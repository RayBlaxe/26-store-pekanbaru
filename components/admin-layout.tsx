"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Users,
  UserCog,
  ShoppingCart,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Data Produk", href: "/admin/products", icon: Package },
  { name: "Entry Penjualan", href: "/admin/sales", icon: ShoppingCart },
  { name: "Pelanggan", href: "/admin/customers", icon: Users },
  { name: "Admin", href: "/admin/admins", icon: UserCog },
  { name: "Laporan", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed left-0 top-0 h-full w-64 bg-secondary p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Image src="/icon.png" alt="logo" width={128} height={32} />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 bg-secondary lg:px-4 lg:py-6">
        <div className="flex items-center space-x-2">
          <Image src="/icon.png" alt="logo" width={128} height={32} />
        </div>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-4 right-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-secondary px-4 py-3 lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-foreground hover:bg-accent lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-foreground text-sm">Hi, Admin!</span>
            <div className="w-8 h-8 bg-muted rounded-full"></div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
