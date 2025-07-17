'use client';

import React from 'react';
import ReactFlow, { Background, Controls, MiniMap, type Node, type Edge } from 'reactflow';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start: Load Data' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Rule: If "Region" is "EU"' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Action: Use EU Template' },
    position: { x: 100, y: 200 },
  },
    {
    id: '4',
    data: { label: 'Action: Use US Template' },
    position: { x: 400, y: 200 },
  },
  {
    id: '5',
    type: 'output',
    data: { label: 'End: Generate Document' },
    position: { x: 250, y: 350 },
  },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', label: 'True' },
    { id: 'e2-4', source: '2', target: '4', label: 'False' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e4-5', source: '4', target: '5' },
];

export default function RuleBuilderClient() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
