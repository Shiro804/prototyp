"use client";

import React, { FC, ReactNode } from "react";
import { Box, Flex } from "@mantine/core";
import { createStyles } from "@mantine/styles";

/** 
 * We define a simple interface for our heatmap slots. 
 * Typically, the length of the array = inventory.limit 
 */
export interface HeatmapSlot {
    used: boolean; // e.g. "true" if slot is occupied
}

/**
 * Props for the Heatmap component.
 * - data: an array of HeatmapSlot (or booleans if you prefer).
 * - columns: how many columns to use (optional, defaults to 10).
 * - aboveChildren / belowChildren: optional React elements to render above/below the grid.
 */
interface HeatmapProps {
    data: HeatmapSlot[];
    columns?: number;
    aboveChildren?: ReactNode;
    belowChildren?: ReactNode;
}

/**
 * Example minimal "heatmap" using a grid of boxes.
 */
export const Heatmap: FC<HeatmapProps> = ({
    data,
    columns = 10,
    aboveChildren,
    belowChildren,
}) => {
    const { classes } = useStyles();

    return (
        <Flex direction="row" align="center" justify="center">
            {aboveChildren && <Box mb="sm">{aboveChildren}</Box>}

            <Box className={classes.gridContainer}>
                {data.map((slot, idx) => {
                    const bgColor = slot.used ? "#fa5252" : "#51cf66"; // red vs. green
                    return (
                        <Box
                            key={idx}
                            className={classes.cell}
                            style={{
                                backgroundColor: bgColor,
                                width: 20,
                                height: 20,
                            }}
                        />
                    );
                })}
            </Box>

            {belowChildren && <Box mt="sm">{belowChildren}</Box>}
        </Flex>
    );
};

const useStyles = createStyles(() => ({
    gridContainer: {
        display: "grid",
        gap: "3px",
        // We repeat 'columns' times, each cell is 20px wide
        // e.g. if columns=10, we get 10 columns of 20px
        // then it flows to a new row automatically.
        gridTemplateColumns: `repeat(25, 20px)`,
        justifyContent: "start",
    },
    cell: {
        cursor: "pointer",
        width: 20,
        height: 20,
    },
}));

