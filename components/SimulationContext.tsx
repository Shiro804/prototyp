import { createContext, useContext, useEffect, useState } from "react";

import { Simulation, SimulationRun } from "@/lib/simulation/simulation";

export interface SimulationState {
  simulation?: SimulationRun;
  frame: number;
  playing: boolean;
  loading: boolean;
  load: (ticks: number) => void;
  toggle: () => void;
}

export const SimulationContext = createContext<SimulationState>({
  simulation: undefined,
  frame: 0,
  playing: false,
  loading: false,
  load: () => {},
  toggle: () => {},
});

export function useSimulationContext(speed: number): SimulationState {
  const [simulation, setSimulation] = useState<SimulationRun>();
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = (ticks: number) => {
    setLoading(true);
    setFrame(0);
    fetch("/api/entity-state")
      .then((res) => res.json())
      .then((es) => {
        let simulation = new Simulation(es);
        setSimulation(simulation.run(ticks));
        setLoading(false);
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
  }, [playing]);

  const toggle = () => {
    setPlaying((prev) => !prev);
  };

  return { simulation, frame, playing, loading, load, toggle };
}

export function useSimulation(): SimulationState {
  return useContext(SimulationContext);
}
