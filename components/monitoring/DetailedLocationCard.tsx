// components/DetailedLocationCard.tsx

"use client";

import React, { FC } from "react";
import {
    Accordion,
    Button,
    Center,
    Divider,
    Flex,
    Paper,
    SimpleGrid,
    Text,
} from "@mantine/core";
import { LocationFull } from "@/lib/simulation/Simulation";
import { Order, ProcessStep, TransportSystem, InventoryEntry } from "@prisma/client";
import { GaugeSection } from "../custom/GaugeSection";
import { getTransportSystemsForLocation } from "@/app/incoming-goods/helpers";
import MaterialEntriesTable from "./MaterialEntriesTable"; // Passe den Pfad entsprechend an

interface DetailedLocationCardProps {
    location: LocationFull;
    onBack?: () => void;
}

/**
 * "DetailedLocationCard" zeigt eine detaillierte Ansicht einer einzelnen Location:
 * - Standortinformationen
 * - ein Accordion für jeden Process Step
 * - ein Sub-Accordion für Transport Systems
 * - ein optionaler "Back" Button oben
 */
export const DetailedLocationCard: FC<DetailedLocationCardProps> = ({
    location,
    onBack,
}) => {
    const { name, description, processSteps, createdAt, updatedAt } = location;

    /**
     * Berechnet die Inventar-Auslastung eines Process Steps.
     * @param inventory Das Inventar-Objekt mit Limit und Einträgen.
     * @returns Die Auslastung als Prozentsatz (0 bis 1).
     */
    function calculateInventoryUtilization(
        inventory: { limit: number; entries: { id: number }[] }
    ): number {
        if (!inventory || inventory.limit <= 0) {
            throw new Error("Invalid inventory or inventory limit");
        }

        const currentCount = inventory.entries.length;
        const utilization = currentCount / inventory.limit;

        return Math.min(utilization, 1); // Stelle sicher, dass es 100% nicht überschreitet
    }

    return (
        <Paper shadow="md" p="lg" style={{ overflowY: "auto" }} bg="white">
            {/* Header */}
            <Flex justify="space-between" align="center" mb="lg">
                <Text fw="bold" size="xl">{name} - Detailed View</Text>
                {onBack && (
                    <Button variant="gradient" onClick={onBack}>
                        Back to Overview
                    </Button>
                )}
            </Flex>

            {/* Standortinformationen */}
            <Text fw="bold" mb="sm">Location Info</Text>
            <Text>Name: {name}</Text>
            <Text>Description: {description}</Text>
            <Text>Created At: {new Date(createdAt).toLocaleString()}</Text>
            <Text>Updated At: {new Date(updatedAt).toLocaleString()}</Text>

            {/* Haupt-Accordion: Jeder Process Step */}
            <Accordion multiple variant="separated" mt="lg">
                {processSteps.map((ps) => {
                    // Berechne die Auslastung des Inventars
                    const utilization = calculateInventoryUtilization(ps.inventory);

                    return (
                        <Accordion.Item key={ps.id} value={`ps-${ps.id}`}>
                            <Accordion.Control>{ps.name}</Accordion.Control>
                            <Accordion.Panel>
                                <Divider mb={30} size="xs" />

                                <Flex direction="row" align="center">
                                    {/* Linke Spalte: Basisinformationen */}
                                    <Flex direction="column">
                                        <Flex direction="row" align="center" justify="center" ta="center">
                                            <Flex direction="column" justify="center" align="center" maw={100} mr={50}>
                                                <Text fw={700}>Process Step Details</Text>
                                            </Flex>
                                            <SimpleGrid cols={4}>
                                                <Flex w="100%" direction="column" justify="center" align="center">
                                                    <Text fw={600}>Status</Text>
                                                    <Text>{ps.status}</Text>
                                                </Flex>
                                                <Flex w="100%" direction="column" justify="center" align="center">
                                                    <Text fw={600}>Input Speed</Text>
                                                    <Text>{ps.inputSpeed}</Text>
                                                </Flex>
                                                <Flex w="100%" direction="column" justify="center" align="center">
                                                    <Text fw={600}>Output Speed</Text>
                                                    <Text>{ps.outputSpeed}</Text>
                                                </Flex>
                                                <Flex w="100%" direction="column" justify="center" align="center">
                                                    <Text fw={600}>Recipe Rate</Text>
                                                    <Text>{ps.recipeRate}</Text>
                                                </Flex>
                                                {ps.totalRecipeTransformations !== null && (
                                                    <Flex w="100%" direction="column">
                                                        <Flex direction="column">
                                                            <Text fw={600}>Transformations</Text>
                                                            <Text ta="center">{ps.totalRecipeTransformations}</Text>
                                                        </Flex>
                                                    </Flex>
                                                )}
                                            </SimpleGrid>
                                        </Flex>
                                    </Flex>

                                    {/* Rechte Spalte: Memoized Gauge */}
                                    <Flex direction="column" align="center" justify="center" miw={300} maw={500} ml={50}>
                                        <GaugeSection id={`gauge-ps-${ps.id}`} percent={utilization} />
                                    </Flex>
                                </Flex>

                                {/* Sub-Accordion für Transport Systems */}
                                <Accordion multiple variant="contained" mt="md">
                                    <Accordion.Item value={`transport-ps-${ps.id}`}>
                                        <Accordion.Control>
                                            Transport Systems ({ps.outputs.length})
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            {getTransportSystemsForLocation(location).map((ts) => (
                                                <Accordion key={ts.id} multiple variant="separated" mb="md">
                                                    <Accordion.Item value={`ts-${ts.id}`}>
                                                        <Accordion.Control>
                                                            {`${ts.name}`}
                                                        </Accordion.Control>
                                                        <Accordion.Panel>
                                                            <Flex w={"100%"} align="center" justify="space-between" p={"sm"}>
                                                                <Flex direction="column" w="60%">
                                                                    <MaterialEntriesTable w={"100%"} entries={ts.inventory.entries} />
                                                                </Flex>
                                                                <Flex w="30%">
                                                                    <GaugeSection id={`gauge-ts-${ts.id}`} percent={ts.inventory.entries.length / ts.inventory.limit} width="80%"></GaugeSection>
                                                                </Flex>
                                                            </Flex>
                                                        </Accordion.Panel>
                                                    </Accordion.Item>
                                                </Accordion>
                                            ))}
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>

                                {/* Sub-Accordion für gruppierte Materialien */}
                                <Accordion multiple variant="contained" mt="md">
                                    <Accordion.Item value={`inventory-ps-${ps.id}`}>
                                        <Accordion.Control>
                                            Materials ({ps.inventory.entries.length})
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            {renderGroupedMaterials(ps.inventory.entries)}
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>
                            </Accordion.Panel>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </Paper>
    )
};

/** 
 * Hilfsfunktion zum Rendern gruppierter Materialien.
 */
function renderGroupedMaterials(
    entries: InventoryEntry[]
) {
    const grouped = entries.reduce<Record<string, InventoryEntry[]>>((acc, e) => {
        if (!acc[e.material]) acc[e.material] = [];
        acc[e.material].push(e);
        return acc;
    }, {});

    const materials = Object.keys(grouped).sort();

    return (
        <Accordion multiple variant="separated">
            {materials.map((mat) => (
                <Accordion.Item key={mat} value={mat}>
                    <Accordion.Control>{mat} ({grouped[mat].length})</Accordion.Control>
                    <Accordion.Panel>
                        <MaterialEntriesTable entries={grouped[mat]} />
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
