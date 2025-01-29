// app/kpis/page.tsx
"use client";

import React, { useState } from "react";
import {
    Title,
    SimpleGrid,
    Text,
    Paper,
    Badge,
    Flex,
    Select,
    Button,
    Tooltip,
} from "@mantine/core";
import { useSimulationLive } from "@/components/context/SimulationContextLive";
import { DetailedKPICard } from "@/components/kpi/DetailedKPICard";
import { Order } from "@prisma/client";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { useKPIs } from "@/components/hooks/useKPIs";
import { KPIsOverview } from "@/components/kpi/KPIsOverview";
import { useSimulationMock } from "../context/SimulationContextMock";
import { useTransportTypes } from "../hooks/useTransportTypes";
import { OrdersList } from "../custom/OrderList";

/**
 * A type to define whether we want the "mock" or "live" mode.
 */
type KPIOverviewMode = "mock" | "live";

/**
 * Props for MonitoringShared.
 */
interface KPIOverviewProps {
    mode: KPIOverviewMode;
}

export default function KPIOverview({ mode }: KPIOverviewProps) {
    // Grab the needed data (simulation, frame, orders, speed) from context
    const { simulation, frame, speed } =
        mode === "mock" ? useSimulationMock() : useSimulationLive();


    // If no simulation => fallback
    if (!simulation) {
        return mode === "mock" ? (
            <Text>Please press on the calculate button.</Text>
        ) : (
            <Text>Loading... (Live)</Text>
        );
    }

    // The current "frame" (i.e., current simulation state)
    const currentFrame = simulation.frames[frame];
    const locations = currentFrame.state.locations;

    // KPI Location Selection
    const [kpiLocationId, setKpiLocationId] = useState<number | null>(
        locations.length > 0 ? locations[0].id : null
    );
    const kpiLocation = locations.find((loc) => loc.id === kpiLocationId);

    // Use the custom hook to calculate KPIs
    const {
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
    } = useKPIs({ simulation, frame, speed });

    // Helper to determine background color for an Order based on status
    const getStatusColor = (status: string): string => {
        switch (status) {
            case "completed":
                return "#2ECC40";
            case "pending":
                return "#9B59B6";
            case "in_progress":
                return "#5300E8";
            default:
                return "#95A5A6";
        }
    };

    const allTypes = useTransportTypes(simulation)

    return (
        <>
            <Title order={2} mb="md">
                KPIs {`${mode === "mock" ? "(Mock Simulation)" : "(Live Simulation)"}`}
            </Title>

            {/* Orders Listing */}
            <Title order={4} mb="sm" mt={"xl"}>
                Orders
            </Title>
            <OrdersList
                orders={currentFrame.orders as Order[]}
                layout="compact" // or "medium"/"big" as you wish
                detailed={true} // <== using the "detailed" style with tooltips
            />
            {/* KPIs Overview Component */}
            <KPIsOverview
                pendingCount={pendingCount}
                inProgressCount={inProgressCount}
                completedCount={completedCount}
                completedSeatsCount={completedSeatsCount}
                averageTimeMinutes={averageTimeMinutes}
                completedSeatsPerMinute={completedSeatsPerMinute}
                averageOrdersPerMinute={averageOrdersPerMinute}
                openAssemblies={openAssemblies}
                transportTypeDurations={transportTypeDurations}
                numberOfProcessSteps={numberOfProcessSteps}
                processStepNames={processStepNames}
                transportSystemCounts={transportSystemCounts}
                totalTransportSystems={totalTransportSystems}
                processStepDurationsAverages={processStepDurationsAverages}
            // transportSystemAverages={transportSystemAverages}
            // allTransportTypes={allTypes}
            />


            {/* Location KPI Details */}
            <Title order={4} mb="sm">
                Location KPI Details
            </Title>
            {locations.length === 0 ? (
                <Text>No locations available</Text>
            ) : (
                <>
                    <Select
                        label="Select a Location for KPI details"
                        placeholder="Pick one"
                        data={locations.map((l) => ({
                            label: l.name,
                            value: l.id.toString(),
                        }))}
                        value={kpiLocationId?.toString() || null}
                        onChange={(value) => {
                            if (value) {
                                setKpiLocationId(parseInt(value));
                            }
                        }}
                        mb="md"
                    />

                    {kpiLocation ? (
                        <DetailedKPICard location={kpiLocation} />
                    ) : (
                        <Text size="sm" mt="xs">
                            Please select a location.
                        </Text>
                    )}
                </>
            )}
        </>
    );
}
