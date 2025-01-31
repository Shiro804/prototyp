// SimulationControlOverlay.tsx

import {
  Button,
  Flex,
  Text,
  Tooltip,
  Slider,
  ActionIcon,
  NumberInput,
  Modal,
  TextInput,
} from "@mantine/core";
import {
  IconPlayerPause as IconPause,
  IconPlayerPlay as IconPlay,
  IconRotateDot as IconReload,
  IconArrowLeft,
  IconArrowRight,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { FunctionComponent, useState } from "react";
import { useSimulationMock } from "./context/SimulationContextMock";
import AdjustSimulationParams from "./modals/AdjustSimulationParamsModal";
import { useKPIs } from "@/components/hooks/useKPIs";
import { BG_COLOR, PRIMARY } from "@/lib/theme";

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
    handleJumpToTick,
  } = useSimulationMock();

  // State for target tick
  const [targetTick, setTargetTick] = useState<number>(0);

  // State for the "Save KPIs" modal
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [simulationName, setSimulationName] = useState("");

  // Define speed; adjust as needed
  const speed = 1;

  // Use the KPI hook; simulation can be undefined
  const {
    pendingCount,
    inProgressCount,
    completedCount,
    completedSeatsCount,
    averageTimeMinutes,
    completedSeatsPerMinute,
    averageOrdersPerMinute,
    openAssemblies,
    transportTypeDurations,
    numberOfProcessSteps,
    processStepNames,
    transportSystemCounts,
    totalTransportSystems,
    processStepDurationsAverages,
  } = useKPIs({ simulation, frame, speed });

  // Build the data array for sending to /api/simulations
  const kpiArray = simulation
  ? [
      { key: "pendingCount", value: pendingCount ?? 0, name: "Pending Orders" },
      { key: "inProgressCount", value: inProgressCount ?? 0, name: "Running Orders" },
      { key: "completedCount", value: completedCount ?? 0, name: "Completed Orders" },
      { key: "openAssemblies", value: openAssemblies ?? 0, name: "Open Assemblies" },
      { key: "completedSeatsCount", value: completedSeatsCount ?? 0, name: "Completed Seats" },
      { key: "averageTimeMinutes", value: averageTimeMinutes ?? 0, name: "⌀ Processing Time (Min.)" },
      { key: "completedSeatsPerMinute", value: completedSeatsPerMinute ?? 0, name: "⌀ Completed Seats (Min.)" },
      { key: "averageOrdersPerMinute", value: averageOrdersPerMinute ?? 0, name: "⌀ Orders Completed (Min.)" },
      { key: "numberOfProcessSteps", value: numberOfProcessSteps ?? 0, name: "Process Steps" },
      { key: "totalTransportSystems", value: totalTransportSystems ?? 0, name: "Transport Systems" },
      // Flatten transportTypeDurations with proper names
      ...Object.entries(transportTypeDurations).map(([tsType, stats]) => ({
        key: `tsAvg_${tsType}`,
        value: stats.average ?? 0,
        name: `⌀ ${tsType} (Min.)`,
      })),
      // Flatten processStepDurationsAverages with proper names
      ...Object.entries(processStepDurationsAverages).map(([psName, stats]) => ({
        key: `psAvg_${psName}`,
        value: stats.average ?? 0,
        name: `⌀ ${psName} (Min.)`,
      })),
      // TS counts with descriptive names
      ...Object.entries(transportSystemCounts).map(([tsName, count]) => ({
        key: `tsCount_${tsName}`,
        value: count ?? 0,
        name: `${tsName} Count`,
      })),
    ]
  : [];


  async function handleSaveKPIs() {
    if (!simulationName.trim()) {
      alert("Please enter a simulation name.");
      return;
    }

    try {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulationName,
          kpis: kpiArray,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success) {
          console.log("Simulation saved with ID:", result.simulationId);
          setSaveModalOpen(false);
          setSimulationName("");
        } else {
          alert("Failed to save simulation: " + result.error);
        }
      } else {
        const text = await response.text();
        alert("Failed to save simulation: " + text);
      }
    } catch (err: any) {
      alert("Error saving simulation: " + err.message);
    }
  }

  return (
    <Flex align="center" gap="md" wrap="nowrap" style={{ padding: "1rem" }}>
      <Text size="md" fw={700}>
        Simulation Control:
      </Text>

      {/* Button: Calculate/Reload Simulation */}
      <Tooltip label="Calculate Simulation" position="bottom" withArrow>
        <Button color={PRIMARY} onClick={() => load(1)} loading={loading}>
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
          color={PRIMARY}
          disabled={!simulation}
          onClick={toggle}
          loading={loading}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </Button>
      </Tooltip>

      {/* Adjust Simulation Params Modal */}
      <AdjustSimulationParams />

      {/* Arrow Left */}
      <ActionIcon
        color={PRIMARY}
        variant="outline"
        disabled={playing || frame <= 0 || !simulation}
        onClick={() => moveFrame(-1)}
      >
        <IconArrowLeft />
      </ActionIcon>

      {/* Slider */}
      <Slider
        styles={{ root: { width: 180 } }}
        color={PRIMARY}
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

      <Text>{frame}</Text>

      {/* Arrow Right */}
      <ActionIcon
        color={PRIMARY}
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
        color={PRIMARY}
        variant="outline"
        disabled={!simulation || targetTick < 0}
        onClick={() => handleJumpToTick(targetTick)}
      >
        Jump to Tick
      </Button>

      {/* Save Simulation Button */}
      <Tooltip label="Save KPIs to Database" position="bottom" withArrow>
        <Button
          color={PRIMARY}
          variant="outline"
          disabled={playing || !simulation || kpiArray.length === 0}
          onClick={() => setSaveModalOpen(true)}
        >
          <IconDeviceFloppy />
        </Button>
      </Tooltip>

      {/* Save KPIs Modal */}
      <Modal
        opened={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Simulation KPIs"
      >
        <TextInput
          label="Simulation Name"
          placeholder="Give it a name..."
          value={simulationName}
          onChange={(e) => setSimulationName(e.currentTarget.value)}
          required
        />

        <Flex mt="md" gap="md" justify="flex-end">
          <Button
            variant="outline"
            color="gray"
            onClick={() => {
              setSaveModalOpen(false);
              setSimulationName("");
            }}
          >
            Cancel
          </Button>
          <Button
            color={PRIMARY}
            onClick={handleSaveKPIs}
            disabled={kpiArray.length === 0 || simulationName === ""}
          >
            Save
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
};

export default SimulationControlOverlay;
