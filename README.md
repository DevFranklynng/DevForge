# DevForge

A professional developer command center for projects, tasks, repositories, deployments, API docs, activity, notifications, settings, and an AI assistant — all wrapped in a polished, themeable React workspace with a real Express + Prisma backend.

## Stack

- **Frontend**: React 18, React Router 6, TanStack Query, Tailwind CSS (custom theme tokens), Lucide icons — plain JavaScript (`.jsx`).
- **Backend**: Express, Prisma (SQLite), Zod validation, token-session auth (cookies), bcrypt, helmet + rate limiting.
- **Tooling**: Vite, TypeScript (server only), tsx, concurrently.

## Features

- **Auth**: register, login, logout, session management, protected routes. Google sign-up/sign-in (optional OAuth). Demo account: `demo@devforge.dev` / `devforge123`.
- **Live updates**: a Server-Sent Events stream (`/api/events`) keeps every open tab in sync — create/edit/delete anywhere is reflected immediately, no refresh needed.
- **Dashboard**: overview stat cards, project pulse, focus tasks, recent deployments, activity feed.
- **Projects**: full lifecycle (planning → active → maintenance → archived), priorities, progress, tech stack, tabs for tasks, repository, deployments, API docs, and activity.
- **Tasks**: kanban board + list views, filters (status/priority/assignee/project), drag-free status moves, inline CRUD.
- **Deployments**: live-status polling, git + non-git deploys, cancel action.
- **Repositories**: connect and track git remotes; real per-user GitHub OAuth (read-only `public_repo` scope, token encrypted at rest) with a "pick from my repos" browser and live sync. Without a connection, repositories fall back to manual/demo metadata.
- **API docs**: endpoints grouped by project, methods, status, expandable request/response details.
- **Activity**: grouped timeline with load-more.
- **Notifications**: reconciled from due-soon tasks and failing deployments, unread badge, mark read/unread, read-all.
- **AI assistant**: contextual answers grounded in workspace data (demo mode when no API key is configured).
- **Global search** (Ctrl/Cmd+K command palette): projects, tasks, endpoints, activity.
- **Settings**: profile, notification preferences (`notifyDueSoon`, `notifyFailing`), theme (dark/light), default project view, password change, sessions.
- **Theme**: dark default with an accessible light mode; per-user persistence.

## Getting started

```bash
# install dependencies (root + server)
npm install
npm --prefix server install

# add env
# root .env: SESSION_SECRET=<long random string>
# server reads DATABASE_URL from server/.env (file:./devforge.db)

# sync the database schema
npm run db:push

# seed demo data
npm run db:seed

# run both (API on :4000, client on :5173 with /api proxy)
npm run dev
```

To run the two processes separately:

```bash
npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Runs server + client concurrently |
| `npm run dev:server` / `dev:client` | Run one side only |
| `npm run build` | Build server (tsc) + client (vite) |
| `npm run typecheck` | Type-check the server |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:seed` | Seed demo data (idempotent-ish; wipes inactive demo users) |
| `npm run test:api` | Live API test suite against a running server on `:4000` |

## Tests

The API suite (`tests/api.test.ts`) is a plain tsx script that exercises the running server over HTTP — auth, dashboard, projects, tasks, deployments, repositories, activity, AI, search, settings, and notifications.

```bash
npm run dev:server   # in one terminal
npm run test:api     # in another
```

## GitHub OAuth (optional)

1. Create a GitHub OAuth app at <https://github.com/settings/developers>.
2. Set the **Authorization callback URL** to `GITHUB_REDIRECT_URI` (default `http://localhost:4000/api/github/callback`, or `https://api.example.com/api/github/callback` in production).
3. In `.env`: `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` (optionally override `GITHUB_REDIRECT_URI` / `GITHUB_APP_ORIGIN`). A shared `GITHUB_TOKEN` alone still enables live sync without OAuth.

