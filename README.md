# Quizzle — Frontend

React frontend for the Quizzle quiz application, built with Vite and Bun.

GitHub repository: https://github.com/Grogu-Dindjarin/quizgame-frontend

## Table of contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Project structure and technologies](#project-structure-and-technologies)
4. [Getting started](#getting-started)
5. [Available commands](#available-commands)
6. [Default accounts and roles](#default-accounts-and-roles)

## Introduction

Quizzle is a quiz and flashcard application. This React application is the user interface; all data comes from the Spring Boot web API ([quizgame-backend](https://github.com/Grogu-Dindjarin/quizgame-backend)).

Main features:

- Register and log in (login state is kept in React Context)
- Choose a category, subcategory and difficulty level and play a quiz
- See your score and earned badges on the results page
- View the leaderboard
- Edit your profile and upload an avatar image
- Admin page: manage categories, subcategories, questions and answers

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- The backend must be running on `http://localhost:8080` (see the backend README), or configure `VITE_API_URL`

## Project structure and technologies

```
src/
├── components/     # Reusable UI components
├── context/        # React Context (AuthContext)
├── hooks/          # Custom React hooks (useQuiz)
├── pages/          # Page components (one per route)
├── services/       # Axios instance (api.js) that adds the JWT to every request
└── styles/         # Global CSS and variables
```

Technologies:

- **React 18** — component-based user interface, with React Context for login state.
- **Vite** — development server and build tool.
- **Bun** — installs the dependencies and runs the scripts in `package.json`.
- **React Router** — navigation between pages, with protected routes for logged-in users and admins.
- **Axios** — HTTP requests to the backend.
- **CSS (self-written, Flexbox)** — no styling framework.
- **ESLint and Prettier** — code quality and formatting.

## Getting started

Run these commands in the project root (the folder with `package.json`).

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create the environment file:

   ```bash
   cp .env.example .env
   ```

   | Variable       | Default                 | Description                 |
   | -------------- | ----------------------- | --------------------------- |
   | `VITE_API_URL` | `http://localhost:8080` | Base URL of the backend API |

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available commands

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `bun run dev`     | Start development server with hot reload |
| `bun run build`   | Build for production                     |
| `bun run preview` | Preview the production build locally     |
| `bun run lint`    | Run ESLint                               |
| `bun run format`  | Format code with Prettier                |
| `bun run quality` | Format and lint in one command           |

The frontend has no automated tests; the tests of the web API are described in the backend README.

## Default accounts and roles

These accounts are loaded by the backend (`data.sql`):

| Email             | Password  | Role  |
| ----------------- | --------- | ----- |
| admin@quizzle.nl  | welkom123 | ADMIN |
| speler@quizzle.nl | welkom123 | USER  |

- **USER** — play quizzes, view results, badges and leaderboard, edit own profile and avatar.
- **ADMIN** — everything a USER can do, plus the admin page.
