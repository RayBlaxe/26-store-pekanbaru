"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"

const salesData = [
  {
    id: 1,
    date: "2023-07-23",
    product: "Sepatu Futsal Specs Metasala",
    price: "Rp. 500.000",
    quantity: 5,
    total: "Rp. 2.500.000",
    status: "Selesai",
  },
  {
    id: 2,
    date: "2023-07-22",
    product: "Sepatu Bola Ortuseight",
    price: "Rp. 350.000",
    quantity: 3,
    total: "Rp. 1.050.000",
    status: "Proses",
  },
  {
    id: 3,
    date: "2023-07-21",
    product: "Bola Futsal",
    price: "Rp. 250.000",
    quantity: 2,
    total: "Rp. 500.000",
    status: "Selesai",
  },
]

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Data Barang Terjual</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Penjualan
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search Penjualan"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">No</TableHead>
                <TableHead className="font-semibold text-gray-900">Tanggal</TableHead>
                <TableHead className="font-semibold text-gray-900">Nama Barang</TableHead>
                <TableHead className="font-semibold text-gray-900">Harga Jual/Pcs</TableHead>
                <TableHead className="font-semibold text-gray-900">Jumlah</TableHead>
                <TableHead className="font-semibold text-gray-900">Total</TableHead>
                <TableHead className="font-semibold text-gray-900">Opsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale, index) => (
                <TableRow key={sale.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>{sale.price}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell className="font-semibold">{sale.total}</TableCell>
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
    
  )
}
