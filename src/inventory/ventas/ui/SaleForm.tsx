import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  ShoppingBag,
  User,
  Calendar,
  Hash,
  Wallet,
  ArrowRight,
  Loader2,
  DollarSign
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
      <div className="py-6 px-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col items-center justify-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          TOTAL DE LA VENTA
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary/40">RD$</span>
          <span className="text-6xl font-black tracking-tighter text-primary">
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

      {/* 5. MÉTODO DE PAGO Y FECHA (Lado a lado) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground ml-1">Método de Pago</Label>
          <div className="relative group">
            <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />
            <Select
              onValueChange={(value) => setValue("paymentMethod", value)}
              defaultValue={sale.paymentMethod || "CASH"}
            >
              <SelectTrigger className="h-11 pl-11 rounded-xl">
                <SelectValue placeholder="Efectivo" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="CASH">Efectivo</SelectItem>
                <SelectItem value="CREDIT_CARD">Tarjeta</SelectItem>
                <SelectItem value="DEBIT_CARD">Tarjeta de Débito</SelectItem>
                <SelectItem value="TRANSFER">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground ml-1">Fecha</Label>
          <div className="relative group">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              type="date"
              {...register("registerDate", { required: true })}
              className="h-11 pl-10 rounded-xl"
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

// import { useEffect, useMemo } from "react";
// import { useForm, useWatch } from "react-hook-form";
// import {
//   ShoppingBag,
//   User,
//   Calendar,
//   Hash,
//   Wallet,
//   ArrowRight,
//   Loader2,

// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";

// import type { Sale } from "@/interface/sales/sale.interface";
// import type { CreateSale } from "@/interface/sales/create-sale";
// import type { ProductsResponse } from "@/interface/products/products.response";
// import { mapToCreateSale } from "../mapping/mapSales";

// interface Props {
//   sale: Sale;
//   products: ProductsResponse;
//   isPending: boolean;
//   onSubmit: (data: Partial<CreateSale>) => Promise<void>;
// }

// export const SalesForm = ({ sale, products, onSubmit, isPending }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     control,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       ...mapToCreateSale(sale),
//     },
//   });

//   // Suscripción a cambios para el cálculo dinámico
//   const watchedProductId = useWatch({ control, name: "productId" });
//   const watchedQuantity = useWatch({ control, name: "quantity" }) || 0;

//   // Cálculo del Total Dinámico
//   const currentTotal = useMemo(() => {
//     const product = products.data?.find((p) => p.id === watchedProductId);
//     const price = product?.price || 0;
//     return price * watchedQuantity;
//   }, [watchedProductId, watchedQuantity, products.data]);

//   useEffect(() => {
//     reset(mapToCreateSale(sale));
//   }, [sale, reset]);

//   const handleFormSubmit = (data: Partial<CreateSale>) => {
//     onSubmit(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 p-1">
//       {/* SECCIÓN: PRODUCTO Y TOTAL */}
//       <div className="flex flex-col gap-6">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
//           {/* Selector de Producto */}
//           <div className="md:col-span-8 space-y-2.5">
//             <Label className="text-xs font-semibold text-muted-foreground/80 ml-1">
//               Producto
//             </Label>
//             <div className="relative">
//               <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
//               <select
//                 {...register("productId", { required: "Selecciona un producto" })}
//                 className={cn(
//                   "w-full h-12 pl-11 pr-4 bg-secondary/30 border border-border/40 rounded-2xl appearance-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-sm outline-none",
//                   errors.productId && "border-destructive/50 ring-destructive/10"
//                 )}
//               >
//                 <option value="">Seleccionar producto...</option>
//                 {products.data?.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name} — RD${p.price.toLocaleString()}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Cantidad */}
//           <div className="md:col-span-4 space-y-2.5">
//             <Label className="text-xs font-semibold text-muted-foreground/80 ml-1">
//               Cantidad
//             </Label>
//             <div className="relative group">
//               <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
//               <Input
//                 type="number"
//                 {...register("quantity", { required: true, min: 1, valueAsNumber: true })}
//                 className={cn(
//                   "h-12 pl-11 rounded-2xl bg-secondary/30 border-border/40 focus-visible:ring-4 focus-visible:ring-primary/5 focus-visible:border-primary/40 transition-all",
//                   errors.quantity && "border-destructive/50"
//                 )}
//                 placeholder="1"
//               />
//             </div>
//           </div>
//         </div>

