import "@/styles/globals.css";

import type { Metadata } from "next";
import { pretendard, pretendardJP } from "@/styles/fonts";
import { Toaster } from "@forestlee0513/iinfo-dx-design-system";

import { Header } from "@/components/Header";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "IInfo DX",
  description: "A tool to help analyze IIDX skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
