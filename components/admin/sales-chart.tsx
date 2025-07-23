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
    orders: number
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
        label: "Sales (Rp)",
        data: data.map((item) => item.sales),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: "Orders",
        data: data.map((item) => item.orders),
        borderColor: "hsl(var(--secondary))",
        backgroundColor: "hsl(var(--secondary) / 0.1)",
        tension: 0.3,
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
              return `Sales: Rp ${context.parsed.y.toLocaleString('id-ID')}`
            }
            return `Orders: ${context.parsed.y}`
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales (Rp)'
        },
        ticks: {
          callback: function(value) {
            return 'Rp ' + Number(value).toLocaleString('id-ID')
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Orders'
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
        <CardTitle>Sales Overview</CardTitle>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
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