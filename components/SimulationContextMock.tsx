import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { SimulationMock, SimulationRunMock } from "@/lib/simulation/simulationMock";

// The shape specifically for the MOCK context
export interface SimulationStateMock {
    simulation?: SimulationRunMock; // <-- The "new" mock simulation
    simInstance?: SimulationMock;      // <-- Expose the actual instance here
    frame: number;
    playing: boolean;
    speed: number;
    loading: boolean;


    setSimulation: Dispatch<SetStateAction<SimulationRunMock | undefined>>;
    setFrame: Dispatch<SetStateAction<number>>;
    setSpeed: Dispatch<SetStateAction<number>>;
    load: (ticks: number) => void;
    toggle: () => void;
}

export const SimulationContextMock = createContext<SimulationStateMock>({
    simulation: undefined,
    frame: 0,
    playing: false,
    loading: false,
    speed: 1,
    setSimulation: () => { },
    setFrame: () => { },
    setSpeed: () => { },
    load: () => { },
    toggle: () => { },
});

function useSimulationCoreMock(speedInput: number): SimulationStateMock {
    const [simulation, setSimulation] = useState<SimulationRunMock>();
    const [simInstance, setSimInstance] = useState<SimulationMock>();

    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);
    const [loading, setLoading] = useState(false);
    const [speed, setSpeed] = useState(speedInput || 1);

    // Debug optional
    useEffect(() => {
        console.log("[MOCK] Speed updated:", speed);
    }, [speed]);

    const load = (ticks: number) => {
        console.log("[MOCK] Loading simulation...");
        setLoading(true);
        setFrame(0);

        fetch("/api/entity-state")
            .then((res) => res.json())
            .then((initialState) => {
                const mockSim = new SimulationMock(initialState);
                mockSim.runNext(ticks);
                setSimInstance(mockSim);
                setSimulation(mockSim.getSimulationRun());
                setLoading(false);
                setPlaying(true);
            });
    };

    // If "playing", advance one tick each interval
    useEffect(() => {
        const interval = setInterval(() => {
            if (!simInstance || !playing) return;

            simInstance.tickForward();
            const run = simInstance.getSimulationRun();
            setSimulation(run);

            const newFrameIndex = run.frames.length - 1;
            setFrame(newFrameIndex);
        }, 1000 * speed);

        return () => clearInterval(interval);
    }, [playing, speed, simInstance]);

    const toggle = () => {
        console.log("[MOCK] Toggled play/pause");
        setPlaying((prev) => !prev);
    };

    // If user setsFrame manually, you might need logic to jump among frames.
    // For now, let's keep it simple: we'll just display the chosen precomputed frame
    useEffect(() => {
        if (!simInstance || !simulation) return;

        // If frame < simulation.frames.length, it's valid. If >, we might runNext to fill it up.
    }, [frame, simInstance, simulation]);

    return {
        simulation,
        frame,
        playing,
        loading,
        speed,
        simInstance,
        setSimulation,
        setFrame,
        setSpeed,
        load,
        toggle,
    };
}

export function useProvideSimulationMock(speedInput = 1) {
    return useSimulationCoreMock(speedInput);
}

export function useSimulationMock(): SimulationStateMock {
    return useContext(SimulationContextMock);
}
