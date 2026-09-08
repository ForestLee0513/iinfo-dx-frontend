# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. (e.g. `searchParams` is now a `Promise` — `await` it.)

UI copy and code comments are written in **Korean**. Path alias: `@/*` → repo root.

Prefer named imports over namespace imports wherever a library exposes them — write `import { useState, useEffect } from 'react'` instead of `import * as React from 'react'`, and call the named exports directly rather than through a namespace prefix (e.g. `React.useState`). React is just one example; apply this to any library. Exception: `components/ui/` (shadcn CLI-generated files) is left as the CLI emits it.

## Commands

Package manager is **yarn** (yarn.lock present).

- `yarn dev` — dev server at http://localhost:3000
- `yarn build` — production build
- `yarn lint` — ESLint (flat config: next/core-web-vitals + next/typescript + @tanstack/query recommended)

There is no test setup in this project.

## Environment

`.env.local` (git-ignored) controls two things:

- `NEXT_PUBLIC_API_URL` — backend base URL (defaults to `http://localhost:8000` in `lib/axios.ts`). Backend routes live under `/api/v1/web/...`.
- `NEXT_PUBLIC_BASE_PATH` / `NEXT_PUBLIC_BASE_DEV_URL` — only for running behind a code-server reverse proxy (`/absproxy/<port>`). When set, `next.config.ts` enables `basePath`/`assetPrefix`, `allowedDevOrigins`, and a root redirect. Leave **unset** for normal local/production use. `NEXT_PUBLIC_*` vars are inlined at build time — restart the dev server after changing them. See README.md for the full proxy explanation.

Because `basePath` may be active, image paths must use **static imports** (`import logo from "../public/logo.png"`) rather than string paths — `basePath` is not applied to `next/image` string `src`, raw `<img>`, or CSS `url()`.

## Testing & verification

There is no automated test suite in this project — verification is manual, against the running dev server.

- **Port:** Always start on the project's assigned default port first (`yarn dev` → `3000`). Don't preemptively pick a different port.
- **Port already in use:** Don't just kill it. First identify what's holding the port (e.g. `lsof -i :3000`), then decide — together with the user if the owner is unclear or looks unrelated — whether to stop that process before starting this project's dev server.
- **How to verify:** Prefer testing through the Chrome extension (claude-in-chrome) — drive the actual running app in the browser. Only if that's not applicable (extension unavailable, a change with no UI surface, etc.) fall back to codebase-level verification (`yarn lint`, type-checking, reading the affected code path).
- **After testing:** Leave the dev server running. Don't stop/kill it once verification is done.

## Project layout

Styling is Tailwind CSS v4 (PostCSS plugin, no tailwind.config). Each top-level folder owns exactly one concern; keep the boundaries from overlapping.

```
📦 repo root
 ┣ 📂api        # per-domain requests + server-state (TanStack Query)
 ┣ 📂app        # routing and screen assembly only
 ┣ 📂components # feature-scoped, reusable UI
 ┣ 📂lib        # shared client foundations (HTTP + cache clients)
 ┣ 📂providers  # React providers wiring lib clients into the tree
 ┗ 📂styles     # global styles and fonts
```

Each folder's rules live in its own doc, loaded below in the same order as the tree above:

@docs/api-layer.md
@docs/app-router.md
@docs/components.md
@docs/lib.md
@docs/providers.md
@docs/styles.md
