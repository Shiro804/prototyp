// SimulationContextLive.tsx
import { createContext, useContext, useEffect } from "react";
import { SimulationCoreState, useSimulationCore } from "../hooks/useSimulationCore"; // Path to the shared hook
import { SimulationRun, Simulation } from "@/lib/simulation/Simulation";

/**
 * Interface: Return type from the context
 */
export interface SimulationStateLive extends Omit<SimulationCoreState, 'toggleTransportSystem'> {
    // Add any live-specific functionalities here if needed
}

// Define the context with default values
export const SimulationContextLive = createContext<SimulationStateLive>({
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
});

/**
 * Provider Component for Live Simulation Context
 */
export function SimulationProviderLive({ children }: { children: React.ReactNode }) {
    const core = useSimulationCore(1); // Initialize with default speed

    useEffect(() => {
        core.load(1)
    }, [])

    return (
        <SimulationContextLive.Provider value={core}>
            {children}
        </SimulationContextLive.Provider>
    );
}

/**
 * Consumer Hook for Live Simulation Context
 */
export function useSimulationLive(): SimulationStateLive {
    return useContext(SimulationContextLive);
}
