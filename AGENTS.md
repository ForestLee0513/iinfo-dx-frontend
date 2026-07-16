# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. (e.g. `searchParams` is now a `Promise` — `await` it.)

UI copy and code comments are written in **Korean**. Path alias: `@/*` → repo root.

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

The sections below give the rules for each folder, in that order.

## `api/<domain>/` — requests & server-state

Each backend domain gets **four files** (see `api/auth/` as the reference implementation):

```
📂api/auth
 ┣ 📜constants.ts  # route base (AUTH_BASE = "/api/v1/web/auth") + enum-like consts
 ┣ 📜types.ts      # request/response interfaces, one block per endpoint (path in a comment)
 ┣ 📜requests.ts   # request layer: raw async fns calling `api` (axios). NO TanStack imports
 ┗ 📜queries.ts    # TanStack layer: <domain>Keys factory, queryOptions, seeders, hooks
```

**Layer separation is one-directional: `queries.ts` → `requests.ts`, never the reverse.** The request layer only knows "what to call and how"; the query layer owns "how the result is cached."

- Components import hooks from `queries.ts`.
- Import raw functions from `requests.ts` only for non-hook flows (e.g. `startOAuthLogin`, or `refreshSession` inside the interceptor / bootstrap) — anything that runs outside a React hook.

### Query keys — the `<domain>Keys` factory

The client cache is TanStack Query — treat it as **server-state, not a client store**. State is partitioned per domain by the **top-level string** of each query key:

```ts
export const authKeys = {
  all: ["auth"] as const, // namespace root for the whole domain
  me: () => [...authKeys.all, "me"] as const,
};
```

- **Namespacing rule:** every domain's `all` MUST start with a unique string (`["auth"]`, `["user"]`, `["post"]`, …). Never hand-build a key in a component — always go through the factory so the prefix stays consistent.
- **Domains don't clobber each other:** invalidate/remove match by array **prefix**, so `removeQueries({ queryKey: authKeys.all })` only touches keys starting with `["auth", …]`. Auth cache is wiped only by a same-prefix collision, `queryClient.clear()`, or a key-less `invalidateQueries()` — all deliberate.
- **Derive child keys from the parent** (`[...authKeys.all, "me"]`) so one `authKeys.all` removal cleans the entire domain in a single call (see `useLogoutMutation`).
- Cache writes go through **named seeders** (`seedMyInfo`) in `queries.ts`, not scattered `setQueryData` calls in components. Login mutations seed the `me` cache from the login response to avoid an immediate follow-up `/me` request.

## `app/` — routing & assembly only

Keep `app/` limited to what is **directly tied to a route**. Provider setup, global styles, and reusable UI belong in `providers/`, `styles/`, and `components/` — not here.

- **Pages stay thin.** A `page.tsx` composes data and delegates the actual UI to a component (e.g. `app/page.tsx` → `components/UserInfoCard`). Only routing-coupled logic lives in the page — e.g. reading the OAuth-callback `?error=` query and `redirect()`-ing to `/login`.
- **Route groups** (parenthesized folders like `app/(auth)/`) do **not** appear in the URL — `app/(auth)/login/page.tsx` serves `/login`, not `/auth/login`. Use them to share a layout across related pages (the `(auth)` group gives `/login` and `/sign-up` a centered card layout), not to shape the URL.
- **Nested layouts:** the root `app/layout.tsx` sets `<html>`/`<body>`, global providers, fonts, and global styles; group layouts (`app/(auth)/layout.tsx`) apply only to their group.
- **`searchParams` is a `Promise`** in this Next.js version — `await` it (`const { error } = await searchParams`). Synchronous access from older Next.js will not work.

## `components/` — feature-scoped UI

One folder per feature component, **one component per file**, split by concern. A simple component starts flat (`components/UserInfoCard.tsx`); when it grows, promote it to a folder:

```
📂components/<Name>
 ┣ 📜index.tsx   # the component itself; module parts attach here (Foo.Body = Body) just before export
 ┣ 📂parts       # helper components too small to live globally, one file each
 ┣ 📜types.ts    # component-local types (props, context types) — reads as the component's table of contents
 ┗ 📜utils.ts    # component-local helpers (optional; omit if unused)
```

For components that own local state, add two more folders:

```
 ┣ 📂contexts    # Context used only inside this component
 ┗ 📂hooks       # hooks used only inside this component
```

- **Scope decides placement.** Shared across screens → global (repo-level `hooks/`, `contexts/`, or a global `components/`); used only inside one component → that component's local `parts/` `hooks/` `contexts/`. Same rule for every subfolder.
- **`index.tsx` is the container.** For stateful components it owns state + providers and delegates rendering to `parts/`; `parts/` consumes state (via Context/hooks) and holds none of its own — keep the "owns state (index) ↔ consumes state (parts)" boundary clean.
- **`types.ts` is the component's index** — reading it alone should reveal what the component takes and exposes, without opening the implementation.