Each user links their own account from **Repositories → Connect GitHub account**. The access token is read-only (`public_repo`), stored AES-256-GCM encrypted at rest with a key derived from `SESSION_SECRET`, and never reaches the client. Keep `SESSION_SECRET` stable across restarts in production or users must reconnect.

## Google sign-in (optional)

1. Create an OAuth 2.0 Client ID at <https://console.cloud.google.com/apis/credentials>.
2. Add `GOOGLE_REDIRECT_URI` (default `http://localhost:4000/api/auth/google/callback`) to the client's **Authorized redirect URIs**, and make sure the OAuth consent screen includes the `userinfo.email` / `openid` scopes.
3. In `.env`: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (optionally override `GOOGLE_REDIRECT_URI` / `GOOGLE_APP_ORIGIN`).

Users then get **Continue with Google** on both the login and register screens. Sign-in links by verified email when an account already exists, otherwise it creates one. When Google is not configured the button redirects back to login with a clear error.

## Deployment

Two pieces are published separately:

- **Client** — a static build (`npm run build:client`) deployed to any static host (Netlify, Vercel, Cloudflare Pages, etc.). `public/_redirects` + `netlify.toml` provide the SPA fallback. The client talks to the API via a build-time `VITE_API_URL`; leave it empty in dev so Vite proxies to `:4000`.
- **API** — the Express server (`npm run build:server` → `server/dist`). It needs a persistent disk for SQLite (or a managed PostgreSQL via `DATABASE_URL`). `render.yaml` is a ready-made blueprint (disk at `/data`, auto-runs `prisma db push`); a Dockerfile with a `/data` volume is included for other providers.

Cross-origin notes (client and API on different domains):

- Set `CLIENT_ORIGIN` to the client's public origin(s) and `API_URL`/`VITE_API_URL` to the API's public URL.
- Cookies must cross `COOKIE_SECURE=true` **and** `COOKIE_SAME_SITE=none` (both are already honored by the server).
- If you keep the API behind the same domain as the client (e.g. `api.example.com`), `COOKIE_SECURE=true` with `COOKIE_SAME_SITE=lax` works and is simpler. Netlify is not able to 200-rewrite to an external origin, so do not rely on it for proxying the API.
- `SESSION_SECRET` must be a stable random value in production (changing it invalidates existing sessions and GitHub/GitHub-encryption keys).

The live event stream is in-process by design; it fits the single-instance deployment above. If you scale the API to multiple instances, swap `server/src/services/events.ts` for a Redis pub/sub.

## Development notes

- **Workspaces**: root and server are installed separately (`npm install` + `npm --prefix server install`); do not introduce npm workspaces again.
- **Frontend is JavaScript**: keep all `src/**` code in `.jsx`/`.js`. Only `server/**` and `tests/**` are TypeScript.
- **SQLite case sensitivity**: searches use `contains` (case-sensitive). Matching relies on consistent casing in seed data; `mode: "insensitive"` is not supported by SQLite.
- **Prisma client lock (Windows)**: `npm run db:generate` fails with `EPERM` while the running `tsx` server holds `query_engine-windows.dll.node`. Stop the server (`dev:server`), regenerate, restart.
- **Notifications**: mark-actions and prefs are split (`notifyDueSoon`, `notifyFailing`); the demo seed enables both.

## Project layout

```
.
├─ src/                  # React client (JavaScript)
│  ├─ components/        # ui kit (Button, Modal, Toast, Tabs, Dropdown, …) + layout (Sidebar, Topbar, …)
│  ├─ features/          # auth, theme, notifications, project tabs, CRUD modals
│  ├─ pages/             # route components
│  ├─ hooks/ lib/ utils/ services/
├─ server/               # Express + Prisma (TypeScript)
│  ├─ prisma/            # schema.prisma + seed.ts
│  └─ src/               # controllers, services, middleware, routes
└─ tests/api.test.ts     # live API test suite
```