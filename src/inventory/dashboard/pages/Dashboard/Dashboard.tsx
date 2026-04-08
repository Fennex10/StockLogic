import { useMemo } from "react"
import { Package, TrendingDown, ShoppingCart, DollarSign } from "lucide-react"
import { useSales } from "@/inventory/ventas/hooks/useSales"
import { useProducts } from "@/inventory/productos/hooks/useProducts"
import { useCategories } from "@/inventory/categories/hooks/useCategories"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading"
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
  Cell,
} from "recharts"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import type { Sale } from "@/interface/sales/sale.interface"
import type { Product } from "@/interface/products/product.interface"

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export const Dashboard = () => {
  const { data: salesResponse, isLoading: isLoadingSales } = useSales()
  const { data: productsResponse, isLoading: isLoadingProducts } = useProducts()
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useCategories()

  const salesList: Sale[] = Array.isArray(salesResponse?.data?.sales)
    ? salesResponse.data.sales
    : []

  const productsList: Product[] = productsResponse?.data ?? []
  const categoriesList = categoriesResponse?.data ?? []

  const currentMonthIndex = new Date().getMonth()

  const totalProducts = productsList.length
  const lowStockProducts = useMemo(
    () =>
      productsList
        .filter((product) => product.currentStock <= product.minStock)
        .sort((a, b) => a.currentStock - b.currentStock),
    [productsList]
  )

  const lowStockCount = lowStockProducts.length
  const totalRevenue =
    salesResponse?.data?.stats?.totalRevenue ??
    salesList.reduce((sum, sale) => sum + sale.totalPrice, 0)
  const totalCompleted =
    salesResponse?.data?.stats?.totalCompleted ??
    salesList.filter((sale) => sale.isCompleted).length
  const monthlySalesCount =
    salesResponse?.data?.stats?.currentMonthSalesCount ??
    salesList.filter(
      (sale) => new Date(sale.registerDate).getMonth() === currentMonthIndex
    ).length

  const monthlyRevenue = useMemo(
    () =>
      salesList
        .filter((sale) => new Date(sale.registerDate).getMonth() === currentMonthIndex)
        .reduce((sum, sale) => sum + sale.totalPrice, 0),
    [salesList, currentMonthIndex]
  )

  const salesTrendData = useMemo(() => {
    const period = Array.from({ length: 6 }, (_, offset) => {
      const date = new Date()
      date.setMonth(currentMonthIndex - (5 - offset))
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      return {
        key: monthKey,
        month: monthNames[date.getMonth()],
        ventas: 0,
        ingresos: 0,
      }
    })

    const lookup = new Map(period.map((item) => [item.key, item]))

    salesList.forEach((sale) => {
      const date = new Date(sale.registerDate)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const target = lookup.get(key)
      if (target) {
        target.ventas += sale.quantity
        target.ingresos += sale.totalPrice
      }
    })

    return Array.from(lookup.values())
  }, [salesList, currentMonthIndex])

  const topProductsData = useMemo(() => {
    const productMap = new Map<string, { product: string; cantidad: number }>()

    salesList.forEach((sale) => {
      const productName = sale.Product?.name ?? "Producto desconocido"
      const existing = productMap.get(productName)
      if (existing) {
        existing.cantidad += sale.quantity
      } else {
        productMap.set(productName, { product: productName, cantidad: sale.quantity })
      }
    })

    return Array.from(productMap.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
  }, [salesList])

  const inventoryData = useMemo(() => {
    const categoryMap = new Map<string, { category: string; stock: number }>()

    productsList.forEach((product) => {
      const categoryName =
        categoriesList.find((category) => category.id === product.categoryId)?.name ??
        "Sin categoría"
      const existing = categoryMap.get(categoryName)
      if (existing) {
        existing.stock += product.currentStock
      } else {
        categoryMap.set(categoryName, {
          category: categoryName,
          stock: product.currentStock,
        })
      }
    })

    return Array.from(categoryMap.values()).sort((a, b) => b.stock - a.stock)
  }, [productsList, categoriesList])

  const lowStockAlerts = useMemo(
    () =>
      lowStockProducts.slice(0, 5).map((product) => ({
        id: product.id,
        productName: product.name,
        currentStock: product.currentStock,
        minStock: product.minStock,
      })),
    [lowStockProducts]
  )

  if (isLoadingSales || isLoadingProducts || isLoadingCategories)
    return <CustomFullScreenLoading />

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value={totalProducts}
          change={`${lowStockCount} con stock bajo`}
          changeType={lowStockCount > 0 ? "negative" : "positive"}
          icon={Package}
        />
        <StatCard
          title="Stock Bajo"
          value={lowStockCount}
          change="Ver alertas"
          changeType="negative"
          icon={TrendingDown}
        />
        <StatCard
          title="Ventas del Mes"
          value={monthlySalesCount}
          change={`$${monthlyRevenue.toLocaleString()} este mes`}
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${totalRevenue.toLocaleString()}`}
          change={`${totalCompleted} ventas completadas`}
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Tendencia de Ventas e Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesTrendData}>
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
                  name="Unidades vendidas"
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

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" width={150} />
                <Tooltip />
                <Bar
                  dataKey="cantidad"
                  fill="var(--primary)"
                  radius={[0, 8, 8, 0]}
                  isAnimationActive={false}
                >
                  {topProductsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.12} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle>Inventario por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div>
          <AlertCard alerts={lowStockAlerts} />
        </div>
      </div>
    </div>
  )
}
