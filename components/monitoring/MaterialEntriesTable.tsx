// MaterialEntriesTable.tsx

import React from 'react';
import { Table, Text } from '@mantine/core';

// Importiere den Typ InventoryEntry. Passe den Pfad entsprechend deiner Projektstruktur an.
import { InventoryEntry } from '@prisma/client';

// Falls du Erweiterungen an InventoryEntry hast, wie z.B. InventoryEntryWithDelay, importiere diesen Typ ebenfalls.
// import { InventoryEntryWithDelay } from '../path/to/your/types';

interface MaterialEntriesTableProps {
    entries: InventoryEntry[];
    // Falls du eine erweiterte Version von InventoryEntry verwendest:
    // entries: InventoryEntryWithDelay[];
}

export const MaterialEntriesTable: React.FC<MaterialEntriesTableProps> = ({ entries }) => {
    return (
        <>
            {entries.length === 0 ? (
                <Text>Noch keine Einträge vorhanden.</Text>
            ) : (
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Added At</Table.Th>
                            <Table.Th>Order ID</Table.Th>
                            <Table.Th>Inventory ID</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {entries.map((item) => (
                            <Table.Tr key={item.id}>
                                <Table.Td>{item.id}</Table.Td>
                                <Table.Td>{new Date(item.addedAt).toLocaleString()}</Table.Td>
                                <Table.Td>{item.orderId ?? '-'}</Table.Td>
                                <Table.Td>{item.inventoryId}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </>
    );
};

export default MaterialEntriesTable;
