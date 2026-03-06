import { useState } from "react";
import { Search, Plus, Eye, TrendingUp, Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Sale {
  id: string;
  orderNumber: string;
  date: string;
  customer: string;
  products: number;
  total: number;
  status: "completado" | "pendiente" | "cancelado";
}

const mockSales: Sale[] = [
  { id: "1", orderNumber: "ORD-001245", date: "2026-02-04", customer: "María González", products: 3, total: 2599.97, status: "completado" },
  { id: "2", orderNumber: "ORD-001244", date: "2026-02-04", customer: "Carlos Ruiz", products: 1, total: 1199.99, status: "completado" },
  { id: "3", orderNumber: "ORD-001243", date: "2026-02-03", customer: "Ana Martínez", products: 5, total: 1847.45, status: "pendiente" },
  { id: "4", orderNumber: "ORD-001242", date: "2026-02-03", customer: "Luis Fernández", products: 2, total: 539.98, status: "completado" },
  { id: "5", orderNumber: "ORD-001241", date: "2026-02-02", customer: "Patricia López", products: 4, total: 3299.96, status: "completado" },
  { id: "6", orderNumber: "ORD-001240", date: "2026-02-02", customer: "Roberto Díaz", products: 1, total: 449.99, status: "cancelado" },
  { id: "7", orderNumber: "ORD-001239", date: "2026-02-01", customer: "Elena Torres", products: 6, total: 2147.94, status: "completado" },
  { id: "8", orderNumber: "ORD-001238", date: "2026-02-01", customer: "Jorge Ramírez", products: 2, total: 899.98, status: "pendiente" },
];

export const Ventas = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = mockSales.filter(
    (sale) =>
      sale.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completado":
        return "default";
      case "pendiente":
        return "secondary";
      case "cancelado":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Ventas</h1>
          <p className="text-muted-foreground">
            Historial y gestión de ventas
          </p>
        </div>

        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Venta
        </Button>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-sm font-medium">
              Total Ventas Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filteredSales.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-sm font-medium">
              Ventas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mockSales.filter((s) => s.status === "pendiente").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder="Buscar por número de orden o cliente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}

      <Card>

        <CardContent className="p-0">

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>N° Orden</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.orderNumber}</TableCell>

                  <TableCell className="text-muted-foreground">
                    {new Date(sale.date).toLocaleDateString("es-ES")}
                  </TableCell>

                  <TableCell>{sale.customer}</TableCell>

                  <TableCell>{sale.products} items</TableCell>

                  <TableCell>
                    ${sale.total.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <Badge variant={getStatusVariant(sale.status)}>
                      {sale.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Button size="icon" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>
  );
}