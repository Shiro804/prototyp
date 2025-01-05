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
} from "@mantine/core";
import { Order, TransportSystem } from "@prisma/client";

// Components
import { MonitoringCard } from "@/components/monitoring/MonitoringCard";
import { DetailedLocationCard } from "@/components/monitoring/DetailedLocationCard";

// Types
import { LocationFull } from "@/lib/simulation/Simulation";
// import { SimulationData } from "@/types/..."; // adapt to your actual type location

// Depending on the "mode" we either import the mock context or the live context
import { useSimulationMock } from "@/components/context/SimulationContextMock";
import { useSimulationLive } from "@/components/context/SimulationContextLive";

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
    const { simulation, frame } =
        mode === "mock" ? useSimulationMock() : useSimulationLive();

    // 2) Track which location is selected in "detailed" mode
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
        null
    );

    // If no simulation => fallback
    if (!simulation) {
        return mode === "mock" ? (
            <Text>Please press on the calculate button. (Mock)</Text>
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
                return "#4263eb";
            default:
                return "#95A5A6";
        }
    };

    /**
     * This function only makes sense in "mock" mode, 
     * so you can either:
     * - implement it for both modes
     * - or conditionally define it or call it only if mode==="mock"
     */
    function getTransportSystemsForLocation(location: LocationFull): TransportSystem[] {
        const tsSet = new Map<number, TransportSystem>();

        for (const ps of location.processSteps) {
            // ps.inputs.forEach((ts) => tsSet.set(ts.id, ts)); // (if relevant)
            ps.outputs.forEach((ts) => tsSet.set(ts.id, ts));
        }

        return Array.from(tsSet.values());
    }

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
            <Title>
                Monitoring {mode === "mock" ? "(Mock)" : "(Live)"}
            </Title>

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

            {/* Render Locations */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {currentFrame.state.locations.map((loc) => {
                    // Only call `getTransportSystemsForLocation` if in mock mode
                    const transportSystems =
                        mode === "mock" ? getTransportSystemsForLocation(loc) : undefined;

                    return (
                        <MonitoringCard
                            key={loc.id}
                            location={loc}
                            transportSystems={transportSystems}
                            onDetailsClick={() => setSelectedLocationId(loc.id)}
                        />
                    );
                })}
            </SimpleGrid>
        </>
    );
}
