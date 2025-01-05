"use client";

import { Box, Button, LoadingOverlay, Title } from "@mantine/core";
import {
  Background,
  Controls,
  Edge,
  OnSelectionChangeFunc,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";

import { getLayoutedElements } from "./layout";
import { SimulationEntityState } from "@/lib/simulation/Simulation";
import {
  NodeType,
  NodeTypes,
  ProcessStepNode,
  SelectedEntity,
  TransportSystemNode,
} from "./nodes";
import { EntityInfo } from "./EntityInfo";

export interface SimulationGraphProps { }

export function SimulationGraph({ }: Readonly<SimulationGraphProps>) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>();

  const [layout, setLayout] = useState<string>("TB");

  useEffect(() => {
    fetch("/api/entity-state")
      .then((res) => res.json())
      .then((entities: SimulationEntityState) => {
        let newNodes: { [id: string]: ProcessStepNode | TransportSystemNode } =
          {};
        let newEdges: { [id: string]: Edge } = {};

        for (const l of entities.locations) {
          for (const ps of l.processSteps) {
            newNodes[ps.id] = {
              id: "ps-" + ps.id,
              data: { name: ps.name, location: l.name, entity: ps },
              position: { x: 0, y: 0 },
              type: "processStep",
            };
          }
        }

        for (const l of entities.locations) {
          for (const ts of l.processSteps.flatMap((ps) =>
            ps.inputs.concat(ps.outputs),
          )) {
            const tsId = "ts-" + ts.id;
            if (!newNodes[tsId]) {
              newNodes[tsId] = {
                id: tsId,
                data: { name: ts.name, entity: ts },
                position: { x: 0, y: 0 },
                type: "transportSystem",
              };
            }

            const inEdgeId = "ps-" + ts.startStepId + "-ts-" + ts.id;
            const outEdgeId = "ts-" + ts.id + "-ps-" + ts.endStepId;

            if (!newEdges[inEdgeId]) {
              newEdges[inEdgeId] = {
                id: "ps-" + ts.startStepId + "-ts-" + ts.id,
                source: "ps-" + ts.startStepId,
                target: tsId,
                animated: true,
              };
            }

            if (!newEdges[outEdgeId]) {
              newEdges[outEdgeId] = {
                id: "ts-" + ts.id + "-ps-" + ts.endStepId,
                source: tsId,
                target: "ps-" + ts.endStepId,
                animated: true,
              };
            }
          }
        }

        setNodes(Object.values(newNodes));
        setEdges(Object.values(newEdges));
      });
  }, []);

  const onSelectionChange = useCallback<OnSelectionChangeFunc>(({ nodes }) => {
    if (nodes[0]) {
      const node = nodes[0] as NodeType;

      switch (node.type) {
        case "processStep":
          setSelectedEntity({
            type: "processStep",
            data: node.data,
          });
          break;
        case "transportSystem":
          setSelectedEntity({
            type: "transportSystem",
            data: node.data,
          });
          break;
      }
    } else {
      setSelectedEntity(undefined);
    }
  }, []);

  const layoutedGraph =
    nodes.length > 0 && edges.length > 0
      ? getLayoutedElements(nodes, edges, {
        direction: layout,
      })
      : { nodes: [], edges: [] };

  return (
    <Box w="100%" h={700}>
      <LoadingOverlay
        visible={layoutedGraph.nodes.length === 0}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <ReactFlow
        nodes={layoutedGraph.nodes}
        edges={layoutedGraph.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={NodeTypes}
        minZoom={0.2}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Button size="xs" mr={10} onClick={() => setLayout("TB")}>
            Vertical layout
          </Button>
          <Button size="xs" onClick={() => setLayout("LR")}>
            Horizontal layout
          </Button>
        </Panel>
      </ReactFlow>
      {selectedEntity && <EntityInfo entity={selectedEntity} />}
    </Box>
  );
}

export function SimulationGraphWithProvider(props: SimulationGraphProps) {
  return (
    <ReactFlowProvider>
      <SimulationGraph {...props} />
    </ReactFlowProvider>
  );
}
