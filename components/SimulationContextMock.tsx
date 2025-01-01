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
  simulation?: SimulationRunMock; // <-- Aktueller Zustand aller Frames
  simInstance?: SimulationMock;   // <-- Die laufende Mock-Simulation
  frame: number;
  playing: boolean;
  speed: number;
  loadingMock: boolean;

  setSimulation: Dispatch<SetStateAction<SimulationRunMock | undefined>>;
  setFrame: Dispatch<SetStateAction<number>>;
  setSpeed: Dispatch<SetStateAction<number>>;
  load: (ticks: number) => void;     // Simulation laden & evtl. N Ticks berechnen
  toggle: () => void;                // Play/Pause
  toggleTransportSystem: (tsId: number) => void; // NEU
  moveFrame: (delta: number) => void;
  handleJumpToTick: (targetTick: number, tickValue?: number) => void;
}

export const SimulationContextMock = createContext<SimulationStateMock>({
  simulation: undefined,
  simInstance: undefined,
  frame: 0,
  playing: false,
  loadingMock: false,
  speed: 1,
  setSimulation: () => { },
  setFrame: () => { },
  setSpeed: () => { },
  load: () => { },
  toggle: () => { },
  toggleTransportSystem: () => { },
  moveFrame: () => { },
  handleJumpToTick: () => { },
});

function useSimulationCoreMock(speedInput: number): SimulationStateMock {
  const [simulation, setSimulation] = useState<SimulationRunMock>();
  const [simInstance, setSimInstance] = useState<SimulationMock>();

  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loadingMock, setLoadingMock] = useState(false);
  const [speed, setSpeed] = useState(speedInput || 1);

  // Debug optional
  useEffect(() => {
    console.log("[MOCK] Speed updated:", speed);
  }, [speed]);

  useEffect(() => {
    setLoadingMock(false)
  }, [frame])

  /**
   * Lädt den Initial-State vom Server (/api/entity-state),
   * baut eine SimulationMock auf, berechnet N Ticks vor
   * und speichert sie im local state.
   */
  const load = (ticks: number) => {
    console.log("[MOCK] Loading simulation...");
    setLoadingMock(true);
    setFrame(0);

    fetch("/api/entity-state")
      .then((res) => res.json())
      .then((initialState) => {
        const mockSim = new SimulationMock(initialState);

        // z.B. 10 Ticks oder 'ticks' vorauskalkulieren
        mockSim.runNext(ticks);
        setSimInstance(mockSim);
        setSimulation(mockSim.getSimulationRun());

        setLoadingMock(false);
        setPlaying(true);
      });
  };

  /**
   * Beim Abspielen gehen wir alle [speed] Sekunden einen Tick vor,
   * solange wir eine simInstance haben und playing == true ist.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!simInstance || !playing) return;

      // Nächsten Tick berechnen
      simInstance.tickForward();
      const run = simInstance.getSimulationRun();
      setSimulation(run);

      // Frame aktualisieren (immer letzter Index)
      const newFrameIndex = run.frames.length - 1;
      setFrame(newFrameIndex);
    }, 1000 * speed);

    return () => clearInterval(interval);
  }, [playing, speed, simInstance]);

  const toggle = () => {
    console.log("[MOCK] Toggled play/pause");
    setPlaying((prev) => !prev);
  };

  /**
   * NEU: TransportSystem (de-)aktivieren.
   * Wir lassen das in der simInstance selbst erledigen,
   * damit deren interner State (currentState) konsistent bleibt.
   */
  const toggleTransportSystem = (tsId: number) => {
    if (!simInstance) return;

    // Toggle in der Simulation (wirft auch future frames weg)
    simInstance.toggleTransportSystem(tsId);

    // Anschließend holen wir das aktualisierte SimulationRun
    const newRun = simInstance.getSimulationRun();
    setSimulation(newRun);

    // Falls unser Frame-Index jetzt außerhalb liegt (z.B. future frames weg),
    // setzen wir ihn auf den letzten verfügbaren
    if (frame >= newRun.frames.length) {
      setFrame(newRun.frames.length - 1);
    }
  };

  /**
 * Helfer, um den aktuellen Frame-Index vor oder zurück zu bewegen
 */
  const moveFrame = (delta: number) => {
    console.log("Move Frame triggered")
    setLoadingMock(true)
    if (!simulation) return;

    if (frame + delta >= simulation.frames.length) {
      handleJumpToTick(undefined, frame + delta)
      return
    }

    setFrame((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= simulation.frames.length) {
        return simulation.frames.length - 1;
      }
      return next;
    });
    // setLoadingMock(false)
  };

  /**
   * Handler für den "Jump to Tick" Button:
   * Falls wir den Tick noch nicht haben, rechnen wir fehlende Ticks nach.
   * Anschließend setzen wir 'frame' auf targetTick.
   */
  const handleJumpToTick = (targetTick: number | undefined, tickValue?: number) => {
    console.log("HandleJumpToKick Triggered")
    setLoadingMock(true)
    if (!simulation || !simInstance) return;

    if (tickValue) {
      simInstance.jumpToTick(tickValue)
    } else if (targetTick) simInstance.jumpToTick(targetTick)

    // Neues SimulationRun holen
    const updatedRun = simInstance.getSimulationRun();
    setSimulation(updatedRun);

    // Aktuellen Tick aus der Simulation lesen
    setFrame(simInstance.getCurrentTick());
    // setLoadingMock(false)
  };

  /**
   * Wenn der Nutzer manuell den frame ändert, könnte man hier
   * in der SimulationMock "rückwärts" oder "vorwärts" springen.
   * Aktuell machen wir es nicht, wir belassen es beim Zeigen des Frame-Zustands.
   */
  useEffect(() => {
    if (!simInstance || !simulation) return;
    // Hier könntest du loggen: console.log("Frame changed to", frame);
  }, [frame, simInstance, simulation]);

  return {
    simulation,
    simInstance,
    frame,
    playing,
    speed,
    loadingMock,
    setSimulation,
    setFrame,
    setSpeed,
    load,
    toggle,
    toggleTransportSystem,
    moveFrame,
    handleJumpToTick
  };
}

export function useProvideSimulationMock(speedInput = 1) {
  return useSimulationCoreMock(speedInput);
}

export function useSimulationMock(): SimulationStateMock {
  return useContext(SimulationContextMock);
}
