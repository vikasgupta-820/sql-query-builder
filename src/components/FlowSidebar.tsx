// src/components/FlowSidebar.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFilter, setLimit, removeFilter } from '../store/querySlice';
import type { RootState } from '../store/store';
import { DATABASE_SCHEMA, getDatabaseSchema } from '../services/databaseSchema';
import { addSchemaTable, setSchemaTables, type TableDef } from '../store/schemaSlice';
import * as XLSX from 'xlsx'; // ← NEW

interface SidebarProps {
  onDragStart: (table: any) => void;
}

// type TableDef = {
//   name: string;
//   columns: string[];
// };

export const FlowSidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.query);
  const schemaState = useSelector((state: RootState) => state.schema);
  const [filterColumn, setFilterColumn] = useState('');
  const [filterOperator, setFilterOperator] = useState('=');
  const [filterValue, setFilterValue] = useState('');
  // const [schema, setSchema] = useState<{ tables: TableDef[] }>(DATABASE_SCHEMA);
  const [excelError, setExcelError] = useState<string | null>(null);

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

 // on mount: load schema from API into Redux
useEffect(() => {
  getDatabaseSchema()
    .then((schema) => {
      dispatch(setSchemaTables(schema.tables));
    })
    .catch(() => {
      dispatch(setSchemaTables(DATABASE_SCHEMA.tables));
    });
}, [dispatch]);

  // NEW: handle Excel upload and convert to a table definition
  // const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setExcelError(null);

  //   const reader = new FileReader();
  //   reader.onload = (evt) => {
  //     try {
  //       const data = evt.target?.result;
  //       if (!data) throw new Error('No file data');

  //       // Read workbook
  //       const workbook = XLSX.read(data, { type: 'array' });

  //       // Take first sheet
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];
  //       if (!sheet) throw new Error('No sheet found in file');

  //       // Convert sheet to JSON using header row
  //       const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
  //         header: 1, // first row as array
  //       });

  //       if (!json.length) throw new Error('Sheet is empty');

  //       const headerRow = json[0] as string[];
  //       const columns = headerRow.map((h) => String(h).trim()).filter(Boolean);

  //       if (!columns.length) throw new Error('No columns detected in first row');

  //       // Build new table definition
  //       const tableNameBase = file.name.replace(/\.[^.]+$/, '');
  //       const newTable: TableDef = {
  //         name: `excel_${tableNameBase}`,
  //         columns,
  //       };

  //       // Append to schema tables
  //       setSchema((prev) => ({
  //         tables: [...prev.tables, newTable],
  //       }));
  //     } catch (err: any) {
  //       console.error('Excel parse error:', err);
  //       setExcelError(err?.message || 'Failed to parse Excel file');
  //     } finally {
  //       // reset input so same file can be selected again if needed
  //       e.target.value = '';
  //     }
  //   };

  //   reader.readAsArrayBuffer(file);
  // };/

  // Excel upload: dispatch addSchemaTable
const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setExcelError(null);

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = evt.target?.result;
      if (!data) throw new Error('No file data');

      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) throw new Error('No sheet found in file');

      const json = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
      if (!json.length) throw new Error('Sheet is empty');

      const headerRow = json[0] as (string | number)[];
      const columns = headerRow.map((h) => String(h).trim()).filter(Boolean);
      if (!columns.length) throw new Error('No columns detected in first row');

      const tableNameBase = file.name.replace(/\.[^.]+$/, '');
      const newTable: TableDef = {
        name: `excel_${tableNameBase}`,
        columns,
      };

      dispatch(addSchemaTable(newTable));
    } catch (err: any) {
      setExcelError(err?.message || 'Failed to parse Excel file');
    } finally {
      e.target.value = '';
    }
  };

  reader.readAsArrayBuffer(file);
};

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.sidebarH2}>📋 Tables</h2>

      {/* NEW: Excel upload */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ ...styles.label, marginBottom: '6px' }}>
          Import table from Excel (first row as header)
        </label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleExcelUpload}
          style={{ fontSize: '12px', color:'#444' }}
        />
        {excelError && (
          <div style={{ marginTop: '6px', fontSize: '11px', color: '#c0152f' }}>
            {excelError}
          </div>
        )}
      </div>

      <div style={styles.tableList}>
  {schemaState.tables.map((table) => (
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
            {state.nodes.flatMap((n) => n.columns).map((col, i) => (
              <option key={i} value={col}>
                {col}
              </option>
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
              <div>
                {filter.column} {filter.operator} '{filter.value}'
              </div>
              <button onClick={() => dispatch(removeFilter(i))} style={styles.removeBtn}>
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
            onChange={(e) =>
              dispatch(setLimit(e.target.value ? parseInt(e.target.value) : null))
            }
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
