"use client";

import React, { useState, useEffect } from "react";
import {
    Popover,
    Button,
    Flex,
    NumberInput,
    Text,
    Divider,
    Tooltip,
} from "@mantine/core";
import { useSimulationMock } from "../context/SimulationContextMock";
import { IconPlayerPause, IconInfoCircle } from "@tabler/icons-react";
import {
    ProcessStep as ProcessStepModel,
    TransportSystem as TransportSystemModel,
    Resource as ResourceModel,
} from "@prisma/client";
import { ProcessStepFull } from "@/lib/simulation/Simulation";
import { PRIMARY } from "@/lib/theme";

interface EntityAdjustmentPopoverProps {
    /** The entity object (ProcessStep, TransportSystem, or Resource). */
    entity: ProcessStepModel | TransportSystemModel | ResourceModel;

    /** The entity type: 'processStep', 'transportSystem', or 'resource'. */
    entityType: "processStep" | "transportSystem" | "resource";

    /** Whether the popover is currently open or closed */
    opened: boolean;

    /** Callback to set the popover state from the parent. */
    onOpenedChange: (val: boolean) => void;

    /** Whether simulation is currently playing => disable inputs. */
    playing: boolean;
}

/**
 * A reusable Popover for adjusting entity parameters.
 * This is purely in-memory changes (no backend update).
 */
