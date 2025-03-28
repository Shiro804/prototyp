// DetailedLocationCard.tsx
"use client";

import React, { FC } from "react";
import {
    Accordion,
    Box,
    Button,
    Divider,
    Flex,
    Paper,
    SimpleGrid,
    Text,
    Title,
} from "@mantine/core";

import { MRT_ColumnDef } from "mantine-react-table"; // For our column defs
import { LocationFull, SensorFull, TransportSystemFull } from "@/lib/simulation/Simulation";
import {
    InventoryEntry,
    LogEntry,
    ProcessStep,
    Sensor,
} from "@prisma/client";
import { GaugeSection } from "../custom/GaugeSection";
// We now import our universal table
import { UniversalTable } from "./Tables";  // <-- wherever the new Tables.tsx is located
import { getTransportSystemsForProcessStep } from "../helpers";
import { PRIMARY } from "@/lib/theme";

/**
 * "DetailedLocationCard" shows a detailed view of one Location (including all process steps).
 */
interface DetailedLocationCardProps {
    location: LocationFull;
    onBack?: () => void;
}

export const DetailedLocationCard: FC<DetailedLocationCardProps> = ({
    location,
    onBack,
}) => {
    const { name, description, processSteps, createdAt, updatedAt } = location;

    /** Computes the inventory utilization for a process step or TS inventory, as a fraction 0..1. */
    function calculateInventoryUtilization(inventory: {
        limit: number;
        entries: { id: number }[];
    }): number {
        if (!inventory || inventory.limit <= 0) {
            throw new Error("Invalid inventory or inventory limit");
        }
        const currentCount = inventory.entries.length;
        const utilization = currentCount / inventory.limit;
        return Math.min(utilization, 1);
    }

    /** Renders a small block with a title/value pair. */
    function LocationStat(title: string, value: any) {
        return (
            <Flex w="100%" direction="column" justify="center" align="center">
                <Text fw={600}>{title}</Text>
                <Text>{typeof value === "number" ? value : String(value)}</Text>
            </Flex>
        );
    }

    return (
        <Paper shadow="md" p="lg" style={{ overflowY: "auto" }} bg="white">
            {/* Header */}
            <Flex justify="space-between" align="center" mb="lg">
                <Text fw="bold" size="xl">
                    {name} - Detailed View
                </Text>
                {onBack && (
                    <Button variant="outline" color={PRIMARY} onClick={onBack}>
                        Back to Overview
                    </Button>
                )}
            </Flex>

            {/* Basic Location Info */}
            <Text fw="bold" mb="sm">
                Location Info
            </Text>
            <Text>Name: {name}</Text>
            <Text>Description: {description}</Text>
            <Text>Created At: {new Date(createdAt).toLocaleString()}</Text>
            <Text>Updated At: {new Date(updatedAt).toLocaleString()}</Text>

            {/* Main Accordion: Each ProcessStep */}
            <Accordion multiple variant="separated" mt="lg">
                {processSteps.map((ps) => {
                    const utilization = calculateInventoryUtilization(ps.inventory);

                    return (
                        <Accordion.Item
                            variant="contained"
                            key={ps.id}
                            value={`ps-${ps.id}`}
                        >
                            <Accordion.Control>{ps.name}</Accordion.Control>
                            <Accordion.Panel>
                                <Divider mb={30} size="xs" />

                                <Flex direction="row" align="center" h={"100%"}>
                                    {/* Left Column: Basic Info */}
                                    <Flex direction="column" h={200} w={"50%"}>
                                        <Flex direction="column" justify="flex-start" h={"100%"}>
                                            <Flex direction="row" justify="center" align="center">
                                                <Text mb={20} fw={700}>
                                                    Process Step Details
                                                </Text>
                                            </Flex>
                                            <SimpleGrid cols={4}>
                                                {LocationStat("Status", ps.status)}
                                                {LocationStat("Input Speed", ps.inputSpeed)}
                                                {LocationStat("Output Speed", ps.outputSpeed)}
                                                {LocationStat("Recipe Rate", ps.recipeRate)}

                                                {ps.recipe && (
                                                    <Flex
                                                        w="100%"
                                                        direction="column"
                                                        justify="center"
                                                        align="center"
                                                    >
                                                        <Text fw={600}>Recipe</Text>
                                                        <Flex direction={"column"}>
                                                            {ps.recipe.inputs.map((i) => (
                                                                <Text fz={13} key={i.id}>
                                                                    {i.material} ({i.quantity})
                                                                </Text>
                                                            ))}
                                                        </Flex>
                                                    </Flex>
                                                )}

                                                {/* If there's a counter sensor, show # transforms */}
                                                {ps.sensors.find((s) => s.type === "counter") && (
                                                    LocationStat(
                                                        "Transformations",
                                                        ps.sensors.find((s) => s.type === "counter")?.value
                                                    )
                                                )}
                                            </SimpleGrid>
                                        </Flex>
                                    </Flex>

                                    {/* Right Column: Gauge */}
                                    <Flex
                                        direction="column"
                                        align="center"
                                        justify="center"
                                        miw={300}
                                        maw={500}
                                        ml={50}
                                    >
                                        <GaugeSection percent={utilization} />
                                    </Flex>
                                </Flex>

                                {/* Sub-Accordion for Transport Systems */}
                                <Accordion multiple variant="contained" mt="md" w={"100%"}>
                                    <Accordion.Item value={`transport-ps-${ps.id}`}>
                                        <Accordion.Control>
                                            Transport Systems ({ps.outputs.length})
                                        </Accordion.Control>
                                        <Accordion.Panel w={"100%"}>
                                            {getTransportSystemsForProcessStep(ps).map(
                                                (ts: TransportSystemFull) => (
                                                    <Accordion
                                                        key={ts.id}
                                                        multiple
                                                        variant="separated"
                                                        mb="md"
                                                        w={"100%"}
                                                    >
                                                        <Accordion.Item value={`ts-${ts.id}`} w={"100%"}>
                                                            <Accordion.Control>{ts.name}</Accordion.Control>
                                                            <Accordion.Panel w={"100%"}>
                                                                <Flex
                                                                    w={"100%"}
                                                                    align="flex-start"
                                                                    p={"sm"}
                                                                    wrap="wrap"
                                                                >
                                                                    {/* Materials of TS => Use UniversalTable */}
                                                                    <Flex
                                                                        direction={"column"}
                                                                        w={"50%"}
                                                                        h={"100%"}
                                                                        align={"flex-start"}
                                                                        justify={"flex-start"}
                                                                        mr={60}
                                                                    >
                                                                        <Title order={6} mb="xs">
                                                                            Materials within the Transport System
                                                                        </Title>

                                                                        {/* Let's define columns for InventoryEntry */}
                                                                        <UniversalTable<InventoryEntry>
                                                                            data={ts.inventory.entries}
                                                                            columns={getInventoryEntryColumns()}
                                                                            tableOptions={{
                                                                                // For example: enableColumnResizing, row selection, etc.
                                                                            }}
                                                                        />
                                                                    </Flex>

                                                                    {/* Gauge for TS inventory */}
                                                                    <Flex ml="auto" mr="auto" align="center">
                                                                        <GaugeSection
                                                                            percent={
                                                                                ts.inventory.entries.length /
                                                                                ts.inventory.limit
                                                                            }
                                                                            width={170}
                                                                            color="green"
                                                                        />
                                                                    </Flex>
                                                                </Flex>

                                                                {/* Additional Sub-Accordion for TS Sensors */}
                                                                {ts.sensors && ts.sensors.length > 0 && (
                                                                    <Accordion
                                                                        multiple
                                                                        variant="contained"
                                                                        mt="md"
                                                                        w={"100%"}
                                                                    >
                                                                        <Accordion.Item
                                                                            value={`ts-sensors-${ts.id}`}
                                                                        >
                                                                            <Accordion.Control>
                                                                                Sensors ({ts.sensors.length})
                                                                            </Accordion.Control>
                                                                            <Accordion.Panel>
                                                                                {renderSensorsAccordion(ts.sensors)}
                                                                            </Accordion.Panel>
                                                                        </Accordion.Item>
                                                                    </Accordion>
                                                                )}
                                                            </Accordion.Panel>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                )
                                            )}
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>
                                <Accordion multiple variant="contained" mt="md">
                                    <Accordion.Item value={`inventory-ps-${ps.id}`}>
                                        <Accordion.Control>
                                            Materials ({ps.inventory.entries.length})
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <UniversalTable<InventoryEntry>
                                                data={ps.inventory.entries}
                                                columns={getInventoryEntryColumns()}
                                            />
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>

                                {/* Sub-Accordion for PS Sensors (if any) */}
                                {ps.sensors && ps.sensors.length > 0 && (
                                    <Accordion multiple variant="contained" mt="md">
                                        <Accordion.Item value={`ps-sensors-${ps.id}`}>
                                            <Accordion.Control>
                                                Sensors ({ps.sensors.length})
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                {renderSensorsAccordion(ps.sensors)}
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>
                                )}
                            </Accordion.Panel>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </Paper>
    );
};

/* -------------------------------------------------------------------------
 * Sensor(s) Rendering
 * ------------------------------------------------------------------------- */

/**
 * For a list of sensors, we create another Accordion (one item per sensor),
 * each containing a universal table for the sensor's log entries.
 */
function renderSensorsAccordion(sensors: SensorFull[]) {
    return (
        <Accordion multiple variant="separated">
            {sensors.map((sensor: SensorFull) => (
                <Accordion.Item key={sensor.id} value={`sensor-${sensor.id}`}>
                    <Accordion.Control>{`${sensor.name} (${sensor.type})`}</Accordion.Control>
                    <Accordion.Panel>
                        Produced Products: {sensor.value}
                        <UniversalTable<LogEntry>
                            data={sensor.logEntries || []}
                            columns={getLogEntryColumns()}
                            tableOptions={{
                                enableColumnResizing: true,

                                // etc...
                            }}
                        />

                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}

/* -------------------------------------------------------------------------
 * Column Definitions for each entity type
 * ------------------------------------------------------------------------- */

/** 
 * Returns columns suitable for InventoryEntry objects 
 */
function getInventoryEntryColumns() {
    const columns: MRT_ColumnDef<InventoryEntry>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "material",
            header: "Material",
        },
        {
            accessorKey: "addedAt",
            header: "Added At",
            Cell: ({ cell }) => {
                const val = cell.getValue<Date>();
                return val ? new Date(val).toLocaleString() : "-";
            },
        },
        {
            accessorKey: "orderId",
            header: "Order ID",
            Cell: ({ cell }) => cell.getValue<number>() ?? "-",
        },
        {
            accessorKey: "inventoryId",
            header: "Inventory ID",
        },
        {
            accessorKey: "slotNumber",
            header: "Slot",
        },
    ];
    return columns;
}

/** 
 * Returns columns suitable for LogEntry objects 
 */
function getSensorCounterLogEntryColumns() {
    const columns: MRT_ColumnDef<LogEntry>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "createdAt",
            header: "CreatedAt",
            Cell: ({ cell }) => {
                const val = cell.getValue<Date>();
                return val ? new Date(val).toLocaleString() : "-";
            },
        },
        {
            accessorKey: "inputType",
            header: "InputType",
        },
        {
            accessorKey: "materialName",
            header: "MaterialName",
        },
    ];
    return columns;
}
/** 
 * Returns columns suitable for LogEntry objects 
 */
function getLogEntryColumns() {
    const columns: MRT_ColumnDef<LogEntry>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "createdAt",
            header: "CreatedAt",
            Cell: ({ cell }) => {
                const val = cell.getValue<Date>();
                return val ? new Date(val).toLocaleString() : "-";
            },
        },
        {
            accessorKey: "inputType",
            header: "InputType",
        },
        {
            accessorKey: "materialId",
            header: "MaterialID",
        },
        {
            accessorKey: "materialName",
            header: "MaterialName",
        },
        {
            accessorKey: "processStepId",
            header: "ProcessStepID",
            Cell: ({ cell }) => cell.getValue<number>() ?? "-",
        },
        {
            accessorKey: "transportSystemId",
            header: "TransportSystemID",
            Cell: ({ cell }) => cell.getValue<number>() ?? "-",
        },
    ];
    return columns;
}
