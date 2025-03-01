"use client";

import { InventoryEntryWithDelay, LocationFull } from "@/lib/simulation/Simulation";
import { Box, Flex, Paper, Select, SimpleGrid, Text } from "@mantine/core";
import { FC, useState } from "react";
import { GaugeSection } from "../custom/GaugeSection";
import { Heatmap, HeatmapSlot } from "../custom/Heatmap";
import { useSimulationMock } from "../context/SimulationContextMock";

interface InventoryVisualizationProps {
}

export const InventoryVisualization: FC<InventoryVisualizationProps> = () => {


    const { simulation, frame } = useSimulationMock();

    if (!simulation) {
        return (
            <Text>Please press on the calculate button.</Text>
        )
    }

    const currentFrame = simulation.frames[frame];
    const locations = currentFrame.state.locations;

    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
        locations.length > 0 ? String(locations[0].id) : null
    );

    // Find the currently selected location
    const selectedLocation = locations.find(
        (loc) => String(loc.id) === selectedLocationId
    );

    /**
     * For a given inventory (limit, entries),
     * build the data array for the heatmap:
     *  - length of array = inventory.limit
     *  - each index's "used" is true if a slotNumber in the entries matches i
     */
    function buildHeatmapData(
        limit: number,
        usedSlotNumbers: number[] | Set<number>
    ): HeatmapSlot[] {
        const data: HeatmapSlot[] = [];
        for (let i = 0; i < limit; i++) {
            data.push({ used: Array.isArray(usedSlotNumbers) ? usedSlotNumbers.includes(i) : usedSlotNumbers.has(i) });
        }
        return data;
    }

    /**
     * Return fraction 0..1 of how full the inventory is
     */
    function calculateVisualization(limit: number, usedCount: number): number {
        if (limit <= 0) return 0;
        return Math.min(usedCount / limit, 1);
    }

    // If there's no location selected or no list, handle that gracefully
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
            {/* Location selector at top */}
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
            <SimpleGrid cols={2} spacing="xl">
                {selectedLocation.processSteps.map((ps) => {
                    const { limit, entries } = ps.inventory;
                    // Gather used slotNumbers
                    const usedSlots = new Set<number>(
                        entries
                            .filter((e: InventoryEntryWithDelay) => e.slotNumber !== undefined && e.slotNumber !== null)
                            .map((e: InventoryEntryWithDelay) => e.slotNumber as number)
                    );

                    // Build our "HeatmapSlot[]" array
                    const heatmapData = buildHeatmapData(limit, usedSlots);

                    // Calculate how full
                    const Visualization = calculateVisualization(limit, usedSlots.size);

                    return (
                        <Box key={ps.id}>
                            {/* Title above the Heatmap */}
                            <Text mb="sm" fw="bold">
                                {ps.name} (ID: {ps.id})
                            </Text>

                            {/* We put a small row with Heatmap and Gauge side by side */}
                            <Flex direction="row" align="flex-start" gap="lg">
                                {/* The heatmap itself */}
                                <Heatmap
                                    data={heatmapData}
                                    columns={10} // or some default
                                />

                                {/* The gauge chart to the right */}
                                <GaugeSection percent={Visualization} width={120} />
                            </Flex>
                        </Box>
                    );
                })}
            </SimpleGrid>
        </Paper>
    );
};
