// src/store/schemaSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DATABASE_SCHEMA } from '../services/databaseSchema';

export type TableDef = {
  name: string;
  columns: string[];
};

export interface SchemaState {
  tables: TableDef[];
}

const initialState: SchemaState = {
  tables: DATABASE_SCHEMA.tables,
};

const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {
    setSchemaTables: (state, action: PayloadAction<TableDef[]>) => {
      state.tables = action.payload;
    },
    addSchemaTable: (state, action: PayloadAction<TableDef>) => {
      // avoid duplicates by name
      const exists = state.tables.some((t) => t.name === action.payload.name);
      if (!exists) {
        state.tables.push(action.payload);
      }
    },
  },
});

export const { setSchemaTables, addSchemaTable } = schemaSlice.actions;
export default schemaSlice.reducer;
