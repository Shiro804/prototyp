import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from "react";

import { Simulation, SimulationRun } from "@/lib/simulation/simulation";

export interface SimulationState {
  simulation?: SimulationRun;
  frame: number;
  playing: boolean;
  loading: boolean;
  speed: number;
  setSpeed: Dispatch<SetStateAction<number>>;
  load: (ticks: number) => void;
  toggle: () => void;
}

// First Simulation Context
export const SimulationContext1 = createContext<SimulationState>({
  simulation: undefined,
  frame: 0,
  playing: false,
  loading: false,
  speed: 1,
  setSpeed: () => { },
  load: () => { },
  toggle: () => { },
});

// Second Simulation Context
export const SimulationContext2 = createContext<SimulationState>({
  simulation: undefined,
  frame: 0,
  playing: true,
  loading: false,
  speed: 1,
  setSpeed: () => { },
  load: () => { },
  toggle: () => { },
});

// Shared Simulation Hook
function useSimulationCore(speedInput: number): SimulationState {
  const [simulation, setSimulation] = useState<SimulationRun>();
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(speedInput || 1);

  useEffect(() => {
    console.log("Speed updated:", speed);
  }, [speed]);

  const load = (ticks: number) => {
    console.log("load")
    setLoading(true);
    setFrame(0);
    fetch("/api/entity-state")
      .then((res) => res.json())
      .then((es) => {
        const simulation = new Simulation(es);
        setSimulation(simulation.run(ticks));
        setLoading(false);
        setPlaying(true)
      });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playing) {
        setFrame((prev) => {
          if (simulation && prev + 1 >= simulation.frames.length) {
            clearInterval(intervalId);
          }
          return prev + 1;
        });
      }
    }, 1000 * speed);

    return () => clearInterval(intervalId);
  }, [playing, speed, simulation]);

  const toggle = () => {
    console.log("Simulation toggled");
    setPlaying((prev) => !prev);
  };

  return { simulation, frame, playing, loading, speed, setSpeed, load, toggle };
}

// Hook for Simulation 1
export function useSimulationContext1(speedInput: number): SimulationState {
  return useSimulationCore(speedInput);
}

// Hook for Simulation 2
export function useSimulationContext2(speedInput: number): SimulationState {
  return useSimulationCore(speedInput);
}

// Helper hooks to use the contexts
export function useSimulation1(): SimulationState {
  return useContext(SimulationContext1);
}

export function useSimulation2(): SimulationState {
  return useContext(SimulationContext2);
}