export function EntityAdjustmentPopover({
    entity,
    entityType,
    opened,
    onOpenedChange,
    playing,
}: EntityAdjustmentPopoverProps) {
    const { updateProcessStep, updateTransportSystem, updateResource, toggle } =
        useSimulationMock();

    // We keep local states for all possible fields:
    const [errorRate, setErrorRate] = useState<number>(0);
    const [outputSpeed, setOutputSpeed] = useState<number>(0);
    const [inputSpeed, setInputSpeed] = useState<number>(0);
    const [minQuantity, setMinQuantity] = useState<number>(0);
    const [transportDelay, setTransportDelay] = useState<number>(0);
    const [recipeRate, setRecipeRate] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const [faultyRate, setFaultyRate] = useState<number>(0);
    const [inventoryLimit, setInventoryLimit] = useState<number>(0);

    // Populate local state from `entity` whenever it changes
    useEffect(() => {
        if (entityType === "processStep") {
            // If you have a "ProcessStepFull" with inventory, you can cast it:
            const ps = entity as unknown as ProcessStepFull;
            setErrorRate(ps.errorRate ?? 0);
            setOutputSpeed(ps.outputSpeed ?? 0);
            setInputSpeed(ps.inputSpeed ?? 0);
            setRecipeRate(ps.recipeRate ?? 0);
            setDuration(ps.duration ?? 0);

            // If we need the inventory limit
            if (ps.inventory) {
                setInventoryLimit(ps.inventory.limit);
            } else {
                setInventoryLimit(0);
            }
        } else if (entityType === "transportSystem") {
            const ts = entity as TransportSystemModel;
            setOutputSpeed(ts.outputSpeed ?? 0);
            setInputSpeed(ts.inputSpeed ?? 0);
            setMinQuantity(ts.minQuantity ?? 0);
            setTransportDelay(ts.transportDelay ?? 0);
        } else if (entityType === "resource") {
            const r = entity as ResourceModel;
            setFaultyRate(r.faultyRate ?? 0);
        }
    }, [entity, entityType]);

    // On Save => call the correct "update" function in memory:
    const handleSave = () => {
        if (entityType === "processStep") {
            const ps = entity as ProcessStepModel;
            updateProcessStep(ps.id, {
                errorRate,
                outputSpeed,
                inputSpeed,
                recipeRate,
                duration,
                inventoryLimit,
            });
        } else if (entityType === "transportSystem") {
            const ts = entity as TransportSystemModel;
            updateTransportSystem(ts.id, {
                inputSpeed,
                outputSpeed,
                minQuantity,
                transportDelay,
            });
        } else if (entityType === "resource") {
            const r = entity as ResourceModel;
            updateResource(r.id, {
                faultyRate,
            });
        }

        onOpenedChange(false);
    };

    /**
     * Local component to standardize label + number input + optional tooltip.
     */
    const LabeledNumberInput: React.FC<{
        label: string;
        tooltip?: string; // new prop for tooltip text
        value: number;
        onChange: (val: number) => void;
        min?: number;
        step?: number;
        disabled?: boolean;
    }> = ({
        label,
        tooltip,
        value,
        onChange,
        min = 0,
        step,
        disabled = false,
    }) => (
            <Flex align={"center"} gap={10} justify={"space-between"}>
                {/* Label + optional tooltip icon */}
                <Flex align="center" justify={"space-between"} w={"60%"}>
                    <Text fz={12}>{label}</Text>
                    {tooltip && (
                        <Tooltip label={tooltip} multiline maw={500} radius={5}>
                            <IconInfoCircle style={{ cursor: "pointer" }} />
                        </Tooltip>
                    )}
                </Flex>

                {/* Actual number input */}
                <NumberInput
                    w={100}
                    value={value}
                    onChange={(val) => onChange(Number(val) ?? 0)}
                    min={min}
                    step={step}
                    disabled={disabled}
                    styles={{ root: { display: "flex" } }}
                />
            </Flex>
        );

    return (
        <Popover
            opened={opened}
            onChange={onOpenedChange}
            position="bottom"
            withArrow
            shadow="md"
            width={250}
        >
            <Popover.Target>
                {/* Usually empty, as we trigger from parent */}
                <div />
            </Popover.Target>

            <Popover.Dropdown>
                <Flex direction="column" gap="sm">
                    {entityType === "processStep" && (
                        <>
                            <Text fw="bold" mb={5}>
                                ProcessStep Settings
                            </Text>
                            <LabeledNumberInput
                                label="Error Rate"
                                tooltip="Probability that a defective item is produced"
                                value={errorRate}
                                onChange={setErrorRate}
                                step={0.01}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Output Speed"
                                tooltip="How quickly items are output per minute"
                                value={outputSpeed}
                                onChange={setOutputSpeed}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Input Speed"
                                tooltip="Max inbound materials per minute"
                                value={inputSpeed}
                                onChange={setInputSpeed}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Recipe Rate"
                                tooltip="How many input materials needed per run"
                                value={recipeRate}
                                onChange={setRecipeRate}
                                min={1}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Duration"
                                tooltip="Time (in ticks) the step needs per cycle"
                                value={duration}
                                onChange={setDuration}
                                min={1}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Inventory Limit"
                                tooltip="Max items that can be stored here"
                                value={inventoryLimit}
                                onChange={setInventoryLimit}
                                min={0}
                                disabled={playing}
                            />
                        </>
                    )}

                    {entityType === "transportSystem" && (
                        <>
                            <Text fw="bold" mb={5}>
                                TransportSystem Settings
                            </Text>
                            <LabeledNumberInput
                                label="Output Speed"
                                tooltip="Items out per minute"
                                value={outputSpeed}
                                onChange={setOutputSpeed}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Input Speed"
                                tooltip="Items in per minute"
                                value={inputSpeed}
                                onChange={setInputSpeed}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Min. Quantity"
                                tooltip="Minimum items required before transport starts"
                                value={minQuantity}
                                onChange={setMinQuantity}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Transport Delay"
                                tooltip="Time (in ticks) it takes to complete one transport"
                                value={transportDelay}
                                onChange={setTransportDelay}
                                min={0}
                                disabled={playing}
                            />
                        </>
                    )}

                    {entityType === "resource" && (
                        <>
                            <Text fw="bold" mb={5}>
                                Resource Settings
                            </Text>
                            <LabeledNumberInput
                                label="Faulty Rate"
                                tooltip="Chance that the resource breaks or produces an error"
                                value={faultyRate}
                                onChange={setFaultyRate}
                                step={0.01}
                                min={0}
                                disabled={playing}
                            />
                        </>
                    )}

                    {playing && (
                        <>
                            <Text c={"#e03131"} fz={13}>
                                Pause the Simulation if you want to adjust parameters! Pause here:
                            </Text>
                            <Button c={PRIMARY} variant="outline" onClick={toggle}>
                                <IconPlayerPause />
                            </Button>
                        </>
                    )}

                    <Divider my="xs" />

                    {/* Buttons */}
                    <Flex justify="flex-end" gap="sm">
                        <Button
                            variant="outline"
                            color="gray"
                            onClick={() => onOpenedChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="fill"
                            color={PRIMARY}
                            onClick={handleSave}
                            disabled={playing}
                        >
                            Save
                        </Button>
                    </Flex>
                </Flex>
            </Popover.Dropdown>
        </Popover>
    );
}
