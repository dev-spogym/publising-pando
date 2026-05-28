import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pando V1 Admin Prototype",
  description: "docs4/V1 기반 Next.js + shadcn/ui 정적 Admin 퍼블리싱"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* admin-pando 폰트: Pretendard CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
