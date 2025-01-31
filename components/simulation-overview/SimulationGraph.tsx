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
  ResourceNode,
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
        let newNodes: { [id: string]: ProcessStepNode | TransportSystemNode | ResourceNode } = {};
        let newEdges: { [id: string]: Edge } = {};

        // Create ProcessStep nodes
        for (const l of entities.locations) {
          for (const ps of l.processSteps) {
            const psNodeId = "ps-" + ps.id;
            newNodes[psNodeId] = {
              id: psNodeId,
              data: { name: ps.name, location: l.name, entity: ps },
              position: { x: 0, y: 0 },
              type: "processStep",
            };

            // Create Resource nodes for ProcessStep
            if (ps.resources && ps.resources.length > 0) {
              for (const res of ps.resources) {
                const resNodeId = "res-" + res.id;
                newNodes[resNodeId] = {
                  id: resNodeId,
                  data: { name: res.name ? res.name : "Undefined Name", entity: res },
                  position: { x: 0, y: 0 },
                  type: "resource",
                };
                const edgeId = `${psNodeId}-res-${res.id}`;
                newEdges[edgeId] = {
                  id: edgeId,
                  source: psNodeId,
                  target: resNodeId,
                  animated: false,
                };
              }
            }
          }
        }

        // Create TransportSystem nodes and their Resource nodes
        for (const l of entities.locations) {
          for (const ts of l.processSteps.flatMap((ps) => ps.inputs.concat(ps.outputs))) {
            const tsNodeId = "ts-" + ts.id;
            if (!newNodes[tsNodeId]) {
              newNodes[tsNodeId] = {
                id: tsNodeId,
                data: { name: ts.name, entity: ts },
                position: { x: 0, y: 0 },
                type: "transportSystem",
              };
            }

            // Create Resource nodes for TransportSystem
            if (ts.resources && ts.resources.length > 0) {
              for (const res of ts.resources) {
                const resNodeId = "res-" + res.id;
                newNodes[resNodeId] = {
                  id: resNodeId,
                  data: { name: res.name ? res.name : "Undefined Name", entity: res },
                  position: { x: 0, y: 0 },
                  type: "resource",
                };
                const edgeId = `${tsNodeId}-res-${res.id}`;
                newEdges[edgeId] = {
                  id: edgeId,
                  source: tsNodeId,
                  target: resNodeId,
                  animated: false,
                };
              }
            }

            // Create edges between ProcessSteps and TransportSystems
            const inEdgeId = "ps-" + ts.startStepId + "-ts-" + ts.id;
            const outEdgeId = "ts-" + ts.id + "-ps-" + ts.endStepId;

            if (!newEdges[inEdgeId] && ts.startStepId) {
              newEdges[inEdgeId] = {
                id: inEdgeId,
                source: "ps-" + ts.startStepId,
                target: tsNodeId,
                animated: true,
              };
            }

            if (!newEdges[outEdgeId] && ts.endStepId) {
              newEdges[outEdgeId] = {
                id: outEdgeId,
                source: tsNodeId,
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
        case "resource":
          setSelectedEntity({
            type: "resource",
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
