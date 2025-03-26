"use client";

import { Switch } from "@mantine/core";
import { IconChartInfographic, IconDeviceDesktopAnalytics } from "@tabler/icons-react";
import { useState } from "react";

import MonitoringLive from "../monitoring/MonitoringLive";
import MonitoringMock from "../monitoring/MonitoringMock";
import KpiMock from "../KPI/KPIMock";
import KpiLive from "../KPI/KPILive";

type MonitoringMode = "mock" | "live";

interface GeneralMonitoringProps {
    mode: MonitoringMode;
}

export default function GeneralMonitoring({ mode }: GeneralMonitoringProps) {
    const [view, setView] = useState(true);

    return (
        <>
            <Switch
                styles={{ body: { alignItems: "center" } }}
                label={view ? "Monitoring" : "KPIs"}
                labelPosition={"right"}
                size="xl"
                checked={view}
                color="gray.2"
                onChange={() => setView(!view)}
                onLabel={<IconDeviceDesktopAnalytics color="var(--mantine-color-black)" />}
                offLabel={<IconChartInfographic color="var(--mantine-color-black)" />}
            />

            {mode === "mock" ? (
                view ? (
                    <MonitoringMock />
                ) : (
                    <KpiMock />
                )
            ) : view ? (
                <MonitoringLive />
            ) : (
                <KpiLive />
            )}
        </>
    );
}