import { useState } from "react";
import { Calendar, Download, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { week: "Sem 1", ventas: 12500 },
  { week: "Sem 2", ventas: 15800 },
  { week: "Sem 3", ventas: 18200 },
  { week: "Sem 4", ventas: 21000 },
];

const topProducts = [
  { name: "iPhone 15 Pro Max", ventas: 142, ingresos: 170278 },
  { name: "Laptop HP Pavilion", ventas: 89, ingresos: 80099 },
  { name: "Samsung Galaxy S24", ventas: 76, ingresos: 98799 },
  { name: "Monitor LG 34\"", ventas: 64, ingresos: 35199 },
  { name: "iPad Pro 12.9\"", ventas: 58, ingresos: 63779 },
];

const lowRotation = [
  { name: "Adaptador USB-C", ventas: 3, ultimaVenta: "Hace 45 días" },
  { name: "Cable HDMI 3m", ventas: 5, ultimaVenta: "Hace 38 días" },
  { name: "Soporte Laptop", ventas: 7, ultimaVenta: "Hace 32 días" },
  { name: "Hub USB 7 puertos", ventas: 8, ultimaVenta: "Hace 28 días" },
];

export const Reportes = () => {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-31");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground">
            Análisis estadístico de ventas e inventario
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 animate-slide-up">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Rango de fechas:</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-auto"
          />
          <span className="text-muted-foreground">a</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-auto"
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90">Aplicar</Button>
      </div>

      {/* Sales Chart */}
      <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Ventas por Semana
            </h3>
            <p className="text-sm text-muted-foreground">
              Tendencia de ventas en el período seleccionado
            </p>
          </div>
          <div className="flex items-center gap-2 text-success">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">+68%</span>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="week"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
                // formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
              />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Top Productos Más Vendidos
            </h3>
            <p className="text-sm text-muted-foreground">
              Productos con mayor demanda
            </p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  // formatter={(value: number, name: string) => [
                  //   name === "ventas" ? `${value} unidades` : `$${value.toLocaleString()}`,
                  //   name === "ventas" ? "Ventas" : "Ingresos"
                  // ]}
                />
                <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Rotation Products */}
        <div className="rounded-2xl border border-border bg-card p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Productos con Baja Rotación
            </h3>
            <p className="text-sm text-muted-foreground">
              Productos que necesitan estrategias de venta
            </p>
          </div>
          <div className="space-y-4">
            {lowRotation.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.ultimaVenta}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-destructive">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-semibold">{product.ventas} ventas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
