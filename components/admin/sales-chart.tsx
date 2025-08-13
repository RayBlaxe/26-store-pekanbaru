"use client"

import { useEffect, useRef } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPriceCompact } from "@/lib/utils"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface SalesChartProps {
  data: {
    date: string
    sales: number
    orders_count: number
  }[]
  period: '7d' | '30d' | '90d'
  onPeriodChange: (period: '7d' | '30d' | '90d') => void
  loading?: boolean
}

export function SalesChart({ data, period, onPeriodChange, loading }: SalesChartProps) {
  const chartRef = useRef<ChartJS<"line"> | null>(null)

  const chartData: ChartData<"line"> = {
    labels: data.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString('id-ID', { 
        month: 'short', 
        day: 'numeric' 
      })
    }),
    datasets: [
      {
        label: "Penjualan (Rp)",
        data: data.map((item) => item.sales),
        borderColor: "#2563eb", // blue-600 for strong contrast
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointHitRadius: 20,
        pointBorderWidth: 1,
        tension: 0.3,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: "Pesanan",
        data: data.map((item) => item.orders_count),
        borderColor: "#f59e0b", // amber-500 for contrast against blue
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointHitRadius: 20,
        pointBorderWidth: 1,
        borderDash: [6, 3],
        tension: 0.3,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  }

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Penjualan: ${formatPriceCompact(context.parsed.y as number)}`
            }
            return `Pesanan: ${context.parsed.y}`
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Tanggal'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Penjualan (Rp)'
        },
        ticks: {
          callback: function(value) {
            return formatPriceCompact(Number(value))
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Pesanan'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  }

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ringkasan Penjualan</CardTitle>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 hari terakhir</SelectItem>
            <SelectItem value="30d">30 hari terakhir</SelectItem>
            <SelectItem value="90d">90 hari terakhir</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
