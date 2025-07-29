"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, X, Search, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchBar } from "@/components/ui/search-bar";
import { useProductStore } from "@/stores/product.store";
import Image from "next/image";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Keranjang", href: "/cart" },
  { name: "Pesanan", href: "/orders" },
  { name: "Profil", href: "/profile" },
];

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { setSearchQuery } = useProductStore();

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Only redirect to products page when user actually searches (not empty queries)
    if (query.trim() && pathname !== '/products') {
      window.location.href = '/products';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Image src="/icon.png" alt="logo" width={100} height={32} />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search, Cart and User */}
            <div className="hidden md:flex items-center space-x-4">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Cari produk..."
              />
              
              <CartDrawer />
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-foreground">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Dasbor
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent">
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                    <Link href="/register">Daftar</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile cart and menu */}
            <div className="flex items-center space-x-2 md:hidden">
              <CartDrawer />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="text-muted-foreground hover:bg-accent"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-50 md:hidden ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-64 bg-secondary p-4">
            <div className="flex items-center justify-between mb-8">
              <span className="text-foreground font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Cari produk..."
              />
            </div>
            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-foreground hover:text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">{children}</main>
    </div>
  );
}
