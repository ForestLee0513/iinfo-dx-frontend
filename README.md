This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), configured to run both behind a **code-server reverse proxy** and in a normal local/production environment from a single codebase. The proxy behavior (`basePath`, `assetPrefix`, dev-origin allowlist, entry redirect) is toggled entirely by environment variables.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open the app depending on how you connect:

- **Direct access (recommended for development)** — [http://localhost:3000](http://localhost:3000). No proxy, no `basePath`, HMR works natively. Leave the env vars below **unset**.
- **Through code-server** — `https://code.forestlee.me/absproxy/3000`. Requires the env vars below. The auto-generated `/proxy/3000/` link redirects here automatically.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Background

code-server exposes a running dev server through its own proxy paths:

- `/proxy/<port>/` — **strips** the path prefix before forwarding (breaks apps that use absolute asset paths).
- `/absproxy/<port>/` — **keeps** the path prefix, so it must match the app's `basePath`.

Next.js references assets with root-absolute paths (`/_next/...`), so behind the proxy you must align `basePath`/`assetPrefix` with the proxy path. `next.config.ts` automates this from environment variables.

## Environment Variables

Create a `.env.local` in the project root (usually git-ignored, since these values are environment-specific).

| Variable | Example | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | `/absproxy/3000` | Proxy path prefix. **When set**, enables `basePath`/`assetPrefix` and the entry redirect. Unset / empty / `"/"` → runs at root (default for production). |
| `NEXT_PUBLIC_BASE_DEV_URL` | `code.forestlee.me` | The **hostname** used to reach the dev server. Added to `allowedDevOrigins` so cross-origin dev requests (HMR WebSocket, etc.) are accepted. |

### Example — code-server

```bash
NEXT_PUBLIC_BASE_PATH=/absproxy/3000
NEXT_PUBLIC_BASE_DEV_URL=code.forestlee.me
```

### Local / production

Leave both variables **unset**. `basePath`/`assetPrefix`/redirect are all disabled and the app runs at the root domain.

> **Notes**
> - `NEXT_PUBLIC_BASE_DEV_URL` must be a **hostname only** — a protocol (`https://`) or path will not match the origin.
> - `NEXT_PUBLIC_*` variables are **inlined at build time**. After editing `.env.local`, **restart the dev server** (HMR won't pick up the change).

## How the config works (`next.config.ts`)

```ts
import type { NextConfig } from "next";

function resolveBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!raw || !raw.trim()) return "";          // unset/blank -> root
  let p = raw.trim();
  if (p === "/") return "";                     // "/" alone -> root
  if (!p.startsWith("/")) p = "/" + p;          // ensure leading slash
  return p.replace(/\/+$/, "");                 // strip trailing slash
}

const basePath = resolveBasePath();
const hasBasePath = basePath !== "";

const nextConfig: NextConfig = {
  // inject only when a basePath is set; otherwise the keys are omitted
  ...(hasBasePath && { basePath, assetPrefix: basePath }),

  // allow cross-origin dev requests (HMR, etc.) from the proxy host
  allowedDevOrigins: [process.env.NEXT_PUBLIC_BASE_DEV_URL ?? ""],

  // /proxy/<port>/ entry -> redirect to /absproxy/<port>
  async redirects() {
    if (!hasBasePath) return [];
    return [
      { source: "/", basePath: false, destination: basePath, permanent: false },
    ];
  },
};

export default nextConfig;
```

1. **`resolveBasePath()`** normalizes `NEXT_PUBLIC_BASE_PATH` (handles unset, blank, `"/"`, missing leading slash, trailing slash) so the config and app share one source of truth.
2. **Conditional `basePath`/`assetPrefix`** are injected only when a base path exists, so production builds (vars unset) are unaffected.
3. **`allowedDevOrigins`** — Next.js 15+ blocks cross-origin dev requests by default, which would reject the HMR WebSocket coming from the proxy domain. Adding the host unblocks it.
4. **`redirects()`** sends the `/proxy/<port>/` entry (which lands at root) to the `basePath`-prefixed `/absproxy/<port>`. `basePath: false` makes the rule match only the raw `/`, so normal entry doesn't loop.

## Images

`basePath` is auto-applied to `next/link`, routing, and `_next` internal assets only. It is **not** applied to `next/image` `src`, raw `<img>`, `public/` paths, or CSS `url()`.

The safest approach is a **static import**, which lets the bundler apply `basePath`/`assetPrefix` automatically:

```tsx
import Image from "next/image";
import logo from "../public/logo.png";

export default function Logo() {
  return <Image src={logo} alt="logo" priority />;
}
```

If you must use a string path, prepend `NEXT_PUBLIC_BASE_PATH` manually via a small helper.

## HMR / WebSocket Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `wss://.../_next/webpack-hmr failed` | Next 15+ blocks cross-origin dev requests | Add the host to `allowedDevOrigins`, then restart dev |
| Still no WS after that | Reverse proxy / code-server absproxy not upgrading the WebSocket hop | Verify WebSocket support on the proxy (e.g. Nginx Proxy Manager "Websockets Support"). If it persists, develop via direct access |
| Images 404 | `basePath` not auto-applied to image paths | Use a static import |
| Page loads but assets 404 | Proxy path and `basePath` mismatch | Access via `/absproxy/<port>` and keep `basePath`/`assetPrefix` aligned |

HMR not connecting does not affect the app itself — changes still apply on a manual refresh.

**Check the WebSocket:** DevTools → **Network** → **WS** filter → confirm `_next/webpack-hmr` reaches `101 Switching Protocols`.

> The code-server in-browser **Ports** panel does not create a real localhost tunnel — it just generates proxy URLs. For native HMR, open a real SSH tunnel from your own machine: `ssh -L 3000:localhost:3000 user@host`, then use [http://localhost:3000](http://localhost:3000).

## Optional — hardening the config

When `NEXT_PUBLIC_BASE_DEV_URL` is unset, `allowedDevOrigins` becomes `[""]`. It's harmless but messy; to filter empty values:

```ts
const devOrigins = [process.env.NEXT_PUBLIC_BASE_DEV_URL]
  .filter((v): v is string => Boolean(v && v.trim()));

const nextConfig: NextConfig = {
  ...(hasBasePath && { basePath, assetPrefix: basePath }),
  ...(devOrigins.length > 0 && { allowedDevOrigins: devOrigins }),
  // ...redirects
};
```