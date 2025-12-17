# React To‑Do App

A clean, modern to‑do list built with React and no UI frameworks. It persists tasks locally and can optionally use a REST backend via an API base URL.

## Features

- Add, edit inline, toggle complete, and delete tasks
- Filters: All / Active / Completed
- Clear completed, remaining count
- Local persistence using localStorage
- API abstraction: uses REACT_APP_API_BASE if set; otherwise falls back to localStorage
- Accessible and keyboard friendly
- Modern, responsive, single‑column layout

## Environment

Optional environment variable:
- REACT_APP_API_BASE: Base URL for REST API providing /todos endpoints

If not set, the app persists to localStorage.

## Development

- npm start
- npm test

## Styling

Theme colors:
- Primary: #3b82f6
- Secondary: #64748b
- Success: #06b6d4
- Error: #EF4444

The layout uses rounded cards, focus rings, and neat spacing. See src/App.css and src/assets/styles/theme.css.
