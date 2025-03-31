// EntityInfo.tsx
"use client";

import { Table, Title } from "@mantine/core";
import { ReactNode } from "react";
import { SelectedEntity } from "./nodes";
import { getFriendlyLabel, getFriendlyValue } from "../custom/utils/friendlyMappings";
import { PROPERTIES_TO_SKIP } from "../custom/utils/technicalKeywords";

const titles: { [key in SelectedEntity["type"]]: string } = {
    processStep: "Selected Process Step",
    transportSystem: "Selected Transport System",
    resource: "Selected Resource",
    material: "Selected Material",
};

/**
 * Renders an object as a sub-table of [property -> value], skipping technical fields.
 */
function renderSubObject(obj: any): ReactNode {
    // If null/undefined, nothing to show
    if (!obj) return null;

    // Convert the object's entries to a list, skipping any "technical" or null values
    const entries = Object.entries(obj).filter(
        ([k, v]) => !PROPERTIES_TO_SKIP.includes(k) && v != null
    );

    return (
        <Table withColumnBorders mt={5} mb={10}>
            <Table.Thead>
                <Table.Tr>

                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {entries.map(([k, v]) => (
                    <Table.Tr key={k}>
                        {/* Convert the field name with getFriendlyLabel */}
                        <Table.Td style={{ fontWeight: 600 }}>{getFriendlyLabel(k)}</Table.Td>
                        {/* Recursively render the value */}
                        <Table.Td>{renderCell(k, v)}</Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
}

/**
 * Renders a single field value. If it's an array, we create a sub-table for each item;
 * if it's an object, we create a sub-table for its properties; otherwise, a simple text.
 */
function renderCell(key: string, value: any): ReactNode {
    // 1) If the value is an array => make a sub-table of items
    if (Array.isArray(value)) {
        return (
            <Table
                withColumnBorders
                mt={5}
                mb={10}
            >
                <Table.Thead>
                    <Table.Tr>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {value.map((item, i) => (
                        <Table.Tr key={i}>
                            <Table.Td>
                                {/* If each array element is an object, render a sub-object.
                    If it's primitive, we'll see it as text. */}
                                {renderCell(key, item)}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        );
    }

    // 2) If it's a non-null object => render as sub-table
    if (value && typeof value === "object") {
        return renderSubObject(value);
    }

    // 3) Otherwise => use getFriendlyValue (handles dates, strings, etc.)
    return <>{getFriendlyValue(key, value)}</>;
}

export interface EntityInfoProps {
    entity: SelectedEntity;
}

export function EntityInfo({ entity }: EntityInfoProps) {
    // Filter out top-level technical fields
    const topEntries = Object.entries(entity.data.entity).filter(
        ([k, v]) => !PROPERTIES_TO_SKIP.includes(k) && v != null
    );

    return (
        <>
            <Title>{titles[entity.type]}</Title>

            {/* Top-level table */}
            <Table w={800} withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ minWidth: 200 }}>Property</Table.Th>
                        <Table.Th>Value</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {topEntries.map(([k, v]) => (
                        <Table.Tr key={k}>
                            <Table.Td style={{ fontWeight: 600 }}>{getFriendlyLabel(k)}</Table.Td>
                            {/* Sub-table or text, depending on the type */}
                            <Table.Td>{renderCell(k, v)}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </>
    );
}
