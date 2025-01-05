// app/kpis/components/KPIsOverview.tsx
"use client";

import React from "react";
import { SimpleGrid, Text } from "@mantine/core";
import { KPIItem } from "./KPIItem";

interface KPIsOverviewProps {
    pendingCount: number;
    inProgressCount: number;
    completedCount: number;
    completedSeatsCount: number;
    averageTimeMinutes: number;
    completedSeatsPerMinute: number;
    averageOrdersPerMinute: number;
    openAssemblies: number;
}

export const KPIsOverview: React.FC<KPIsOverviewProps> = ({
    pendingCount,
    inProgressCount,
    completedCount,
    completedSeatsCount,
    averageTimeMinutes,
    completedSeatsPerMinute,
    averageOrdersPerMinute,
    openAssemblies
}) => {
    return (
        <>
            <SimpleGrid
                cols={4}
                spacing="md"
                mb="xl"
            >
                <KPIItem label="Open Orders" value={pendingCount} />
                <KPIItem label="Running Orders" value={inProgressCount} />
                <KPIItem label="Completed Orders" value={completedCount} />
                <KPIItem label="Open Assemblies" value={openAssemblies} />
                <KPIItem label="Completed Seats" value={completedSeatsCount} />
                <KPIItem label="⌀ Avg Processing Time (Min.)" value={averageTimeMinutes.toFixed(2)} />
                <KPIItem label="⌀ Completed Seats (Min.)" value={completedSeatsPerMinute.toFixed(2)} />
                <KPIItem label="⌀ Orders Completed (Min.)" value={averageOrdersPerMinute.toFixed(2)} />
            </SimpleGrid>
        </>
    );
};
