"use client";

import { Box, Button, LoadingOverlay } from "@mantine/core";
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

export function SimulationGraph({ }: SimulationGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>();
  const [layout, setLayout] = useState<string>("TB");

  useEffect(() => {
    fetch("/api/entity-state")
      .then((res) => res.json())
      .then((entities: SimulationEntityState) => {
        // Temporäre Maps für Nodes/Edges
        const newNodes: Record<string, ProcessStepNode | TransportSystemNode> = {};
        const newEdges: Record<string, Edge> = {};

        // 1) Erstelle Nodes für alle ProcessSteps
        for (const loc of entities.locations) {
          for (const ps of loc.processSteps) {
            newNodes["ps-" + ps.id] = {
              id: "ps-" + ps.id,
              data: { name: ps.name, location: loc.name, entity: ps },
              position: { x: 0, y: 0 },
              type: "processStep",
            };
          }
        }

        // 2) Erstelle Nodes für alle TransportSystems (aus ps.inputs/ps.outputs)
        //    sowie Edges (PS->TS, TS->PS)
        for (const loc of entities.locations) {
          const allTS = loc.processSteps.flatMap((ps) => ps.inputs.concat(ps.outputs));
          for (const ts of allTS) {
            const tsId = "ts-" + ts.id;

            if (!newNodes[tsId]) {
              newNodes[tsId] = {
                id: tsId,
                data: { name: ts.name, entity: ts },
                position: { x: 0, y: 0 },
                type: "transportSystem",
              };
            }

            // PS->TS Edge (wenn startStepId definiert)
            if (ts.startStepId !== null && ts.startStepId !== undefined) {
              const sourceId = "ps-" + ts.startStepId;
              const targetId = tsId;
              const edgeId = sourceId + "-to-" + targetId;
              if (!newEdges[edgeId]) {
                newEdges[edgeId] = {
                  id: edgeId,
                  source: sourceId,
                  target: targetId,
                  animated: true,
                };
              }
            }

            // TS->PS Edge (wenn endStepId definiert)
            if (ts.endStepId !== null && ts.endStepId !== undefined) {
              const sourceId = tsId;
              const targetId = "ps-" + ts.endStepId;
              const edgeId = sourceId + "-to-" + targetId;
              if (!newEdges[edgeId]) {
                newEdges[edgeId] = {
                  id: edgeId,
                  source: sourceId,
                  target: targetId,
                  animated: true,
                };
              }
            }

            // NEU: TS->TS: Wenn startTSId (d. h. dieses TS hat einen Vorläufer-TS)
            if (ts.startTSId !== null && ts.startTSId !== undefined) {
              const sourceId = "ts-" + ts.startTSId;
              const targetId = tsId;
              const edgeId = sourceId + "-to-" + targetId;
              if (!newEdges[edgeId]) {
                newEdges[edgeId] = {
                  id: edgeId,
                  source: sourceId,
                  target: targetId,
                  animated: true,
                  style: { stroke: "#a8a8a8" }, // bspw. graue Farbe
                };
              }
            }

            // NEU: TS->TS: Wenn endTSId (d. h. dieses TS geht zu einem anderen TS)
            if (ts.endTSId !== null && ts.endTSId !== undefined) {
              const sourceId = tsId;
              const targetId = "ts-" + ts.endTSId;
              const edgeId = sourceId + "-to-" + targetId;
              if (!newEdges[edgeId]) {
                newEdges[edgeId] = {
                  id: edgeId,
                  source: sourceId,
                  target: targetId,
                  animated: true,
                  style: { stroke: "#a8a8a8" },
                };
              }
            }
          }
        }

        setNodes(Object.values(newNodes));
        setEdges(Object.values(newEdges));
      });
  }, []);

  // Selektions-Callback
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

  // Layout
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