## `lib/` — shared client foundations

App-wide plumbing that isn't tied to any domain or screen. Domains grow, screens grow; these two files stay reused.

```
📂lib
 ┣ 📜axios.ts        # shared HTTP instance + 401 auto-recovery
 ┗ 📜query-client.ts # server/browser QueryClient factory
```

### `axios.ts` — shared HTTP instance & 401 recovery

- Exports the shared `api` axios instance. Sessions are cookie-based (`withCredentials: true`).
- The access token for Bearer-protected endpoints lives **in memory only** (`setAccessToken`), so a page refresh drops it **intentionally** — real identity rests in the httpOnly refresh cookie (XSS can't read it), and the in-memory token is a recoverable derivative.
- On any 401 (except login/refresh requests themselves), the response interceptor calls `POST /refresh` — **deduplicated through a single shared promise** so concurrent 401s trigger one refresh — then retries the original request **exactly once** (`_retried` flag). A 401 on refresh/login itself is a credential error and propagates as-is (no recursion).

### `query-client.ts` — server/browser factory

- `retry` skips all 4xx errors (retry only `5xx`, up to 3×): a 401 reaching TanStack Query means the axios interceptor's refresh-and-retry already failed, so retrying again is pointless. The two layers manage retries without overlapping.
- `getQueryClient()` returns a **new `QueryClient` per server request** (no cross-user cache leaks) and a **browser singleton** (survives suspend/re-render without discarding the hydrated cache). Callers just call `getQueryClient()` — the server/browser rule stays sealed in this file.

## `providers/` — wiring `lib` clients into the tree

Providers connect the clients created in `lib/` to the React tree.

```
📂providers
 ┣ 📜QueryProvider.tsx      # inject QueryClient into the tree
 ┣ 📜AuthProvider.tsx       # restore session once on landing
 ┗ 📜AuthReadyContext.ts    # bootstrap-complete flag context
```

**Ordering matters: `QueryProvider` wraps `AuthProvider`** — `AuthProvider` calls `useQueryClient()`, so a `QueryClientProvider` must already be above it.

- **`QueryProvider.tsx`** (thin) — calls `getQueryClient()` and mounts Devtools. Never `new QueryClient()` here.
- **`AuthProvider.tsx`** — restores the session once on landing, matching the in-memory-token design. If a token is already in memory (client nav right after login), it starts `ready` immediately and skips restore. Otherwise it calls `refreshSession()` once and seeds the `me` cache from the response (`seedMyInfo`), so restore costs **one** request instead of `/me`→`/refresh`→`/me`. A failed refresh means "logged out" → it writes `null` into the `me` cache. An `active` flag guards against `setReady` after unmount.
- **`AuthReadyContext.ts`** — a deliberately thin module holding just `AuthReadyContext` + `useAuthReady()`, split out of `AuthProvider` to **break the circular dep** (`AuthProvider` imports `api/auth/requests`, and `me`-query consumers import the context). `false` = restore in progress (gate the `me` query off); `true` = `me` cache filled (user or `null`).

OAuth login is a full-page redirect (`window.location.assign`), not XHR — the session cookie is set on the provider callback.

## `styles/` — global styles & fonts

```
📂styles
 ┣ 📂fonts
 ┃ ┣ 📜PretendardVariable.woff2
 ┃ ┣ 📜PretendardJPVariable.woff2
 ┃ ┗ 📜index.ts       # localFont declarations → CSS variables
 ┗ 📜globals.css      # Tailwind v4 entry + design tokens
```

- **`globals.css`** is the Tailwind v4 entry point: `@import "tailwindcss"` replaces the old `@tailwind base/components/utilities`, and the `@theme` block replaces `tailwind.config`'s `theme.extend`. It wires `--font-sans: var(--font-pretendard), var(--font-pretendard-jp), sans-serif` so Tailwind emits the `font-sans` utility.
- **`fonts/index.ts`** registers Pretendard / Pretendard JP via `next/font/local` (self-hosted, optimized), each exposed as a CSS variable (`--font-pretendard`, `--font-pretendard-jp`) with a variable-weight range (`weight: "45 920"`) and `display: "swap"`. The root layout attaches `pretendard.variable` / `pretendardJP.variable` to `<html>`.
- **Flow:** `fonts/index.ts` loads fonts → CSS variables → layout attaches them to `<html>` → `globals.css` `@theme` promotes them to the `font-sans` token → components just use the `font-sans` utility. Importing fonts via `localFont` (not string paths) also sidesteps the `basePath` pitfall.
