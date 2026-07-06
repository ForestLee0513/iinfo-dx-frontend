<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:iinfo-dx-frontend-agent-rules -->

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

## Architecture

Path alias: `@/*` → repo root. Styling is Tailwind CSS v4 (PostCSS plugin, no tailwind.config). UI copy and code comments are written in Korean.

### API layer pattern (`api/<domain>/`)

Each backend domain gets three files (see `api/auth/` as the reference implementation):

- `constants.ts` — route base (e.g. `AUTH_BASE = "/api/v1/web/auth"`) and enum-like consts
- `types.ts` — request/response interfaces, one block per endpoint with the endpoint path in a comment
- `requests.ts` — everything TanStack Query: a `<domain>Keys` query-key factory, raw request functions, `queryOptions` exports, and `useXxxQuery`/`useXxxMutation` hooks

### Auth & HTTP flow

- `lib/axios.ts` exports the shared `api` axios instance. Sessions are cookie-based (`withCredentials: true`); the access token for Bearer-protected endpoints lives **in memory only** (`setAccessToken`), so a page refresh drops it intentionally.
- On any 401 (except login/refresh requests themselves), the response interceptor calls `POST /refresh` — deduplicated through a single shared promise so concurrent 401s trigger one refresh — then retries the original request exactly once.
- `lib/query-client.ts` configures query retries to skip all 4xx errors, since a 401 reaching TanStack Query means the interceptor's refresh-and-retry already failed.
- Login mutations seed the `me` query cache from the login response (`seedMyInfo`) to avoid an immediate follow-up `/me` request.
- OAuth login is a full-page redirect (`window.location.assign`), not XHR — the session cookie is set on the provider callback.

### App shell

- `app/layout.tsx` wraps everything in `QueryProvider` (`providers/QueryProvider.tsx`), which uses `getQueryClient()` from `lib/query-client.ts` — a new `QueryClient` per server request, a singleton in the browser (SSR-hydration-safe pattern).
- Route groups organize pages, e.g. `app/(auth)/` shares a centered card layout for `/login` and `/sign-up`.
- Fonts (Pretendard / Pretendard JP) come from `styles/fonts` and are exposed as CSS variables on `<html>`.

<!-- END:iinfo-dx-frontend-agent-rules -->
