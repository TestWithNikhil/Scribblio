# Scribblio

A browser-based multiplayer drawing and guessing game inspired by classic party games.

## Overview

Scribblio is a real-time multiplayer game where one player draws a secret word while others guess it. Each round rotates through players, tracks scores, and ends with a winner screen.

## Features

- Multiplayer room creation and joining
- Guest nickname setup
- Room lobby with host controls
- Word selection flow
- Real-time drawing synchronization via Socket.IO
- Guess validation and server-side scoring
- Round and game timers
- Final results screen and replay
- Responsive UI for desktop and mobile

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + TypeScript + Express + Socket.IO
- Shared types: TypeScript contracts
- Testing: Vitest + Playwright

## Local development

```bash
npm install
npm run dev
```

Then open the frontend URL shown in the client terminal.

## Production build

```bash
npm run build
```

## Deployment

- Frontend: Vercel
- Backend: Render

## Notes

This project is implemented as an MVP combining in-memory room management with a persistent Node.js server.
