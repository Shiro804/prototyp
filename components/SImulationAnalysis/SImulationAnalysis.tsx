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
import { KPIItem } from "../KPI/KPIItem";
import { ACTIVE_BUTTON_COLOR, PRIMARY } from "@/lib/theme";
import { IconReload } from "@tabler/icons-react";

/**
 * The server returns an array of { tick, type, name }
 * for each bottleneck event. We'll define the shape here.
 */
interface BottleneckEvent {
    tick: number;
    type: string;
    name: string;
}

export default function SimulationAnalysis() {
    const [simulations, setSimulations] = useState<SimulationRecord[]>([]);
    const [selectedSimId, setSelectedSimId] = useState<string>("");
    const [kpis, setKpis] = useState<KpiRecord[]>([]);
    const [bottlenecks, setBottlenecks] = useState<BottleneckEvent[]>([]);

    // State for the second "compare" simulation
    const [selectedCompareSimId, setSelectedCompareSimId] = useState<string>("");
    const [kpisCompare, setKpisCompare] = useState<KpiRecord[]>([]);
    const [bottlenecksCompare, setBottlenecksCompare] = useState<BottleneckEvent[]>([]);

    // Layout state
    const [selectedLayout, setSelectedLayout] = useState("compact");
    const [fetching, setFetching] = useState(false);

    // -------------------------------------
    // 1) Fetching the Simulations list
    // -------------------------------------
    async function fetchSimulations() {
        // GET all simulations (IDs and names only)
        const res = await fetch("/api/simulationsAll");
        const data = await res.json();
        if (data.success) {
            setSimulations(data.simulations); // array of {id, name,...}
        } else {
            alert("Failed to fetch simulations: " + data.error);
        }
    }

    // 2) Fetch a single simulation => returns { success, kpis, bottlenecks, simulation }
    async function fetchSimulationData(simId: string) {
        const res = await fetch(`/api/simulationsAll?simId=${simId}`);
        const data = await res.json();
        if (data.success) {
            return {
                kpis: data.kpis as KpiRecord[],
                bottlenecks: (data.bottlenecks ?? []) as BottleneckEvent[],
            };
        } else {
            alert("Failed to fetch data: " + data.error);
            return { kpis: [], bottlenecks: [] };
        }
    }

    const handleFetch = () => {
        setFetching(true);
        fetchSimulations().then(() => setFetching(false));
    };

    // On mount, fetch all simulations
    useEffect(() => {
        handleFetch();
    }, []);

    // When user picks a main simulation, fetch its data
    useEffect(() => {
        if (selectedSimId) {
            fetchSimulationData(selectedSimId).then((res) => {
                setKpis(res.kpis);
                setBottlenecks(res.bottlenecks);
                console.log("res###########################################################", res);
            });
        } else {
            setKpis([]);
            setBottlenecks([]);
        }
        // Reset compare data
        setSelectedCompareSimId("");
        setKpisCompare([]);
        setBottlenecksCompare([]);
    }, [selectedSimId]);

    // When user picks a compare simulation, fetch its data
    useEffect(() => {
        if (selectedCompareSimId) {
            fetchSimulationData(selectedCompareSimId).then((res) => {
                setKpisCompare(res.kpis);
                setBottlenecksCompare(res.bottlenecks);
            });
        } else {
            setKpisCompare([]);
            setBottlenecksCompare([]);
        }
    }, [selectedCompareSimId]);

    // -------------------------------------
    // 3) We want to filter only the matching KPI keys 
    //    if there's a compare sim selected. 
    //    (Bottlenecks are separate, no matching logic)
    // -------------------------------------
    function getMatchedKpis(mainKpis: KpiRecord[], compareKpis: KpiRecord[]) {
        if (!selectedCompareSimId) {
            return mainKpis;
        }
        const compareMap = new Map<string, KpiRecord>();
        compareKpis.forEach((ck) => compareMap.set(ck.key, ck));
        return mainKpis.filter((mk) => compareMap.has(mk.key));
    }

    // We only do the matched logic for actual KPIs, ignoring "bottlenecks"
    const matchedGeneralKpis = getMatchedKpis(
        kpis.filter(
            (k) =>
                !k.key.startsWith("ts") &&
                !k.key.startsWith("ps") &&
                !k.key.startsWith("bottleneck") // ignore bottlenecks from KPI merging
        ),
        kpisCompare.filter(
            (k) =>
                !k.key.startsWith("ts") &&
                !k.key.startsWith("ps") &&
                !k.key.startsWith("bottleneck")
        )
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

    const handleSimulationSelectChange = (val: string | null) => {
        console.log(val);
        setSelectedSimId(val || "");
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
            <Flex miw={"100%"} gap={40} mt={20} align={"center"} mb={20}>
                <Flex gap={10} align={"center"}>
                    <Text>Select a Simulation:</Text>
                    <Select
                        key={selectedSimId}
                        placeholder="Select a simulation..."
                        data={simulations.map((s) => ({
                            label: s.id + ": " + s.name,
                            value: s.id.toString(),
                        }))}
                        value={selectedSimId}
                        onChange={(val) => handleSimulationSelectChange(val)}
                        maw={500}
                        clearable
                    />
                </Flex>

                {/* Compare Select (only other simulations) */}
                {selectedSimId !== "" && (
                    <Flex gap={10} align={"center"}>
                        <Text>Compare to:</Text>
                        <Select
                            key={selectedCompareSimId}
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
                    </Flex>
                )}

                <Button color={PRIMARY} loading={fetching} onClick={handleFetch}>
                    <IconReload />
                </Button>
            </Flex>

            {/* KPI Display */}
            {kpis.length > 0 && (
                <Paper shadow="md" p="md" withBorder c="black">
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
                            <SimpleGrid cols={getCols()} spacing="xs" mb="xl">
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

                    {/* 
            4) Bottle Necks - SEPARATE from KPIs 
               We read them directly from `bottlenecks` array 
               returned by the server for the main sim,
               and `bottlenecksCompare` for the compare sim (if any).
          */}

                    {bottlenecks.length > 0 && (
                        <>
                            <Title order={5} mb="sm">
                                Bottle Necks (Sim #{selectedSimId})
                            </Title>
                            <SimpleGrid cols={getCols()} spacing="xs" mb="xl">
                                {bottlenecks.map((b, idx) => (
                                    <KPIItem
                                        key={`bneck_main_${idx}`}
                                        label={`${b.name}`}
                                        value={b.tick}
                                        bg="red"
                                    />
                                ))}
                            </SimpleGrid>
                        </>
                    )}

                    {bottlenecksCompare.length > 0 && (
                        <>
                            <Title order={5} mb="sm">
                                Bottle Necks (Sim #{selectedCompareSimId})
                            </Title>
                            <SimpleGrid cols={getCols()} spacing="xs" mb="xl">
                                {bottlenecksCompare.map((b, idx) => (
                                    <KPIItem
                                        key={`bneck_cmp_${idx}`}
                                        label={`${b.name}`}
                                        value={b.tick}
                                        bg="red"
                                    />
                                ))}
                            </SimpleGrid>
                        </>
                    )}
                </Paper>
            )}
        </div>
    );
}
