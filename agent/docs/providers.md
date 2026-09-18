# `providers/` — wiring `lib` clients into the tree

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
