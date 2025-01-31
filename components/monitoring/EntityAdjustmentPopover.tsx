"use client";

import React, { useState, useEffect } from "react";
import {
    Popover,
    Button,
    Flex,
    NumberInput,
    Switch,
    Text,
    Divider,
} from "@mantine/core";
import { useSimulationMock } from "../context/SimulationContextMock";
import { IconCheck, IconPlayerPause, IconX } from "@tabler/icons-react";
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
    // sensorDelay not used in example, but could be added similarly

    // Populate local state from `entity` whenever it changes
    useEffect(() => {
        if (entityType === "processStep") {
            // If you have a "ProcessStepFull" with inventory, you can cast it:
            const ps = entity as unknown as ProcessStepFull;
            // or if it's not guaranteed to have the full inventory, handle carefully
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
                transportDelay
            });
        } else if (entityType === "resource") {
            const r = entity as ResourceModel;
            updateResource(r.id, {
                faultyRate,
            });
        }

        onOpenedChange(false);
    };

    // Local functional component to eliminate redundancies
    const LabeledNumberInput: React.FC<{
        label: string;
        value: number;
        onChange: (val: number) => void;
        min?: number;
        step?: number;
        disabled?: boolean;
    }> = ({ label, value, onChange, min = 0, step, disabled = false }) => (
        <Flex align={"center"} gap={10} justify={"space-between"}>
            <Text fz={12}>{label}</Text>
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
                                value={errorRate}
                                onChange={setErrorRate}
                                step={0.01}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Output Speed"
                                value={outputSpeed}
                                onChange={setOutputSpeed}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Input Speed"
                                value={inputSpeed}
                                onChange={setInputSpeed}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Recipe Rate"
                                value={recipeRate}
                                onChange={setRecipeRate}
                                min={1}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Duration"
                                value={duration}
                                onChange={setDuration}
                                min={1}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Inventory Limit"
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
                                value={outputSpeed}
                                onChange={setOutputSpeed}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Input Speed"
                                value={inputSpeed}
                                onChange={setInputSpeed}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Min. Quantity"
                                value={minQuantity}
                                onChange={setMinQuantity}
                                min={0}
                                disabled={playing}
                            />
                            <LabeledNumberInput
                                label="Transport Delay"
                                value={transportDelay}
                                onChange={setTransportDelay}
                                min={0}
                                disabled={playing}
                            />
                            {/* minQuantity, transportDelay, etc. can also go here */}
                        </>
                    )}

                    {entityType === "resource" && (
                        <>
                            <Text fw="bold" mb={5}>
                                Resource Settings
                            </Text>
                            <LabeledNumberInput
                                label="Faulty Rate"
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
