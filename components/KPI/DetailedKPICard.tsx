// DetailedKPICard.tsx
"use client";

import React, { FC, useEffect } from "react";
import { Paper, Text, Flex, SimpleGrid, Divider, Box, Title, MantineStyleProp, StyleProp, Tooltip } from "@mantine/core";
import GaugeChart from "react-gauge-chart";
import { LocationFull } from "@/lib/simulation/Simulation";
import { ProcessStep } from "@prisma/client";
import { GaugeSection } from "../custom/GaugeSection";
import { getTransportSystemsForProcessStep } from "../helpers";
import { IconInfoCircle, IconInfoCircleFilled } from "@tabler/icons-react";
import { BG_COLOR } from "@/lib/theme";

/**
 * Interface for DetailedKPICard Props
 */
interface DetailedKPICardProps {
    location: LocationFull;
}


/**
 * DetailedKPICard Component
 * Displays KPI details for a single location, including process steps and their metrics.
 */
export const DetailedKPICard: FC<DetailedKPICardProps> = ({ location }) => {
    const { name, description, processSteps, createdAt, updatedAt } = location;

    useEffect(() => {
        console.log("DetailedKPICard Rendered");
    }, [location]);

    /**
     * Calculates the inventory utilization of a process step.
     * @param inventory The inventory object containing the limit and entries.
     * @returns The utilization as a percentage (0 to 1).
     */
    const calculateInventoryUtilization = (inventory: {
        limit: number;
        entries: { id: number }[];
    }): number => {
        if (!inventory || inventory.limit <= 0) {
            return 0;
        }

        const currentCount = inventory.entries.length;
        const utilization = currentCount / inventory.limit;
        return Math.min(utilization, 1);
    };

    const KPI = (header: string, value: any, tooltip?: string) => {
        return (
            <Flex direction={"column"}>
                <Flex align={"center"} justify={"space-between"}>
                    <Text fw={600} size="sm">
                        {header}
                    </Text>
                    {tooltip && (
                        <Tooltip label={tooltip} multiline maw={500} radius={5}>
                            <IconInfoCircle />
                        </Tooltip>
                    )}
                </Flex>
                <Text size="sm">
                    {(typeof value === "number") ? "" + value : value}
                </Text>
            </Flex>
        )
    }

    return (
        <Paper shadow="md" p="lg" mb="xl" withBorder bg={BG_COLOR} c={"white"}>
            {/* LOCATION INFO */}
            <Text fw="bold" size="xl" mb="sm">
                {name} - KPI Overview
            </Text>
            {description && <Text size="sm">Description: {description}</Text>}
            {/* <Text size="sm">Created At: {new Date(createdAt).toLocaleString()}</Text>
            <Text size="sm" mb="md">
                Updated At: {new Date(updatedAt).toLocaleString()}
            </Text> */}
            <Divider mb="lg" />

            {/* PROCESS STEPS GRID */}
            <SimpleGrid cols={1} spacing="md">
                {processSteps.map((ps) => {
                    const utilization = calculateInventoryUtilization(ps.inventory);
                    return (
                        <Paper
                            key={ps.id}
                            shadow="xl"
                            p="md"
                            withBorder
                            bd={"2px solid #4d93ff"}
                            bg={BG_COLOR}
                            miw={500}
                        >
                            <Flex direction={"column"} bg={BG_COLOR}>
                                <Box bg={BG_COLOR}>
                                    <Title order={4} fw="bold" size="md" mb="xs">
                                        {ps.name}
                                    </Title>
                                    <Divider mb="sm" />
                                </Box>
                                <Flex bg={BG_COLOR} direction={"row"}>
                                    <Flex p={20} pr={40} w={"50%"} direction={"row"} align={"center"} h={"100%"}>
                                        {/* KPIs */}
                                        <SimpleGrid cols={{ base: 2, sm: 2, lg: 2 }} miw={"50%"} mr={"xl"}>
                                            {/* Left column: textual details */}
                                            {KPI("Status", ps.status, "Current status of the process step (e.g. Idling, Running, Stopped.)")}
                                            {KPI("Input Speed", ps.inputSpeed, "Displays the number of materials that can be taken in by the inventory per tick.")}
                                            {KPI("Output Speed", ps.outputSpeed, "Displays the number of materials that can be taken out of the inventory per tick.")}
                                            {KPI("Recipe Rate", ps.recipeRate, "Displays the number of recipes that can be fulfilled within one tick by this process step. One recipe is e.g. 1x Material A + 1x Material B = 1x Product C.")}
                                            {KPI("Materials", ps.inventory.entries.length, "Total number of the materials within the inventory.")}

                                            {KPI("Order IDs",
                                                ps.orders.length > 0
                                                    ? ps.orders.map((o, index) => (
                                                        <React.Fragment key={o.id}>
                                                            {o.id}
                                                            {index < ps.orders.length - 1 && ", "}
                                                        </React.Fragment>
                                                    ))
                                                    : "-",
                                                "Displays the IDs of the orders that are currently being handled within this process step.")}

                                            {ps.sensors.find(s => s.type === "counter") != null && (
                                                <>
                                                    {KPI("Transformations", ps.sensors.find(s => s.type === "counter")?.value)}
                                                </>
                                            )}

                                            {/* Right column: Memoized Gauge for inventory utilization */}
                                        </SimpleGrid>
                                        <Flex direction={"row"} gap={20} align={"center"} justify={"center"} p={20} h={"100%"}>
                                            <GaugeSection title="Inventory Ut. (%)" percent={utilization} width={170} color="green" tooltip="Displays the current inventory utilization in percent. Formula is '(current number of materials within inventory / inventory limit) * 100'." />
                                        </Flex>
                                    </Flex>
                                    <Flex direction={"row"} gap={20} align={"center"} justify={"center"} p={20}>
                                        {ps.outputs.length > 0 && (
                                            <Title order={5} style={{ transform: "rotate(-90deg)" }} miw={200} mr={-40}>
                                                Transport System(s)
                                            </Title>
                                        )}
                                        {getTransportSystemsForProcessStep(ps).map(ts => {
                                            return (
                                                <GaugeSection title="Inventory Ut. (%)" percent={ts.inventory.entries.length / ts.inventory.limit} width={170} color="green" footerLabel={ts.name} tooltip="Displays the current inventory utilization in percent. Formula is 'current materials / limit'." />

                                            )
                                        })}
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Paper>
                    );
                })}
            </SimpleGrid >
        </Paper >
    );
};
