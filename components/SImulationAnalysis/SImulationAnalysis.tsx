"use client";

import React, { useEffect, useState } from "react";
import {
  Title,
  Text,
  Select,
  Paper,
  SimpleGrid,
  Flex,
  Button,
} from "@mantine/core";
import { Prisma, SimulationRecord, KpiRecord } from "@prisma/client";
import { KPIItem } from "../kpi/KPIItem";
import { ACTIVE_BUTTON_COLOR, PRIMARY } from "@/lib/theme";
import { IconReload } from "@tabler/icons-react";

export default function SimulationAnalysis() {
  const [simulations, setSimulations] = useState<SimulationRecord[]>([]);
  const [selectedSimId, setSelectedSimId] = useState<string>("");
  const [kpis, setKpis] = useState<KpiRecord[]>([]);

  // State for the second "compare" simulation
  const [selectedCompareSimId, setSelectedCompareSimId] = useState<string>("");
  const [kpisCompare, setKpisCompare] = useState<KpiRecord[]>([]);

  // Layout state
  const [selectedLayout, setSelectedLayout] = useState("compact");
  const [fetching, setFetching] = useState(false);

  // -------------------------------------
  // Fetching and handling simulations
  // -------------------------------------
  async function fetchSimulations() {
    const res = await fetch("/api/simulationsAll");
    const data = await res.json();
    if (data.success) {
      setSimulations(data.simulations);
    } else {
      alert("Failed to fetch simulations: " + data.error);
    }
  }

  async function fetchKpisForSimulation(simId: string) {
    const res = await fetch(`/api/simulationsAll?simId=${simId}`);
    const data = await res.json();
    if (data.success) {
      return data.kpis as KpiRecord[];
    } else {
      alert("Failed to fetch KPIs: " + data.error);
      return [];
    }
  }

  const handleFetch = () => {
    setFetching(true);
    fetchSimulations().then(() => setFetching(false));
  };

  // Initial fetch of simulations
  useEffect(() => {
    handleFetch();
  }, []);

  // Fetch primary simulation's KPIs
  useEffect(() => {
    if (selectedSimId) {
      fetchKpisForSimulation(selectedSimId).then((res) => setKpis(res));
    } else {
      setKpis([]);
    }
    // Reset compare if the main simulation changes
    setSelectedCompareSimId("");
    setKpisCompare([]);
  }, [selectedSimId]);

  // Fetch compare simulation's KPIs
  useEffect(() => {
    if (selectedCompareSimId) {
      fetchKpisForSimulation(selectedCompareSimId).then((res) =>
        setKpisCompare(res)
      );
    } else {
      setKpisCompare([]);
    }
  }, [selectedCompareSimId]);

  // -------------------------------------
  // Categorize KPIs
  // -------------------------------------
  // We want to filter only the matching keys if there's a compare sim selected
  function getMatchedKpis(mainKpis: KpiRecord[], compareKpis: KpiRecord[]) {
    // Build a map for compareKpis by key
    const compareMap = new Map<string, KpiRecord>();
    compareKpis.forEach((ck) => compareMap.set(ck.key, ck));

    // Return only mainKpis that have a matching key in compareMap
    // If no compare selected, just return mainKpis
    if (!selectedCompareSimId) {
      return mainKpis;
    }

    const matched = mainKpis.filter((mk) => compareMap.has(mk.key));
    return matched;
  }

  const matchedGeneralKpis = getMatchedKpis(
    kpis.filter((k) => !k.key.startsWith("ts") && !k.key.startsWith("ps")),
    kpisCompare.filter((k) => !k.key.startsWith("ts") && !k.key.startsWith("ps"))
  );

  const matchedTransportKpis = getMatchedKpis(
    kpis.filter((k) => k.key.startsWith("ts")),
    kpisCompare.filter((k) => k.key.startsWith("ts"))
  );

  const matchedProcessStepKpis = getMatchedKpis(
    kpis.filter((k) => k.key.startsWith("ps")),
    kpisCompare.filter((k) => k.key.startsWith("ps"))
  );

  // Layout-based grid columns
  const getCols = () => {
    switch (selectedLayout) {
      case "compact":
        return 6;
      case "medium":
        return 5;
      case "big":
        return 4;
      default:
        return 6;
    }
  };

  // -------------------------------------
  // Rendering
  // -------------------------------------
  return (
    <div style={{ padding: "1rem" }}>
      {/* Title + layout buttons */}
      <Flex align={"center"} gap={30}>
        <Title order={2} mb={0}>
          Simulation Analysis
        </Title>
        {selectedSimId !== "" && (
          <Flex gap={5}>
            <Button
              bg={`${selectedLayout === "compact" ? ACTIVE_BUTTON_COLOR : ""}`}
              color={PRIMARY}
              variant="outline"
              onClick={() => setSelectedLayout("compact")}
            >
              Compact
            </Button>
            <Button
              bg={`${selectedLayout === "medium" ? ACTIVE_BUTTON_COLOR : ""}`}
              color={PRIMARY}
              variant="outline"
              onClick={() => setSelectedLayout("medium")}
            >
              Medium
            </Button>
            <Button
              bg={`${selectedLayout === "big" ? ACTIVE_BUTTON_COLOR : ""}`}
              color={PRIMARY}
              variant="outline"
              onClick={() => setSelectedLayout("big")}
            >
              Big
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Main Select + Compare Select + Reload */}
      <Flex miw={"100%"} gap={15} mt={20} align={"center"} mb={20}>
        <Text>Select a Simulation:</Text>
        <Select
          placeholder="Select a simulation..."
          data={simulations.map((s) => ({
            label: s.id + ": " + s.name,
            value: s.id.toString(),
          }))}
          value={selectedSimId}
          onChange={(val) => setSelectedSimId(val || "")}
          maw={500}
          clearable
        />

        {/* Compare Select (only other simulations) */}
        {selectedSimId !== "" && (
          <>
            <Text>Compare to:</Text>
            <Select
              placeholder="(optional)"
              data={simulations
                .filter((sim) => sim.id.toString() !== selectedSimId)
                .map((s) => ({
                  label: s.id + ": " + s.name,
                  value: s.id.toString(),
                }))}
              value={selectedCompareSimId}
              onChange={(val) => setSelectedCompareSimId(val || "")}
              maw={500}
              clearable
            />
          </>
        )}

        <Button color={PRIMARY} loading={fetching} onClick={handleFetch}>
          <IconReload />
        </Button>
      </Flex>

      {/* KPI Display */}
      {kpis.length > 0 && (
        <Paper shadow="md" p="md" withBorder>
          <Title order={4} mb="sm">
            KPIs for Simulation #{selectedSimId}
            {selectedCompareSimId && ` vs #${selectedCompareSimId}`}
          </Title>

          {/* General KPIs */}
          {matchedGeneralKpis.length > 0 && (
            <>
              <Title order={5} mb="sm">
                General KPIs
              </Title>
              <SimpleGrid cols={getCols()} spacing="xs" mb="xl">
                {matchedGeneralKpis.map((k) => {
                  const compareItem = kpisCompare.find(
                    (cmp) => cmp.key === k.key
                  );
                  return (
                    <KPIItem
                      key={k.id}
                      label={k.name ? k.name : k.key}
                      value={k.value}
                      compareValue={compareItem?.value}
                    />
                  );
                })}
              </SimpleGrid>
            </>
          )}

          {/* Transport Systems KPIs */}
          {matchedTransportKpis.length > 0 && (
            <>
              <Title order={5} mb="sm">
                Transport Systems
              </Title>
              <SimpleGrid cols={getCols()} spacing="xs" mb="xl">
                {matchedTransportKpis.map((k) => {
                  const compareItem = kpisCompare.find(
                    (cmp) => cmp.key === k.key
                  );
                  return (
                    <KPIItem
                      key={k.id}
                      label={
                        k.name
                          ? k.name
                          : k.key.replace(/^tsAvg_/, "⌀ ") + " (Avg)"
                      }
                      value={k.value}
                      compareValue={compareItem?.value}
                    />
                  );
                })}
              </SimpleGrid>
            </>
          )}

          {/* Process Steps KPIs */}
          {matchedProcessStepKpis.length > 0 && (
            <>
              <Title order={5} mb="sm">
                Process Steps
              </Title>
              <SimpleGrid cols={getCols()} spacing="xs">
                {matchedProcessStepKpis.map((k) => {
                  const compareItem = kpisCompare.find(
                    (cmp) => cmp.key === k.key
                  );
                  return (
                    <KPIItem
                      key={k.id}
                      label={
                        k.name
                          ? k.name
                          : k.key.replace(/^psAvg_/, "⌀ ") + " (Avg)"
                      }
                      value={k.value}
                      compareValue={compareItem?.value}
                    />
                  );
                })}
              </SimpleGrid>
            </>
          )}
        </Paper>
      )}
    </div>
  );
}
