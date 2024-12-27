import {
  Button,
  Flex,
  Text,
  Tooltip,
  Slider,
  ActionIcon,
  NumberInput,
} from "@mantine/core";
import {
  IconPlayerPause as IconPause,
  IconPlayerPlay as IconPlay,
  IconRotateDot as IconReload,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";

import { FunctionComponent, useState } from "react";
import { useSimulationMock } from "./SimulationContextMock";
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
  } = useSimulationMock();

  // Local state for how many ticks the user wants to add
  const [ticksToAdd, setTicksToAdd] = useState<number>(0);

  /**
   * Helper to move the current frame forward/back safely
   */
  const moveFrame = (delta: number) => {
    if (!simulation) return;
    setFrame((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= simulation.frames.length) {
        return simulation.frames.length - 1;
      }
      return next;
    });
  };

  /**
   * Handler for the "Add Ticks" button:
   * We'll call the underlying SimulationMock instance’s `runNext(ticksToAdd)`.
   */
  const handleAddTicks = () => {
    if (!simulation || ticksToAdd <= 0) return;

    // 1) Compute the next N ticks from the current state
    simInstance?.runNext(ticksToAdd);

    // 2) Retrieve the updated run
    const updated = simInstance?.getSimulationRun();

    setSimulation(updated)

    // If you store it in a local state (like setSimulation), do that now:
    // setSimulation(updated);

    // 3) Jump the slider to the new last frame
    updated && setFrame(updated.frames.length - 1);

    // Optionally reset ticksToAdd or leave it
    // setTicksToAdd(0);
  };

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

      {/* Slider for manual frames navigation */}
      <Slider
        styles={{ root: { width: 180 } }} // tweak to your liking
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
      {/* Arrow Right */}
      <ActionIcon
        color="indigo"
        variant="outline"
        disabled={!simulation || playing || frame >= simulation.frames.length - 1}
        onClick={() => moveFrame(1)}
      >
        <IconArrowRight />
      </ActionIcon>

      {/* Number Input for additional ticks */}
      <NumberInput
        placeholder="Add ticks"
        hideControls
        min={1}
        value={ticksToAdd}
        onChange={(val) => {
          if (typeof val === 'number') setTicksToAdd(val);
        }}
        styles={{ input: { width: 60 } }}
      />

      {/* Button to actually add ticks */}
      <Button
        color="indigo"
        variant="outline"
        disabled={!simulation || ticksToAdd <= 0}
        onClick={handleAddTicks}
      >
        Add Ticks
      </Button>

    </Flex>
  );
};

export default SimulationControlOverlay;
