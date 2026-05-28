import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pando V1 Admin Prototype",
  description: "docs4/V1 기반 Next.js + shadcn/ui 정적 Admin 퍼블리싱"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
