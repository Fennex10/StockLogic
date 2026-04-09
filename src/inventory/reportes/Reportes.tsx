import { useState, useMemo } from "react";
import { Download, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import type { Sale } from "@/interface/sales/sale.interface";
import { useSales } from "../ventas/hooks/useSales";
import { useProducts } from "../productos/hooks/useProducts";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { exportReportPDF } from "@/lib/exportToPdf";

// Tipos auxiliares corregidos
type ChartData = { week: string; ventas: number; };
type TopProduct = { name: string; ventas: number; ingresos: number; };
type LowRotation = { name: string; ventas: number; ultimaVenta: string; };

export const Reportes = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState(firstDay.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split("T")[0]);

  const { data: salesDataHook, isLoading } = useSales();
  const { data: productsData } = useProducts();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const salesList: Sale[] = salesDataHook?.data?.sales ?? [];
  // const stats = salesDataHook?.data.stats;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const productList = productsData?.data ?? [];

  

  const isInvalidRange = new Date(startDate) > new Date(endDate);

  const filteredSales: Sale[] = useMemo(() => {
    return salesList.filter((s) => {
      const date = new Date(s.registerDate);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }, [salesList, startDate, endDate]);

  const salesChartData: ChartData[] = useMemo(() => {
    return filteredSales.reduce<ChartData[]>((acc, sale) => {
      const date = new Date(sale.registerDate);
      const week = `Sem ${Math.ceil(date.getDate() / 7)}`;
      const existing = acc.find((item) => item.week === week);
      if (existing) { existing.ventas += sale.totalPrice; } 
      else { acc.push({ week, ventas: sale.totalPrice }); }
      return acc;
    }, []);
  }, [filteredSales]);

  const topProducts: TopProduct[] = useMemo(() => {
    const grouped = filteredSales.reduce<Record<string, TopProduct>>((acc, sale) => {
      const key = sale.productId;
      if (!acc[key]) {
        acc[key] = { name: sale.Product.name, ventas: 0, ingresos: 0 };
      }
      acc[key].ventas += sale.quantity;
      acc[key].ingresos += sale.totalPrice;
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => b.ventas - a.ventas).slice(0, 5);
  }, [filteredSales]);

  const lowRotation: LowRotation[] = useMemo(() => {
    return productList.map((product) => {
      const productSales = filteredSales.filter((s) => s.productId === product.id);
      const lastSale = productSales.map((s) => new Date(s.registerDate)).sort((a, b) => b.getTime() - a.getTime())[0];
      
      const daysAgo = lastSale ? Math.floor((Date.now() - lastSale.getTime()) / (1000 * 60 * 60 * 24)) : null;
      return {
        name: product.name,
        ventas: productSales.length,
        ultimaVenta: lastSale ? `Hace ${daysAgo} días` : "Sin ventas",
      };
    }).sort((a, b) => a.ventas - b.ventas).slice(0, 4);
  }, [filteredSales, productList]);

  if (isLoading) return <CustomFullScreenLoading />;

  return (
    <div id="report-container" className="max-w-[1200px] mx-auto space-y-8 p-6 animate-fade-in">

      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 p-3 rounded-2xl flex flex-wrap items-center gap-3 shadow-sm">
     {/* Contenedor de Rango de Fechas */}
      <div className="flex items-center gap-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-1.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
        <div className="flex items-center gap-2 border-r border-zinc-100 dark:border-zinc-800 pr-3">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Rango</span>
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="bg-transparent border-none text-sm font-medium focus:outline-none dark:color-scheme-dark w-[120px]" 
          />
          <span className="text-zinc-400 text-xs font-bold">→</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="bg-transparent border-none text-sm font-medium focus:outline-none dark:color-scheme-dark w-[120px]" 
          />
        </div>

        <button 
          onClick={() => {/* Tu lógica de aplicar */}}
          disabled={isInvalidRange}
          className="ml-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 disabled:opacity-40 transition-colors uppercase tracking-tight"
        >
          Aplicar
        </button>
      </div>

      {/* Botón de Exportar con estilo Moderno */}
      <Button 
        onClick={() => exportReportPDF({ startDate, endDate, salesChartData, topProducts, lowRotation })}
        className="ml-auto rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 bg-primary shadow-md hover:shadow-lg transition-all active:scale-[0.98] h-10 px-5"
      >
        <Download className="mr-2 h-4 w-4 stroke-[2.5px]" /> 
        <span className="font-semibold text-sm">Exportar Reporte</span>
      </Button>
    </div>

  <Card className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden">
   <CardHeader className="pb-2">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <CardTitle className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Ventas por Semana
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
          Tendencia de ingresos en el período seleccionado
        </CardDescription>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg text-[11px] border border-emerald-100 dark:border-emerald-500/20">
          <TrendingUp className="h-3 w-3" /> +68.4%
        </div>
        <span className="text-[10px] text-zinc-400 font-medium">vs. mes anterior</span>
      </div>
    </div>
  </CardHeader>

  <CardContent className="h-[320px] px-2 pb-6">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        
       
        <CartesianGrid 
          strokeDasharray="4 4" 
          vertical={false} 
          stroke="currentColor" 
          className="text-zinc-100 dark:text-zinc-800/50" 
        />
        
        <XAxis 
          dataKey="week" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fontWeight: 500 }}
          className="fill-zinc-400 dark:fill-zinc-500"
          dy={10} 
        />
        
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fontWeight: 500 }}
          className="fill-zinc-400 dark:fill-zinc-500"
          tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`} 
        />

        <Tooltip
          cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-2xl">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-1">
                    {payload[0].payload.week}
                  </p>
                  <p className="text-sm font-black text-zinc-900 dark:text-white">
                    ${new Intl.NumberFormat().format(payload[0].value as number)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />

        <Area
          type="monotone"
          dataKey="ventas"
          stroke="#6366f1"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorSales)"
          activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
          isAnimationActive={true}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

      {/* BOTTOM SECTION: TOP PRODUCTS & LOW ROTATION */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
        
        {/* Top Products Chart */}
        {/* <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">Top Productos Más Vendidos</CardTitle>
            <CardDescription>Productos con mayor demanda</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }} >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11}} width={120} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} contentStyle={{borderRadius: '10px'}} />
                <Bar dataKey="ventas" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={32} isAnimationActive={false}>
                  {topProducts.map((_, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Low Rotation List */}
        {/* <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">Productos con Baja Rotación</CardTitle>
            <CardDescription>Productos que necesitan estrategias de venta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {lowRotation.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border/40 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-black dark:bg-rose-500/10">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">{p.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{p.ultimaVenta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-rose-500 font-bold text-sm">
                    <ArrowDownRight className="h-4 w-4" /> {p.ventas} ventas
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

      {/* </div> */}

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white">
  
  {/* Top Productos - Gráfica con Barras Robustas */}
  <Card className="rounded-[2rem] border border-zinc-100 shadow-sm bg-white overflow-hidden">
    <CardHeader className="pb-4">
      <CardTitle className="text-xl font-bold tracking-tight text-zinc-900">Top Productos Más Vendidos</CardTitle>
      <CardDescription className="text-sm text-zinc-500">Productos con mayor demanda</CardDescription>
    </CardHeader>
    <CardContent className="h-[320px] pt-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={topProducts} 
          layout="vertical" 
          margin={{ left: 40, right: 30, top: 10, bottom: 10 }}
        >
          {/* Líneas de referencia sutiles como en la imagen 2 */}
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          
          <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a1a1aa'}} />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fontWeight: 600, fill: '#4b5563'}} 
            width={110}
          />
          <Tooltip 
            cursor={{fill: '#f8fafc'}} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Bar 
            dataKey="ventas" 
            fill="#4f46e5" 
            radius={[6, 6, 6, 6]} 
            barSize={38} // Barras más gruesas como en la imagen
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  {/* Productos Baja Rotación - Lista Refinada */}
  <Card className="rounded-[2rem] border border-zinc-100 shadow-sm bg-white overflow-hidden">
    <CardHeader className="pb-4">
      <CardTitle className="text-xl font-bold tracking-tight text-zinc-900">Productos con Baja Rotación</CardTitle>
      <CardDescription className="text-sm text-zinc-500">Estrategias de venta necesarias</CardDescription>
    </CardHeader>
    <CardContent className="px-6">
      <div className="flex flex-col gap-3">
        {lowRotation.map((p, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between p-4 rounded-2xl border border-zinc-50 bg-white hover:shadow-md hover:shadow-zinc-100 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-rose-50/50 text-rose-500 text-sm font-bold border border-rose-100/50">
                {i + 1}
              </div>
              <div className="flex flex-col">
                <h4 className="text-[15px] font-bold text-zinc-800 leading-tight">{p.name}</h4>
                <p className="text-[12px] text-zinc-400 font-medium">Hace {p.ultimaVenta.replace('Hace ', '')}</p> 
                {/* .replace para evitar el "Hace Hace" si ya viene incluido en el string */}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-rose-500 font-bold text-[14px]">
              <TrendingDown className="h-4 w-4 opacity-80" />
              <span>{p.ventas} ventas</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>

</div>

    </div>
  );
};
