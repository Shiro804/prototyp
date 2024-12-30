import { Accordion, Table } from "@mantine/core";

interface InventoryEntry {
  id: number;
  addedAt: Date; // <--
  material: string;
  inventoryId: number;
}

interface InventoryEntriesAccordionProps {
  entries: InventoryEntry[];
}

export function InventoryEntriesAccordion({
  entries,
}: InventoryEntriesAccordionProps) {
  // 1) Wir gruppieren die Einträge nach 'material'
  const groupedByMaterial = entries.reduce<Record<string, InventoryEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.material]) {
        acc[entry.material] = [];
      }
      acc[entry.material].push(entry);
      return acc;
    },
    {},
  );

  // 2) Sort the keys (material names) alphabetically
  const sortedMaterials = Object.keys(groupedByMaterial).sort();

  // 2) Wir bauen ein Accordion auf, in dem jedes Material sein eigenes Panel hat
  return (
    <Accordion multiple variant="separated">
      {sortedMaterials.map((material, materialEntries) => (
        <Accordion.Item key={material} value={material}>
          <Accordion.Control>
            {material} ({groupedByMaterial[material].length})
          </Accordion.Control>
          <Accordion.Panel>
            {/* Beispiel: Tabelle mit den Einträgen dieses Materials */}
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Added At</Table.Th>
                  <Table.Th>Inventory ID</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {groupedByMaterial[material].map((entry: InventoryEntry) => (
                  <Table.Tr key={entry.id}>
                    <Table.Td>{entry.id}</Table.Td>
                    <Table.Td>
                      {new Date(entry.addedAt).toLocaleString()}
                    </Table.Td>
                    <Table.Td>{entry.inventoryId}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
