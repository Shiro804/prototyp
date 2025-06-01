"use client";

import React, { useState } from "react";
import {
    Title,
    Flex,
    Text,
    Button,
    SimpleGrid,
} from "@mantine/core";
import { Order } from "@prisma/client";

import { MonitoringCard } from "@/components/monitoring/MonitoringCard";
import { DetailedLocationCard } from "@/components/monitoring/DetailedLocationCard";

import { useSimulationMock } from "@/components/context/SimulationContextMock";
import { useSimulationLive } from "@/components/context/SimulationContextLive";
import { OrdersList } from "../custom/OrderList";
import { ACTIVE_BUTTON_COLOR, PRIMARY } from "@/lib/theme";


/**
 * A type to define whether we want the "mock" or "live" mode.
 */
type MonitoringMode = "mock" | "live";

interface MonitoringProps {
    mode: MonitoringMode;
}

export function Monitoring({ mode }: MonitoringProps) {
    const [selectedLocationsLayout, setSelectedLocationsLayout] = useState("compact");
    const [selectedOrdersLayout, setSelectedOrdersLayout] = useState("compact");

    const { simulation, frame } =
        mode === "mock" ? useSimulationMock() : useSimulationLive();

    // Tracking which location is in "detailed" mode
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

    if (!simulation) {
        return mode === "mock" ? (
            <Text>Please press on the calculate button.</Text>
        ) : (
            <Text>Loading... (Live)</Text>
        );
    }

    const currentFrame = simulation.frames[frame];


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



    return (
        <>
            <Title order={2}>
                Monitoring Overview {mode === "mock" ? "(Mock Simulation)" : "(Live Simulation)"}
            </Title>

            {/* ORDERS */}
            <Flex maw={400} justify="space-between" pb={20} gap={25} align="center">
                <Title order={3} mb={0}>
                    Orders
                </Title>
                <Flex gap={5} align="center">
                    <Button
                        bg={`${selectedOrdersLayout === "compact" ? ACTIVE_BUTTON_COLOR : ""}`}
                        color={PRIMARY}
                        variant="outline"
                        onClick={() => setSelectedOrdersLayout("compact")}
                    >
                        Compact
                    </Button>
                    <Button
                        bg={`${selectedOrdersLayout === "medium" ? ACTIVE_BUTTON_COLOR : ""}`}
                        color={PRIMARY}
                        variant="outline"
                        onClick={() => setSelectedOrdersLayout("medium")}
                    >
                        Medium
                    </Button>
                    <Button
                        bg={`${selectedOrdersLayout === "big" ? ACTIVE_BUTTON_COLOR : ""}`}
                        color={PRIMARY}
                        variant="outline"
                        onClick={() => setSelectedOrdersLayout("big")}
                    >
                        Big
                    </Button>
                </Flex>
            </Flex>

            <OrdersList
                orders={currentFrame.orders as Order[]}
                layout={selectedOrdersLayout as "compact" | "medium" | "big"}
                detailed={false}
            />

            {/* LOCATIONS */}
            <Flex maw={400} justify="space-between" pb={20} gap={25} align="center">
                <Title order={3} mb={0}>
                    Locations
                </Title>
                <Flex gap={5} align="center">
                    <Button
                        bg={`${selectedLocationsLayout === "compact" ? ACTIVE_BUTTON_COLOR : ""}`}
                        color={PRIMARY}
                        variant="outline"
                        onClick={() => setSelectedLocationsLayout("compact")}
                    >
                        Compact
                    </Button>
                    <Button
                        bg={`${selectedLocationsLayout === "medium" ? ACTIVE_BUTTON_COLOR : ""}`}
                        color={PRIMARY}
                        variant="outline"
                        onClick={() => setSelectedLocationsLayout("medium")}
                    >
                        Medium
                    </Button>
                    <Button
                        bg={`${selectedLocationsLayout === "big" ? ACTIVE_BUTTON_COLOR : ""}`}
                        color={PRIMARY}
                        variant="outline"
                        onClick={() => setSelectedLocationsLayout("big")}
                    >
                        Big
                    </Button>
                </Flex>
            </Flex>

            <SimpleGrid
                cols={{
                    base: 1,
                    md: selectedLocationsLayout === "compact" ? 3 : selectedLocationsLayout === "medium" ? 2 : 1,
                }}
                spacing="lg"
            >
                {currentFrame.state.locations.map((loc) => (
                    <MonitoringCard
                        key={loc.id}
                        location={loc}
                        onDetailsClick={() => setSelectedLocationId(loc.id)}
                    />
                ))}
            </SimpleGrid>
        </>
    );
}
