"use client";

import React from "react";
import { Button, Flex, Paper, Text, Tooltip } from "@mantine/core";
import { IconInfoCircleFilled, IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import { BG_COLOR, PRIMARY, SECONDARY } from "@/lib/theme";

interface KPIItemProps {
  label: string;
  value: string | number;
  compareValue?: string | number;  // compare property
  tooltip?: string | React.ReactNode;
  /**
   * Optional background color. If provided, overrides the default BG_COLOR.
   */
  bg?: string;
}

export const KPIItem: React.FC<KPIItemProps> = ({
  label,
  value,
  compareValue,
  tooltip,
  bg,
}) => {
  const kpiOverviewPaperHeight = 80;
  const kpiOverviewPaperPadding = "xs";

  // Helper to format the value
  const formatValue = (val: string | number): string => {
    if (typeof val === "number") {
      return Number.isInteger(val) ? val.toString() : val.toFixed(2);
    }
    return val;
  };

  const mainValNumber = typeof value === "number" ? value : parseFloat(value);
  const compareValNumber =
    compareValue === undefined
      ? undefined
      : typeof compareValue === "number"
      ? compareValue
      : parseFloat(compareValue);

  const formattedValue = formatValue(value);

  // Compute difference if compareValue is present
  let differenceDisplay: React.ReactNode = null;

  if (compareValNumber !== undefined && !Number.isNaN(compareValNumber)) {
    const diff = mainValNumber - compareValNumber;
    const diffAbs = Math.abs(diff);
    // Format difference similarly
    const diffText = Number.isInteger(diffAbs) ? diffAbs.toString() : diffAbs.toFixed(2);

    if (diff > 0) {
      // Positive => arrow up (green)
      differenceDisplay = (
        <Flex gap={5} align="center">
          <IconArrowUp color="green" size={16} />
          <Text color="green" size="sm">
            +{diffText}
          </Text>
        </Flex>
      );
    } else if (diff < 0) {
      // Negative => arrow down (red)
      differenceDisplay = (
        <Flex gap={5} align="center">
          <IconArrowDown color="red" size={16} />
          <Text color="red" size="sm">
            -{diffText}
          </Text>
        </Flex>
      );
    } else {
      // diff = 0 => "0"
      differenceDisplay = (
        <Text color="gray" size="sm">
          0
        </Text>
      );
    }
  }

  return (
    <Paper
      shadow="xl"
      p={kpiOverviewPaperPadding}
      style={{
        color: "white",
        minHeight: kpiOverviewPaperHeight,
      }}
      // Use the optional 'bg' if provided; otherwise BG_COLOR
      bg={bg ?? BG_COLOR}
      bd={`3px solid ${PRIMARY}`}
    >
      <Flex justify={"space-between"} align={"center"}>
        <Text fw="bold">{label}</Text>
        {tooltip && (
          <Tooltip label={tooltip} multiline maw={500} radius={5}>
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
      {/* Value + difference in a new flex */}
      <Flex justify="space-between" align="center" mt={5}>
        <Text size="lg">{formattedValue}</Text>
        {differenceDisplay && <Flex align="center">{differenceDisplay}</Flex>}
      </Flex>
    </Paper>
  );
};
