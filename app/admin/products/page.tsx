"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Sepatu Futsal Specs Metasala",
    price: "Rp. 500.000",
    quantity: 50,
    status: "Tersedia",
  },
  {
    id: 2,
    name: "Sepatu Bola Ortuseight",
    price: "Rp. 350.000",
    quantity: 30,
    status: "Tersedia",
  },
  {
    id: 3,
    name: "Bola Futsal",
    price: "Rp. 250.000",
    quantity: 25,
    status: "Tersedia",
  },
  {
    id: 4,
    name: "Jersey Apparel",
    price: "Rp. 150.000",
    quantity: 50,
    status: "Tersedia",
  },
  {
    id: 5,
    name: "Tas Sport",
    price: "Rp. 100.000",
    quantity: 40,
    status: "Tersedia",
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Data Produk</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search Produk"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Info Banner */}
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
          Data yang ada di tabel ini adalah 5 produk pertama
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">No</TableHead>
                <TableHead className="font-semibold text-gray-900">Nama Barang</TableHead>
                <TableHead className="font-semibold text-gray-900">Harga Jual</TableHead>
                <TableHead className="font-semibold text-gray-900">Jumlah</TableHead>
                <TableHead className="font-semibold text-gray-900">Opsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="font-semibold">{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 text-xs">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}
