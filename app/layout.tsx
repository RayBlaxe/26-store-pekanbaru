import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import Script from "next/script";

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
      <body>
        <Providers>
          {children}
        </Providers>
        
        {/* Midtrans Snap Script */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
