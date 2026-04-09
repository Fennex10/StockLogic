import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tag, FileText, Loader2, Save } from "lucide-react"; 
import type { Category } from "@/interface/categories/category.interface";
import type { CreateCategory } from "@/interface/categories/create-category";
import { mapToCreateCategory } from "../../mapping/mapCategory";

interface Props {
  category: Category;
  isPending: boolean;
  onSubmit: (data: Partial<CreateCategory>) => Promise<void>;
}

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

export const CategoryForm = ({ category, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCategory>({
    defaultValues: mapToCreateCategory(category),
  });

  useEffect(() => {
    if (category) {
      reset(mapToCreateCategory(category));
    }
  }, [category, reset]);

  return (
    <motion.form 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      onSubmit={handleSubmit(onSubmit)} 
      className="max-w-2xl mx-auto space-y-8 p-1"
    >
      <div className="grid grid-cols-1 gap-y-8">
        
        {/* Nombre de la Categoría */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="categoryName" className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider ml-0.5">
            Nombre de la Categoría
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary">
              <Tag className="h-4 w-4" />
            </div>
            <Input
              id="categoryName"
              {...register("categoryName", { required: "El nombre es obligatorio" })}
              placeholder="Ej. Electrónica, Oficina..."
              className={cn(
                "h-10 pl-10 bg-secondary/30 border-border rounded-md shadow-none transition-all focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40",
                errors.categoryName && "border-destructive/50 ring-destructive/20"
              )}
            />
          </div>
          {errors.categoryName && (
            <span className="text-[11px] font-medium text-destructive ml-1">{errors.categoryName.message}</span>
          )}
        </motion.div>

        {/* Descripción */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="categoryDescription" className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider ml-0.5">
            Descripción de Categoría
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <Input
              id="categoryDescription"
              {...register("categoryDescription", { required: "La descripción es obligatoria" })}
              placeholder="Breve detalle sobre esta categoría"
              className={cn(
                "h-10 pl-10 bg-secondary/30 border-border rounded-md shadow-none transition-all focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40",
                errors.categoryDescription && "border-destructive/50 ring-destructive/20"
              )}
            />
          </div>
          {errors.categoryDescription && (
            <span className="text-[11px] font-medium text-destructive ml-1">Requerido</span>
          )}
        </motion.div>
      </div>

      {/* Botones de acción con el Primary Blue */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-end gap-3 pt-4 border-t border-border/50"
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
          className={cn(
            "h-10 px-6 rounded-md font-medium flex items-center gap-2 transition-all active:scale-95",
            "bg-primary text-primary-foreground hover:bg-primary/90", // El color azul primario
            "shadow-md shadow-primary/20" // Sombra suave del mismo color azul
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Guardando..." : "Finalizar Categoría"}
        </Button>
      </motion.div>
    </motion.form>
  );
};


{/* Botones de acción con el Primary Blue */}
{/* <motion.div 
  variants={itemVariants}
  className="flex items-center justify-end gap-3 pt-4 border-t border-border/50"
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
    className={cn(
      "h-10 px-6 rounded-md font-medium flex items-center gap-2 transition-all active:scale-95",
      "bg-primary text-primary-foreground hover:bg-primary/90", // Azul Primario
      "shadow-md shadow-primary/20" // Sombra sutil azulada
    )}
  >
    {isPending ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Save className="h-4 w-4" />
    )}
    {isPending ? "Guardando..." : "Finalizar Categoría"}
  </Button>
</motion.div> */}

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { Tag, FileText, Loader2, Save} from "lucide-react"; // Iconos consistentes
// import type { Category } from "@/interface/categories/category.interface";
// import type { CreateCategory } from "@/interface/categories/create-category";
// import { mapToCreateCategory } from "../../mapping/mapCategory";

// interface Props {
//   category: Category;
//   isPending: boolean;
//   onSubmit: (data: Partial<CreateCategory> & { files?: File[] }) => Promise<void>;
// }

// interface FormInputs extends CreateCategory {
//   color: string;
// }

// export const CategoryForm = ({ category, onSubmit, isPending }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       ...mapToCreateCategory(category),
//     },
//   });

//   useEffect(() => {
//     if (category && category.id !== "new") {
//       reset({
//         ...mapToCreateCategory(category),
//       });
//     }
//   }, [category, reset]);

//   const handleFormSubmit = (data: FormInputs) => {
//     onSubmit(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      
//       {/* Usamos el mismo Grid que en Proveedores para mantener la alineación */}
//       <div className="grid grid-cols-1 gap-5">
        
//         {/* Nombre de la Categoría */}
//         <div className="space-y-2">
//           <Label htmlFor="categoryName" className="text-sm font-semibold flex items-center gap-2">
//             <Tag className="h-4 w-4 text-muted-foreground" /> Nombre de la Categoría
//           </Label>
//           <Input
//             id="categoryName"
//             {...register("categoryName", { required: "El nombre es obligatorio" })}
//             className={cn("h-11 transition-all focus-visible:ring-primary/20", {
//               "border-destructive ring-destructive/20": errors.categoryName,
//             })}
//             placeholder="Ej. Electrónica, Oficina..."
//           />
//           {errors.categoryName && (
//             <p className="text-destructive text-xs font-medium">{errors.categoryName.message}</p>
//           )}
//         </div>

//         {/* Descripción (Usando Input h-11 para que sea idéntico a los de proveedores) */}
//         <div className="space-y-2">
//           <Label htmlFor="categoryDescription" className="text-sm font-semibold flex items-center gap-2">
//             <FileText className="h-4 w-4 text-muted-foreground" /> Descripción
//           </Label>
//           <Input
//             id="categoryDescription"
//             {...register("categoryDescription", { required: "La descripción es obligatoria" })}
//             className={cn("h-11 transition-all focus-visible:ring-primary/20", {
//               "border-destructive ring-destructive/20": errors.categoryDescription,
//             })}
//             placeholder="Breve descripción de la categoría"
//           />
//           {errors.categoryDescription && (
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

