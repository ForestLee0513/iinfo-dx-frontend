import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";

import { LegalDocument } from "@/components/common/LegalDocument";

export const metadata: Metadata = {
  title: "이용약관 | IInfo DX",
};

export default async function TermsPage() {
  const content = await readFile(
    join(process.cwd(), "docs", "legal", "terms.md"),
    "utf8",
  );

  return <LegalDocument content={content} />;
}
