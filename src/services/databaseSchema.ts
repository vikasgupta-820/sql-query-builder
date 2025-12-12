// src/services/databaseSchema.ts

import type { QueryState } from "../types/types_index";

/**
 * Local fallback schema
 */
export const DATABASE_SCHEMA = {
  tables: [
    {
      name: "users",
      columns: ["id", "name", "email", "age", "department_id"],
    },
    {
      name: "departments",
      columns: ["id", "name", "location", "budget"],
    },
    {
      name: "orders",
      columns: ["id", "user_id", "amount", "order_date", "status"],
    },
    {
      name: "products",
      columns: ["id", "name", "price", "stock", "category"],
    },
  ],
};

/**
 * Table 1: users from JSONPlaceholder [web:102][web:109]
 * GET https://jsonplaceholder.typicode.com/users
 */
async function fetchUsersTable() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users from JSONPlaceholder");
  }
  const data: any[] = await res.json();

  const first = data[0] ?? {};
  const columns = Object.keys(first);

  return {
    name: "users",
    columns,
  };
}

/**
 * Table 2: products from DummyJSON [web:120][web:127]
 * GET https://dummyjson.com/products
 */
async function fetchProductsTable() {
  const res = await fetch("https://dummyjson.com/products");
  if (!res.ok) {
    throw new Error("Failed to fetch products from DummyJSON");
  }
  const json = await res.json();
  const data: any[] = json.products ?? [];

  const first = data[0] ?? {};
  const columns = Object.keys(first);

  return {
    name: "products",
    columns,
  };
}

/**
 * Fetch two tables with different data sources
 */
export async function fetchRemoteTables() {
  const tables = [];

  try {
    const [usersTable, productsTable] = await Promise.all([
      fetchUsersTable(),
      fetchProductsTable(),
    ]);

    tables.push(usersTable);
    tables.push(productsTable);
  } catch (e) {
    console.error("Error fetching remote tables:", e);
  }

  // If remote failed, fall back to static schema
  if (tables.length === 0) {
    return DATABASE_SCHEMA.tables;
  }

  return tables;
}

/**
 * Public helper to get schema for UI
 */
export async function getDatabaseSchema() {
  const remoteTables = await fetchRemoteTables();
  return { tables: remoteTables };
}

/**
 * Existing SQL generator (unchanged)
 */
export function generateSQL(state: QueryState): string {
  if (state.nodes.length === 0) return "SELECT * FROM table_name;";

  let sql = "SELECT ";
  sql += state.selectColumns.length > 0 ? state.selectColumns.join(", ") : "*";
  sql += " FROM " + state.nodes[0].name;

  state.joins.forEach((join) => {
    sql += ` ${join.type} ${join.table} ON ${join.condition}`;
  });

  if (state.filters.length > 0) {
    sql += " WHERE ";
    sql += state.filters
      .map((f) => `${f.column} ${f.operator} '${f.value}'`)
      .join(" AND ");
  }

  if (state.orderBy.length > 0) {
    sql += " ORDER BY " + state.orderBy.join(", ");
  }

  if (state.limit) {
    sql += " LIMIT " + state.limit;
  }

  sql += ";";
  return sql;
}

/**
 * Existing query executor (still points to your backend)
 */
export async function executeQuery(sql: string) {
  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: sql }),
    });
    return await response.json();
  } catch (error) {
    console.error("Query execution error:", error);
    throw error;
  }
}
