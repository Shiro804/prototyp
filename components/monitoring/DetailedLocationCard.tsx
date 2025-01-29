// components/DetailedLocationCard.tsx

"use client";

import React, { FC } from "react";
import {
    Accordion,
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Paper,
    SimpleGrid,
    Text,
    Title,
} from "@mantine/core";
import { LocationFull, TransportSystemFull } from "@/lib/simulation/Simulation";
import { Order, ProcessStep, TransportSystem, InventoryEntry } from "@prisma/client";
import { GaugeSection } from "../custom/GaugeSection";
import MaterialEntriesTable from "./MaterialEntriesTable"; // Passe den Pfad entsprechend an
import { getTransportSystemsForProcessStep } from "../helpers";

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

    const LocationStat = (title: string, value: any) => {
        return (
            <Flex w="100%" direction="column" justify="center" align="center">
                <Text fw={600}>{title}</Text>
                <Text>{typeof value === "number" ? value : "" + value}</Text>
            </Flex>
        )
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
                        <Accordion.Item variant="contained" key={ps.id} value={`ps-${ps.id}`}>
                            <Accordion.Control >{ps.name}</Accordion.Control>
                            <Accordion.Panel>
                                <Divider mb={30} size="xs" />

                                <Flex direction="row" align="center" h={"100%"}>
                                    {/* Linke Spalte: Basisinformationen */}
                                    <Flex direction="column" h={200} w={"50%"}>
                                        <Flex direction="column" justify="flex-start" h={"100%"}>
                                            <Flex direction="row" justify="center" align="center">
                                                <Text mb={20} fw={700}>Process Step Details</Text>
                                            </Flex>
                                            <SimpleGrid cols={4}>
                                                {LocationStat("Status", ps.status)}
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
                                                {ps.recipe && (
                                                    <Flex w="100%" direction="column" justify="center" align="center">
                                                        <Text fw={600}>Recipe</Text>
                                                        <Flex direction={"column"}>{ps.recipe?.inputs.map(i => { return <Text fz={13}>{i.material} ({i.quantity})</Text> })}</Flex>
                                                    </Flex>
                                                )}
                                                {ps.sensors.find(s => s.type === "counter") !== null && (
                                                    LocationStat("Transformations", ps.sensors.find(s => s.type === "counter")?.value)
                                                )}
                                            </SimpleGrid>
                                        </Flex>
                                    </Flex>

                                    {/* Rechte Spalte: Memoized Gauge */}
                                    <Flex direction="column" align="center" justify="center" miw={300} maw={500} ml={50}>
                                        <GaugeSection percent={utilization} />
                                    </Flex>
                                </Flex>

                                {/* Sub-Accordion für Transport Systems */}
                                <Accordion multiple variant="contained" mt="md" w={"100%"}>
                                    <Accordion.Item value={`transport-ps-${ps.id}`}>
                                        <Accordion.Control>
                                            Transport Systems ({ps.outputs.length})
                                        </Accordion.Control>
                                        <Accordion.Panel w={"100%"}>
                                            {getTransportSystemsForProcessStep(ps).map((ts: TransportSystemFull) => (
                                                <Accordion key={ts.id} multiple variant="separated" mb="md" w={"100%"}>
                                                    <Accordion.Item value={`ts-${ts.id}`} w={"100%"}>
                                                        <Accordion.Control>
                                                            {`${ts.name}`}
                                                        </Accordion.Control>
                                                        <Accordion.Panel w={"100%"}>
                                                            <Flex w={"100%"} align="flex-start" p={"sm"}>
                                                                <Flex direction={"column"} w={"50%"} h={"100%"} align={"flex-start"} justify={"flex-start"} mr={"113"}>
                                                                    <Title order={6}>Materials within the Transport System</Title>
                                                                    <Flex direction="column" w="100%">
                                                                        <MaterialEntriesTable w={"100%"} entries={ts.inventory.entries} showMaterialName />
                                                                    </Flex>
                                                                </Flex>
                                                                <Flex>
                                                                    <GaugeSection percent={ts.inventory.entries.length / ts.inventory.limit} width={170} color="green"></GaugeSection>
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
