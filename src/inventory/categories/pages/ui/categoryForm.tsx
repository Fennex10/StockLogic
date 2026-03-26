import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tag, FileText, Loader2, Save} from "lucide-react"; // Iconos consistentes
import type { Category } from "@/interface/categories/category.interface";
import type { CreateCategory } from "@/interface/categories/create-category";
import { mapToCreateCategory } from "../../mapping/mapCategory";

interface Props {
  category: Category;
  isPending: boolean;
  onSubmit: (data: Partial<CreateCategory> & { files?: File[] }) => Promise<void>;
}

interface FormInputs extends CreateCategory {
  color: string;
}

export const CategoryForm = ({ category, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      ...mapToCreateCategory(category),
    },
  });

  useEffect(() => {
    if (category && category.id !== "new") {
      reset({
        ...mapToCreateCategory(category),
      });
    }
  }, [category, reset]);

  const handleFormSubmit = (data: FormInputs) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      
      {/* Usamos el mismo Grid que en Proveedores para mantener la alineación */}
      <div className="grid grid-cols-1 gap-5">
        
        {/* Nombre de la Categoría */}
        <div className="space-y-2">
          <Label htmlFor="categoryName" className="text-sm font-semibold flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" /> Nombre de la Categoría
          </Label>
          <Input
            id="categoryName"
            {...register("categoryName", { required: "El nombre es obligatorio" })}
            className={cn("h-11 transition-all focus-visible:ring-primary/20", {
              "border-destructive ring-destructive/20": errors.categoryName,
            })}
            placeholder="Ej. Electrónica, Oficina..."
          />
          {errors.categoryName && (
            <p className="text-destructive text-xs font-medium">{errors.categoryName.message}</p>
          )}
        </div>

        {/* Descripción (Usando Input h-11 para que sea idéntico a los de proveedores) */}
        <div className="space-y-2">
          <Label htmlFor="categoryDescription" className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" /> Descripción
          </Label>
          <Input
            id="categoryDescription"
            {...register("categoryDescription", { required: "La descripción es obligatoria" })}
            className={cn("h-11 transition-all focus-visible:ring-primary/20", {
              "border-destructive ring-destructive/20": errors.categoryDescription,
            })}
            placeholder="Breve descripción de la categoría"
          />
          {errors.categoryDescription && (
            <p className="text-destructive text-xs font-medium">Requerido</p>
          )}
        </div>

      </div>

      {/* Botones de Acción: Exactamente iguales al de Proveedores */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Button 
          type="submit" 
          disabled={isPending}
          className="rounded-xl px-8 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Categoría
            </span>
          )}
        </Button>
      </div>

    </form>
  );
};

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";
// import type { Category } from "@/interface/categories/category.interface";
// import type { CreateCategory } from "@/interface/categories/create-category";
// import { mapToCreateCategory } from "../../mapping/mapCategory";

// interface Props {
//   category: Category;
//   isPending: boolean;
//   onSubmit: (
//     data: Partial<CreateCategory> & { files?: File[] }
//   ) => Promise<void>;
// }

// interface FormInputs extends CreateCategory {
//   color: string;
// }

// export const CategoryForm = ({
//   category,
//   onSubmit,
//   isPending,
// }: Props) => {

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
//     <form
//       onSubmit={handleSubmit(handleFormSubmit)}
//       className="space-y-5"
//     >

//       {/* Nombre */}
//       <div className="space-y-2">
//         <Label>Nombre</Label>
//         <input
//           {...register("categoryName", { required: true })}
//           className={cn(
//             "w-full px-4 py-3 border rounded-lg",
//             { "border-red-500": errors.categoryName }
//           )}
//           placeholder="Nombre de la categoría"
//         />
//         {errors.categoryName && (
//           <p className="text-red-500 text-sm">Requerido</p>
//         )}
//       </div>

//       {/* Descripción */}
//       <div className="space-y-2">
//         <Label>Descripción</Label>
//         <input
//           {...register("categoryDescription", { required: true })}
//           className={cn(
//             "w-full px-4 py-3 border rounded-lg",
//             { "border-red-500": errors.categoryDescription }
//           )}
//           placeholder="Descripción"
//         />
//         {errors.categoryDescription && (
//           <p className="text-red-500 text-sm">Requerido</p>
//         )}
//       </div>

//       {/* Botones */}
//       <div className="flex justify-end gap-3 pt-2">
//         <Button type="submit" disabled={isPending}>
//           {isPending ? "Guardando..." : "Guardar"}
//         </Button>
//       </div>

//     </form>
//   );
// };
