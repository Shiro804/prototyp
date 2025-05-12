"use client";

import { InventoryEntryWithDelay, LocationFull } from "@/lib/simulation/Simulation";
import { Box, Flex, Paper, Select, SimpleGrid, Text } from "@mantine/core";
import { FC, useState } from "react";
import { GaugeSection } from "../custom/GaugeSection";
import { Heatmap, HeatmapSlot } from "../custom/Heatmap";
import { useSimulationMock } from "../context/SimulationContextMock";

/**
 * The InventoryVisualization view:
 * - Select a Location
 * - For each ProcessStep in that location, show a Heatmap + Gauge
 */
interface InventoryVisualizationProps { }

export const InventoryVisualization: FC<InventoryVisualizationProps> = () => {
    // Grab data from your simulation context (mock)
    const { simulation, frame } = useSimulationMock();

    if (!simulation) {
        return <Text>Please press on the calculate button.</Text>;
    }

    const currentFrame = simulation.frames[frame];
    const locations = currentFrame.state.locations;

    // We'll store the selected location ID in state. Default to the first location if available.
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
        locations.length > 0 ? String(locations[0].id) : null
    );

    // Find the currently selected location
    const selectedLocation = locations.find(
        (loc) => String(loc.id) === selectedLocationId
    );

    /**
     * Build an array of HeatmapSlot (used + optional entry) for each slot in the inventory.
     */
    function buildHeatmapData(limit: number, entries: InventoryEntryWithDelay[]): HeatmapSlot[] {
        const data: HeatmapSlot[] = [];
        for (let i = 0; i < limit; i++) {
            // Find the one entry (if any) that has slotNumber = i
            const foundEntry = entries.find((e) => e.slotNumber === i);
            data.push({
                used: !!foundEntry,
                entry: foundEntry,
            });
        }
        return data;
    }

    /** Returns fraction 0..1 of how full the inventory is */
    function calculateVisualization(limit: number, usedCount: number): number {
        if (limit <= 0) return 0;
        return Math.min(usedCount / limit, 1);
    }

    // If there's no location selected, show a fallback
    if (!selectedLocation) {
        return (
            <Paper p="md">
                <Select
                    label="Select Location"
                    value={selectedLocationId}
                    onChange={setSelectedLocationId}
                    data={locations.map((loc) => ({
                        label: loc.name,
                        value: String(loc.id),
                    }))}
                    placeholder="No locations found"
                />
                <Text mt="md">No Location Selected.</Text>
            </Paper>
        );
    }

    return (
        <Paper p="md" shadow="md">
            {/* Location selector at the top */}
            <Select
                label="Select Location"
                value={selectedLocationId}
                onChange={setSelectedLocationId}
                data={locations.map((loc) => ({
                    label: loc.name,
                    value: String(loc.id),
                }))}
                placeholder="Pick one"
            />

            {/* Display the location name as a heading */}
            <Text fw="bold" size="xl" mt="md" mb="lg">
                Inventory Visualization for: {selectedLocation.name}
            </Text>

            {/* We'll show each processStep's inventory in a grid with 2 columns */}
            <SimpleGrid cols={1} spacing="xl">
                {selectedLocation.processSteps.map((ps) => {
                    const { limit, entries } = ps.inventory;

                    // Build the heatmap data
                    const heatmapData = buildHeatmapData(limit, entries as InventoryEntryWithDelay[]);

                    // Calculate how full it is
                    const usedCount = heatmapData.filter((s) => s.used).length;
                    const fullness = calculateVisualization(limit, usedCount);

                    return (
                        <Box key={ps.id}>
                            {/* Title above the Heatmap */}
                            <Text mb="sm" fw="bold">
                                {ps.name} (ID: {ps.id})
                            </Text>

                            {/* Show Heatmap + Gauge side by side */}
                            <Flex direction="row" align="center" justify={"space-between"} gap="lg">
                                <Heatmap data={heatmapData} columns={40} />
                                <Flex w={"100%"} h={"100%"} justify={"center"}>
                                    <GaugeSection percent={fullness} width={500} />
                                </Flex>
                            </Flex>
                        </Box>
                    );
                })}
            </SimpleGrid>
        </Paper>
    );
};
