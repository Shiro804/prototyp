"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
} from "react";
import { Simulation, SimulationRun } from "@/lib/simulation/simulationNew";

// The shape specifically for the LIVE context
export interface SimulationStateLive {
    /** The computed frames so far, plus any events. */
    simulation?: SimulationRun;

    /** Current "frame index" we’re showing on screen. */
    frame: number;

    /** Are we auto-advancing frames on an interval? */
    playing: boolean;

    /** Are we currently loading/fetching the initial state? */
    loading: boolean;

    /** The speed factor (seconds per tick). */
    speed: number;

    /** Set the current frame index (manual jump). */
    setFrame: Dispatch<SetStateAction<number>>;

    /** Set the speed (seconds per tick). */
    setSpeed: Dispatch<SetStateAction<number>>;

    /** Load the initial state (optionally run a few ticks). */
    load: (ticks: number) => void;

    /** Play/pause toggling. */
    toggle: () => void;
}

// 1) The actual context
export const SimulationContextLive = createContext<SimulationStateLive>({
    simulation: undefined,
    frame: 0,
    playing: false,
    loading: false,
    speed: 1,
    setFrame: () => { },
    setSpeed: () => { },
    load: () => { },
    toggle: () => { },
});

/**
 * useSimulationCoreLive:
 * Provides a "live" simulation that can tick forward on-demand,
 * similar to the SimulationMock approach.
 */
function useSimulationCoreLive(speedInput: number): SimulationStateLive {
    // The raw "Simulation" instance
    const [simInstance, setSimInstance] = useState<Simulation | undefined>(
        undefined
    );

    // The current computed run (frames array + events)
    const [simulation, setSimulation] = useState<SimulationRun | undefined>(
        undefined
    );

    // Playback state
    const [playing, setPlaying] = useState(false);

    // The "slider" or "currentFrame" index we are displaying
    const [frame, setFrame] = useState(0);

    // Are we loading/fetching the initial data?
    const [loading, setLoading] = useState(false);

    // How many seconds per tick (1 = 1s per tick, 2 = 2s per tick, etc.)
    const [speed, setSpeed] = useState(speedInput || 1);

    // Debug optional
    useEffect(() => {
        console.log("[LIVE] Speed updated:", speed);
    }, [speed]);

    /**
     * 1) "Load" the simulation from the server,
     *    create a Simulation instance, optionally run some ticks.
     */
    const load = (ticks: number) => {
        console.log("[LIVE] Loading simulation...");
        setLoading(true);
        setFrame(0);

        fetch("/api/entity-state")
            .then((res) => res.json())
            .then((initialState) => {
                // Create the new live simulation
                const sim = new Simulation(initialState);

                // Optionally run some ticks upfront
                // (If you want to start from tick=0, remove this line)
                sim.runNext(ticks);

                // We now have frames up to tick=N
                setSimInstance(sim);
                setSimulation(sim.getSimulationRun());

                setLoading(false);
                setPlaying(true); // start auto-advancing
            });
    };

    /**
     * 2) Auto-advance frames if "playing" is true:
     *    - Every [speed] seconds, we do 1 tickForward on the sim.
     *    - Then update the SimulationRun + the "frame" index in local state.
     */
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!simInstance || !playing) return;

            // Move forward exactly 1 tick
            simInstance.tickForward();

            // Now we have a new frame
            const newRun = simInstance.getSimulationRun();
            setSimulation(newRun);

            // The current tick index is simInstance.getCurrentTick().
            setFrame(simInstance.getCurrentTick());
        }, 1000 * speed);

        return () => clearInterval(intervalId);
    }, [playing, speed, simInstance]);

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
        setFrame,
        setSpeed,
        load,
        toggle,
    };
}

// 4) Provide a wrapper that calls the hook
export function useProvideSimulationLive(speedInput = 1) {
    return useSimulationCoreLive(speedInput);
}

// 5) Consumer hook
export function useSimulationLive(): SimulationStateLive {
    return useContext(SimulationContextLive);
}
