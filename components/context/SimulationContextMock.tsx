// SimulationContextMock.tsx

import React, { createContext, useContext, FC } from "react";
import { SimulationRun, Simulation } from "@/lib/simulation/Simulation";
import { useSimulationCore, SimulationCoreState } from "../hooks/useSimulationCore";
import { Resource, ProcessStep, TransportSystem } from "@prisma/client";

/**
 * Extended Interface for Mock Simulation State
 */
export interface SimulationStateMock extends SimulationCoreState {
  toggleTransportSystem: (tsId: number) => void;
  toggleProcessStep: (psId: number) => void;
  toggleResource: (res: Resource) => void;

  updateProcessStep: (
    psId: number,
    data: {
      errorRate?: number;
      outputSpeed?: number;
      inputSpeed?: number;
      recipeRate?: number;
      duration?: number;
      active?: boolean;
      inventoryLimit?: number; // custom
    }
  ) => void;

  updateTransportSystem: (
    tsId: number,
    data: {
      inputSpeed?: number;
      outputSpeed?: number;
      active?: boolean;
      minQuantity?: number;
      transportDelay?: number;
    }
  ) => void;

  updateResource: (
    resId: number,
    data: {
      faultyRate?: number;
      active?: boolean;
    }
  ) => void;
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
  toggleResource: () => { },
  updateProcessStep: () => { },
  updateTransportSystem: () => { },
  updateResource: () => { },
});

/**
 * Provider Component for Mock Simulation Context
 */
export const SimulationProviderMock: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const core = useSimulationCore(1); // Initialize with default speed = 1

  /**
   * Toggle the active state of a TransportSystem.
   */
  const toggleTransportSystem = (tsId: number) => {
    if (!core.simInstance) return;

    core.simInstance.toggleTransportSystem(tsId);

    const newRun = core.simInstance.getSimulationRun();
    core.setSimulation(newRun);

    if (core.frame >= newRun.frames.length) {
      core.setFrame(newRun.frames.length - 1);
    }
  };

  /**
   * Toggle the active state of a ProcessStep.
   */
  const toggleProcessStep = (psId: number) => {
    if (!core.simInstance) return;

    core.simInstance.toggleProcessStep(psId);

    const newRun = core.simInstance.getSimulationRun();
    core.setSimulation(newRun);

    if (core.frame >= newRun.frames.length) {
      core.setFrame(newRun.frames.length - 1);
    }
  };

  /**
   * Toggle the active state of a Resource (machine/worker).
   */
  const toggleResource = (res: Resource) => {
    if (!core.simInstance) return;

    core.simInstance.toggleResource(res);

    const newRun = core.simInstance.getSimulationRun();
    core.setSimulation(newRun);

    if (core.frame >= newRun.frames.length) {
      core.setFrame(newRun.frames.length - 1);
    }
  };

  /**
   * Update various fields of a ProcessStep in-memory.
   */
  const updateProcessStep = (
    psId: number,
    data: {
      errorRate?: number;
      outputSpeed?: number;
      inputSpeed?: number;
      recipeRate?: number;
      duration?: number;
      active?: boolean;
      inventoryLimit?: number;
    }
  ) => {
    if (!core.simInstance) return;

    core.simInstance.updateProcessStep(psId, data);

    const newRun = core.simInstance.getSimulationRun();
    core.setSimulation(newRun);

    if (core.frame >= newRun.frames.length) {
      core.setFrame(newRun.frames.length - 1);
    }
  };

  /**
   * Update various fields of a TransportSystem in-memory.
   */
  const updateTransportSystem = (
    tsId: number,
    data: {
      inputSpeed?: number;
      outputSpeed?: number;
      active?: boolean;
      minQuantity?: number;
      transportDelay?: number;
    }
  ) => {
    if (!core.simInstance) return;

    core.simInstance.updateTransportSystem(tsId, data);

    const newRun = core.simInstance.getSimulationRun();
    core.setSimulation(newRun);

    if (core.frame >= newRun.frames.length) {
      core.setFrame(newRun.frames.length - 1);
    }
  };

  /**
   * Update various fields of a Resource in-memory.
   */
  const updateResource = (
    resId: number,
    data: {
      faultyRate?: number;
    }
  ) => {
    if (!core.simInstance) return;

    core.simInstance.updateResource(resId, data);

    const newRun = core.simInstance.getSimulationRun();
    core.setSimulation(newRun);

    if (core.frame >= newRun.frames.length) {
      core.setFrame(newRun.frames.length - 1);
    }
  };

  return (
    <SimulationContextMock.Provider
      value={{
        ...core,
        toggleProcessStep,
        toggleTransportSystem,
        toggleResource,
        updateProcessStep,
        updateTransportSystem,
        updateResource,
      }}
    >
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