//         {/* DISPLAY DEL TOTAL (Premium Glassmorphism Style) */}
//         <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent border border-primary/10 p-8 flex flex-col items-center justify-center space-y-1">
//           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
//             Total de la Venta
//           </span>
//           <div className="flex items-center gap-2">
//             <span className="text-xl font-medium text-primary/40">RD$</span>
//             <span className="text-5xl font-extrabold tracking-tighter text-primary">
//               {currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//             </span>
//           </div>
//           {/* Elementos decorativos sutiles */}
//           <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
//           <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
//         </div>
//       </div>

//       {/* INFORMACIÓN ADICIONAL */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
//         {/* Cliente */}
//         <div className="space-y-2.5">
//           <Label className="text-xs font-semibold text-muted-foreground/80 flex items-center gap-2">
//             <User className="h-3.5 w-3.5" /> Cliente
//           </Label>
//           <Input
//             {...register("clientName", { required: true })}
//             className={cn(
//               "h-12 rounded-2xl bg-background border-border/60 focus-visible:ring-4 focus-visible:ring-primary/5 transition-all",
//               errors.clientName && "border-destructive/50"
//             )}
//             placeholder="Nombre del cliente"
//           />
//         </div>

//         {/* Fecha */}
//         <div className="space-y-2.5">
//           <Label className="text-xs font-semibold text-muted-foreground/80 flex items-center gap-2">
//             <Calendar className="h-3.5 w-3.5" /> Fecha
//           </Label>
//           <Input
//             type="date"
//             {...register("registerDate", { required: true })}
//             className={cn(
//               "h-12 rounded-2xl bg-background border-border/60 focus-visible:ring-4 focus-visible:ring-primary/5 transition-all",
//               errors.registerDate && "border-destructive/50"
//             )}
//           />
//         </div>

