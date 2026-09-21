import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";

import { LegalDocument } from "@/components/common/LegalDocument";

export const metadata: Metadata = {
  title: "오픈소스 및 출처 | IInfo DX",
};

export default async function AttributionPage() {
  const content = await readFile(
    join(process.cwd(), "docs", "legal", "attribution.md"),
    "utf8",
  );

  return <LegalDocument content={content} />;
}
