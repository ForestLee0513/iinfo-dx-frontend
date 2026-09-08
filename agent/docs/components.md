# `components/` — feature-scoped UI

Three top-level groups, split by scope:

```
📂components
 ┣ 📂ui       # shadcn/ui primitives (generated via shadcn CLI) — don't hand-roll variants here beyond what the CLI emits
 ┣ 📂screens  # one-route components — the bulk of a page's UI, imported by exactly one app/ page.tsx
 ┗ 📂common   # cross-route components — shared chrome or wrappers imported by more than one page.tsx (e.g. Header, AuthGuard)
```

A component moves from `screens/` to `common/` the moment a second route imports it — not before.

Within `screens/` and `common/`, one folder per feature component, **one component per file**, split by concern. A simple component starts flat (`components/screens/UserInfoCard.tsx`); when it grows, promote it to a folder:

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
