import {
  Package,
  TrendingDown,
  ShoppingCart,
  DollarSign,
} from "lucide-react"

import { StatCard } from "@/inventory/dashboard/components/StatCard"
import { AlertCard } from "@/inventory/dashboard/components/AlertCard"

import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

// Mock Data

const salesData = [
  { month: "Ene", ventas: 45000, ingresos: 52000 },
  { month: "Feb", ventas: 52000, ingresos: 61000 },
  { month: "Mar", ventas: 48000, ingresos: 55000 },
  { month: "Abr", ventas: 61000, ingresos: 71000 },
  { month: "May", ventas: 55000, ingresos: 64000 },
  { month: "Jun", ventas: 67000, ingresos: 78000 },
]

const topProductsData = [
  { product: "Laptop Dell XPS", cantidad: 245 },
  { product: "iPhone 15 Pro", cantidad: 189 },
  { product: 'Monitor LG 27"', cantidad: 167 },
  { product: "Teclado Mecánico", cantidad: 134 },
  { product: "Mouse Logitech", cantidad: 112 },
]

const inventoryData = [
  { category: "Electrónicos", stock: 850 },
  { category: "Accesorios", stock: 1240 },
  { category: "Componentes", stock: 670 },
  { category: "Periféricos", stock: 920 },
  { category: "Audio", stock: 580 },
]

const lowStockAlerts = [
  { id: "1", productName: "Cable HDMI 2m", currentStock: 5, minStock: 20 },
  { id: "2", productName: "Batería Laptop HP", currentStock: 8, minStock: 15 },
  { id: "3", productName: "SSD Samsung 1TB", currentStock: 12, minStock: 25 },
  { id: "4", productName: "RAM DDR4 16GB", currentStock: 6, minStock: 20 },
  { id: "5", productName: "Webcam Logitech", currentStock: 4, minStock: 15 },
]

export const Dashboard = () => {  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {/* <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de tu inventario y ventas
        </p>
      </div> */}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value="1,247"
          change="+12% vs mes anterior"
          changeType="positive"
          icon={Package}
        />
        <StatCard
          title="Stock Bajo"
          value="23"
          change="Requiere atención"
          changeType="negative"
          icon={TrendingDown}
        />
        <StatCard
          title="Ventas del Mes"
          value="892"
          change="+8.2% vs mes anterior"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatCard
          title="Ingresos del Mes"
          value="$67,000"
          change="+15.3% vs mes anterior"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Tendencia de Ventas e Ingresos</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Ventas"
                />

                <Area
                  type="monotone"
                  dataKey="ingresos"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Ingresos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" width={130} />
                <Tooltip />

                <Bar
                  dataKey="cantidad"
                  fill="var(--primary)"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory */}
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle>
              Estado del Inventario por Categoría
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="stock"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts */}
        <div>
          <AlertCard alerts={lowStockAlerts} />
        </div>
      </div>
    </div>
  )
}
