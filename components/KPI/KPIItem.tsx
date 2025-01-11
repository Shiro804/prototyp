// app/kpis/components/KPIItem.tsx
"use client";

import React from "react";
import { Button, Flex, Paper, Text, Tooltip } from "@mantine/core";
import { IconInfoCircleFilled } from "@tabler/icons-react";

interface KPIItemProps {
    label: string;
    value: string | number;
    tooltip?: string | React.ReactNode;
}

export const KPIItem: React.FC<KPIItemProps> = ({ label, value, tooltip }) => {
    const kpiOverviewPaperHeight = 80;
    const kpiOverviewPaperPadding = "xs";

    return (
        <Paper
            shadow="md"
            p={kpiOverviewPaperPadding}
            style={{
                backgroundColor: "#4263eb",
                color: "white",
                minHeight: kpiOverviewPaperHeight,
            }}
        >
            <Flex justify={"space-between"} align={"center"}>
                <Text fw="bold">{label}</Text>
                {tooltip && (
                    <Tooltip
                        label={tooltip}
                        multiline
                        maw={500}
                        radius={5}
                    >
                        <Button
                            m={0}
                            p={0}
                            size="xs"
                            variant="transparent"
                            color="white"
                            justify="center"
                        >
                            <IconInfoCircleFilled />
                        </Button>
                    </Tooltip>
                )}
            </Flex>
            <Text size="lg">{value}</Text>
        </Paper>
    );
};
