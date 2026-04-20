import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, type Variants } from "framer-motion"; // Necesitarás instalar framer-motion
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tag, FileText, Loader2, Save, ShoppingBag, ChevronDown } from "lucide-react"; 
import type { ProductsResponse } from "@/interface/products/products.response";
import type { CreateRestartStock } from "@/interface/providers/create-restart-stock";

interface Props {
  restartStock: CreateRestartStock;
  products: ProductsResponse;
  isPending: boolean;
  onSubmit: (data: Partial<CreateRestartStock>) => Promise<void>;
}

// Tipa los objetos así:
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: "easeOut", 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 }
};


export const RestartStockForm = ({ restartStock, products, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRestartStock>({
    defaultValues: restartStock,
  });

  useEffect(() => {
    reset(restartStock);
  }, [restartStock, reset]);

  return (
    <motion.form 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      onSubmit={handleSubmit(onSubmit)} 
      className="max-w-2xl mx-auto space-y-8 p-1"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-8">
        
        {/* Selector de Producto - Estilo Minimalista */}
        <motion.div variants={itemVariants} className="md:col-span-6 space-y-2">
          <Label className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider ml-0.5">
            Producto Seleccionado
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <select
              {...register("productId", { required: "Campo obligatorio" })}
              className={cn(
                "w-full h-10 pl-10 pr-10 bg-secondary/30 border border-border rounded-md appearance-none text-sm transition-all outline-none",
                "focus:ring-1 focus:ring-ring focus:border-ring/40 hover:bg-secondary/50",
                errors.productId && "border-destructive/50 ring-destructive/20"
              )}
            >
              <option value="" disabled>Seleccione un artículo...</option>
              {products.data?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
          </div>
          {errors.productId && (
            <span className="text-[11px] font-medium text-destructive ml-1">Requerido</span>
          )}
        </motion.div>

        {/* Cantidad - Input más sobrio */}
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-2">
          <Label htmlFor="quantity" className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider ml-0.5">
            Cantidad
          </Label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="quantity"
              type="number"
              {...register("productRestockQuantity", { required: true })}
              placeholder="0"
              className={cn(
                "h-10 pl-10 bg-secondary/30 border-border rounded-md shadow-none focus-visible:ring-1 focus-visible:ring-ring",
                errors.productRestockQuantity && "border-destructive/50"
              )}
            />
          </div>
        </motion.div>

        {/* Referencia - Ancho dinámico */}
        <motion.div variants={itemVariants} className="md:col-span-4 space-y-2">
          <Label htmlFor="ref" className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider ml-0.5">
            Referencia de Stock
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="ref"
              {...register("reference", { required: true })}
              placeholder="Ej. Reabastecimiento Semanal"
              className={cn(
                "h-10 pl-10 bg-secondary/30 border-border rounded-md shadow-none focus-visible:ring-1 focus-visible:ring-ring",
                errors.reference && "border-destructive/50"
              )}
            />
          </div>
        </motion.div>
      </div>

      {/* Botones de acción estilo "Clean SaaS" */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-end gap-3 pt-4"
      >
        <Button 
          variant="ghost" 
          type="button" 
          onClick={() => reset()}
          className="h-10 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
        >
          Descartar
        </Button>
        <Button 
          type="submit" 
          disabled={isPending}
          className={cn("h-10 px-6 rounded-md font-medium flex items-center gap-2 transition-all shadow-sm",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "focus-visible:ring-0 focus-visible:outline-none",
              "active:bg-primary",
          )}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Guardando..." : "Finalizar Registro"}
        </Button>
      </motion.div>
    </motion.form>
  );
};

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { Tag, FileText, Loader2, Save, ShoppingBag} from "lucide-react"; // Iconos consistentes
// import type { ProductsResponse } from "@/interface/products/products.response";
// import type { CreateRestartStock } from "@/interface/providers/create-restart-stock";

// interface Props {
//   restartStock: CreateRestartStock;
//   products: ProductsResponse;
//   isPending: boolean;
//   onSubmit: (data: Partial<CreateRestartStock>) => Promise<void>;
// }

// export const RestartStockForm = ({ restartStock, products, onSubmit, isPending }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<CreateRestartStock>({
//     defaultValues: restartStock,
//   });

//   useEffect(() => {
//       reset(restartStock);
//   }, [restartStock, reset]);

//   const handleFormSubmit = (data: Partial<CreateRestartStock>) => {
//     onSubmit(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      
//       {/* Usamos el mismo Grid que en Proveedores para mantener la alineación */}
//       <div className="grid grid-cols-1 gap-5">

//          {/* 1. PRODUCTO (Ancho completo) */}
//          <div className="space-y-1.5">
//   <Label className="text-xs font-medium text-muted-foreground ml-1">
//     Producto
//   </Label>

//   <div className="relative group">
//     <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />

//     <select
//       defaultValue="" // 🔥 IMPORTANTE
//       {...register("productId", {
//         required: "Debes seleccionar un producto",
//         validate: (value) =>
//           value !== "" || "Debes seleccionar un producto"
//       })}
//       onChange={(e) => {
//         console.log("🟢 productId seleccionado:", e.target.value);
//       }}
//       className={cn(
//         "w-full h-11 pl-11 pr-4 bg-background border border-input rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none",
//         errors.productId && "border-destructive"
//       )}
//     >
//       <option value="" disabled>
//         Seleccionar producto...
//       </option>

//       {products.data?.map((p) => (
//         <option key={p.id} value={p.id}>
//           {p.name}
//         </option>
//       ))}
//     </select>
//   </div>

//   {/* 🔥 ERROR VISUAL */}
//   {errors.productId && (
//     <p className="text-destructive text-xs font-medium">
//       {errors.productId.message}
//     </p>
//   )}
// </div>
//       {/* <div className="space-y-1.5">
//         <Label className="text-xs font-medium text-muted-foreground ml-1">Producto</Label>
//         <div className="relative group">
//           <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />
//           <select
//             {...register("productId", { required: "Obligatorio" })}
//             className={cn(
//               "w-full h-11 pl-11 pr-4 bg-background border border-input rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none",
//               errors.productId && "border-destructive"
//             )}
//           >
//             <option value="">Seleccionar producto...</option>
//             {products.data?.map((p) => (
//               <option key={p.id} value={p.id}>{p.name}</option>
//             ))}
//           </select>
//         </div>
//       </div> */}
        
//         {/* Nombre de la Categoría */}
//         <div className="space-y-2">
//           <Label htmlFor="categoryName" className="text-sm font-semibold flex items-center gap-2">
//             <Tag className="h-4 w-4 text-muted-foreground" /> Rellenar Producto
//           </Label>
//           <Input
//             type="number"
//             id="categoryName"
//             {...register("productRestockQuantity", { required: true })}
//             className={cn("h-11 transition-all focus-visible:ring-primary/20", {
//               "border-destructive ring-destructive/20": errors.productRestockQuantity,
//             })}
//             placeholder="0"
//           />
//           {errors.productRestockQuantity && (
//             <p className="text-destructive text-xs font-medium">{errors.productRestockQuantity.message}</p>
//           )}
//         </div>

//         {/* Descripción (Usando Input h-11 para que sea idéntico a los de proveedores) */}
//         <div className="space-y-2">
//           <Label htmlFor="categoryDescription" className="text-sm font-semibold flex items-center gap-2">
//             <FileText className="h-4 w-4 text-muted-foreground" /> Referencia del Stock
//           </Label>
//           <Input
//             id="categoryDescription"
//             {...register("reference", { required: "La referencia es obligatoria" })}
//             className={cn("h-11 transition-all focus-visible:ring-primary/20", {
//               "border-destructive ring-destructive/20": errors.reference,
//             })}
//             placeholder="Breve descripción de la categoría"
//           />
//           {errors.reference && (
//             <p className="text-destructive text-xs font-medium">Requerido</p>
//           )}
//         </div>

//       </div>

//       {/* Botones de Acción: Exactamente iguales al de Proveedores */}
//       <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
//         <Button 
//           type="submit" 
//           disabled={isPending}
//           className="rounded-xl px-8 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
//         >
//           {isPending ? (
//             <span className="flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Guardando...
//             </span>
//           ) : (
//             <span className="flex items-center gap-2">
//               <Save className="h-4 w-4" />
//               Guardar Categoría
//             </span>
//           )}
//         </Button>
//       </div>

//     </form>
//   );
// };