// nodesMaterial.ts

import { SimulationEntityState } from "@/lib/simulation/Simulation";
import { List, Title, Tooltip } from "@mantine/core";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import "./layout.css";

/**
 * We'll define 4 node interfaces:
 *  - ProcessStep
 *  - TransportSystem
 *  - Resource
 *  - Material
 */

// ----------------------------
// 1) PROCESS STEP
// ----------------------------
export type ProcessStepNode = Node<
  {
    name: string;
    location?: string;
    entity: object;
  },
  "processStep"
>;

const MaterialProcessStepNodeLabel = ({
  entity,
}: {
  entity: SimulationEntityState["locations"][0]["processSteps"][0];
}) => (
  <>
    <Title order={3}>Assigned Resources</Title>
    <List>
      {entity.resources.map((r) => (
        <List.Item key={r.id}>{r.name}</List.Item>
      ))}
    </List>
  </>
);

export function MaterialProcessStepNode({
  data,
  selected,
}: NodeProps<ProcessStepNode>) {
  return (
    <Tooltip
      position="right"
      offset={15}
      label={<MaterialProcessStepNodeLabel entity={data.entity as any} />}
      opened={selected}
    >
      <div className="processStepNode">
        <span className="location">{data.location}</span>
        <span className="name">{data.name}</span>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </Tooltip>
  );
}

// ----------------------------
// 2) TRANSPORT SYSTEM
// ----------------------------
export type TransportSystemNode = Node<
  {
    name: string;
    entity: object;
  },
  "transportSystem"
>;

export function MaterialTransportSystemNode({
  data,
}: NodeProps<TransportSystemNode>) {
  return (
    <div className="transportSystemNode">
      <span className="name">{data.name}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ----------------------------
// 3) RESOURCE
// ----------------------------
export type ResourceNode = Node<
  {
    name: string;
    entity: object;
  },
  "resource"
>;

export function MaterialResourceNodeComponent({
  data,
}: NodeProps<ResourceNode>) {
  return (
    <div className="resourceNode">
      <span className="resourceName">{data.name}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ----------------------------
// 4) MATERIAL
// ----------------------------
export type MaterialNode = Node<
  {
    materialName: string;
    entity: object;
  },
  "material"
>;

export function MaterialNodeComponent({ data }: NodeProps<MaterialNode>) {
  return (
    <div className="materialNode">
      <span className="materialName">{data.materialName}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export type NodeType =
  | ProcessStepNode
  | TransportSystemNode
  | ResourceNode
  | MaterialNode;

export const MaterialFlowNodeTypes = {
  processStep: MaterialProcessStepNode,
  transportSystem: MaterialTransportSystemNode,
  resource: MaterialResourceNodeComponent,
  material: MaterialNodeComponent,
};

// ---------------------------------
// SelectedEntity shape
// ---------------------------------
export type SelectedEntity =
  | {
      type: "processStep";
      data: ProcessStepNode["data"];
    }
  | {
      type: "transportSystem";
      data: TransportSystemNode["data"];
    }
  | {
      type: "resource";
      data: ResourceNode["data"];
    }
  | {
      type: "material";
      data: MaterialNode["data"];
    };
