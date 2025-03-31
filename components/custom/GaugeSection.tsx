import { Flex, Text, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import React from "react";

function getColor(percent: number): string {
    // Map 0..1 to a hue range from 120° (green) down to 0° (red).
    //  percent=0   => hue=120 => green
    //  percent=1   => hue=0   => red
    const hue = 120 - 120 * percent;
    return `hsl(${hue}, 100%, 50%)`;
}

interface GaugeSectionProps {
    /** Optional title above the gauge */
    title?: string;
    /** The gauge's value as a fraction (0..1) */
    percent: number;
    /** Desired width (and height) of the gauge in px */
    width?: number;
    /** Optionally override the color logic */
    color?: string;
    /** Small label under the gauge */
    footerLabel?: string;
    /** Tooltip content displayed next to the title */
    tooltip?: string | React.ReactNode;
}

/**
 * "GaugeSection" - a memoized 180° gauge.
 * Shows a pointer and arcs from green (left) to red (right).
 */
export const GaugeSection = React.memo(
    ({
        title,
        percent,
        width,
        color,
        footerLabel,
        tooltip,
    }: GaugeSectionProps) => {
        // If you want a dynamic color from green to red, we'll ignore the "color" prop
        // and compute it from `percent`:
        const dynamicColor = getColor(percent);

        return (
            <Flex direction="column" align="center" justify="center">
                {title && (
                    <Flex align="center" justify="space-between" gap={10}>
                        <Text fw={600} fz={16} ta="center">
                            {title}
                        </Text>
                        {tooltip && (
                            <Tooltip label={tooltip} multiline maw={500} radius={5}>
                                <IconInfoCircle style={{ cursor: "pointer" }} />
                            </Tooltip>
                        )}
                    </Flex>
                )}

                <Gauge
                    // The gauge value in percentage (0..100)
                    value={percent * 100}
                    valueMin={0}
                    valueMax={100}
                    // Render as a half-circle (180 degrees) from left (180°) to right (0°)
                    startAngle={-90}
                    endAngle={90}
                    // The gauge's total size in px
                    width={width ?? 200}
                    height={width ?? 200}
                    // MUI X Charts doesn't currently expose a separate "pointer" prop,
                    // but it does show a pointer by default if there's enough space.
                    // We'll style it below.
                    sx={{
                        [`& .${gaugeClasses.valueArc}`]: {
                            // Instead of a single color, you can do a gradient <defs> if you want,
                            // but here's a dynamic color from green to red:
                            fill: color ?? dynamicColor,
                        },
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 40,
                            fontWeight: 700,
                            color: "white",
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "white",
                        },
                        [`& .${gaugeClasses.root}`]: {
                            color: "white !important",
                        },
                    }}
                />

                {footerLabel && (
                    <Text fw={600} fz={9} ta="center" maw={100} c={"white"}>
                        {footerLabel}
                    </Text>
                )}
            </Flex>
        );
    },
    (prev, next) => prev.percent === next.percent
);
