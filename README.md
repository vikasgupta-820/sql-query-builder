# SQL Query Builder

A web-based visual SQL Query Builder that lets you design SQL queries by placing tables on a canvas, creating joins, and adding filters with an intuitive drag‑and‑drop interface. The app generates SQL in real time and lets you copy it for use in your database or application.

## Preview

![SQL Query Builder Preview](public/image-query.png)

> Live Demo: https://vikasgupta-820.github.io/sql-query-builder/

---

## Features

- Visual canvas to arrange database tables as cards (for example, `users`, `products`).
- Drag‑and‑drop joins between tables with a dashed connector.
- Options panel to configure join type (INNER JOIN, etc.) and the ON condition.
- Filter builder to add conditions on any column (e.g. `id = '11'`).
- Result limiter to restrict number of returned rows.
- Live SQL preview panel with a button to copy the generated SQL.
- Query summary showing number of tables, filters, joins, and limit.

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Installation

git clone https://github.com/vikasgupta-820/sql-query-builder.git
cd sql-query-builder
npm install

### Development


Open the URL printed in the terminal (usually `http://localhost:5173` or similar, depending on your bundler).

### Production Build


### Deploy

The project is configured to be deployed to GitHub Pages:

npm run deploy

Make sure the repository’s GitHub Pages settings are correctly pointing to the `gh-pages` branch.

---

## Usage

1. Select tables from the **Tables** sidebar to add them to the canvas.
2. Drag tables to position them as desired.
3. Drag from the connector on one table to another to create a join.
4. In the **Options** panel:
   - Choose a join type (e.g. INNER JOIN).
   - Select the table and set the join condition (e.g. `users.id = products.userId`).
5. In the **Query Builder** panel:
   - Choose a column, operator, and value to add filters.
   - Manage active filters and change the result limit.
6. Copy the generated SQL from the **Generated SQL** panel and use it in your database tool.

---

## Project Structure

> This is a general overview; file names may differ slightly.

- `src/` – Main application source
  - `components/` – Reusable UI components (tables list, canvas, panels, etc.)
  - `hooks/` – Custom hooks for managing query state
  - `utils/` – Helper functions for building SQL strings
  - `styles/` – Global styles and theme
- `public/` – Static assets
- `package.json` – Scripts and dependencies
- `vite.config.*` or equivalent – Build configuration

---

## Tech Stack

Update this list if needed to match the actual repo:

- Framework: React
- Language: TypeScript
- Build Tool: Vite
- Styling: CSS 
- Deployment: GitHub Pages

---

## Scripts

Common scripts defined in `package.json`:

- `npm run dev` – Start the development server.
- `npm run build` – Build the app for production.
- `npm run preview` – Preview the production build locally.
- `npm run deploy` – Deploy to GitHub Pages.

---

## Contributing

Contributions, feature requests, and bug reports are welcome.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

---

