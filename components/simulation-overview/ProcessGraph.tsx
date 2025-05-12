"use client";

import { Box, Button, Flex, Switch } from "@mantine/core";
import {
  Background,
  Controls,
  Edge,
  MarkerType,
  OnSelectionChangeFunc,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import { MaterialFlowNodeTypes, NodeType, SelectedEntity } from "./nodes";
import { useLayout } from "./layout";
import { EntityInfo } from "./EntityInfo";
import { useSimulationMock } from "../context/SimulationContextMock";
// or import { useSimulationLive } if needed

export interface ProcessGraphProps { }

/**
 * A graph component that can render in two modes:
 * 1) Detailed (includes material nodes)
 * 2) Simple (excludes material nodes)
 */
export function ProcessGraph({ }: Readonly<ProcessGraphProps>) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>();
  const [detailed, setDetailed] = useState<boolean>(false);

  // NEW: Switch to activate or deactivate the "technical" onclick detail view
  const [technicalView, setTechnicalView] = useState<boolean>(false);

  const [layout, setLayout] = useState<"DOWN" | "RIGHT">("DOWN");
  useLayout({ direction: layout });

  // Grab simulation data (mock or live)
  const { simulation, frame } = useSimulationMock();

  useEffect(() => {
    if (!simulation) return;

    const currentFrame = simulation.frames[frame];
    if (!currentFrame) return;

    const entities = currentFrame.state;
    const newNodes: Record<string, NodeType> = {};
    const newEdges: Record<string, Edge> = {};

    // A) Process Steps as nodes
    for (const loc of entities.locations) {
      for (const ps of loc.processSteps) {
        const nodeId = "ps-" + ps.id + "-unlayouted";

        // [QUEUE CLASS] Check the queue length
        const queueSize = (ps as any).__queue ? (ps as any).__queue.length : 0;
        let className = ps.active ? undefined : "inactive";
        if (queueSize > 0) {
          // If already "inactive", combine them, else just "queue"
          className = className ? `${className} queue` : "queue";
        }

        newNodes[nodeId] = {
          id: nodeId,
          position: { x: 0, y: 0 },
          data: {
            name: ps.name,
            location: loc.name,
            entity: ps,
          },
          type: "processStep",
          className,
          style: {
            opacity: 0,
          },
        };

        // Also create Resource nodes for the PS
        if (ps.resources && ps.resources.length > 0) {
          for (const res of ps.resources) {
            const resNodeId = "res-" + res.id + "-unlayouted";
            newNodes[resNodeId] = {
              id: resNodeId,
              position: { x: 0, y: 0 },
              data: {
                name: res.name || "Undefined Resource",
                entity: res,
              },
              type: "resource",
              className: res.active ? undefined : "inactive",
              style: {
                opacity: 0,
              },
            };

            const edgeId = `${nodeId}-res-${res.id}-unlayouted`;
            newEdges[edgeId] = {
              id: edgeId,
              source: nodeId,
              target: resNodeId,
              animated: false,
              style: {
                opacity: 0,
              },
            };
          }
        }
      }
    }

    // B) Transport Systems as nodes
    for (const loc of entities.locations) {
      for (const ps of loc.processSteps) {
        for (const ts of ps.inputs.concat(ps.outputs)) {
          const tsId = "ts-" + ts.id + "-unlayouted";

          // [QUEUE CLASS] Check the queue length
          const queueSize = (ts as any).__queue
            ? (ts as any).__queue.length
            : 0;
          let className = ts.active ? undefined : "inactive";
          if (queueSize > 0) {
            className = className ? `${className} queue` : "queue";
          }

          if (!newNodes[tsId]) {
            newNodes[tsId] = {
              id: tsId,
              position: { x: 0, y: 0 },
              data: { name: ts.name, entity: ts },
              type: "transportSystem",
              className,
              style: {
                opacity: 0,
              },
            };
          }

          // Resource nodes for the TS
          if (ts.resources && ts.resources.length > 0) {
            for (const res of ts.resources) {
              const resNodeId = "res-" + res.id + "-unlayouted";
              newNodes[resNodeId] = {
                id: resNodeId,
                position: { x: 0, y: 0 },
                data: {
                  name: res.name || "Undefined Resource",
                  entity: res,
                },
                type: "resource",
                className: res.active ? undefined : "inactive",
                style: {
                  opacity: 0,
                },
              };

              const edgeId = `${tsId}-res-${res.id}-unlayouted`;
              newEdges[edgeId] = {
                id: edgeId,
                source: tsId,
                target: resNodeId,
                animated: false,
                style: {
                  opacity: 0,
                },
              };
            }
          }

          // Edges from startStep => TS => endStep
          const inEdgeId = `ps-${ts.startStepId}-ts-${ts.id}-unlayouted`;
          const outEdgeId = `ts-${ts.id}-ps-${ts.endStepId}-unlayouted`;

          if (!newEdges[inEdgeId] && ts.startStepId) {
            newEdges[inEdgeId] = {
              id: inEdgeId,
              source: "ps-" + ts.startStepId + "-unlayouted",
              target: tsId,
              animated: true,
              markerEnd: {
                type: MarkerType.Arrow,
                color: "black",
              },
              style: {
                strokeWidth: 1,
                stroke: "black",
                opacity: 0,
              },
            };
          }
          if (!newEdges[outEdgeId] && ts.endStepId) {
            newEdges[outEdgeId] = {
              id: outEdgeId,
              source: tsId,
              target: "ps-" + ts.endStepId + "-unlayouted",
              animated: true,
              markerEnd: {
                type: MarkerType.Arrow,
                color: "black",
              },
              style: {
                strokeWidth: 1,
                stroke: "black",
                opacity: 0,
              },
            };
          }
        }
      }
    }

    // C) Materials as nodes (only if detailed)
    if (detailed) {
      for (const loc of entities.locations) {
        for (const ps of loc.processSteps) {
          // Materials in PS
          for (const item of ps.inventory.entries.filter(
            (i) => i.orderId != null
          )) {
            const matNodeId = "mat-" + item.id + "-unlayouted";
            newNodes[matNodeId] = {
              id: matNodeId,
              position: { x: 0, y: 0 },
              data: {
                materialName: item.material,
                entity: item,
              },
              type: "material",
              style: {
                opacity: 0,
              },
            };

            const edgeId = `ps-${ps.id}-mat-${item.id}-unlayouted`;
            if (!newEdges[edgeId]) {
              newEdges[edgeId] = {
                id: edgeId,
                source: "ps-" + ps.id + "-unlayouted",
                target: matNodeId,
                animated: true,
                style: {
                  opacity: 0,
                },
              };
            }
          }

          // Materials in TS
          for (const ts of ps.inputs.concat(ps.outputs)) {
            for (const item of ts.inventory.entries.filter(
              (i) => i.orderId != null
            )) {
              const matNodeId = "mat-" + item.id + "-unlayouted";
              newNodes[matNodeId] = {
                id: matNodeId,
                position: { x: 0, y: 0 },
                data: {
                  materialName: item.material,
                  entity: item,
                },
                type: "material",
                style: {
                  opacity: 0,
                },
              };
              const edgeId = `ts-${ts.id}-mat-${item.id}-unlayouted`;
              if (!newEdges[edgeId]) {
                newEdges[edgeId] = {
                  id: edgeId,
                  source: "ts-" + ts.id + "-unlayouted",
                  target: matNodeId,
                  animated: true,
                  style: {
                    opacity: 0,
                  },
                };
              }
            }
          }
        }
      }
    }

    setNodes((prev) => [...prev, ...Object.values(newNodes)]);
    setEdges((prev) => [...prev, ...Object.values(newEdges)]);
  }, [simulation, frame, detailed, setEdges, setNodes]);

  const onSelectionChange = useCallback<OnSelectionChangeFunc>(({ nodes }) => {
    // Only allow selecting an entity if "technicalView" is ON
    if (!technicalView) {
      setSelectedEntity(undefined);
      return;
    }

    if (nodes[0]) {
      const node = nodes[0] as NodeType;
      if (node.type === "processStep") {
        setSelectedEntity({ type: "processStep", data: node.data });
      } else if (node.type === "transportSystem") {
        setSelectedEntity({ type: "transportSystem", data: node.data });
      } else if (node.type === "material") {
        setSelectedEntity({ type: "material", data: node.data });
      } else if (node.type === "resource") {
        setSelectedEntity({ type: "resource", data: node.data });
      }
    } else {
      setSelectedEntity(undefined);
    }
  }, [technicalView]);

  return (
    <Box w="100%" h={700}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={MaterialFlowNodeTypes}
        minZoom={0.2}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Flex align={"center"} justify={"center"} gap={10}>
            <Button size="xs" mr={10} onClick={() => setLayout("DOWN")}>
              Vertical layout
            </Button>
            <Button size="xs" mr={10} onClick={() => setLayout("RIGHT")}>
              Horizontal layout
            </Button>

            {/* Existing "Detailed View" switch */}
            <Switch
              label="Detailed view"
              checked={detailed}
              onChange={(event) => setDetailed(event.currentTarget.checked)}
              size="md"
            />

            {/* NEW switch for technical/EntityInfo view */}
            <Switch
              label="Technical View"
              checked={technicalView}
              onChange={(event) => setTechnicalView(event.currentTarget.checked)}
              size="md"
            />
          </Flex>
        </Panel>
      </ReactFlow>

      {/* Render the detail only if we have a selection AND the tech switch is on */}
      {technicalView && selectedEntity && <EntityInfo entity={selectedEntity} />}
    </Box>
  );
}

export function ProcessGraphProvider(props: ProcessGraphProps) {
  return (
    <ReactFlowProvider>
      <ProcessGraph {...props} />
    </ReactFlowProvider>
  );
}
