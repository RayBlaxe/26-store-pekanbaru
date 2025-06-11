import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "26 Store Pekanbaru - E-Commerce Olahraga",
  description: "Ingat Olahraga Ingat 26 Store Pekanbaru",
  generator: "aza-dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
