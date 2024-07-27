import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Bili Image Uploader - Bilibili 图床在线上传器",
  description: "Bilibili 图床在线上传器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
