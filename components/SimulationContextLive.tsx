// context.ts
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
} from "react";
import { Simulation, SimulationRun, SimulationEntityState } from "@/lib/simulation/simulationNew";
import { Order } from "@prisma/client";
import { handleNotification } from "@/app/general-settings/page";

/**
 * Die SimulationStateLive-Schnittstelle wurde angepasst,
 * um nur noch die SimulationEntityState ohne Orders zu enthalten.
 */
export interface SimulationStateLive {
    /** Die bisher berechneten Frames, inklusive Events. */
    simulation?: SimulationRun;

    /** Der aktuelle Frame-Index, der auf dem Bildschirm angezeigt wird. */
    frame: number;

    /** Läuft die Simulation automatisch weiter? */
    playing: boolean;

    /** Wird gerade der Initialzustand geladen? */
    loading: boolean;

    /** Der Geschwindigkeitsfaktor (Sekunden pro Tick). */
    speed: number;

    /** Setzt den aktuellen Frame-Index (manuelles Springen). */
    setFrame: Dispatch<SetStateAction<number>>;

    /** Setzt die Geschwindigkeit (Sekunden pro Tick). */
    setSpeed: Dispatch<SetStateAction<number>>;

    /** Lädt den Initialzustand (optional einige Ticks ausführen). */
    load: (ticks: number) => void;

    /** Spielt die Simulation ab oder pausiert sie. */
    toggle: () => void;
}

/**
 * 1) Der tatsächliche Kontext
 */
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
 * Bietet eine "Live"-Simulation, die Ticks bei Bedarf berechnet,
 * ähnlich dem SimulationMock-Ansatz.
 */
function useSimulationCoreLive(speedInput: number): SimulationStateLive {
    // Die rohe "Simulation"-Instanz
    const [simInstance, setSimInstance] = useState<Simulation | undefined>(
        undefined
    );

    // Der aktuelle berechnete Lauf (Frames-Array + Events)
    const [simulation, setSimulation] = useState<SimulationRun | undefined>(
        undefined
    );

    // Wiedergabestatus
    const [playing, setPlaying] = useState(false);

    // Der "Slider" oder der aktuelle Frame-Index, der angezeigt wird
    const [frame, setFrame] = useState(0);

    // Wird gerade der Initialzustand geladen?
    const [loading, setLoading] = useState(false);

    // Wie viele Sekunden pro Tick (1 = 1s pro Tick, 2 = 2s pro Tick, etc.)
    const [speed, setSpeed] = useState(speedInput || 1);

    // Debug optional
    useEffect(() => {
        console.log("[LIVE] Speed updated:", speed);
    }, [speed]);

    /**
     * 1) "Load" the simulation from the server,
     *    create a Simulation instance, optionally run some ticks.
     */
    const load = async (ticks: number) => {
        console.log("[LIVE] Loading simulation...");
        setLoading(true);
        setFrame(0);

        try {
            // Laden der SimulationEntityState (nur Locations)
            const resState = await fetch("/api/entity-state");
            const initialState: SimulationEntityState = await resState.json();

            // Laden der initialen Orders separat
            const resOrders = await fetch("/api/orders"); // Neuen API-Endpunkt für Orders erstellen
            const initialOrders: Order[] = await resOrders.json();

            // Debugging
            console.log(`Geladene Orders: ${initialOrders.length}`);

            // Erstelle die neue Live-Simulation mit initialState und initialOrders
            const sim = new Simulation(initialState, initialOrders);

            // Optional einige Ticks vorab ausführen
            sim.runNext(ticks);

            // Jetzt haben wir Frames bis Tick=N
            setSimInstance(sim);
            setSimulation(sim.getSimulationRun());

            setLoading(false);
            setPlaying(true); // Startet das automatische Weiterlaufen
        } catch (error) {
            console.error("[LIVE] Fehler beim Laden der Simulation:", error);
            handleNotification(
                "Ladefehler",
                "Fehler beim Laden der Simulation.",
                "error"
            );
            setLoading(false);
        }
    };

    /**
     * 2) Automatisches Weiterlaufen der Frames, wenn "playing" wahr ist:
     *    - Alle [speed] Sekunden wird 1 TickForward auf der Simulation durchgeführt.
     *    - Dann wird der SimulationRun + der Frame-Index im lokalen Zustand aktualisiert.
     */
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!simInstance || !playing) return;

            // Bewege dich genau 1 Tick vorwärts
            simInstance.tickForward();

            // Jetzt haben wir einen neuen Frame
            const newRun = simInstance.getSimulationRun();
            setSimulation(newRun);

            // Der aktuelle Tick-Index ist simInstance.getCurrentTick().
            setFrame(simInstance.getCurrentTick());
        }, 1000 * speed);

        return () => clearInterval(intervalId);
    }, [playing, speed, simInstance]);

    /**
     * 3) Umschalten von Play/Pause
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

/**
 * 4) Bietet einen Wrapper, der den Hook aufruft
 */
export function useProvideSimulationLive(speedInput = 1) {
    return useSimulationCoreLive(speedInput);
}

/**
 * 5) Consumer Hook
 */
export function useSimulationLive(): SimulationStateLive {
    return useContext(SimulationContextLive);
}
