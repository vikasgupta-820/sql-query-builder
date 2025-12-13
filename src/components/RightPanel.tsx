// src/components/RightPanel.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJoin, reset, removeJoin } from '../store/querySlice';
import type { RootState } from '../store/store';
import { generateSQL } from '../services/databaseSchema';

// import { generateSQL, getDatabaseSchema, DATABASE_SCHEMA } from '../services/databaseSchema';

type TableDef = {
  name: string;
  columns: string[];
};

export const RightPanel: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.query);
  const schemaState = useSelector((state: RootState) => state.schema);

  const [message, setMessage] = useState('');
  const [joinType, setJoinType] = useState('INNER');
  const [joinTable, setJoinTable] = useState('');
  const [joinCondition, setJoinCondition] = useState('');

  const sql = generateSQL(state);

   const handleAddJoin = () => {
    if (joinTable && joinCondition) {
      dispatch(addJoin({ type: joinType as any, table: joinTable, condition: joinCondition }));
      setMessage('✓ Join added');
      setJoinTable('');
      setJoinCondition('');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sql);
    setMessage('✓ SQL copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    dispatch(reset());
    setMessage('✓ Query reset');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={styles.rightPanel}>
      <h2 style={styles.heading}>⚙️ Options</h2>

      {message && <div style={styles.success}>{message}</div>}

      <div style={styles.panelSection}>
        <h3 style={styles.panelH3}>Join Tables</h3>

        <div style={styles.formGroup}>
          <label style={styles.label}>Join Type</label>
          <select value={joinType} onChange={(e) => setJoinType(e.target.value)} style={styles.select}>
            <option value="INNER">INNER JOIN</option>
            <option value="LEFT">LEFT JOIN</option>
            <option value="RIGHT">RIGHT JOIN</option>
            <option value="FULL">FULL OUTER JOIN</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Table</label>
          <select
            value={joinTable}
            onChange={(e) => setJoinTable(e.target.value)}
            style={styles.select}
          >
            <option value="">Select table...</option>
            {schemaState.tables.map((t: TableDef) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>ON Condition</label>
          <input
            type="text"
            value={joinCondition}
            onChange={(e) => setJoinCondition(e.target.value)}
            placeholder="e.g., users.id = products.userId"
            style={styles.input}
          />
        </div>

        <button onClick={handleAddJoin} style={styles.btnPrimary}>
          Add Join
        </button>
      </div>

      {state.joins.length > 0 && (
        <div style={styles.panelSection}>
          <h3 style={styles.panelH3}>Active Joins ({state.joins.length})</h3>
          {state.joins.map((join, i) => (
            <div key={i} style={styles.joinTag}>
              <div style={{ fontSize: '12px', color: '#444' }}>
                <strong>{join.type}</strong> {join.table}
              </div>
              <button onClick={() => dispatch(removeJoin(i))} style={styles.removeBtn}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={styles.panelSection}>
        <h3 style={styles.panelH3}>Generated SQL</h3>
        <div style={styles.sqlOutput}>{sql}</div>
      </div>

      <div style={styles.panelSection}>
        <h3 style={styles.panelH3}>Query Summary</h3>
        <div style={styles.nodeContent}>
          <div>📊 Tables: {state.nodes.length}</div>
          <div>🔍 Filters: {state.filters.length}</div>
          <div>🔗 Joins: {state.joins.length}</div>
          <div>📈 Limit: {state.limit || 'None'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={handleCopySQL} style={{ ...styles.btnPrimary, flex: 1 }}>
          📋 Copy SQL
        </button>
        <button onClick={handleReset} style={{ ...styles.btnSecondary, flex: 1 }}>
          Reset
        </button>
      </div>
    </div>
  );
};

const styles = {
  error: {
    background: 'rgba(192, 21, 47, 0.08)',
    color: '#c0152f',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px',
    border: '1px solid #c0152f',
    marginTop: '4px',
  },
  rightPanel: {
    width: '320px',
    background: '#fff',
    borderLeft: '1px solid #e0e0e0',
    padding: '20px',
    overflowY: 'auto' as const,
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px'
  },
  heading: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#133a3b',
    margin: 0
  },
  panelSection: {
    background: '#f5f5f5',
    padding: '12px',
    borderRadius: '6px'
  },
  panelH3: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '12px',
    marginTop: 0,
    color: '#133a3b'
  },
  formGroup: {
    marginBottom: '12px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    marginBottom: '4px',
    color: '#133a3b'
  },
  select: {
    width: '100%',
    padding: '8px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    fontSize: '13px',
    background: '#fff',
    color: '#133a3b',
    fontFamily: 'sans-serif',
    boxSizing: 'border-box' as const
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    fontSize: '13px',
    background: '#fff',
    color: '#133a3b',
    fontFamily: 'sans-serif',
    boxSizing: 'border-box' as const
  },
  btnPrimary: {
    width: '100%',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    background: '#208190',
    color: '#fff',
    transition: 'all 0.2s'
  },
  btnSecondary: {
    width: '100%',
    padding: '8px 16px',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    background: '#f5f5f5',
    color: '#133a3b',
    transition: 'all 0.2s'
  },
  sqlOutput: {
    background: '#1a1a1a',
    color: '#00ff00',
    padding: '12px',
    borderRadius: '6px',
    fontFamily: "'Courier New', monospace",
    fontSize: '12px',
    wordBreak: 'break-all',
    maxHeight: '200px',
    overflowY: 'auto' as const,
    border: '1px solid #d0d0d0'
  },
  nodeContent: {
    fontSize: '13px',
    color: '#666'
  },
  success: {
    background: 'rgba(33, 128, 141, 0.1)',
    color: '#208190',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px',
    border: '1px solid #208190'
  },
  joinTag: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    background: '#fff',
    borderRadius: '4px',
    marginBottom: '8px',
    border: '1px solid #e0e0e0'
  },
  removeBtn: {
    background: '#ff5959',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    padding: '2px 6px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};

export default RightPanel;
