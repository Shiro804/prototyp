// app/kpis/components/KPIsOverview.tsx

"use client";

import React from "react";
import { Flex, SimpleGrid, Text, Title } from "@mantine/core";
import { KPIItem } from "./KPIItem";
import { SimulationEntityState, SimulationRun } from "@/lib/simulation/Simulation";
import { KPIs } from "../hooks/useKPIs";

interface TransportTypeStats {
    durations: number[];
    average: number;
}

export const KPIsOverview: React.FC<KPIs> = ({
    pendingCount,
    inProgressCount,
    completedCount,
    completedSeatsCount,
    averageTimeMinutes,
    completedSeatsPerMinute,
    averageOrdersPerMinute,
    openAssemblies,
    transportTypeDurations,
    numberOfProcessSteps,
    processStepNames,
    transportSystemCounts,
    totalTransportSystems,
    processStepDurationsAverages
    // transportSystemAverages, // new
    // allTransportTypes,
}) => {



    return (
        <>
            <Title order={4}>
                General KPIs
            </Title>
            <SimpleGrid cols={4} spacing="md" mb="xl">
                <KPIItem label="Pending Orders" value={pendingCount} tooltip="Amount of pending orders within the simulation. An order is pending when no material of this order has been moved yet." />
                <KPIItem label="Running Orders" value={inProgressCount} tooltip="Amount of running orders within the simulation. An order is running when it's in progress (atleast one material of this order has already been moved)." />
                <KPIItem label="Completed Orders" value={completedCount} tooltip="Amount of completed orders within the simulation." />
                <KPIItem label="Open Assemblies" value={openAssemblies} tooltip="Amount of completed seats being left to fulfill 100% of the orders." />
                <KPIItem label="Completed Seats" value={completedSeatsCount} tooltip="Amount of completed seats already assembled." />
                <KPIItem
                    label="⌀ Processing Time (Min.)"
                    value={averageTimeMinutes.toFixed(2)}
                    tooltip="Average order processing time in minutes. Measured starting from the first material from this order being moved to the last completed seat for this order."
                />
                <KPIItem
                    label="⌀ Completed Seats (Min.)"
                    value={completedSeatsPerMinute.toFixed(2)}
                    tooltip="Average number of completed seats being assembled in one minute."
                />
                <KPIItem
                    label="⌀ Orders Completed (Min.)"
                    value={averageOrdersPerMinute.toFixed(2)}
                    tooltip="Average number of orders being completed in one minute."
                />
            </SimpleGrid>

            <Title order={4} fw="bold" mt="xl" mb="md">
                Transport Systems
            </Title>
            <SimpleGrid cols={5} spacing="md">
                <KPIItem label="Transport Systems" value={totalTransportSystems} tooltip={
                    <Flex direction={"column"}>
                        {Object.keys(transportSystemCounts).map(e => {
                            return (
                                <Text fz={13}>
                                    {`${e}: ${transportSystemCounts[e]}`}
                                </Text>
                            )
                        })}
                    </Flex>
                }>
                </KPIItem>
                {Object.entries(transportTypeDurations).map(([tsType, stats]) => {
                    const avgTicks = stats.average;
                    const avgMins = avgTicks / 60; // if you want to convert ticks -> minutes
                    return (
                        <>
                            <KPIItem
                                key={tsType}
                                label={`⌀ ${tsType} (Min.)`}
                                value={`${avgMins.toFixed(2)}`}
                                tooltip={`Average transportation duration for one material within ${tsType}s.`}
                            />
                        </>
                    );
                })}
            </SimpleGrid>

            <Title order={4} fw="bold" mt="xl" mb="md">
                Process Steps
            </Title>
            <SimpleGrid cols={5} spacing="md" mt="md">
                <KPIItem label="Process Steps" value={numberOfProcessSteps} tooltip={
                    <Flex direction={"column"}>
                        {Array.from(processStepNames.values()).map((name) => {
                            return (
                                <Text fz={13} key={name}>
                                    {name}
                                </Text>
                            );
                        })}
                    </Flex>
                }>
                </KPIItem>
                {Object.entries(processStepDurationsAverages).map(([psName, stats]) => {
                    const avgTicks = stats.average;
                    const avgSecs = avgTicks; // or (avgTicks * <your seconds per tick>?)
                    // If your "tick" is a direct measure of time, we can do a direct display
                    return (
                        <KPIItem
                            key={psName}
                            label={`⌀ ${psName} (Min.)`}
                            value={avgSecs.toFixed(2)}
                            tooltip={`Average processing time for ${psName}. For process steps with recipes, it measures the time for one transformation. For process steps without recipes, it measures the duration of one material within the process step.`}
                        />
                    );
                })}
            </SimpleGrid>
        </>
    );
};
