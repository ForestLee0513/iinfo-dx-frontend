import "@/styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pretendard, pretendardJP } from "@/styles/fonts";
import { Toaster } from "@/components/ui/sonner";

import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "IInfo DX",
  description: "A tool to help analyze IIDX skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${pretendardJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
