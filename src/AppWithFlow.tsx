// src/AppWithFlow.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ReactFlowProvider } from '@xyflow/react';

import FlowSidebar from './components/FlowSidebar';
import FlowCanvas from './components/FlowCanvas';
import RightPanel from './components/RightPanel';

function AppWithFlow() {
  const dispatch = useDispatch();
  const [draggedTable, setDraggedTable] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleDragStart = (table: any) => {
    setDraggedTable(table);
  };

  const handleTableAdded = (tableName: string) => {
    setMessage(`✓ Added ${tableName} table`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <FlowSidebar onDragStart={handleDragStart} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={styles.topBar}>
          <h1 style={styles.topBarH1}>SQL Query Visual Builder</h1>
          <div style={styles.topActions}>
            {message && <div style={styles.successMsg}>{message}</div>}
          </div>
        </div>
        <ReactFlowProvider>
          <FlowCanvas draggedTable={draggedTable} onTableAdded={handleTableAdded} />
        </ReactFlowProvider>
      </div>
      <RightPanel />
    </div>
  );
}

const styles = {
  topBar: {
    background: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topBarH1: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#133a3b',
    margin: 0
  },
  topActions: {
    display: 'flex',
    gap: '12px'
  },
  successMsg: {
    background: 'rgba(33, 128, 141, 0.1)',
    color: '#208190',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    border: '1px solid #208190'
  }
};

export default AppWithFlow;
