import { SimulationEntityState } from "@/lib/simulation/simulationNew";
import { Background, Controls, Edge, ReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import { NodeTypes, ProcessStepNode, TransportSystemNode } from "./Nodes";

export interface SimulationGraphProps { }

export function SimulationGraph({ }: Readonly<SimulationGraphProps>) {
  const [entities, setEntities] = useState<SimulationEntityState>();

  useEffect(() => {
    fetch("/api/entity-state")
      .then((res) => res.json())
      .then((e) => {
        setEntities(e);
      });
  });

  let nodes: { [id: string]: ProcessStepNode | TransportSystemNode } = {};
  let edges: Edge[] = [];

  if (entities) {
    for (const ps of entities.locations.flatMap((l) => l.processSteps)) {
      nodes[ps.id] = {
        id: "ps-" + ps.id,
        data: { name: ps.name },
        position: { x: 0, y: 0 },
        type: "processStep",
      };
    }

    for (const ts of entities.locations
      .flatMap((l) => l.processSteps)
      .flatMap((ps) => ps.inputs.concat(ps.outputs))) {
      const tsId = "ts-" + ts.id;
      if (!nodes[tsId]) {
        nodes[tsId] = {
          id: tsId,
          data: { name: ts.name },
          position: { x: 0, y: 0 },
          type: "transportSystem",
        };
      }

      edges.push({
        id: "ps-" + ts.startStepId + "-ts-" + ts.id,
        source: "ps-" + ts.startStepId,
        target: tsId,
      });

      edges.push({
        id: "ts-" + ts.id + "-ps-" + ts.endStepId,
        source: tsId,
        target: "ps-" + ts.endStepId,
      });
    }
  }

  return (
    <ReactFlow nodes={Object.values(nodes)} edges={edges} nodeTypes={NodeTypes}>
      <Background />
      <Controls />
    </ReactFlow>
  );
}
