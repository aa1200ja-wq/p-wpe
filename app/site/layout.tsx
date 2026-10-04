import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "任我行薩克斯風社",
  description: "任我行薩克斯風社官方網站",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
