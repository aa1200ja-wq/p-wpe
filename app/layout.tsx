import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Private Web Page Editor",
  description: "通用視覺網站編輯器",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
