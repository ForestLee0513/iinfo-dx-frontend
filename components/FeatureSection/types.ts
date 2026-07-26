import type { ReactNode } from "react";

export type FeatureSectionProps = {
  title: string;
  description: ReactNode;
  note?: ReactNode;
  imagePosition?: "start" | "end";
};
