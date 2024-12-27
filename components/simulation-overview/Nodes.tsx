import { Handle, NodeProps, Position, Node } from "@xyflow/react";
import styles from "./Nodes.module.css";

export type ProcessStepNode = Node<
  {
    name: string;
  },
  "processStep"
>;

export type TransportSystemNode = Node<
  {
    name: string;
  },
  "transportSystem"
>;

export function ProcessStepNode({ data }: NodeProps<ProcessStepNode>) {
  return (
    <div className={styles["process-step-node"]}>
      <span>{data.name}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function TransportSystemNode({ data }: NodeProps<TransportSystemNode>) {
  return (
    <div className={styles["transport-system-node"]}>
      <span>{data.name}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export const NodeTypes = {
  processStep: ProcessStepNode,
  transportSystem: TransportSystemNode,
};
