import { Flex, Text } from "@mantine/core";
import { Gauge, gaugeClasses, useGaugeState } from '@mui/x-charts/Gauge';
import React from "react";

/**
 * A memoized GaugeSection to prevent re-renders unless the 'percent' prop changes.
 * - id: an identifier (string or number) to uniquely set the gauge's HTML id
 * - percent: the utilization (0 to 1)
 */
export const GaugeSection = React.memo(
    ({
        title,
        percent,
        width,
        color,
        footerLabel
    }: {
        title?: string;
        percent: number;
        width?: number;
        color?: string
        footerLabel?: string
    }) => {

        return (
            <Flex direction="column" align="center" justify="center" style={{}}>
                <Text fw={600} fz={16} ta="center">
                    {title}
                </Text>
                <Gauge
                    cornerRadius="30%"
                    width={width ? width : 200}
                    height={200}
                    value={percent * 100}
                    sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 40
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: `${color ? color : "#5300E8"}`,
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.disabled,
                        },
                    })}
                />
                <Text fw={600} fz={13} ta="center" maw={100}>
                    {footerLabel}
                </Text>
            </Flex>
        );
    },
    (prev, next) => prev.percent === next.percent //&& prev.id === next.id
);
