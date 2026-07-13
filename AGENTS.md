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

Each backend domain gets four files (see `api/auth/` as the reference implementation):

- `constants.ts` — route base (e.g. `AUTH_BASE = "/api/v1/web/auth"`) and enum-like consts
- `types.ts` — request/response interfaces, one block per endpoint with the endpoint path in a comment
- `requests.ts` — the request layer: raw `async` functions that call `api` (axios) and return response data. No TanStack Query imports.
- `queries.ts` — the TanStack Query layer, built on top of `requests.ts`: a `<domain>Keys` query-key factory, `queryOptions` exports, cache seeders, and `useXxxQuery`/`useXxxMutation` hooks

Keep the two layers separate: `queries.ts` imports request functions from `requests.ts`, never the reverse. Components import hooks from `queries.ts`; import raw functions from `requests.ts` only for non-hook flows (e.g. `startOAuthLogin`, or `refreshSession` inside the interceptor/bootstrap).

### TanStack Query state management (query keys)

The client cache is TanStack Query — treat it as server-state, not a client store. State is partitioned per domain by the **top-level string** of each query key, via a `<domain>Keys` factory:

```ts
export const authKeys = {
  all: ["auth"] as const,              // namespace root for the whole domain
  me: () => [...authKeys.all, "me"] as const,
};
```

- **Namespacing rule:** every domain's `all` MUST start with a unique string (`["auth"]`, `["user"]`, `["post"]`, …). Never build a key by hand in a component — always go through the factory so the prefix stays consistent.
- **Why domains don't clobber each other:** invalidate/remove match by array **prefix**, so `removeQueries({ queryKey: authKeys.all })` only touches keys starting with `["auth", …]`. Other domains' subtrees are untouched. Auth cache is only wiped by a same-prefix collision, `queryClient.clear()`, or a key-less `invalidateQueries()` — all deliberate.
- **Derive keys from the parent:** child keys spread `authKeys.all` (`[...authKeys.all, "me"]`) so one `authKeys.all` removal cleans the entire domain in a single call (see `useLogoutMutation`).
- Cache writes go through named seeders (`seedMyInfo`) in `queries.ts`, not scattered `setQueryData` calls in components.

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
