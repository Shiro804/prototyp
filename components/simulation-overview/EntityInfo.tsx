// EntityInfo.tsx

import { Table, Title } from "@mantine/core";
import { ReactNode } from "react";
import { MaterialSelectedEntity } from "../material-flow-graph-overview/nodesMaterial";

const titles: { [key in MaterialSelectedEntity["type"]]: string } = {
    processStep: "Selected Process Step",
    transportSystem: "Selected Transport System",
    material: "Selected Material",
};

/**
 * If you want to handle special fields for a material (like "materialName", "orderId", etc.)
 * you can expand your logic in `renderCell`.
 */
function renderCell(key: string, content: any): ReactNode {
    return JSON.stringify(content);
}

export interface EntityInfoProps {
    entity: MaterialSelectedEntity;
}

export function EntityInfo({ entity }: EntityInfoProps) {
    return (
        <>
            <Title>{titles[entity.type]}</Title>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Property</Table.Th>
                        <Table.Th>Value</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {Object.entries(entity.data.entity).map(([k, v]) => (
                        <Table.Tr key={k}>
                            <Table.Td>{k}</Table.Td>
                            <Table.Td>{renderCell(k, v)}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </>
    );
}
