// context.ts
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Simulation, SimulationRun, SimulationEntityState } from "@/lib/simulation/simulationNew";
import { Order } from "@prisma/client";
import { handleNotification } from "@/app/notification-settings/page";

/**
 * Schnittstelle: Rückgabe aus dem Kontext
 */
export interface SimulationStateLive {
  simulation?: SimulationRun;
  frame: number;
  playing: boolean;
  loading: boolean;
  speed: number;
  orders: Order[]; // <--- Neu: Alle Orders aus der Simulation

  setFrame: Dispatch<SetStateAction<number>>;
  setSpeed: Dispatch<SetStateAction<number>>;
  load: (ticks: number) => void;
  toggle: () => void;
}

/**
 * Der Kontext
 */
export const SimulationContextLive = createContext<SimulationStateLive>({
  simulation: undefined,
  frame: 0,
  playing: false,
  loading: false,
  speed: 1,
  orders: [],

  setFrame: () => {},
  setSpeed: () => {},
  load: () => {},
  toggle: () => {},
});

/**
 * useSimulationCoreLive:
 * - Timer läuft immer
 * - Falls playing=true => sim.tickForward()
 * - wir halten simulation + frame + orders aktuell
 */
function useSimulationCoreLive(speedInput: number): SimulationStateLive {
  const [simInstance, setSimInstance] = useState<Simulation | undefined>();
  const [simulation, setSimulation] = useState<SimulationRun | undefined>();
  const [orders, setOrders] = useState<Order[]>([]); // <--- Neu

  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(speedInput || 1);

  /**
   * 1) Simulation laden (async)
   */
  const load = async (ticks: number) => {
    console.log("[LIVE] Loading simulation...");
    setLoading(true);
    setFrame(0);

    try {
      const resState = await fetch("/api/entity-state");
      const initialState: SimulationEntityState = await resState.json();

      const resOrders = await fetch("/api/orders");
      const initialOrders: Order[] = await resOrders.json();

      console.log(`Geladene Orders: ${initialOrders.length}`);

      const sim = new Simulation(initialState, initialOrders);
      sim.runNext(ticks);

      setSimInstance(sim);
      setSimulation(sim.getSimulationRun());
      setOrders(sim.getAllOrders());

      setLoading(false);
      setPlaying(true);
    } catch (error) {
      console.error("[LIVE] Fehler beim Laden:", error);
      handleNotification(
        "Ladefehler",
        "Fehler beim Laden der Simulation.",
        "error"
      );
      setLoading(false);
    }
  };

  /**
   * 2) Interval: läuft permanent
   * - wenn playing=true, tickForward()
   * - danach simulation + orders updaten
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!simInstance) return;
      if (playing) {
        simInstance.tickForward();

        // Nach dem Tick => aktualisiere den SimulationRun + orders
        const newRun = simInstance.getSimulationRun();
        setSimulation(newRun);

        const simOrders = simInstance.getAllOrders(); 
        setOrders(simOrders);

        setFrame(simInstance.getCurrentTick());
      }
    }, 1000 * speed);

    return () => clearInterval(intervalId);
  }, [simInstance, playing, speed]);

  /**
   * 3) Toggle
   */
  const toggle = () => {
    console.log("[LIVE] Toggled play/pause");
    setPlaying((prev) => !prev);
  };

  return {
    simulation,
    frame,
    playing,
    loading,
    speed,
    orders, // <--- Hier geben wir die Orders raus
    setFrame,
    setSpeed,
    load,
    toggle,
  };
}

/**
 * Wrapper
 */
export function useProvideSimulationLive(speedInput = 1) {
  return useSimulationCoreLive(speedInput);
}

/**
 * Consumer Hook
 */
export function useSimulationLive(): SimulationStateLive {
  return useContext(SimulationContextLive);
}
