import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

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

export const SimulationContext = createContext<SimulationState>({
  simulation: undefined,
  frame: 0,
  playing: false,
  loading: false,
  speed: 1,
  setSpeed: () => { },
  load: () => { },
  toggle: () => { },
});

export function useSimulationContext(speedInput: number): SimulationState {
  const [simulation, setSimulation] = useState<SimulationRun>();
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(speedInput || 1);

  useEffect(() => {
    console.log(speed)
  }, [speed])

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
    console.log("toggle triggered")
    setPlaying((prev) => !prev);
  };

  return { simulation, frame, playing, loading, speed, setSpeed, load, toggle };
}

export function useSimulation(): SimulationState {
  return useContext(SimulationContext);
}
