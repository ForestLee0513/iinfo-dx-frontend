import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";

import { LegalDocument } from "@/components/common/LegalDocument";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | IInfo DX",
};

export default async function PrivacyPage() {
  const content = await readFile(
    join(process.cwd(), "docs", "legal", "privacy-consent.md"),
    "utf8",
  );

  return <LegalDocument content={content} />;
}
