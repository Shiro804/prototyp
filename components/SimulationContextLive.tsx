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
 * Interface: Return type from the context
 */
export interface SimulationStateLive {
    simulation?: SimulationRun;
    frame: number;
    playing: boolean;
    loading: boolean;
    speed: number;
    orders: Order[]; // Expose the Orders array to the UI

    setFrame: Dispatch<SetStateAction<number>>;
    setSpeed: Dispatch<SetStateAction<number>>;
    load: (ticks: number) => void;
    toggle: () => void;
}

/**
 * The Context
 */
export const SimulationContextLive = createContext<SimulationStateLive>({
    simulation: undefined,
    frame: 0,
    playing: false,
    loading: false,
    speed: 1,
    orders: [],

    setFrame: () => { },
    setSpeed: () => { },
    load: () => { },
    toggle: () => { },
});

/**
 * Hook: Core logic for live simulation
 */
function useSimulationCoreLive(speedInput: number): SimulationStateLive {
    const [simInstance, setSimInstance] = useState<Simulation | undefined>();
    const [simulation, setSimulation] = useState<SimulationRun | undefined>();
    const [orders, setOrders] = useState<Order[]>([]); // Exposed Orders

    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);
    const [loading, setLoading] = useState(false);
    const [speed, setSpeed] = useState(speedInput || 1);

    /**
     * 1) Load the simulation
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

            console.log(`Loaded Orders: ${initialOrders.length}`);

            const sim = new Simulation(initialState, initialOrders);
            sim.runNext(ticks);

            setSimInstance(sim);
            setSimulation(sim.getSimulationRun());
            setOrders(sim.getAllOrders().map(order => ({ ...order }))); // Clone orders

            setLoading(false);
            setPlaying(true);
        } catch (error) {
            console.error("[LIVE] Error loading simulation:", error);
            handleNotification(
                "Load Error",
                "Error loading the simulation.",
                "error"
            );
            setLoading(false);
        }
    };

    /**
     * 2) Interval for ticks if playing = true
    */
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!simInstance) return;
            if (playing) {
                // Perform 1 tick
                simInstance.tickForward();

                // Update the simulation run and orders
                const newRun = simInstance.getSimulationRun();
                setSimulation(newRun);

                const updatedOrders = simInstance.getAllOrders();

                // Clone orders to ensure a new array reference
                setOrders(updatedOrders.map(order => ({ ...order })));

                setFrame(simInstance.getCurrentTick());
            }
        }, 1000 * speed);

        return () => clearInterval(intervalId);
    }, [simInstance, playing, speed]);

    /**
     * 3) Toggle play/pause
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
        orders,
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
