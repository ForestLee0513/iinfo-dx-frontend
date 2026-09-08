# `styles/` — global styles & fonts

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
