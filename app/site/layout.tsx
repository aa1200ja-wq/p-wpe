import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "網站預覽",
  description: "Private Web Page Editor 前台預覽",
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
