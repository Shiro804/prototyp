// app/kpis/components/KPIItem.tsx
"use client";

import React from "react";
import { Paper, Text } from "@mantine/core";

interface KPIItemProps {
    label: string;
    value: string | number;
}

export const KPIItem: React.FC<KPIItemProps> = ({ label, value }) => {
    const kpiOverviewPaperHeight = 80;
    const kpiOverviewPaperPadding = "md";

    return (
        <Paper
            shadow="md"
            p={kpiOverviewPaperPadding}
            style={{
                backgroundColor: "#4263eb",
                color: "white",
                height: kpiOverviewPaperHeight,
            }}
        >
            <Text fw="bold">{label}</Text>
            <Text size="lg">{value}</Text>
        </Paper>
    );
};
