import { List, Table, Title } from "@mantine/core";

import { SelectedEntity } from "./nodes";
import { ReactNode } from "react";
import { SimulationEntityState } from "@/lib/simulation/simulationNew";

const titles: { [key in EntityInfoProps["entity"]["type"]]: string } = {
  processStep: "Selected Process Step",
  transportSystem: "Selected Transport System",
};

function renderCell(key: string, content: any): ReactNode {
  if (key === "inventory") {
    const c =
      content as SimulationEntityState["locations"][0]["processSteps"][0]["inventory"];

    const materials = c.entries.reduce<Record<string, number>>((acc, e) => {
      acc[e.material] = acc[e.material] || 0;
      acc[e.material] += 1;

      return acc;
    }, {});

    return (
      <List>
        {Object.entries(materials).map(([m, v]) => (
          <List.Item key={m}>
            {m}: {v}
          </List.Item>
        ))}
      </List>
    );
  }

  return JSON.stringify(content);
}

export interface EntityInfoProps {
  entity: SelectedEntity;
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
