// src/components/FlowCanvas.tsx

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { addNode as addNodeAction } from '../store/querySlice';
import SqlTableNode from './SqlTableNode';

interface FlowCanvasProps {
  draggedTable: any;
  onTableAdded: (tableName: string) => void;
}

const nodeTypes: NodeTypes = {
  sqlTable: SqlTableNode,
};

const FlowCanvas: React.FC<FlowCanvasProps> = ({ draggedTable, onTableAdded }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.query);

  const initialNodes = useMemo(
    () =>
      state.nodes.map((node, index) => ({
        id: node.id,
        type: 'sqlTable',
        position: { x: index * 300, y: 100 },
        data: {
          label: node.name,
          columns: node.columns,
        },
      })),
    [state.nodes]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTable) return;

    const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

    const position = {
      x: e.clientX - bounds.left - 150,
      y: e.clientY - bounds.top - 50,
    };

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'table' as const,
      name: draggedTable.name,
      columns: draggedTable.columns,
    };

    dispatch(addNodeAction(newNode));

    setNodes((nds) => [
      ...nds,
      {
        id: newNode.id,
        type: 'sqlTable',
        position,
        data: {
          label: newNode.name,
          columns: newNode.columns,
        },
      },
    ]);

    onTableAdded(draggedTable.name);
  };

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        fitView
      >
        <Background />
        <Controls style={{color:'#444'}}/>
        {/* <MiniMap style={{width:'100px', height:'100px'}} /> */}
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
