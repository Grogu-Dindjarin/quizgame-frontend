# Quizzle — Frontend

React frontend for the Quizzle quiz application, built with Vite and Bun.

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- The backend must be running on `http://localhost:8080` (or configure `VITE_API_URL`)

## Getting started

Install dependencies:

```bash
bun install
```

Copy the environment template and configure it:

```bash
cp .env.example .env
```

Start the development server:

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment variables

| Variable       | Default                 | Description                 |
| -------------- | ----------------------- | --------------------------- |
| `VITE_API_URL` | `http://localhost:8080` | Base URL of the backend API |

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:8080
```

## Available commands

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `bun run dev`     | Start development server with hot reload |
| `bun run build`   | Build for production                     |
| `bun run preview` | Preview the production build locally     |
| `bun run lint`    | Run ESLint                               |
| `bun run format`  | Format code with Prettier                |
| `bun run quality` | Format and lint in one command           |

## Project structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context (AuthContext)
├── hooks/          # Custom React hooks
├── pages/          # Page components (one per route)
├── services/       # Axios instance and API helpers
└── styles/         # Global CSS and variables
```

## Default accounts (seeded)

| Email             | Password  | Role  |
| ----------------- | --------- | ----- |
| admin@quizzle.nl  | welkom123 | ADMIN |
| speler@quizzle.nl | welkom123 | USER  |
