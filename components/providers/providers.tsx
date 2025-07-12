'use client'

import { useState, useEffect } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    );
  }

  return (
    <QueryProvider>
      {children}
      <Toaster />
    </QueryProvider>
  );
}