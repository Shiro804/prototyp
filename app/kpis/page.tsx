// app/kpis/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
    Title,
    SimpleGrid,
    Text,
    Paper,
    Badge,
    Flex,
    Select,
    Button,
    Tooltip
} from "@mantine/core";
import { useSimulationLive } from "@/components/SimulationContextLive";
import { DetailedKPICard } from "@/components/KPI/DetailedKPICard";
import { DetailedLocationCard } from "@/components/monitoring/DetailedLocationCard";
import { Order } from "@prisma/client";
import { LocationFull } from "@/lib/simulation/simulationNew";
import { IconInfoCircleFilled } from "@tabler/icons-react";

export default function KpiPage() {
    // Grab the needed data (simulation, frame, orders, speed) from context
    const { simulation, frame, orders, speed } = useSimulationLive();

    // If the simulation is not loaded yet
    if (!simulation) {
        return <Text>Loading...</Text>;
    }

    // The current "frame" (i.e., current simulation state)
    const currentFrame = simulation.frames[frame];
    const locations = currentFrame.locations;

    // KPI Location Selection
    const [kpiLocationId, setKpiLocationId] = useState<number | null>(
        locations.length > 0 ? locations[0].id : null
    );
    const kpiLocation = locations.find((loc) => loc.id === kpiLocationId);

    // -----------------------------
    // 1) Basic KPI counts
    // -----------------------------
    const pendingCount = useMemo(() => orders.filter((o) => o.status === "pending").length, [orders]);
    const inProgressCount = useMemo(() => orders.filter((o) => o.status === "in_progress").length, [orders]);
    const completedCount = useMemo(() => orders.filter((o) => o.status === "completed").length, [orders]);

    // -----------------------------
    // 2) Compute average processing time directly from completed orders
    // -----------------------------
    const averageTimeSeconds = useMemo(() => {
        const completedOrders = orders.filter(
            (o) =>
                o.status === "completed" &&
                o.startedTick != null &&
                o.completedTick != null
        );

        if (completedOrders.length === 0) return 0;

        const totalSeconds = completedOrders.reduce((acc, o) => {
            const durationTicks = o.completedTick! - o.startedTick!;
            return acc + durationTicks * speed;
        }, 0);

        return totalSeconds / completedOrders.length;
    }, [orders, speed]);

    // Helper to determine background color for an Order based on status
    const getStatusColor = (status: string): string => {
        switch (status) {
            case "completed":
                return "#2ECC40";
            case "pending":
                return "#9B59B6";
            case "in_progress":
                return "#4263eb";
            default:
                return "#95A5A6";
        }
    };

    return (
        <>
            <Title order={2} mb="md">
                KPIs
            </Title>

            {/* 1) KPIs Overview: 4 Paper placeholders */}
            <Title order={4} mb="sm">
                KPIs Overview
            </Title>
            <SimpleGrid cols={4} spacing="md" mb="xl">
                {/* 1) Offene Aufträge (pending) */}
                <Paper
                    shadow="md"
                    p="lg"
                    style={{
                        backgroundColor: "#4263eb",
                        color: "white",
                        height: 80,
                    }}
                >
                    <Text fw="bold">Offene Aufträge</Text>
                    <Text size="lg">{pendingCount}</Text>
                </Paper>

                {/* 2) Laufende Aufträge (in_progress) */}
                <Paper
                    shadow="md"
                    p="lg"
                    style={{
                        backgroundColor: "#4263eb",
                        color: "white",
                        height: 80,
                    }}
                >
                    <Text fw="bold">Laufende Aufträge</Text>
                    <Text size="lg">{inProgressCount}</Text>
                </Paper>

                {/* 3) Abgeschlossene Aufträge (completed) */}
                <Paper
                    shadow="md"
                    p="lg"
                    style={{
                        backgroundColor: "#4263eb",
                        color: "white",
                        height: 80,
                    }}
                >
                    <Text fw="bold">Abgeschlossene Aufträge</Text>
                    <Text size="lg">{completedCount}</Text>
                </Paper>

                {/* 4) Average Time KPI */}
                <Paper
                    shadow="md"
                    p="lg"
                    style={{
                        backgroundColor: "#4263eb",
                        color: "white",
                        height: 80,
                    }}
                >
                    <Text fw="bold">Ø Bearbeitungszeit (Sek.)</Text>
                    <Text size="lg">
                        {averageTimeSeconds.toFixed(1)}
                    </Text>
                </Paper>
            </SimpleGrid>

            {/* 2) Orders listing */}
            <Title order={4} mb="sm">
                Orders
            </Title>
            <SimpleGrid cols={10} spacing="xs" mb="xl">
                {orders.map((order: Order) => (
                    <Paper
                        key={order.id}
                        shadow="md"
                        p="xs"
                        pt="xs"
                        withBorder
                        style={{
                            backgroundColor: getStatusColor(order.status),
                            color: "white",
                        }}
                    >
                        <Flex direction="column-reverse" align="center" justify="center">
                            <Badge color="white" variant="light" fz={8} mb="xs">
                                {order.status}
                            </Badge>
                            <Flex justify="center" align="center" p={0} m={0}>
                                <Flex w={30}></Flex>
                                <Text
                                    ta="center"
                                    fw={500}
                                    size="xs"
                                    mr="auto"
                                    w="100%"
                                >
                                    Order-ID: {order.id}
                                </Text>
                                <Flex
                                    w={30}
                                    p={0}
                                    m={0}
                                    align="center"
                                    justify="center"
                                >
                                    <Tooltip
                                        label={
                                            <Flex direction="column" gap={10}>
                                                {Object.entries(order).map(
                                                    ([key, value]) => {
                                                        return (
                                                            <Text key={key} size="xs">
                                                                {key}:{" "}
                                                                {value
                                                                    ? value?.toString()
                                                                    : "-"}
                                                            </Text>
                                                        );
                                                    }
                                                )}
                                            </Flex>
                                        }
                                        multiline
                                        maw={600}
                                    >
                                        <Button
                                            m={0}
                                            p={0}
                                            size="xs"
                                            variant="transparent"
                                            c="white"
                                        >
                                            <IconInfoCircleFilled />
                                        </Button>
                                    </Tooltip>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Paper>
                ))}
            </SimpleGrid>

            {/* 3) Location KPI Details */}
            <Title order={4} mb="sm">
                Location KPI Details
            </Title>
            {locations.length === 0 ? (
                <Text>No locations available</Text>
            ) : (
                <>
                    <Select
                        label="Select a Location for KPI details"
                        placeholder="Pick one"
                        data={locations.map((l) => ({
                            label: l.name,
                            value: l.id.toString(),
                        }))}
                        value={kpiLocationId?.toString() || null}
                        onChange={(value) => {
                            if (value) {
                                setKpiLocationId(parseInt(value));
                            }
                        }}
                        mb="md"
                    />

                    {kpiLocation ? (
                        <DetailedKPICard location={kpiLocation} />
                    ) : (
                        <Text size="sm" mt="xs">
                            Please select a location.
                        </Text>
                    )}
                </>
            )}
        </>)
}
