
import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface TableNodeData {
  label: string;
  columns?: string[];
}

export type SqlTableNodeType = NodeProps<TableNodeData>;

export const SqlTableNode: React.FC<SqlTableNodeType> = ({
  data,
  isConnectable,
  selected,
}) => {
  return (
    <div
      style={{
        background: selected ? 'rgba(33, 128, 141, 0.1)' : 'white',
        border: selected ? '2px solid #208190' : '2px solid #ccc',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '180px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'sans-serif'
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px', color: '#208190' }}>
        📊 {data.label}
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {data.columns && data.columns.slice(0, 5).map((col, i) => (
          <div key={i}>• {col}</div>
        ))}
        {data.columns && data.columns.length > 5 && (
          <div>+ {data.columns.length - 5} more</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default SqlTableNode;