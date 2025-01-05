import { Flex, Text } from "@mantine/core";
import React from "react";
import GaugeChart from "react-gauge-chart";

/**
 * A memoized GaugeSection to prevent re-renders unless the 'percent' prop changes.
 * - id: an identifier (string or number) to uniquely set the gauge's HTML id
 * - percent: the utilization (0 to 1)
 */
export const GaugeSection = React.memo(
    ({
        id,
        percent,
        width
    }: {
        id: string;
        percent: number;
        width?: string;
    }) => {
        return (
            <Flex direction="column" align="center" justify="center" style={{ width: "100%" }}>
                <Text fz={14} ta="center" mb="xs">
                    Inventory Utilization
                </Text>
                <GaugeChart
                    id={id}
                    nrOfLevels={10}
                    arcPadding={0}
                    cornerRadius={0}
                    colors={["#5991ff", "#ed375b"]}
                    percent={percent}
                    style={{ width: width ? width : "100%", borderRadius: "20px" }}
                    textColor="black"
                    needleColor="grey"
                    needleBaseColor="grey"
                    formatTextValue={(val) => `${(+val).toFixed(1)}%`}
                />
            </Flex>
        );
    },
    (prev, next) => prev.percent === next.percent && prev.id === next.id
);
