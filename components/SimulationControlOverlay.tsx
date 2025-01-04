// SimulationControlOverlay.tsx

import {
  Button,
  Flex,
  Text,
  Tooltip,
  Slider,
  ActionIcon,
  NumberInput
} from "@mantine/core";
import {
  IconPlayerPause as IconPause,
  IconPlayerPlay as IconPlay,
  IconRotateDot as IconReload,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { FunctionComponent, useState } from "react";
import { useSimulationMock } from "./context/SimulationContextMock";
import AdjustSimulationParams from "./modals/AdjustSimulationParamsModal";

const SimulationControlOverlay: FunctionComponent = () => {
  const {
    playing,
    loading,
    simulation,
    frame,
    simInstance,
    setSimulation,
    load,
    toggle,
    setFrame,
    moveFrame,
    handleJumpToTick
  } = useSimulationMock();

  // Wir nennen den State jetzt "targetTick", weil wir gezielt zu *diesem* Tick springen.
  const [targetTick, setTargetTick] = useState<number>(0);

  return (
    <Flex align="center" gap="md" wrap="nowrap" style={{ padding: "1rem" }}>
      <Text size="md" fw={700}>
        Simulation Control:
      </Text>

      {/* Button: Calculate/Reload Simulation (precompute 1 tick, for instance) */}
      <Tooltip label="Calculate Simulation" position="bottom" withArrow>
        <Button color="indigo" onClick={() => load(1)} loading={loading}>
          <IconReload />
        </Button>
      </Tooltip>

      {/* Button: Play / Pause */}
      <Tooltip
        label={playing ? "Pause Simulation" : "Play Simulation"}
        position="bottom"
        withArrow
      >
        <Button
          color="indigo"
          disabled={!simulation}
          onClick={toggle}
          loading={loading}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </Button>
      </Tooltip>

      {/* Optional: Adjust Simulation Params Modal */}
      <AdjustSimulationParams />

      {/* Arrow Left */}
      <ActionIcon
        color="indigo"
        variant="outline"
        disabled={playing || frame <= 0 || !simulation}
        onClick={() => moveFrame(-1)}
      >
        <IconArrowLeft />
      </ActionIcon>

      {/* Slider für manuelle Frame-Navigation */}
      <Slider
        styles={{ root: { width: 180 } }}
        min={0}
        max={simulation ? simulation.frames.length - 1 : 0}
        value={frame}
        onChange={(val) => setFrame(val)}
        disabled={playing || !simulation}
        marks={[
          { value: 0, label: "Start" },
          {
            value: simulation ? simulation.frames.length - 1 : 0,
            label: "End",
          },
        ]}
      />

      <p>{frame}</p>

      {/* Arrow Right */}
      <ActionIcon
        color="indigo"
        variant="outline"
        disabled={!simulation || playing}
        onClick={() => moveFrame(1)}
      >
        <IconArrowRight />
      </ActionIcon>

      {/* Number Input: "Target Tick" */}
      <NumberInput
        placeholder="Tick #"
        hideControls
        min={0}
        value={targetTick}
        onChange={(val) => {
          if (typeof val === "number") setTargetTick(val);
        }}
        styles={{ input: { width: 60 } }}
      />

      {/* Button: Jump to that Tick */}
      <Button
        color="indigo"
        variant="outline"
        disabled={!simulation || targetTick < 0 || targetTick >= (simulation ? simulation.frames.length : 0)}
        onClick={() => handleJumpToTick(targetTick)}
      >
        Jump to Tick
      </Button>
    </Flex>
  );
};

export default SimulationControlOverlay;
