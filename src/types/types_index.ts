// src/types/index.ts

export interface Column {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  columns: string[];
}

export interface Filter {
  column: string;
  operator: string;
  value: string;
}

export interface Join {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  condition: string;
}

export interface QueryNode {
  id: string;
  name: string;
  columns: string[];
  type: 'table';
}

export interface QueryState {
  nodes: QueryNode[];
  selectedNode: QueryNode | null;
  filters: Filter[];
  joins: Join[];
  selectColumns: string[];
  orderBy: string[];
  limit: number | null;
}
