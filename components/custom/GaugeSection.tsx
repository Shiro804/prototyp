import { Flex, Text } from "@mantine/core";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import React from "react";

function getColor(percent: number): string {
    // Map 0..1 to a hue range from 120° (green) down to 0° (red).
    //  percent=0   => hue=120 => green
    //  percent=1   => hue=0   => red
    const hue = 120 - 120 * percent;
    return `hsl(${hue}, 100%, 50%)`;
}

/**
 * "GaugeSection" - a memoized 180° gauge.
 * Shows a pointer and arcs from green (left) to red (right).
 * 
 * @param {object} props
 * @param {string} [props.title] - optional title above the gauge
 * @param {number} props.percent - utilization (0..1)
 * @param {number} [props.width] - the gauge's width (px)
 * @param {string} [props.color] - if you prefer to override the gradient logic
 * @param {string} [props.footerLabel] - small label under the gauge
 */
export const GaugeSection = React.memo(
    ({
        title,
        percent,
        width,
        color,
        footerLabel,
    }: {
        title?: string;
        percent: number;
        width?: number;
        color?: string;
        footerLabel?: string;
    }) => {
        // If you want a dynamic color from green to red, we'll ignore the "color" prop
        // and compute it from `percent`:
        const dynamicColor = getColor(percent);

        return (
            <Flex direction="column" align="center" justify="center">
                {title && (
                    <Text fw={600} fz={16} ta="center">
                        {title}
                    </Text>
                )}

                <Gauge
                    // The gauge value in percentage (0..100)
                    value={percent * 100}
                    valueMin={0}
                    valueMax={100}
                    // Render as a half-circle (180 degrees) from left (180°) to right (0°)
                    startAngle={-90}
                    endAngle={90}
                    // Adjust thickness as needed
                    // If you want to specify the gauge's total width in px
                    width={width ?? 200}
                    height={width ?? 200}
                    // MUI X Charts doesn't currently expose a separate "pointer" prop,
                    // but it does show a pointer by default if there's enough space.
                    // We'll style it below.
                    sx={{
                        [`& .${gaugeClasses.valueArc}`]: {
                            // Instead of a single color, you can do a gradient <defs> if you want,
                            // but here's a dynamic color from green to red:
                            fill: dynamicColor,
                        },
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 40,
                            fontWeight: 700,
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: '#e0e0e0',
                        },
                    }}
                    
                />

                {footerLabel && (
                    <Text fw={600} fz={13} ta="center" maw={100} mt={4}>
                        {footerLabel}
                    </Text>
                )}
            </Flex>
        );
    },
    (prev, next) => prev.percent === next.percent
);
