import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ShoppingBag, User, Calendar, Hash, Wallet, ArrowRight, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Sale } from "@/interface/sales/sale.interface";
import type { CreateSale } from "@/interface/sales/create-sale";
import type { ProductsResponse } from "@/interface/products/products.response";
import { mapToCreateSale } from "../mapping/mapSales";

interface Props {
  sale: Sale;
  products: ProductsResponse;
  isPending: boolean;
  onSubmit: (data: Partial<CreateSale>) => Promise<void>;
}

export const SalesForm = ({ sale, products, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      ...mapToCreateSale(sale),
    },
  });

  const watchedProductId = useWatch({ control, name: "productId" });
  const watchedQuantity = useWatch({ control, name: "quantity" }) || 1;
  const [unitPrice, setUnitPrice] = useState<number>(0);

  useEffect(() => {
    const product = products.data?.find((p) => p.id === watchedProductId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnitPrice(product?.price || 0);
  }, [watchedProductId, products.data]);

  const currentTotal = useMemo(() => unitPrice * watchedQuantity, [unitPrice, watchedQuantity]);

  useEffect(() => {
    reset(mapToCreateSale(sale));
  }, [sale, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* 1. PRODUCTO (Ancho completo) */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground ml-1">Producto</Label>
        <div className="relative group">
          <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />
          <select
            {...register("productId", { required: "Obligatorio" })}
            className={cn(
              "w-full h-11 pl-11 pr-4 bg-background border border-input rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none",
              errors.productId && "border-destructive"
            )}
          >
            <option value="">Seleccionar producto...</option>
            {products.data?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. CANTIDAD Y PRECIO UNITARIO (Lado a lado) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground ml-1">Cantidad</Label>
          <div className="relative">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              type="number"
              {...register("quantity", { required: true, min: 1, valueAsNumber: true })}
              className="h-11 pl-10 rounded-xl"
              placeholder="0"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground ml-1">Precio Unitario</Label>
          <div className="relative">
            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              readOnly
              value={unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              className="h-11 pl-10 rounded-xl bg-muted/30 font-mono text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* 3. TOTAL DE LA VENTA */}
      {/* <div className="py-6 px-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col items-center justify-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          TOTAL DE LA VENTA
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary/40">RD$</span>
          <span className="text-6xl font-black tracking-tighter text-primary">
            {currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div> */}

      {/* 3. TOTAL DE LA VENTA */}
      <div className="py-6 px-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col items-center justify-center space-y-1 overflow-hidden">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          TOTAL DE LA VENTA
        </span>
        <div className="flex flex-wrap items-baseline justify-center gap-2 w-full px-2">
          <span className="text-xl md:text-2xl font-bold text-primary/40 shrink-0">RD$</span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-primary break-all text-center leading-none">
            {currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* 4. CLIENTE (Ancho completo) */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground ml-1">Cliente</Label>
        <div className="relative group">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
          <Input
            {...register("clientName", { required: true })}
            className="h-11 pl-10 rounded-xl"
            placeholder="Nombre del cliente"
          />
        </div>
      </div>

  {/* Método de Pago */}
      <div className="grid grid-cols-2 gap-4">
  
        {/* Método de Pago */}
        <div className="space-y-2 min-w-0">
          <Label className="text-[13px] font-medium text-muted-foreground/80 ml-1">
            Método de Pago
          </Label>

          <div className="relative group w-full">
            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors z-10" />

            <Select
              onValueChange={(value) => setValue("paymentMethod", value)}
              defaultValue={sale.paymentMethod || "CASH"}
            >
              <SelectTrigger className="w-full min-w-0 h-12 pl-11 pr-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/10 transition-all">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                <SelectItem value="CASH">Efectivo</SelectItem>
                <SelectItem value="CREDIT CARD">Tarjeta de Crédito</SelectItem>
                <SelectItem value="DEBIT CARD">Tarjeta de Débito</SelectItem>
                <SelectItem value="TRANSFER">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fecha */}
        <div className="space-y-2 min-w-0">
          <Label className="text-[13px] font-medium text-muted-foreground/80 ml-1">
            Fecha
          </Label>

          <div className="relative group w-full">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors z-10" />

            <Input
              type="date"
              {...register("registerDate", { required: true })}
              className="w-full min-w-0 h-12 pl-11 pr-4 rounded-2xl border border-gray-200 bg-white appearance-none focus-visible:ring-2 focus-visible:ring-primary/10 transition-all"
            />
          </div>
        </div>

      </div>

      {/* BOTONES */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground hover:bg-transparent"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex gap-2 font-bold"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Registrar Venta"}
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
};

