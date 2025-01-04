"use client";

import React, { FC } from "react";
import {
    Accordion,
    Button,
    Code,
    Container,
    Divider,
    Flex,
    Grid,
    Paper,
    SimpleGrid,
    Table,
    Text,
} from "@mantine/core";
import GaugeChart from "react-gauge-chart";
import { LocationFull } from "@/lib/simulation/simulationNew";
import { ProcessStep } from "@prisma/client";
import { GaugeSection } from "../custom/GaugeSection";

interface DetailedLocationCardProps {
    location: LocationFull;
    onBack?: () => void;
}

interface InventoryEntry {
    id: number;
    addedAt: string | Date;
    material: string;
    inventoryId: number;
    orderId: number | null;
}


/**
 * "DetailedLocationCard" shows a more "accordion-based" view of a single Location:
 * - location info
 * - an accordion for each process step
 * - a sub-accordion for grouped materials in the inventory
 * - an optional "Back" button at the top
 */
export const DetailedLocationCard: FC<DetailedLocationCardProps> = ({
    location,
    onBack,
}) => {
    const { name, description, processSteps, createdAt, updatedAt } = location;

    /**
     * Calculates the inventory utilization of a process step.
     * @param inventory The inventory object containing the limit and entries.
     * @returns The utilization as a percentage (0 to 1).
     */
    function calculateInventoryUtilization(
        inventory: { limit: number; entries: { id: number }[] }
    ): number {
        if (!inventory || inventory.limit <= 0) {
            throw new Error("Invalid inventory or inventory limit");
        }

        const currentCount = inventory.entries.length;
        const utilization = currentCount / inventory.limit;

        return Math.min(utilization, 1); // Ensure it doesn't exceed 100%
    }

    return (
        <Paper shadow="md" p="lg" style={{ overflowY: "auto" }} bg="white">
            {/* Header */}
            <Flex justify="space-between" align="center" mb="lg">
                <Text fw="bold" size="xl">
                    {name} - Detailed View
                </Text>
                {onBack && (
                    <Button variant="gradient" onClick={onBack}>
                        Back to Overview
                    </Button>
                )}
            </Flex>

            {/* Location Info */}
            <Text fw="bold" mb="sm">
                Location Info
            </Text>
            <Text>Name: {name}</Text>
            <Text>Description: {description}</Text>
            <Text>Created At: {new Date(createdAt).toLocaleString()}</Text>
            <Text>Updated At: {new Date(updatedAt).toLocaleString()}</Text>
            {description && <Text>Description: {description}</Text>}

            {/* Big accordion: each processStep */}
            <Accordion multiple variant="separated" mt="lg">
                {processSteps.map((ps) => {
                    // Calculate gauge utilization
                    const utilization = calculateInventoryUtilization(ps.inventory);

                    return (
                        <Accordion.Item key={ps.id} value={`ps-${ps.id}`}>
                            <Accordion.Control>{ps.name}</Accordion.Control>
                            <Accordion.Panel>
                                <Divider mb={30} size="xs" />

                                <Flex direction="row" align="center">
                                    {/* Left Column: Basic Info */}
                                    <Flex direction="column">
                                        <Flex
                                            direction="row"
                                            align="center"
                                            justify="center"
                                            ta="center"
                                        >
                                            <Flex
                                                direction="column"
                                                justify="center"
                                                align="center"
                                                maw={100}
                                                mr={50}
                                            >
                                                <Text fw={700}>Process Step Details</Text>
                                            </Flex>
                                            <SimpleGrid cols={4}>
                                                <Flex
                                                    w="100%"
                                                    direction="column"
                                                    justify="center"
                                                    align="center"
                                                >
                                                    <Text fw={600}>Status</Text>
                                                    <Text>{ps.status}</Text>
                                                </Flex>
                                                <Flex
                                                    w="100%"
                                                    direction="column"
                                                    justify="center"
                                                    align="center"
                                                >
                                                    <Text fw={600}>Input Speed</Text>
                                                    <Text>{ps.inputSpeed}</Text>
                                                </Flex>
                                                <Flex
                                                    w="100%"
                                                    direction="column"
                                                    justify="center"
                                                    align="center"
                                                >
                                                    <Text fw={600}>Output Speed</Text>
                                                    <Text>{ps.outputSpeed}</Text>
                                                </Flex>
                                                <Flex
                                                    w="100%"
                                                    direction="column"
                                                    justify="center"
                                                    align="center"
                                                >
                                                    <Text fw={600}>Recipe Rate</Text>
                                                    <Text>{ps.recipeRate}</Text>
                                                </Flex>
                                                {ps.totalRecipeTransformations && (
                                                    <Flex w="100%" direction="column">
                                                        <Flex direction="column">
                                                            <Text fw={600}>Transformations</Text>
                                                            <Text ta="center">
                                                                {ps.totalRecipeTransformations}
                                                            </Text>
                                                        </Flex>
                                                    </Flex>
                                                )}
                                            </SimpleGrid>
                                        </Flex>
                                    </Flex>

                                    {/* Right Column: Memoized Gauge */}
                                    <Flex
                                        direction="column"
                                        align="center"
                                        justify="center"
                                        miw={300}
                                        maw={500}
                                        ml={50}
                                    >
                                        <GaugeSection
                                            id={`gauge-ps-${ps.id}`}
                                            percent={utilization}
                                        />
                                    </Flex>
                                </Flex>

                                {/* Sub-Accordion for grouped materials */}
                                <Accordion multiple variant="contained" mt="md">
                                    <Accordion.Item value={`inventory-ps-${ps.id}`}>
                                        <Accordion.Control>
                                            Materials ({ps.inventory.entries.length})
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            {renderGroupedMaterials(
                                                ps.inventory.entries,
                                                processSteps
                                            )}
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>
                            </Accordion.Panel>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </Paper>
    );
};

/** Renders a sub-accordion for each material + a table of entries */
function renderGroupedMaterials(
    entries: InventoryEntry[],
    processSteps?: ProcessStep[]
) {
    const grouped = entries.reduce<Record<string, InventoryEntry[]>>((acc, e) => {
        if (!acc[e.material]) acc[e.material] = [];
        acc[e.material].push(e);
        return acc;
    }, {});

    // If you needed to map inventoryId -> processStepName, you can do so here
    // const inventoryIdToProcessStepName = processSteps?.reduce(...);

    const materials = Object.keys(grouped).sort();

    return (
        <Accordion multiple variant="separated">
            {materials.map((mat) => (
                <Accordion.Item key={mat} value={mat}>
                    <Accordion.Control>
                        {mat} ({grouped[mat].length})
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>ID</Table.Th>
                                    <Table.Th>Added At</Table.Th>
                                    <Table.Th>Order ID</Table.Th>
                                    <Table.Th>Inventory ID</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {grouped[mat].map((item) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td>{item.id}</Table.Td>
                                        <Table.Td>
                                            {new Date(item.addedAt).toLocaleString()}
                                        </Table.Td>
                                        <Table.Td>{item.orderId}</Table.Td>
                                        <Table.Td>{item.inventoryId}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
