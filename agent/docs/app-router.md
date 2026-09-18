# `app/` — routing & assembly only

Keep `app/` limited to what is **directly tied to a route**. Provider setup, global styles, and reusable UI belong in `providers/`, `styles/`, and `components/` — not here.

- **Pages stay thin.** A `page.tsx` composes data and delegates the actual UI to a component (e.g. `app/page.tsx` → `components/UserInfoCard`). Only routing-coupled logic lives in the page — e.g. reading the OAuth-callback `?error=` query and `redirect()`-ing to `/login`.
- **Route groups** (parenthesized folders like `app/(auth)/`) do **not** appear in the URL — `app/(auth)/login/page.tsx` serves `/login`, not `/auth/login`. Use them to share a layout across related pages (the `(auth)` group gives `/login` and `/sign-up` a centered card layout), not to shape the URL.
- **Nested layouts:** the root `app/layout.tsx` sets `<html>`/`<body>`, global providers, fonts, and global styles; group layouts (`app/(auth)/layout.tsx`) apply only to their group.
- **`searchParams` is a `Promise`** in this Next.js version — `await` it (`const { error } = await searchParams`). Synchronous access from older Next.js will not work.
