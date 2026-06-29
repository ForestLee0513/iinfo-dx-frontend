import type { NextConfig } from "next";

function resolveBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!raw || !raw.trim()) return "";
  let p = raw.trim();
  if (p === "/") return "";
  if (!p.startsWith("/")) p = "/" + p;
  return p.replace(/\/+$/, "");
}

const basePath = resolveBasePath();
const hasBasePath = basePath !== "";

const nextConfig: NextConfig = {
  ...(hasBasePath && { basePath, assetPrefix: basePath }),
  allowedDevOrigins: [process.env.NEXT_PUBLIC_BASE_DEV_URL ?? ""],

  async redirects() {
    if (!hasBasePath) return [];
    return [
      { source: "/", basePath: false, destination: basePath, permanent: false },
    ];
  },
};

export default nextConfig;
