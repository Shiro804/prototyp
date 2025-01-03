// DetailedKPICard.tsx
"use client";

import { FC } from "react";
import { Paper, Text, Flex, SimpleGrid, Divider, Box } from "@mantine/core";
import GaugeChart from "react-gauge-chart";
import { LocationFull } from "@/lib/simulation/simulationNew";
import { ProcessStep } from "@prisma/client";

interface DetailedKPICardProps {
    location: LocationFull;
}

/**
 * "DetailedKPICard" shows a KPI-oriented layout for a single Location:
 * - Basic Location info (name, date, etc.)
 * - A grid of ProcessSteps, each as a Paper with KPI details
 * - No accordions
 */
export const DetailedKPICard: FC<DetailedKPICardProps> = ({ location }) => {
    const { name, description, processSteps, createdAt, updatedAt } = location;

    /**
     * Calculates the inventory utilization of a process step.
     * @param inventory The inventory object containing the limit and entries.
     * @returns The utilization as a percentage (0 to 1).
     */
    function calculateInventoryUtilization(inventory: {
        limit: number;
        entries: { id: number }[];
    }): number {
        if (!inventory || inventory.limit <= 0) {
            return 0;
        }

        const currentCount = inventory.entries.length;
        const utilization = currentCount / inventory.limit;
        return Math.min(utilization, 1);
    }

    return (
        <Paper shadow="md" p="lg" mb="xl" withBorder bg="white">
            {/* LOCATION INFO */}
            <Text fw="bold" size="xl" mb="sm">
                {name} - KPI Overview
            </Text>
            <Text size="sm">Description: {description || "-"}</Text>
            <Text size="sm">Created At: {new Date(createdAt).toLocaleString()}</Text>
            <Text size="sm" mb="md">
                Updated At: {new Date(updatedAt).toLocaleString()}
            </Text>
            <Divider mb="lg" />

            {/* PROCESS STEPS GRID */}
            <SimpleGrid
                cols={2}
                spacing="md"
            >
                {processSteps.map((ps) => (
                    <Paper key={ps.id} shadow="xs" p="md" withBorder bg="white" c="black" miw={500} maw={700}>
                        {/* bg="#4263eb"  */}
                        <Text fw="bold" size="md" mb="xs">
                            {ps.name}
                        </Text>
                        <Divider mb="sm" />

                        {/* KPIs */}
                        <SimpleGrid cols={2}>
                            {/* Left column: textual details */}
                            <Box>
                                <Text fw={600} size="sm">
                                    Status
                                </Text>
                                <Text size="sm" mb="xs">
                                    {ps.status}
                                </Text>

                                <Text fw={600} size="sm">
                                    Input Speed
                                </Text>
                                <Text size="sm" mb="xs">
                                    {ps.inputSpeed}
                                </Text>

                                <Text fw={600} size="sm">
                                    Output Speed
                                </Text>
                                <Text size="sm" mb="xs">
                                    {ps.outputSpeed}
                                </Text>

                                <Text fw={600} size="sm">
                                    Recipe Rate
                                </Text>
                                <Text size="sm" mb="xs">
                                    {ps.recipeRate}
                                </Text>
                                <Text fw={600} size="sm">
                                    Materials
                                </Text>
                                <Text size="sm" mb="xs">
                                    {ps.inventory.entries.length}
                                </Text>
                                <Text fw={600} size="sm">
                                    Current Orders
                                </Text>
                                <Text size="sm" mb="xs">
                                    {ps.orders.length > 0 ?
                                        ps.orders.map((o) => {
                                            return <>{o.id}{ps.orders[ps.orders.length - 1] == o ? "" : ","} </>
                                        })
                                        :
                                        <>
                                            -
                                        </>
                                    }
                                </Text>

                                {ps.totalRecipeTransformations != null && (
                                    <>
                                        <Text fw={600} size="sm">
                                            Transformations
                                        </Text>
                                        <Text size="sm" mb="xs">
                                            {ps.totalRecipeTransformations}
                                        </Text>
                                    </>
                                )}
                            </Box>

                            {/* Right column: Gauge for inventory utilization */}
                            <Flex direction="column" align="center" justify="center">
                                <Text fz={14} ta="center" mb="xs">
                                    Inventory Utilization
                                </Text>
                                <GaugeChart
                                    id={`gauge-ps-${ps.id}`}
                                    nrOfLevels={100}
                                    arcPadding={0}
                                    cornerRadius={0}
                                    colors={["#2ecc40", "#ed375b"]}
                                    percent={calculateInventoryUtilization(ps.inventory)}
                                    style={{ width: "100%" }}
                                    // textColor="white"
                                    textColor="black"
                                    needleColor="grey"
                                    needleBaseColor="grey"
                                    formatTextValue={(val) => val} // or a custom format
                                />
                            </Flex>
                        </SimpleGrid>
                    </Paper>
                ))}
            </SimpleGrid>
        </Paper>
    );
};
