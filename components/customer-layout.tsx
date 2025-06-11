"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface CustomerLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Keranjang", href: "/cart" },
  { name: "Pesanan", href: "/orders" },
  { name: "Profil", href: "/profile" },
]

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">26</span>
              </div>
              <span className="text-white font-semibold">STORE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href ? "text-blue-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                  {item.name === "Keranjang" && <Badge className="ml-1 bg-red-600 text-white">3</Badge>}
                </Link>
              ))}
            </nav>

            {/* Search and User */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Cari produk..."
                  className="pl-10 w-64 bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
                <User className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:bg-slate-800 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`fixed inset-0 z-50 md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-slate-900 p-4">
            <div className="flex items-center justify-between mb-8">
              <span className="text-white font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href ? "text-blue-400" : "text-gray-300 hover:text-white"
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
      <main>{children}</main>
    </div>
  )
}
