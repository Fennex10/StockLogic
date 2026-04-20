import { Package, TrendingDown, ShoppingCart, DollarSign,
} from "lucide-react"
import { StatCard } from "@/inventory/dashboard/components/StatCard"
import { AlertCard } from "@/inventory/dashboard/components/AlertCard"
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card"
import { useProducts } from "@/inventory/productos/hooks/useProducts"
import { useSales } from "@/inventory/ventas/hooks/useSales"
import { useCategories } from "@/inventory/categories/hooks/useCategories"
import type { Sale } from "@/interface/sales/sale.interface"

export const Dashboard = () => {  
  
  const {data: products} = useProducts();
  const {data: sales} = useSales();
  const {data: categories} = useCategories();

  const productsList = products?.data ?? [];

  const categoriesList = categories?.data ?? [];
  const stats = sales?.data?.stats;

  const totalRevenue = stats?.totalRevenue ?? 0;
 const monthlySales = stats?.currentMonthSalesCount ?? 0;
  
  const topProductsData = productsList.map(p => ({
      product: p.name,
      cantidad: p.currentStock
   })).sort((a, b) => b.cantidad - a.cantidad); 
   

   const inventoryData = categoriesList.map(c => {
    const totalStock = productsList
      .filter(p => p.categoryId === c.id) // productos de esa categoría
      .reduce((acc, p) => acc + (p.currentStock || 0), 0); // suma de stock

    return {
      category: c.name,
      stock: totalStock
    };
  });

  const lowStockAlerts = productsList
    .filter(p => (p.currentStock ?? 0) <= (p.minStock ?? 0))
    .map(p => ({
      id: p.id,
      productName: p.name,
      currentStock: p.currentStock,
      minStock: p.minStock
    }));
   
    //Ventas Grafica 
    const salesList: Sale[] = Array.isArray(sales?.data?.sales)
  ? sales.data.sales
  : [];

    const currentYear = new Date().getFullYear();

    // Filtrar ventas válidas
    const filteredSales = salesList.filter(s => {
      const date = new Date(s.registerDate);
      return (
        s.isCompleted &&
        date.getFullYear() === currentYear
      );
    });

    // Agrupar por mes
    const salesByMonth: Record<string, { ventas: number; ingresos: number }> = {};

    filteredSales.forEach(s => {
      const date = new Date(s.registerDate);

      const month = date.toLocaleString("es-ES", { month: "short" }); // ene, feb...

      if (!salesByMonth[month]) {
        salesByMonth[month] = {
          ventas: 0,
          ingresos: 0,
        };
      }

      salesByMonth[month].ventas += s.quantity;
      salesByMonth[month].ingresos += s.totalPrice;
    });

    // Convertir a array
    const salesData = Object.entries(salesByMonth).map(([month, data]) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1), // Ene
      ventas: data.ventas,
      ingresos: data.ingresos,
    }));

    // Orden correcto de meses
    const monthOrder = [
      "Ene","Feb","Mar","Abr","May","Jun",
      "Jul","Ago","Sep","Oct","Nov","Dic"
    ];

    const salesDataSorted = salesData.sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

  return (
    // <div className="p-6 space-y-6">
    <div className="space-y-6 animate-fade-in">
    

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value={productsList.length}
          change="Inventario disponible"
          changeType="positive"
          icon={Package}
        />
        <StatCard
          title="Stock Bajo"
          value={lowStockAlerts.length.toString()}
          change="Requiere atención"
          changeType="negative"
          icon={TrendingDown}
        />
        <StatCard
          title="Ventas del Mes"
          value={monthlySales}
          change="Ventas registradas este mes"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatCard
          title="Ingresos del Mes"
           value={totalRevenue.toLocaleString()}
          change="Rendimiento financiero"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Tendencia de Ventas e Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesDataSorted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                
                <YAxis yAxisId="left" />
                
                <YAxis yAxisId="right" orientation="right" hide={true} />
                
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="right" 
                  type="monotone"
                  dataKey="ventas"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Unidades vendidas"
                />
                <Area
                  yAxisId="left" 
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
                {/* <YAxis dataKey="product" type="category" width={130} /> */}
                <YAxis 
                    dataKey="product" 
                    type="category" 
                    width={170} 
                    interval={0} 
                  />
                <Tooltip />
                <Bar
                  dataKey="cantidad"
                  fill="var(--primary)"
                  radius={[0, 8, 8, 0]}
                 barSize={50}
                />
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

                <Bar
                  dataKey="stock"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                   barSize={70}
                />
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
