import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Input } from "@/components/ui/input"
import type { Label } from "radix-ui"
import { colorOptions } from "../categories/Categories"
import type { Category } from "@/interface/categories/category.interface"
import type { CreateCategory } from "@/interface/categories/create-category"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { mapToCreateCategory } from "../../mapping/mapCategory"
import { Title } from "@/components/components/Title"
import { cn } from "@/lib/utils"

interface Props {
  title: string;
  subTitle: string;
  category: Category;
  isPending: boolean;

  onSubmit: (
    productLike: Partial<CreateCategory> & { files?: File[] }
  ) => Promise<void>;
}

interface FormInputs extends CreateCategory  {
  files?: File[];
}

export const CategoryForm = ({
  title,
  subTitle,
  category,
  onSubmit,
  isPending,
}: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<FormInputs>({
    defaultValues: mapToCreateCategory(category),
  });

useEffect(() => {
  if (category && category.id !== 'new') {
    reset(mapToCreateCategory(category));
  }
}, [category, reset]);

// useEffect(() => {
//   // eslint-disable-next-line react-hooks/set-state-in-effect
//   setFiles([]);
// }, [product]);

  const handleFormSubmit = (data: FormInputs) => {
    onSubmit({
      ...data,
      files,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;
    if (!inputFiles) return;

    const newFiles = Array.from(inputFiles);

    setFiles((prev) => [...prev, ...newFiles]);

    const currentFiles = getValues("files") ?? [];
    setValue("files", [...currentFiles, ...newFiles]);
  };

  return (
    <div className=""> 
     {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-2">

             <Title title={title} subtitle={subTitle} /> 

            <div className="space-y-2">
              <label>Nombre</label>

               <input
                type="text"
                {...register("categoryName", { required: true })}
                className={cn(
                  "w-full px-4 py-3 border border-slate-300 rounded-lg",
                  { "border-red-500": errors.categoryName }
                )}
                placeholder="Nombre de la categoria"
              />

              {errors.categoryName && (
                <p className="text-red-500 text-sm">
                  El nombre es requerido
                </p>
              )}
             
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descripción de la categoría" />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setForm({ ...form, color: opt.value })}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                      form.color === opt.value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className={`h-3 w-3 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
}