// DetailedKPICard.tsx
"use client";

import React, { FC, useEffect } from "react";
import { Paper, Text, Flex, SimpleGrid, Divider, Box, Title, MantineStyleProp, StyleProp } from "@mantine/core";
import GaugeChart from "react-gauge-chart";
import { LocationFull } from "@/lib/simulation/Simulation";
import { ProcessStep } from "@prisma/client";
import { GaugeSection } from "../custom/GaugeSection";
import { getTransportSystemsForProcessStep } from "../helpers";

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

    const KPI = (header: string, value: any) => {
        return (
            <Flex direction={"column"}>
                <Text fw={600} size="sm">
                    {header}
                </Text>
                <Text size="sm" mb="xs">
                    {(typeof value === "number") ? "" + value : value}
                </Text>
            </Flex>
        )
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
            <SimpleGrid cols={1} spacing="md">
                {processSteps.map((ps) => {
                    const utilization = calculateInventoryUtilization(ps.inventory);
                    return (
                        <Paper
                            key={ps.id}
                            shadow="xl"
                            p="md"
                            withBorder
                            bg="white"
                            miw={500}
                        >
                            <Flex direction={"column"}>
                                <Box>
                                    <Title order={4} fw="bold" size="md" mb="xs">
                                        {ps.name}
                                    </Title>
                                    <Divider mb="sm" />
                                </Box>
                                <Flex direction={"row"}>
                                    <Flex p={20} pr={40} w={"50%"}>
                                        {/* KPIs */}
                                        <SimpleGrid cols={{ base: 2, sm: 2, lg: 2 }} miw={"50%"} mr={"xl"}>
                                            {/* Left column: textual details */}
                                            {KPI("Status", ps.status)}
                                            {KPI("Input Speed", ps.inputSpeed)}
                                            {KPI("Output Speed", ps.outputSpeed)}
                                            {KPI("Recipe Rate", ps.recipeRate)}
                                            {KPI("Materials", ps.inventory.entries.length)}

                                            {KPI("Order IDs",
                                                ps.orders.length > 0
                                                    ? ps.orders.map((o, index) => (
                                                        <React.Fragment key={o.id}>
                                                            {o.id}
                                                            {index < ps.orders.length - 1 && ", "}
                                                        </React.Fragment>
                                                    ))
                                                    : "-"
                                            )}

                                            {ps.sensors.find(s => s.type === "counter") != null && (
                                                <>
                                                    {KPI("Transformations", ps.sensors.find(s => s.type === "counter")?.value)}
                                                </>
                                            )}

                                            {/* Right column: Memoized Gauge for inventory utilization */}
                                        </SimpleGrid>
                                        <GaugeSection percent={utilization} width={170} />
                                    </Flex>
                                    <Flex direction={"row"} gap={20} align={"center"}>
                                        <Title order={5} style={{ transform: "rotate(-90deg)" }} miw={200} mr={-40}>
                                            Transport System(s)
                                        </Title>
                                        {getTransportSystemsForProcessStep(ps).map(ts => {
                                            return (
                                                <GaugeSection title="Inventory Ut. (%)" percent={ts.inventory.entries.length / ts.inventory.limit} width={170} color="green" footerLabel={ts.name}/>

                                            )
                                        })}
                                    </Flex>
                                    {/* <Flex direction={"column"} w={"100%"}>
                                        <Title order={5}>
                                            Transport System(s)
                                        </Title>
                                        {getTransportSystemsForProcessStep(ps).map(ts => {
                                            return (
                                                <Paper p={"xs"} shadow="xl" mb="xl" withBorder bg="white">
                                                    <Flex>
                                                        <Title order={6} mr={"xs"}>Name:</Title>
                                                        {KPI("", ts.name)}
                                                    </Flex>
                                                    <Flex w={"100%"} justify={"space-between"} p={"xs"} pr={"xl"} >
                                                        <Flex justify={"center"} align={"center"}>
                                                            <SimpleGrid cols={{ base: 2, sm: 1, md: 2, lg: 3 }}>
                                                                {KPI("Placeholder", 1)}
                                                                {KPI("Placeholder", 1)}
                                                                {KPI("Placeholder", 1)}
                                                                {KPI("Placeholder", 1)}
                                                                {KPI("Placeholder", 1)}
                                                                {KPI("Placeholder", 1)}
                                                            </SimpleGrid>
                                                        </Flex>
                                                        <Flex>
                                                            <GaugeSection percent={ts.inventory.entries.length / ts.inventory.limit} width={170} color="green" />
                                                        </Flex>
                                                    </Flex>
                                                </Paper>
                                            )
                                        })}
                                    </Flex> */}
                                </Flex>
                            </Flex>
                        </Paper>
                    );
                })}
            </SimpleGrid>
        </Paper>
    );
};
