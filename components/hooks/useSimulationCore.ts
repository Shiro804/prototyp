// useSimulationCore.ts

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { handleNotification } from "@/app/notification-settings/page";
import { Simulation, SimulationRun } from "@/lib/simulation/Simulation";
import { Order } from "@prisma/client";

/**
 * Shared Interface for Simulation State
 */
export interface SimulationCoreState {
  simulation?: SimulationRun;
  simInstance?: Simulation;
  frame: number;
  playing: boolean;
  speed: number;
  loading: boolean;

  setSimulation: Dispatch<SetStateAction<SimulationRun | undefined>>;
  setFrame: Dispatch<SetStateAction<number>>;
  setSpeed: Dispatch<SetStateAction<number>>;
  load: (ticks: number) => void;
  toggle: () => void;
  moveFrame: (delta: number) => void;
  handleJumpToTick: (targetTick: number, tickValue?: number) => void;
}

/**
 * Custom Hook: Shared Simulation Logic
 */
export function useSimulationCore(speedInput: number): SimulationCoreState {
  const [simulation, setSimulation] = useState<SimulationRun>();
  const [simInstance, setSimInstance] = useState<Simulation>();
  const [orders, setOrders] = useState<Order[]>([]); // Exposed Orders

  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(speedInput || 1);

  // Debug optional
  useEffect(() => {
    console.log("[SIMULATION CORE] Speed updated:", speed);
  }, [speed]);

  useEffect(() => {
    setLoading(false);
  }, [frame]);

  /**
   * Loads the initial state and orders from the server,
   * initializes the Simulation instance, precomputes N ticks, and updates the local state.
   */
  const load = async (ticks: number) => {
    console.log("[SIMULATION CORE] Loading simulation...");
    setLoading(true);
    setFrame(0);

    try {
      const [resState, resOrders] = await Promise.all([
        fetch("/api/entity-state"),
        fetch("/api/orders"),
      ]);

      if (!resState.ok || !resOrders.ok) {
        throw new Error("Failed to fetch simulation data.");
      }

      const initialState = await resState.json();
      const initialOrders: Order[] = await resOrders.json();

      const sim = new Simulation(initialState, initialOrders);
      sim.runNext(ticks);

      setSimInstance(sim);
      setSimulation(sim.getSimulationRun());
      setOrders(sim.getAllOrders().map((order) => ({ ...order }))); // Clone orders

      setLoading(false);
      setPlaying(true);
    } catch (error) {
      console.error("[SIMULATION CORE] Error loading simulation:", error);
      handleNotification(
        "Load Error",
        "Error loading the simulation.",
        "error"
      );
      setLoading(false);
    }
  };

  /**
   * Handles the simulation ticking forward while playing.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!simInstance || !playing) return;

      // Advance to the next tick
      simInstance.tickForward();
      const run = simInstance.getSimulationRun();
      setSimulation(run);

      // Update orders
      setOrders(simInstance.getAllOrders().map((order) => ({ ...order }))); // Clone orders

      // Update frame index (always the last frame)
      const newFrameIndex = run.frames.length - 1;
      setFrame(newFrameIndex);
    }, 1000 * speed);

    return () => clearInterval(interval);
  }, [playing, speed, simInstance]);

  /**
   * Toggles play/pause state.
   */
  const toggle = () => {
    console.log("[SIMULATION CORE] Toggled play/pause");
    setPlaying((prev) => !prev);
  };

  /**
   * Helper to move the current frame index forward or backward.
   */
  const moveFrame = (delta: number) => {
    console.log("[SIMULATION CORE] Move Frame triggered");
    setLoading(true);
    if (!simulation) return;

    if (frame + delta >= simulation.frames.length) {
      handleJumpToTick(undefined, frame + delta);
      return;
    }

    setFrame((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= simulation.frames.length) {
        return simulation.frames.length - 1;
      }
      return next;
    });
    setLoading(false);
  };

  /**
   * Handler for the "Jump to Tick" button:
   * If the tick hasn't been computed yet, compute the missing ticks.
   * Then set 'frame' to the target tick and update orders based on the current frame.
   */
  const handleJumpToTick = (
    targetTick: number | undefined,
    tickValue?: number
  ) => {
    console.log("[SIMULATION CORE] HandleJumpToTick Triggered");
    setLoading(true);
    if (!simulation || !simInstance) return;

    if (tickValue !== undefined) {
      simInstance.jumpToTick(tickValue);
    } else if (targetTick !== undefined) {
      simInstance.jumpToTick(targetTick);
    }

    // Retrieve the updated SimulationRun
    const updatedRun = simInstance.getSimulationRun();
    setSimulation(updatedRun);

    // Find the frame corresponding to the current tick
    const currentTick = simInstance.getCurrentTick();
    const currentFrame = updatedRun.frames.find((f) => f.tick === currentTick);

    if (currentFrame) {
      // Update orders based on the current frame
      setOrders(currentFrame.orders.map((order) => ({ ...order })));
    }

    // Set the current frame to the simulation's current tick
    setFrame(currentTick);
    setLoading(false);
  };

  /**
   * Optional: Handle side effects when the frame changes.
   */
  useEffect(() => {
    if (!simInstance || !simulation) return;
    // Example: console.log("[SIMULATION CORE] Frame changed to", frame);
  }, [frame, simInstance, simulation]);

  return {
    simulation,
    simInstance,
    frame,
    playing,
    speed,
    loading,
    setSimulation,
    setFrame,
    setSpeed,
    load,
    toggle,
    moveFrame,
    handleJumpToTick,
  };
}
