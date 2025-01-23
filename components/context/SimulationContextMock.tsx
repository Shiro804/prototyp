// SimulationContextMock.tsx

import React, { createContext, useContext, FC } from "react";
import { SimulationRun, Simulation } from "@/lib/simulation/Simulation";
import { useSimulationCore, SimulationCoreState } from "../hooks/useSimulationCore";

/**
 * Extended Interface for Mock Simulation State
 */
export interface SimulationStateMock extends SimulationCoreState {
  toggleTransportSystem: (tsId: number) => void;
  toggleProcessStep: (psId: number) => void;
}

/**
 * Create Mock Simulation Context
 */
export const SimulationContextMock = createContext<SimulationStateMock>({
  simulation: undefined,
  simInstance: undefined,
  frame: 0,
  playing: false,
  speed: 1,
  loading: false,

  setSimulation: () => { },
  setFrame: () => { },
  setSpeed: () => { },
  load: () => { },
  toggle: () => { },
  moveFrame: () => { },
  handleJumpToTick: () => { },
  toggleProcessStep: () => { },
  toggleTransportSystem: () => { },
});

/**
 * Provider Component for Mock Simulation Context
 */
export const SimulationProviderMock: FC<{ children: React.ReactNode }> = ({ children }) => {
  const core = useSimulationCore(1); // Initialize with default speed

  /**
   * Toggle the active state of a transport system.
   */
  const toggleTransportSystem = (tsId: number) => {
    if (!core.simInstance) return;

    // Toggle in the Simulation (also discards future frames)
    core.simInstance.toggleTransportSystem(tsId);

    // Retrieve the updated SimulationRun
    const newRun = core.simInstance.getSimulationRun();
    core.setSimulation(newRun);

    // If the current frame index is now out of bounds (e.g., future frames discarded),
    // set it to the last available frame
    if (core.frame >= newRun.frames.length) {
      core.setFrame(newRun.frames.length - 1);
    }
  };

  /**
   * Toggle the active state of a transport system.
   */
  const toggleProcessStep = (psId: number) => {
    if (!core.simInstance) return;

    // Toggle in the Simulation (also discards future frames)
    core.simInstance.toggleProcessStep(psId);

    // Retrieve the updated SimulationRun
    const newRun = core.simInstance.getSimulationRun();
    core.setSimulation(newRun);

    // If the current frame index is now out of bounds (e.g., future frames discarded),
    // set it to the last available frame
    if (core.frame >= newRun.frames.length) {
      core.setFrame(newRun.frames.length - 1);
    }
  };

  return (
    <SimulationContextMock.Provider value={{ ...core, toggleProcessStep, toggleTransportSystem }}>
      {children}
    </SimulationContextMock.Provider>
  );
};

/**
 * Consumer Hook for Mock Simulation Context
 */
export function useSimulationMock(): SimulationStateMock {
  return useContext(SimulationContextMock);
}