//         {/* Método de Pago */}
//         <div className="md:col-span-2 space-y-2.5">
//           <Label className="text-xs font-semibold text-muted-foreground/80 flex items-center gap-2">
//             <Wallet className="h-3.5 w-3.5" /> Método de Pago
//           </Label>
//           <Select
//             onValueChange={(value) => setValue("paymentMethod", value)}
//             defaultValue={sale.paymentMethod}
//           >
//             <SelectTrigger className="h-12 rounded-2xl bg-background border-border/60 focus:ring-4 focus:ring-primary/5 transition-all">
//               <SelectValue placeholder="Seleccionar método..." />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl">
//               <SelectItem value="CASH">Efectivo</SelectItem>
//               <SelectItem value="CREDIT_CARD">Tarjeta de Crédito</SelectItem>
//               <SelectItem value="DEBIT_CARD">Tarjeta de Débito</SelectItem>
//               <SelectItem value="TRANSFER">Transferencia Bancaria</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* ACCIONES */}
//       <div className="flex items-center justify-end gap-4 pt-4">
//         <Button
//           type="button"
//           variant="ghost"
//           disabled={isPending}
//           className="rounded-2xl px-6 h-12 text-muted-foreground hover:bg-secondary/50 transition-colors"
//         >
//           Cancelar
//         </Button>
//         <Button
//           type="submit"
//           disabled={isPending}
//           className="rounded-2xl px-10 h-12 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] gap-3 font-semibold"
//         >
//           {isPending ? (
//             <>
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Procesando
//             </>
//           ) : (
//             <>
//               Registrar Venta
//               <ArrowRight className="h-4 w-4" />
//             </>
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// };

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { 
//   ShoppingBag, 
//   User, 
//   Calendar, 
//   Hash, 
//   Wallet,
//   ArrowRight,
//   Loader2 
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";

// import type { Sale } from "@/interface/sales/sale.interface";
// import type { CreateSale } from "@/interface/sales/create-sale";
// import type { ProductsResponse } from "@/interface/products/products.response";
// import { mapToCreateSale } from "../mapping/mapSales";

// interface Props {
//   sale: Sale;
//   products: ProductsResponse;
//   isPending: boolean;
//   onSubmit: (data: Partial<CreateSale>) => Promise<void>;
// }

// export const SalesForm = ({ sale, products, onSubmit, isPending }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       ...mapToCreateSale(sale),
//     },
//   });

//   useEffect(() => {
//     reset(mapToCreateSale(sale));
//   }, [sale, reset]);

//   const handleFormSubmit = (data: Partial<CreateSale>) => {
//     onSubmit(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
//       {/* Sección Principal: Producto y Cantidad */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
        
//         {/* Producto */}
//         <div className="md:col-span-2 space-y-2">
//           <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
//             Producto Seleccionado
//           </Label>
//           <div className="relative group">
//             <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors z-10" />
//             <select
//               {...register("productId", { required: "Obligatorio" })}
//               className={cn(
//                 "w-full h-11 pl-10 pr-4 bg-background border border-input rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 transition-all text-sm",
//                 errors.productId && "border-destructive ring-destructive/10"
//               )}
//             >
//               <option value="">Seleccionar un producto...</option>
//               {products.data?.map((p) => (
//                 <option key={p.id} value={p.id}>{p.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Cantidad */}
//         <div className="space-y-2">
//           <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
//             Cantidad
//           </Label>
//           <div className="relative group">
//             <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors z-10" />
//             <Input
//               type="number"
//               {...register("quantity", { required: true, min: 1 })}
//               className={cn("h-11 pl-10 rounded-xl bg-background", errors.quantity && "border-destructive")}
//               placeholder="1"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Grid de Información del Cliente y Pago */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* Cliente */}
//         <div className="space-y-2">
//           <Label className="text-sm font-medium flex items-center gap-2 mb-1">
//             <User className="h-4 w-4 text-primary" /> Información del Cliente
//           </Label>
//           <Input
//             {...register("clientName", { required: true })}
//             className={cn("h-11 rounded-xl shadow-sm", errors.clientName && "border-destructive")}
//             placeholder="Nombre completo del cliente"
//           />
//         </div>

//         {/* Fecha */}
//         <div className="space-y-2">
//           <Label className="text-sm font-medium flex items-center gap-2 mb-1">
//             <Calendar className="h-4 w-4 text-primary" /> Fecha de Operación
//           </Label>
//           <Input
//             type="date"
//             {...register("registerDate", { required: true })}
//             className={cn("h-11 rounded-xl shadow-sm", errors.registerDate && "border-destructive")}
//           />
//         </div>

//         {/* Método de Pago - Usando Select de Shadcn para mejor UI */}
//         <div className="space-y-2">
//           <Label className="text-sm font-medium flex items-center gap-2 mb-1">
//             <Wallet className="h-4 w-4 text-primary" /> Método de Pago
//           </Label>
//           <Select 
//             onValueChange={(value) => setValue("paymentMethod", value)} 
//             defaultValue={sale.paymentMethod}
//           >
//             <SelectTrigger className="h-11 rounded-xl shadow-sm">
//               <SelectValue placeholder="Seleccionar método..." />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="CASH">Efectivo</SelectItem>
//               <SelectItem value="CREDIT_CARD">Tarjeta de Crédito</SelectItem>
//               <SelectItem value="DEBIT_CARD">Tarjeta de Débito</SelectItem>
//               <SelectItem value="TRANSFER">Transferencia Bancaria</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Card de Total - Visualmente destacada */}
//         <div className="relative overflow-hidden rounded-2xl bg-primary p-[1px]">
//             <div className="bg-primary/10 backdrop-blur-md h-full w-full rounded-[15px] p-4 flex flex-col justify-center items-center relative z-10 bg-background/95 dark:bg-background/40">
//                 <p className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Total a Pagar</p>
//                 <div className="flex items-baseline gap-1">
//                     <span className="text-sm font-medium text-primary">RD$</span>
//                     <span className="text-3xl font-black text-primary tracking-tight">
//                         {(sale.totalPrice ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                     </span>
//                 </div>
//             </div>
//             {/* Decoración abstracta de fondo */}
//             <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full -mr-10 -mt-10 blur-2xl" />
//         </div>
//       </div>

//       {/* Botones de Acción */}
//       <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/60">
//         <Button 
//           type="button" 
//           variant="ghost" 
//           disabled={isPending}
//           className="rounded-xl px-6 text-muted-foreground hover:text-foreground"
//         >
//           Cancelar
//         </Button>
//         <Button 
//           type="submit" 
//           disabled={isPending}
//           className="rounded-xl px-8 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 transition-all active:scale-95 gap-2"
//         >
//           {isPending ? (
//             <>
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Procesando...
//             </>
//           ) : (
//             <>
//               Finalizar Venta
//               <ArrowRight className="h-4 w-4" />
//             </>
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// };

// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import type { Sale } from "@/interface/sales/sale.interface";
// import type { CreateSale } from "@/interface/sales/create-sale";
// import { useForm } from "react-hook-form";
// import { mapToCreateSale } from "../mapping/mapSales";
// import type { ProductsResponse } from "@/interface/products/products.response";
// import { CreditCard, ShoppingBag } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface Props {
//   sale: Sale;
//   products: ProductsResponse;
//   isPending: boolean;
//   onSubmit: (data: Partial<CreateSale>) => Promise<void>;
// }

// export const SalesForm = ({ sale, products, onSubmit, isPending }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       ...mapToCreateSale(sale),
//     },
//   });

//   useEffect(() => {
//       reset(mapToCreateSale(sale))
//   }, [sale, reset]);

//   const handleFormSubmit = (data: Partial<CreateSale>) => {
//     onSubmit(data);
//   };

//   return (
   
//         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          
//           <div className="space-y-2 md:col-span-2">
//             <Label htmlFor="roles" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 ml-1">
//               Productos
//             </Label>
//             <div className="relative group">
//               <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />
//               <select
//                 {...register("productId", { required: "Seleccionar un producto es obligatorio" })}
//                 className={cn(
//                   "w-full h-11 pl-10 pr-10 border border-muted-foreground/20 rounded-lg bg-background appearance-none focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-sm",
//                   { "border-destructive": errors.productId }
//                 )}
//               >
//                 <option value="">Seleccionar un producto...</option>
//                 {products.data?.map((p) => (
//                   <option key={p.id} value={p.id}>{p.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>


//         {/* Cantidad */}
//         <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="providerAddress" className="text-sm font-semibold flex items-center gap-2">
//             <CreditCard className="h-4 w-4 text-muted-foreground" /> Cantidad
//           </Label>
//           <Input
//             id="quantity"
//             {...register("quantity", { required: true })}
//             className={cn("h-11", { "border-destructive": errors.quantity })}
//             placeholder="1"
//           />
//           {errors.quantity && (
//             <p className="text-destructive text-xs font-medium">Cantidad es requerida</p>
//           )}
//         </div> 
         

//           <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
//             <p className="text-sm text-muted-foreground">Total</p>
//             <p className="text-2xl font-bold text-primary">${sale.totalPrice.toFixed(2)}</p>
//           </div>

//             {/* Cliente */}
//         <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="providerAddress" className="text-sm font-semibold flex items-center gap-2">
//             <CreditCard className="h-4 w-4 text-muted-foreground" /> Cliente
//           </Label>
//           <Input
//             id=""
//             type="text"
//             {...register("clientName", { required: true })}
//             className={cn("h-11", { "border-destructive": errors.clientName })}
//             placeholder="Cliente..."
//           />
//           {errors.clientName && (
//             <p className="text-destructive text-xs font-medium">El Nombre del cliente es requerido</p>
//           )}
//         </div> 


//         <div className="space-y-2 md:col-span-2">
//             <Label htmlFor="roles" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 ml-1">
//               Metodo de pago
//             </Label>
//             <div className="relative group">
//               <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />
//               <select
//                 {...register("productId", { required: "Seleccionar un metodo de pago es obligatorio" })}
//                 className={cn(
//                   "w-full h-11 pl-10 pr-10 border border-muted-foreground/20 rounded-lg bg-background appearance-none focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-sm",
//                   { "border-destructive": errors.productId }
//                 )}
//               > 
//                 <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
//                 <SelectContent className="bg-popover">
//                   <SelectItem key={sale.id} value={sale.id}>{sale.paymentMethod}</SelectItem>
//                 </SelectContent>
//               </select>
//             </div>
//           </div>
          
//         <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="providerAddress" className="text-sm font-semibold flex items-center gap-2">
//             <CreditCard className="h-4 w-4 text-muted-foreground" /> Fecha de venta
//           </Label>
//           <Input
//             id=""
//             type="date"
//             {...register("registerDate", { required: true })}
//             className={cn("h-11", { "border-destructive": errors.registerDate })}
//             placeholder="Cliente..."
//           />
//           {errors.registerDate && (
//             <p className="text-destructive text-xs font-medium">El Nombre del cliente es requerido</p>
//           )}
//         </div> 
          
     
//           {/* Botones de Acción */}
//       <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
//         <Button 
//           type="button" 
//           variant="outline" 
//           disabled={isPending}
//           className="rounded-xl px-6"
//         >
//           Cancelar
//         </Button>
//         <Button 
//           type="submit" 
//           disabled={isPending}
//           className="rounded-xl px-8 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
//         >
//           {isPending ? (
//             <span className="flex items-center gap-2">
//               <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               Guardando...
//             </span>
//           ) : "Guardar Proveedor"}
//         </Button>
//       </div>
//         </form>
//   );
// }
