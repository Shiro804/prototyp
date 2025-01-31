import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import "./nodes.css";

export type ProcessStepNode = Node<
  {
    name: string;
    location: string;
    entity: object;
  },
  "processStep"
>;

export type TransportSystemNode = Node<
  {
    name: string;
    entity: object;
  },
  "transportSystem"
>;

export type ResourceNode = Node<
  {
    name: string;
    entity: object;
  },
  "resource"
>;

export function ProcessStepNode({ data }: NodeProps<ProcessStepNode>) {
  return (
    <div>
      <span className="location">{data.location}</span>
      <span className="name">{data.name}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function TransportSystemNode({ data }: NodeProps<TransportSystemNode>) {
  return (
    <div>
      <span className="name">{data.name}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function ResourceNode({ data }: NodeProps<ResourceNode>) {
  return (
    <div>
      <span className="name">{data.name}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}


export const NodeTypes = {
  processStep: ProcessStepNode,
  transportSystem: TransportSystemNode,
  resource: ResourceNode,
};

export type NodeType = ProcessStepNode | TransportSystemNode | ResourceNode;

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
  };
