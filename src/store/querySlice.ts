// src/store/querySlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QueryState, QueryNode, Filter, Join } from '../types/types_index';

const initialState: QueryState = {
  nodes: [],
  selectedNode: null,
  filters: [],
  joins: [],
  selectColumns: [],
  orderBy: [],
  limit: null
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<QueryNode>) => {
      state.nodes.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(n => n.id !== action.payload);
      if (state.selectedNode?.id === action.payload) {
        state.selectedNode = null;
      }
    },
    selectNode: (state, action: PayloadAction<QueryNode>) => {
      state.selectedNode = action.payload;
    },
    updateNode: (state, action: PayloadAction<QueryNode>) => {
      const index = state.nodes.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = action.payload;
      }
    },
    addFilter: (state, action: PayloadAction<Filter>) => {
      state.filters.push(action.payload);
    },
    removeFilter: (state, action: PayloadAction<number>) => {
      state.filters.splice(action.payload, 1);
    },
    addJoin: (state, action: PayloadAction<Join>) => {
      state.joins.push(action.payload);
    },
    removeJoin: (state, action: PayloadAction<number>) => {
      state.joins.splice(action.payload, 1);
    },
    setSelectColumns: (state, action: PayloadAction<string[]>) => {
      state.selectColumns = action.payload;
    },
    setOrderBy: (state, action: PayloadAction<string[]>) => {
      state.orderBy = action.payload;
    },
    setLimit: (state, action: PayloadAction<number | null>) => {
      state.limit = action.payload;
    },
    reset: () => initialState
  }
});

export const {
  addNode,
  removeNode,
  selectNode,
  updateNode,
  addFilter,
  removeFilter,
  addJoin,
  removeJoin,
  setSelectColumns,
  setOrderBy,
  setLimit,
  reset
} = querySlice.actions;

export default querySlice.reducer;
