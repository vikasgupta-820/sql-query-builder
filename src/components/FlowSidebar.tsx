// src/components/FlowSidebar.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFilter, setLimit, removeFilter } from '../store/querySlice';
import type { RootState } from '../store/store';
import { DATABASE_SCHEMA, getDatabaseSchema } from '../services/databaseSchema';


interface SidebarProps {
  onDragStart: (table: any) => void;
}

export const FlowSidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.query);
  const [filterColumn, setFilterColumn] = useState('');
  const [filterOperator, setFilterOperator] = useState('=');
  const [filterValue, setFilterValue] = useState('');
  const [schema, setSchema] = useState(DATABASE_SCHEMA); 

  const handleAddFilter = () => {
    if (filterColumn && filterValue) {
      dispatch(addFilter({ column: filterColumn, operator: filterOperator, value: filterValue }));
      setFilterColumn('');
      setFilterValue('');
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, table: any) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(table));
    onDragStart(table);
  };

  useEffect(() => {
    getDatabaseSchema().then(setSchema).catch(() => {
      // fallback already handled in getDatabaseSchema,
      // but you can log or show error here
    });
  }, []);

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.sidebarH2}>📋 Tables</h2>
      <div style={styles.tableList}>
        {schema.tables.map(table => (
          <div
            key={table.name}
            draggable
            onDragStart={(e) => handleDragStart(e, table)}
            style={styles.tableItem}
          >
            {table.name}
          </div>
        ))}
      </div>

      <h2 style={styles.sidebarH2}>🎯 Query Builder</h2>
      <div style={styles.panelSection}>
        <h3 style={styles.panelH3}>Filters ({state.filters.length})</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Column</label>
          <select
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
            style={styles.select}
          >
            <option value="">Select column...</option>
            {state.nodes.flatMap(n => n.columns).map((col, i) => (
              <option key={i} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Operator</label>
          <select
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            style={styles.select}
          >
            <option value="=">=</option>
            <option value="!=">!=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Value</label>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter value..."
            style={styles.input}
          />
        </div>
        <button onClick={handleAddFilter} style={styles.btnPrimary}>
          Add Filter
        </button>
      </div>

      {state.filters.length > 0 && (
        <div style={styles.panelSection}>
          <h3 style={styles.panelH3}>Active Filters</h3>
          {state.filters.map((filter, i) => (
            <div key={i} style={styles.filterTag}>
              <div>{filter.column} {filter.operator} '{filter.value}'</div>
              <button
                onClick={() => dispatch(removeFilter(i))}
                style={styles.removeBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={styles.panelSection}>
        <h3 style={styles.panelH3}>Limit Results</h3>
        <div style={styles.formGroup}>
          <input
            type="number"
            placeholder="10"
            onChange={(e) => dispatch(setLimit(e.target.value ? parseInt(e.target.value) : null))}
            style={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    background: '#fff',
    borderRight: '1px solid #e0e0e0',
    padding: '20px',
    overflowY: 'auto' as const,
    maxHeight: '100vh'
  },
  sidebarH2: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#133a3b'
  },
  tableList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '24px'
  },
  tableItem: {
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '6px',
    cursor: 'grab',
    fontSize: '14px',
    color: '#133a3b',
    transition: 'all 0.2s',
    border: '2px solid transparent',
    userSelect: 'none' as const,
  },
  panelSection: {
    background: '#f5f5f5',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px'
  },
  panelH3: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '12px',
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
    fontFamily: 'sans-serif'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    fontSize: '13px',
    background: '#fff',
    color: '#133a3b',
    fontFamily: 'sans-serif'
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
  filterTag: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    background: '#fff',
    borderRadius: '4px',
    marginBottom: '8px',
    fontSize: '12px',
    color: '#666'
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

export default FlowSidebar;
