'use client'

import { useState, useEffect, createContext, useContext } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import { AuthContextType } from '@/lib/auth-types'

// SSR-safe fallback auth context
const SSRAuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  fetchUser: async () => {},
  clearError: () => {},
})

function SSRAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SSRAuthContext.Provider value={{
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      fetchUser: async () => {},
      clearError: () => {},
    }}>
      {children}
    </SSRAuthContext.Provider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryProvider>
      {mounted ? (
        <AuthProvider>
          {children}
        </AuthProvider>
      ) : (
        <SSRAuthProvider>
          {children}
        </SSRAuthProvider>
      )}
      <Toaster />
    </QueryProvider>
  );
}