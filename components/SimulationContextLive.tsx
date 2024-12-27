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
    simulation?: SimulationRun; // <-- The "old" simulation
    frame: number;
    setFrame: Dispatch<SetStateAction<number>>;

    playing: boolean;
    loading: boolean;

    speed: number;
    setSpeed: Dispatch<SetStateAction<number>>;

    load: (ticks: number) => void;
    toggle: () => void;
}

// 1) The actual context
export const SimulationContextLive = createContext<SimulationStateLive>({
    simulation: undefined,
    frame: 0,
    setFrame: () => { },
    playing: false,
    loading: false,
    speed: 1,
    setSpeed: () => { },
    load: () => { },
    toggle: () => { },
});

// 2) The "useSimulationCoreLive" hook
function useSimulationCoreLive(speedInput: number): SimulationStateLive {
    const [simulation, setSimulation] = useState<SimulationRun>();
    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);
    const [loading, setLoading] = useState(false);
    const [speed, setSpeed] = useState(speedInput || 1);

    // Debug optional
    useEffect(() => {
        console.log("[LIVE] Speed updated:", speed);
    }, [speed]);

    const load = (ticks: number) => {
        console.log("[LIVE] Loading simulation...");
        setLoading(true);
        setFrame(0);

        fetch("/api/entity-state")
            .then((res) => res.json())
            .then((initialState) => {
                const sim = new Simulation(initialState);
                setSimulation(sim.run(ticks));
                setLoading(false);
                setPlaying(true);
            });
    };

    // Autoplay frames
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (playing) {
                setFrame((prev) => {
                    if (!simulation) return prev;
                    if (prev + 1 >= simulation.frames.length) {
                        clearInterval(intervalId);
                        return prev;
                    }
                    return prev + 1;
                });
            }
        }, 1000 * speed);

        return () => clearInterval(intervalId);
    }, [playing, speed, simulation]);

    const toggle = () => {
        console.log("[LIVE] Toggled play/pause");
        setPlaying((prev) => !prev);
    };

    return {
        simulation,
        frame,
        setFrame,
        playing,
        loading,
        speed,
        setSpeed,
        load,
        toggle,
    };
}

// 3) Provide a wrapper to create the context value
export function useProvideSimulationLive(speedInput = 1) {
    return useSimulationCoreLive(speedInput);
}

// 4) The consumer hook
export function useSimulationLive(): SimulationStateLive {
    return useContext(SimulationContextLive);
}
