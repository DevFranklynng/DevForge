# DevForge

A professional developer command center for projects, tasks, repositories, deployments, API docs, activity, notifications, settings, and an AI assistant — a polished, themeable React workspace.

> **This repository is the frontend (static client).** The Express + Prisma API lives in the separate **[DevForge-Api](https://github.com/DevFranklynng/DevForge-Api)** repository.

## Stack

- **Frontend**: React 18, React Router 6, TanStack Query, Tailwind CSS (custom theme tokens), Lucide icons — plain JavaScript (`.jsx`).
- **Build**: Vite. Deployed to a static host (Netlify) — `public/_redirects` + `netlify.toml` provide the SPA fallback.

## Features

- **Auth**: register, login, logout, session management, protected routes. Google sign-up/sign-in (optional OAuth). Demo account: `demo@devforge.dev` / `devforge123`.
- **Live updates**: a Server-Sent Events stream keeps every open tab in sync — create/edit/delete anywhere is reflected immediately, no refresh needed.
- **Dashboard**: overview stat cards, project pulse, focus tasks, recent deployments, activity feed.
- **Projects**: full lifecycle (planning → active → maintenance → archived), priorities, progress, tech stack, tabs for tasks, repository, deployments, API docs, and activity.
- **Tasks**: kanban board + list views, filters (status/priority/assignee/project), drag-free status moves, inline CRUD.
- **Deployments**: live-status polling, git + non-git deploys, cancel action.
- **Repositories**: connect and track git remotes; real per-user GitHub OAuth (read-only `public_repo` scope, token encrypted at rest) with a "pick from my repos" browser and live sync. Without a connection, repositories fall back to manual/demo metadata.
- **API docs**: endpoints grouped by project, methods, status, expandable request/response details.
- **Activity**: grouped timeline with load-more.
- **Notifications**: reconciled from due-soon tasks and failing deployments, unread badge, mark read/unread, read-all.
- **AI assistant**: contextual answers grounded in workspace data (demo mode when no API key is configured on the API).
- **Global search** (Ctrl/Cmd+K command palette): projects, tasks, endpoints, activity.
- **Settings**: profile, notification preferences, theme (dark/light), default project view, password change, sessions.
- **Theme**: dark default with an accessible light mode; per-user persistence.

## Getting started

You need the API running too — see **DevForge-Api**'s README (its `npm run dev` serves `http://localhost:4000`).

```bash
# install dependencies
npm install

# run the client (Vite dev server on :5173, proxies /api -> :4000)
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on `:5173` (proxies `/api` to `:4000`) |
| `npm run build` | Static production build → `dist/` |
| `npm run preview` | Preview the production build locally |

## Deployment

- **Client** — `npm run build:client`, publish `dist/`. `netlify.toml` + `public/_redirects` handle the SPA fallback on Netlify. Set `VITE_API_URL` (in `netlify.toml` or the Netlify dashboard env vars) to the deployed API, e.g. `https://devforge-api.onrender.com`.
- **API** — deployed separately from the **DevForge-Api** repo (Render blueprint / Docker), where `CLIENT_ORIGIN`, `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=none`, the OAuth URIs, `VITE_API_URL` counterpart and the callback registration in the Google/GitHub consoles all live.

## Project layout

```
.
├─ src/                  # React client (JavaScript)
│  ├─ components/        # ui kit (Button, Modal, Toast, Tabs, Dropdown, …) + layout (Sidebar, Topbar, …)
│  ├─ features/          # auth, theme, notifications, project tabs, CRUD modals
│  ├─ pages/             # route components
│  ├─ hooks/ lib/ utils/ services/
├─ public/               # static assets + _redirects (SPA fallback)
├─ netlify.toml          # Netlify build/publish config
└─ index.html
```

The API code, schema, seed and live API test suite moved to **DevForge-Api**.