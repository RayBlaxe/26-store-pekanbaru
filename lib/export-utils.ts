import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface SalesMetrics {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  avgOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  topSellingProducts: Array<{
    id: string
    name: string
    soldQty: number
    revenue: number
  }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: string
    total: number
    status: string
    date: string
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export const exportToPDF = (metrics: SalesMetrics, dateRange: string) => {
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    let currentY = 20
    
    // Header
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text('Sales Report & Analytics', pageWidth / 2, currentY, { align: 'center' })
    currentY += 15
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Period: ${dateRange}`, pageWidth / 2, currentY, { align: 'center' })
    currentY += 8
    doc.text(`Generated on: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, currentY, { align: 'center' })
    currentY += 20
    
    // Key Metrics Section
    doc.setFontSize(16)
    doc.setTextColor(40, 40, 40)
    doc.text('Key Metrics', 14, currentY)
    currentY += 15
    
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }
    
    // Key metrics as text (simpler approach)
    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    
    doc.text(`Total Revenue: ${formatPrice(metrics.totalRevenue)} (${metrics.revenueGrowth >= 0 ? '+' : ''}${metrics.revenueGrowth}%)`, 14, currentY)
    currentY += 8
    doc.text(`Total Orders: ${metrics.totalOrders} (${metrics.ordersGrowth >= 0 ? '+' : ''}${metrics.ordersGrowth}%)`, 14, currentY)
    currentY += 8
    doc.text(`Average Order Value: ${formatPrice(metrics.avgOrderValue)}`, 14, currentY)
    currentY += 8
    doc.text(`Total Customers: ${metrics.totalCustomers}`, 14, currentY)
    currentY += 20
    
    // Top Selling Products
    if (metrics.topSellingProducts.length > 0) {
      doc.setFontSize(16)
      doc.setTextColor(40, 40, 40)
      doc.text('Top Selling Products', 14, currentY)
      currentY += 15
      
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      
      metrics.topSellingProducts.slice(0, 10).forEach((product, index) => {
        doc.text(`${index + 1}. ${product.name} - ${product.soldQty} units - ${formatPrice(product.revenue)}`, 14, currentY)
        currentY += 6
      })
      currentY += 15
    }
    
    // Recent Orders
    if (metrics.recentOrders.length > 0) {
      doc.setFontSize(16)
      doc.setTextColor(40, 40, 40)
      doc.text('Recent Orders', 14, currentY)
      currentY += 15
      
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      
      metrics.recentOrders.slice(0, 10).forEach((order) => {
        const orderDate = new Date(order.date).toLocaleDateString('id-ID')
        doc.text(`#${order.orderNumber} - ${order.customer} - ${formatPrice(order.total)} - ${order.status} - ${orderDate}`, 14, currentY)
        currentY += 6
        
        // Check if we need a new page
        if (currentY > 270) {
          doc.addPage()
          currentY = 20
        }
      })
      currentY += 15
    }
    
    // Monthly Revenue
    if (metrics.monthlyRevenue.length > 0) {
      if (currentY > 200) {
        doc.addPage()
        currentY = 20
      }
      
      doc.setFontSize(16)
      doc.setTextColor(40, 40, 40)
      doc.text('Monthly Revenue Trend', 14, currentY)
      currentY += 15
      
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      
      metrics.monthlyRevenue.forEach((month) => {
        doc.text(`${month.month}: ${formatPrice(month.revenue)} (${month.orders} orders)`, 14, currentY)
        currentY += 6
      })
    }
    
    // Save the PDF
    const fileName = `sales-report-${dateRange.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    return true
  } catch (error) {
    console.error('PDF Export Error:', error)
    throw error
  }
}

export const exportToExcel = (metrics: SalesMetrics, dateRange: string) => {
  const workbook = XLSX.utils.book_new()
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }
  
  // Summary Sheet
  const summaryData = [
    ['Sales Report & Analytics'],
    [`Period: ${dateRange}`],
    [`Generated on: ${new Date().toLocaleDateString('id-ID')}`],
    [''],
    ['Key Metrics'],
    ['Metric', 'Value', 'Growth'],
    ['Total Revenue', formatPrice(metrics.totalRevenue), `${metrics.revenueGrowth >= 0 ? '+' : ''}${metrics.revenueGrowth}%`],
    ['Total Orders', metrics.totalOrders, `${metrics.ordersGrowth >= 0 ? '+' : ''}${metrics.ordersGrowth}%`],
    ['Average Order Value', formatPrice(metrics.avgOrderValue), '-'],
    ['Total Customers', metrics.totalCustomers, '-']
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
  
  // Top Products Sheet
  const productsData = [
    ['Top Selling Products'],
    [''],
    ['Rank', 'Product Name', 'Units Sold', 'Revenue'],
    ...metrics.topSellingProducts.map((product, index) => [
      index + 1,
      product.name,
      product.soldQty,
      formatPrice(product.revenue)
    ])
  ]
  
  const productsSheet = XLSX.utils.aoa_to_sheet(productsData)
  XLSX.utils.book_append_sheet(workbook, productsSheet, 'Top Products')
  
  // Recent Orders Sheet
  const ordersData = [
    ['Recent Orders'],
    [''],
    ['Order Number', 'Customer', 'Total', 'Status', 'Date'],
    ...metrics.recentOrders.map(order => [
      order.orderNumber,
      order.customer,
      formatPrice(order.total),
      order.status,
      new Date(order.date).toLocaleDateString('id-ID')
    ])
  ]
  
  const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData)
  XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Recent Orders')
  
  // Monthly Revenue Sheet
  if (metrics.monthlyRevenue.length > 0) {
    const monthlyData = [
      ['Monthly Revenue Trend'],
      [''],
      ['Month', 'Revenue', 'Orders'],
      ...metrics.monthlyRevenue.map(month => [
        month.month,
        formatPrice(month.revenue),
        month.orders
      ])
    ]
    
    const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData)
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Revenue')
  }
  
  // Save the Excel file
  const fileName = `sales-report-${dateRange}-${new Date().toISOString().split('T')[0]}.xlsx`
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(data, fileName)
}
