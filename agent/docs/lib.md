# `lib/` — shared client foundations

App-wide plumbing that isn't tied to any domain or screen. Domains grow, screens grow; these two files stay reused.

```
📂lib
 ┣ 📜axios.ts        # shared HTTP instance + 401 auto-recovery
 ┗ 📜query-client.ts # server/browser QueryClient factory
```

## `axios.ts` — shared HTTP instance & 401 recovery

- Exports the shared `api` axios instance. Sessions are cookie-based (`withCredentials: true`).
- The access token for Bearer-protected endpoints lives **in memory only** (`setAccessToken`), so a page refresh drops it **intentionally** — real identity rests in the httpOnly refresh cookie (XSS can't read it), and the in-memory token is a recoverable derivative.
- On any 401 (except login/refresh requests themselves), the response interceptor calls `POST /refresh` — **deduplicated through a single shared promise** so concurrent 401s trigger one refresh — then retries the original request **exactly once** (`_retried` flag). A 401 on refresh/login itself is a credential error and propagates as-is (no recursion).

## `query-client.ts` — server/browser factory

- `retry` skips all 4xx errors (retry only `5xx`, up to 3×): a 401 reaching TanStack Query means the axios interceptor's refresh-and-retry already failed, so retrying again is pointless. The two layers manage retries without overlapping.
- `getQueryClient()` returns a **new `QueryClient` per server request** (no cross-user cache leaks) and a **browser singleton** (survives suspend/re-render without discarding the hydrated cache). Callers just call `getQueryClient()` — the server/browser rule stays sealed in this file.
