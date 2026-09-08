# `api/<domain>/` — requests & server-state

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

## Query keys — the `<domain>Keys` factory

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
