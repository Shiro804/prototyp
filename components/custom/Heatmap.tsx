"use client";

import React, { FC, ReactNode } from "react";
import { Box, Flex, Tooltip } from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { InventoryEntryWithDelay } from "@/lib/simulation/Simulation";

/**
 * Each HeatmapSlot can carry whether it's used plus an optional entry reference
 * so we can show a tooltip with that entry’s data.
 */
export interface HeatmapSlot {
  used: boolean;
  entry?: InventoryEntryWithDelay;
}

/**
 * Props for the Heatmap component.
 * - data: an array of HeatmapSlot
 * - columns: how many columns to use (defaults to 10)
 * - aboveChildren / belowChildren: optional React elements to render above/below the grid
 */
interface HeatmapProps {
  data: HeatmapSlot[];
  columns?: number;
  aboveChildren?: ReactNode;
  belowChildren?: ReactNode;
}

/**
 * A minimal heatmap using a grid of boxes, with an optional tooltip per slot.
 */
export const Heatmap: FC<HeatmapProps> = ({
  data,
  columns = 10,
  aboveChildren,
  belowChildren,
}) => {
  const { classes } = useStyles();

  return (
    <Flex direction="column" align="center" justify="center">
      {aboveChildren && <Box mb="sm">{aboveChildren}</Box>}

      {/* Dynamically set columns via inline style */}
      <Box
        className={classes.gridContainer}
        style={{ gridTemplateColumns: `repeat(${columns}, 20px)` }}
      >
        {data.map((slot, idx) => {
          const bgColor = slot.used ? "#fa5252" : "#51cf66"; // red vs. green

          // Using a React element with whiteSpace: "pre-line" to respect "\n" in the string
          const tooltipLabel = slot.used ? (
            <div style={{ whiteSpace: "pre-line" }}>
              {`Material: ${slot.entry?.material}\nOrderID: ${
                slot.entry?.orderId ?? "N/A"
              }\nSlot: ${slot.entry?.slotNumber}`}
            </div>
          ) : (
            "Empty slot"
          );

          return (
            <Tooltip key={idx} label={tooltipLabel} position="top" withArrow withinPortal>
              <Box
                className={classes.cell}
                style={{
                  backgroundColor: bgColor,
                  width: 20,
                  height: 20,
                }}
              />
            </Tooltip>
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
    justifyContent: "start",
  },
  cell: {
    cursor: "pointer",
  },
}));
