# To-Do List Web App

A simple, elegant task management web app built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just open it and go.

## Features

- **Add tasks** — type and hit Add or press Enter
- **Delete tasks** — with a smooth fade-out animation
- **Mark as completed** — animated checkmark, tasks sink to the bottom
- **Edit tasks** — click the pencil icon or double-click a task
- **Search** — live filtering as you type
- **Filters** — All / Active / Done tabs with live counts
- **Progress bar** — shows how many tasks are done, glows green at 100%
- **Priority star** — mark important tasks (amber accent bar)
- **Timestamps** — each task shows when it was added or completed
- **Local storage** — tasks persist across page reloads
- **Celebration** — confetti + "All done!" when you finish everything

## Files

| File         | Purpose                    |
|--------------|----------------------------|
| `index.html` | Page structure             |
| `style.css`  | Styling and animations     |
| `script.js`  | App logic and persistence  |

## Getting Started

Just open `index.html` in any modern browser. No installation or server required.

## How It Works

- Tasks are stored in the browser's `localStorage` under the key `todos`.
- Each task is an object: `{ id, text, completed, important, createdAt, completedAt }`.
- The UI re-renders from this state after every change, keeping the data as the single source of truth.

## Roadmap (possible extras)

- Due dates with overdue highlighting
- Dark/light theme toggle
- Drag-and-drop reordering
- Export / import tasks
- Installable as a PWA

## Author

Sonam
