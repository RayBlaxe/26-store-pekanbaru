"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"

const salesReport = [
  {
    id: 1,
    customer: "Achmad",
    amount: "Rp. 500.000",
    date: "2023-07-23",
    status: "Sudah kirim balik",
  },
  {
    id: 2,
    customer: "Wahyudi",
    amount: "Rp. 350.000",
    date: "2023-07-22",
    status: "Sudah kirim balik",
  },
  {
    id: 3,
    customer: "Fauzan",
    amount: "Rp. 300.000",
    date: "2023-07-21",
    status: "Sudah kirim balik",
  },
  {
    id: 4,
    customer: "Miko",
    amount: "Rp. 150.000",
    date: "2023-07-20",
    status: "Dibatalkan",
  },
  {
    id: 5,
    customer: "Zaki",
    amount: "Rp. 100.000",
    date: "2023-07-19",
    status: "Dibatalkan",
  },
]

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [status, setStatus] = useState("")

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Laporan Penjualan</h1>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-slate-700 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-4">Laporan Semua Penjualan</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal mulai</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal selesai</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="completed">Sudah kirim balik</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">Filter</Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">No</TableHead>
                <TableHead className="font-semibold text-gray-900">Nama Pelanggan</TableHead>
                <TableHead className="font-semibold text-gray-900">Jumlah</TableHead>
                <TableHead className="font-semibold text-gray-900">Tanggal</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesReport.map((report, index) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{report.customer}</TableCell>
                  <TableCell className="font-semibold">{report.amount}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={report.status === "Sudah kirim balik" ? "default" : "destructive"}
                      className={report.status === "Sudah kirim balik" ? "bg-green-100 text-green-800" : ""}
                    >
                      {report.status}
                    </Badge>
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
