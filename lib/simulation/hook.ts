import { useEffect, useState } from "react";
import { Simulation, SimulationRun } from "./simulation";

export function useSimulation() {
  const [result, setResult] = useState<SimulationRun>();

  const load = (ticks: number) => {
    fetch("/api/entity-state")
      .then((res) => res.json())
      .then((es) => {
        let simulation = new Simulation(es);
        setResult(simulation.run(ticks));
      });
  };

  return { load, result };
}

export function useSimulationPlayer(speed: number) {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playing) {
        setFrame((prev) => prev + 1);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [playing]);

  const toggle = () => {
    setPlaying((prev) => !prev);
  };

  return { toggle, playing, frame };
}
