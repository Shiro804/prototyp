"use client";

import React, { useState } from "react";
import {
    Title,
    SimpleGrid,
    Text,
    Paper,
    Flex,
    Badge,
    Stack,
    Button,
} from "@mantine/core";
import { Order, TransportSystem } from "@prisma/client";

// Components
import { MonitoringCard } from "@/components/monitoring/MonitoringCard";
import { DetailedLocationCard } from "@/components/monitoring/DetailedLocationCard";


// Depending on the "mode" we either import the mock context or the live context
import { useSimulationMock } from "@/components/context/SimulationContextMock";
import { useSimulationLive } from "@/components/context/SimulationContextLive";
import { getTransportSystemsForLocation } from "../helpers";

/**
 * A type to define whether we want the "mock" or "live" mode.
 */
type MonitoringMode = "mock" | "live";

/**
 * Props for MonitoringShared.
 */
interface MonitoringProps {
    mode: MonitoringMode;
}

/**
 * A single shared monitoring component, which chooses the underlying data
 * based on the `mode` prop.
 */
export function Monitoring({ mode }: MonitoringProps) {
    // 1) Get the simulation/frames from the correct context
    const [selectedLayout, setSelectedLayout] = useState("");

    const { simulation, frame } =
        mode === "mock" ? useSimulationMock() : useSimulationLive();

    // 2) Track which location is selected in "detailed" mode
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
        null
    );

    // If no simulation => fallback
    if (!simulation) {
        return mode === "mock" ? (
            <Text>Please press on the calculate button.</Text>
        ) : (
            <Text>Loading... (Live)</Text>
        );
    }

    // Extract the currentFrame from the simulation
    const currentFrame = simulation.frames[frame];


    /**
     * Function to determine the background color based on order status
     */
    const getStatusColor = (status: string): string => {
        switch (status) {
            case "completed":
                return "#2ECC40";
            case "pending":
                return "#9B59B6";
            case "in_progress":
                return "#5300E8";
            default:
                return "#95A5A6";
        }
    };


    // If a location is selected, show the Detailed View
    if (selectedLocationId !== null) {
        const location = currentFrame.state.locations.find(
            (l) => l.id === selectedLocationId
        );
        if (!location) return <Text>Error: Location not found</Text>;

        return (
            <DetailedLocationCard
                location={location}
                onBack={() => setSelectedLocationId(null)}
            />
        );
    }

    // Otherwise, show the Overview
    return (
        <>
            <Title order={2}>
                Monitoring Overview {mode === "mock" ? "(Mock Simulation)" : "(Live Simulation)"}
            </Title>

            <Title order={3}>Orders</Title>
            {/* Render Orders */}
            <SimpleGrid cols={10} spacing="xs" mb="xl">
                {currentFrame.orders.map((order: Order) => (
                    <Paper
                        key={order.id}
                        shadow="md"
                        p="md"
                        pt="xs"
                        withBorder
                        style={{
                            backgroundColor: getStatusColor(order.status),
                            color: "white",
                        }}
                    >
                        <Flex direction="column-reverse">
                            <Text fw={500} size="xs">Order-ID: {order.id}</Text>
                            <Flex justify="center" align="center">
                                <Badge color="white" variant="light" fz={8} mb="xs">
                                    {order.status}
                                </Badge>
                            </Flex>
                        </Flex>

                        <Stack gap={5}>
                            <Text size="xs">Quantity: {order.quantity}</Text>
                            {order.completedAt && (
                                <Text size="xs">
                                    Completed At: {new Date(order.completedAt).toLocaleString()}
                                </Text>
                            )}
                        </Stack>
                    </Paper>
                ))}
            </SimpleGrid>
            <Flex maw={200} justify={"space-between"} pb={20} gap={25} align={"center"}>
                <Title order={3} mb={0}>Locations</Title>
                <Flex gap={5} align={"center"}>
                    <Button color="#5300E8" variant="outline" onClick={() => setSelectedLayout("compact")}>Compact</Button>
                    <Button color="#5300E8" variant="outline" onClick={() => setSelectedLayout("big")}>Big</Button>
                </Flex>
            </Flex>

            {/* Render Locations */}
            <SimpleGrid cols={{ base: 1, md: selectedLayout === "compact" ? 2 : 1 }} spacing="lg">
                {currentFrame.state.locations.map((loc) => {

                    return (
                        <MonitoringCard
                            key={loc.id}
                            location={loc}
                            onDetailsClick={() => setSelectedLocationId(loc.id)}
                        />
                    );
                })}
            </SimpleGrid>
        </>
    );
}
