import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "任我行網站編輯器",
  description: "通用 Canva 式網站編輯器測試版",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
