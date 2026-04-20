import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { Title } from "@/components/components/Title";
import { Button } from "@/components/ui/button";
import { X, SaveAll, Upload,  DollarSign,  Image as ImageIcon, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

import type { CreateProduct } from "@/interface/products/create-product.interface";
import type { CategoriesResponse } from "@/interface/categories/categories.reponse";
import { mapToCreateProduct } from '../mapping/mapProduct';
import type { Product } from "@/interface/products/product.interface";
import type { ProvidersResponse } from "@/interface/providers/providers.response";
import { getFullImageUrl } from "@/lib/formatUrl";

interface Props {
  title: string;
  subTitle: string;
  product: Product;
  categories: CategoriesResponse;
  providers: ProvidersResponse;
  isPending: boolean;
  // onSubmit: (productLike: Partial<CreateProduct> & { files?: File[] }) => Promise<void>;
  onSubmit: (productLike: Partial<CreateProduct> & { file?: File | null }) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FormInputs extends CreateProduct {}

export const ProductForm = ({ title, subTitle, product, categories, providers, onSubmit, isPending }: Props) => {
  const [dragActive, setDragActive] = useState(false);
const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
    defaultValues: mapToCreateProduct(product),
  });

  useEffect(() => {
    if (product && product.id !== 'new') {
      reset(mapToCreateProduct(product));
    }
  }, [product, reset]);

  // const handleFormSubmit = (data: FormInputs) => {
  //   onSubmit({ ...data, file });
  // };
  const handleFormSubmit = (data: FormInputs) => {
    onSubmit({ ...data, file });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault(); e.stopPropagation();
  //   setDragActive(false);
  //   const droppedFiles = e.dataTransfer.files;
  //   if (!droppedFiles) return;
  //   const newFiles = Array.from(droppedFiles);
  //   setFile((prev) => [...prev, ...newFiles]);
  // };

  const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  const droppedFile = e.dataTransfer.files?.[0];
  if (!droppedFile) return;

  setFile(droppedFile);
};

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputFiles = e.target.files;
  //   if (!inputFiles) return;
  //   const newFiles = Array.from(inputFiles);
  //   setFiles((prev) => [...prev, ...newFiles]);
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (!selectedFile) return;
     console.log("FILE SELECTED:", file); 
    setFile(selectedFile);
  };

  // const removeFile = (index: number) => {
  //   setFiles((prev) => prev.filter((_, i) => i !== index));
  // };

//   const removeFile = () => {
//   setFile(null);
// };

  // ESTILO DE INPUT MEJORADO: Borde definido y fondo sólido para que NO se vea transparente
  const inputStyles = "h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-slate-700 shadow-sm";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="animate-in fade-in duration-500 pb-20">
      
      {/* HEADER: mb-4 para reducir espacio con el contenido */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <Title title={title} subtitle={subTitle} />

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button variant="outline" type="button" asChild className="rounded-lg h-10 px-4 border-slate-300">
            <Link to="/dashboard/products" className="flex items-center gap-2">
              <X className="w-4 h-4" /> Cancelar
            </Link>
          </Button>

          <Button type="submit" disabled={isPending} className="rounded-lg h-10 px-6 bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95">
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Guardando...</span>
              </div>
            ) : (
              <><SaveAll className="w-4 h-4 mr-2" /> Guardar cambios</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* <div className="flex items-center gap-2 text-primary font-semibold border-b border-slate-100 pb-4">
              <Package className="w-5 h-5" />
              <h2>Detalles del Producto</h2>
            </div> */}

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 mb-2">Nombre comercial</label>
                <input
                  type="text"
                  {...register("productName", { required: true })}
                  className={cn("w-full", inputStyles, { "border-red-400": errors.productName })}
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Precio de Venta
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("productPrice", { required: true, min: 0 })}
                    className={cn("w-full", inputStyles)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-500" /> Precio de Costo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("productCostPrice", { required: true, min: 0 })}
                    className={cn("w-full", inputStyles)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
              {product.id === "new" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Stock Actual</label>
                    <input type="number" {...register("productCurrentStock")} className={cn("w-full", inputStyles)} />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Mínimo</label>
                  <input type="number" {...register("productMinStock")} className={cn("w-full", inputStyles)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Máximo</label>
                  <input type="number" {...register("productMaxStock")} className={cn("w-full", inputStyles)} />
                </div>
              </div> */}

              <div className={cn("grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100",
                    product.id === "new" ? "md:grid-cols-3" : "md:grid-cols-2"
                  )}>
                  {product.id === "new" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400">
                        Stock Actual
                      </label>
                      <input
                        type="number"
                        {...register("productCurrentStock")}
                        className={cn("w-full", inputStyles)}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">
                      Mínimo
                    </label>
                    <input
                      type="number"
                      {...register("productMinStock")}
                      className={cn("w-full", inputStyles)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">
                      Máximo
                    </label>
                    <input
                      type="number"
                      {...register("productMaxStock")}
                      className={cn("w-full", inputStyles)}
                    />
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 mb-2">Categoría</label>
                  <select {...register("productCategoryId")} className={cn("w-full cursor-pointer", inputStyles)}>
                    <option value="">Seleccionar...</option>
                    {categories.data?.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 mb-2">Proveedor</label>
                  <select {...register("productProviderId")} className={cn("w-full cursor-pointer", inputStyles)}>
                    <option value="">Seleccionar...</option>
                    {providers.data?.map((prov) => (<option key={prov.id} value={prov.id}>{prov.name}</option>))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 mb-2">Descripción</label>
                <textarea
                  {...register("productDescription")}
                  rows={3}
                  className={cn("w-full py-3 resize-none", inputStyles, "h-auto")}
                  placeholder="Detalles del producto..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 text-primary font-semibold mb-4 text-sm">
              <ImageIcon className="w-4 h-4" />
              <h2>Multimedia</h2>
            </div>

            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer mb-4",
                dragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary/50"
              )}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              <input type="file"  accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs font-medium text-slate-600">Subir imagen</p>
            </div>

            {/* PREVIEW DE IMÁGENES CON BOTÓN ELIMINAR */}
            {/* <div className="space-y-2">
              {product.imageURL && (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={getFullImageUrl(product.imageURL)} className="w-full h-32 object-cover" alt="Actual" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-bold uppercase">Imagen Actual</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                {file.map((file, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="New" />
                    <button 
                      type="button"
                      onClick={() => removeFile()}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div> */}

           <div className="space-y-2">

              {file ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200">
                  <img 
                    src={URL.createObjectURL(file)} 
                    className="w-full object-contain" 
                    alt="Nueva imagen" 
                  />

                  <button 
                    type="button"
                    onClick={() => setFile(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                product.imageURL && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200">
                    <img 
                      src={getFullImageUrl(product.imageURL)} 
                      className="w-full object-contain" 
                      alt="Actual" 
                    />
                  </div>
                )
              )}

            </div>

          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Disponibilidad</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={cn("w-4 h-4", product.currentStock > 0 ? "text-emerald-500" : "text-slate-300")} />
                <span className="text-sm font-semibold text-slate-600">Estado</span>
              </div>
              <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full uppercase", 
                product.currentStock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
                {product.currentStock > 0 ? "Activo" : "Sin Stock"}
              </span>
            </div>
            <Separator className="bg-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Stock Total</span>
              <span className="text-lg font-bold text-slate-700">{product.currentStock || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

// import { useEffect, useState } from "react";
// import { Link } from "react-router";
// import { useForm } from "react-hook-form";
// import { Title } from "@/components/components/Title";
// import { Button } from "@/components/ui/button";
// import { X, SaveAll, Upload, Package, DollarSign, Layers, Factory, FileText, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Separator } from "@/components/ui/separator";

// // Interfaces y tipos (manteniendo los tuyos)
// import type { CreateProduct } from "@/interface/products/create-product.interface";
// import type { CategoriesResponse } from "@/interface/categories/categories.reponse";
// import { mapToCreateProduct } from '../mapping/mapProduct';
// import type { Product } from "@/interface/products/product.interface";
// import type { ProvidersResponse } from "@/interface/providers/providers.response";
// import { getFullImageUrl } from "@/lib/formatUrl";

// interface Props {
//   title: string;
//   subTitle: string;
//   product: Product;
//   categories: CategoriesResponse;
//   providers: ProvidersResponse;
//   isPending: boolean;
//   onSubmit: (productLike: Partial<CreateProduct> & { files?: File[] }) => Promise<void>;
// }

// interface FormInputs extends CreateProduct {
//   files?: File[];
// }

// export const ProductForm = ({ title, subTitle, product, categories, providers, onSubmit, isPending }: Props) => {
//   const [dragActive, setDragActive] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);

//   const { register, handleSubmit, formState: { errors }, getValues, setValue, reset } = useForm<FormInputs>({
//     defaultValues: mapToCreateProduct(product),
//   });

//   useEffect(() => {
//     if (product && product.id !== 'new') {
//       reset(mapToCreateProduct(product));
//     }
//   }, [product, reset]);

//   const handleFormSubmit = (data: FormInputs) => {
//     onSubmit({ ...data, files });
//   };

//   // Handlers de Drag & Drop (Funcionalidad intacta)
//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault(); e.stopPropagation();
//     setDragActive(e.type === "dragenter" || e.type === "dragover");
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault(); e.stopPropagation();
//     setDragActive(false);
//     const droppedFiles = e.dataTransfer.files;
//     if (!droppedFiles) return;
//     const newFiles = Array.from(droppedFiles);
//     setFiles((prev) => [...prev, ...newFiles]);
//     setValue("files", [...(getValues("files") ?? []), ...newFiles]);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const inputFiles = e.target.files;
//     if (!inputFiles) return;
//     const newFiles = Array.from(inputFiles);
//     setFiles((prev) => [...prev, ...newFiles]);
//     setValue("files", [...(getValues("files") ?? []), ...newFiles]);
//   };

//   const inputStyles = "h-11 rounded-lg border-muted-foreground/20 bg-background focus:ring-1 focus:ring-primary/30 transition-all";

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="animate-in fade-in duration-500 pb-20">
      
//       {/* HEADER FIJO O SUPERIOR */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//         <Title title={title} subtitle={subTitle} />

//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <Button variant="outline" type="button" asChild className="rounded-lg h-11 px-6 border-muted-foreground/20">
//             <Link to="/dashboard/products" className="flex items-center gap-2">
//               <X className="w-4 h-4" /> Cancelar
//             </Link>
//           </Button>

//           <Button type="submit" disabled={isPending} className="rounded-lg h-11 px-8 shadow-sm shadow-primary/20 bg-primary active:scale-95">
//             {isPending ? (
//               <div className="flex items-center gap-2">
//                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 <span>Guardando...</span>
//               </div>
//             ) : (
//               <>
//                 <SaveAll className="w-4 h-4 mr-2" /> Guardar cambios
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//         {/* COLUMNA IZQUIERDA: INFORMACIÓN PRINCIPAL */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
//             <div className="flex items-center gap-2 text-primary font-semibold border-b pb-4">
//               <Package className="w-5 h-5" />
//               <h2>Detalles del Producto</h2>
//             </div>

//             <div className="grid grid-cols-1 gap-6">
//               {/* Título */}
//               <div className="space-y-2">
//                 <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nombre comercial</label>
//                 <input
//                   type="text"
//                   {...register("productName", { required: true })}
//                   className={cn("w-full px-4", inputStyles, { "border-destructive": errors.productName })}
//                   placeholder="Ej: Laptop Gamer Nitro 5"
//                 />
//               </div>

//               {/* Precios y Costos */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1">
//                     <DollarSign className="w-3 h-3" /> Precio de Venta
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     {...register("productPrice", { required: true, min: 1 })}
//                     className={cn("w-full px-4", inputStyles, { "border-destructive": errors.productPrice })}
//                     placeholder="0.00"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1">
//                     <AlertCircle className="w-3 h-3 text-amber-500" /> Precio de Costo
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     {...register("productCostPrice", { required: true, min: 0 })}
//                     className={cn("w-full px-4", inputStyles, { "border-destructive": errors.productCostPrice })}
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>

//               {/* Stock Management */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-bold uppercase text-muted-foreground">Stock Actual</label>
//                   <input
//                     type="number"
//                     {...register("productCurrentStock", { required: true, min: 0 })}
//                     className={cn("w-full px-4", inputStyles)}
//                     placeholder="0"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-bold uppercase text-muted-foreground">Mínimo</label>
//                   <input
//                     type="number"
//                     {...register("productMinStock", { required: true, min: 1 })}
//                     className={cn("w-full px-4", inputStyles)}
//                     placeholder="Min"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-bold uppercase text-muted-foreground">Máximo</label>
//                   <input
//                     type="number"
//                     {...register("productMaxStock", { required: true, min: 0 })}
//                     className={cn("w-full px-4", inputStyles)}
//                     placeholder="Max"
//                   />
//                 </div>
//               </div>

//               {/* Categoría y Proveedor */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1">
//                     <Layers className="w-3 h-3" /> Categoría
//                   </label>
//                   <select {...register("productCategoryId")} className={cn("w-full px-4 appearance-none cursor-pointer", inputStyles)}>
//                     <option value="">Seleccionar categoría</option>
//                     {categories.data?.map((cat) => (
//                       <option key={cat.id} value={cat.id}>{cat.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1">
//                     <Factory className="w-3 h-3" /> Proveedor
//                   </label>
//                   <select {...register("productProviderId")} className={cn("w-full px-4 appearance-none cursor-pointer", inputStyles)}>
//                     <option value="">Seleccionar proveedor</option>
//                     {providers.data?.map((prov) => (
//                       <option key={prov.id} value={prov.id}>{prov.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Descripción */}
//               <div className="space-y-2">
//                 <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1">
//                   <FileText className="w-3 h-3" /> Descripción detallada
//                 </label>
//                 <textarea
//                   {...register("productDescription", { required: true })}
//                   rows={4}
//                   className={cn("w-full px-4 py-3 resize-none", inputStyles, { "border-destructive": errors.productDescription })}
//                   placeholder="Describe las características principales..."
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* COLUMNA DERECHA: IMÁGENES Y ESTADO */}
//         <div className="space-y-6">
          
//           {/* CARGA DE IMÁGENES */}
//           <div className="bg-card rounded-xl border shadow-sm p-6">
//             <div className="flex items-center gap-2 text-primary font-semibold mb-4">
//               <ImageIcon className="w-5 h-5" />
//               <h2>Multimedia</h2>
//             </div>

//             <div
//               className={cn(
//                 "relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
//                 dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50"
//               )}
//               onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
//             >
//               <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
//               <Upload className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" />
//               <p className="text-sm font-medium">Subir archivos</p>
//               <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
//             </div>

//             {/* Preview de imágenes */}
//             {(product.imageURL || files.length > 0) && (
//               <div className="mt-6 grid grid-cols-3 gap-2">
//                 {product.imageURL && (
//                   <div className="aspect-square rounded-md overflow-hidden border">
//                     <img src={getFullImageUrl(product.imageURL)} className="w-full h-full object-cover" alt="Actual" />
//                   </div>
//                 )}
//                 {files.map((file, i) => (
//                   <div key={i} className="aspect-square rounded-md overflow-hidden border relative group">
//                     <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="New" />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ESTADO DEL INVENTARIO (RESUMEN) */}
//           <div className="bg-muted/30 rounded-xl border border-dashed p-6 space-y-4">
//             <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resumen de disponibilidad</h3>
            
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className={cn("w-4 h-4", product.currentStock > 0 ? "text-success" : "text-muted-foreground")} />
//                 <span className="text-sm font-medium">Estado</span>
//               </div>
//               <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full uppercase", 
//                 product.currentStock > 0 ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
//                 {product.currentStock > 0 ? "En Stock" : "Agotado"}
//               </span>
//             </div>

//             <Separator />

//             <div className="grid grid-cols-2 gap-4 pt-2">
//               <div>
//                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Total Unidades</p>
//                 <p className="text-xl font-bold">{product.currentStock || 0}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Imágenes</p>
//                 <p className="text-xl font-bold">{(product.imageURL ? 1 : 0) + files.length}</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </form>
//   );
// };

// import { useEffect, useState } from "react";
// import { Link } from "react-router";
// import { useForm } from "react-hook-form";
// import { Title } from "@/components/components/Title";
// import { Button } from "@/components/ui/button";
// import type { CreateProduct } from "@/interface/products/create-product.interface";
// import type { CategoriesResponse } from "@/interface/categories/categories.reponse";
// import { mapToCreateProduct } from '../mapping/mapProduct';
// import type { Product } from "@/interface/products/product.interface";
// import { X, SaveAll, Upload } from "lucide-react";
// import { cn } from "@/lib/utils";
// import type { ProvidersResponse } from "@/interface/providers/providers.response";
// import { getFullImageUrl } from "@/lib/formatUrl";

// interface Props {
//   title: string;
//   subTitle: string;
//   product: Product;
//   categories: CategoriesResponse;
//   providers: ProvidersResponse;
//   isPending: boolean;

//   onSubmit: (
//     productLike: Partial<CreateProduct> & { files?: File[] }
//   ) => Promise<void>;
// }

// interface FormInputs extends CreateProduct  {
//   files?: File[];
// }

// export const ProductForm = ({
//   title,
//   subTitle,
//   product,
//   categories,
//   providers,
//   onSubmit,
//   isPending,
// }: Props) => {
//   const [dragActive, setDragActive] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     getValues,
//     setValue,
//     reset,
//   } = useForm<FormInputs>({
//     defaultValues: mapToCreateProduct(product),
//   });

// useEffect(() => {
//   if (product && product.id !== 'new') {
//     reset(mapToCreateProduct(product));
//   }
// }, [product, reset]);

// // useEffect(() => {
// //   // eslint-disable-next-line react-hooks/set-state-in-effect
// //   setFiles([]);
// // }, [product]);

//   const handleFormSubmit = (data: FormInputs) => {
//     onSubmit({
//       ...data,
//       files,
//     });
//   };

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     setDragActive(false);

//     const droppedFiles = e.dataTransfer.files;
//     if (!droppedFiles) return;

//     const newFiles = Array.from(droppedFiles);

//     setFiles((prev) => [...prev, ...newFiles]);

//     const currentFiles = getValues("files") ?? [];
//     setValue("files", [...currentFiles, ...newFiles]);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const inputFiles = e.target.files;
//     if (!inputFiles) return;

//     const newFiles = Array.from(inputFiles);

//     setFiles((prev) => [...prev, ...newFiles]);

//     const currentFiles = getValues("files") ?? [];
//     setValue("files", [...currentFiles, ...newFiles]);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)}>
      
//       <div className="flex justify-between items-center">
//         <Title title={title} subtitle={subTitle} />

//         <div className="flex justify-end mb-10 gap-4">
//           <Button variant="outline" type="button">
//             <Link to="/dashboard/products" className="flex items-center gap-2">
//               <X className="w-4 h-4" />
//               Cancelar
//             </Link>
//           </Button>

//           <Button type="submit" disabled={isPending}>
//             <SaveAll className="w-4 h-4" />
//             Guardar cambios
//           </Button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* MAIN FORM */}
//           <div className="lg:col-span-2 space-y-6">

//             <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
//               <h2 className="text-xl font-semibold text-slate-800 mb-6">
//                 Información del producto
//               </h2>

//               <div className="space-y-6">

//                 {/* NAME */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Título del producto
//                   </label>

//                   <input
//                     type="text"
//                     {...register("productName", { required: true })}
//                     className={cn(
//                       "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                       { "border-red-500": errors.productName }
//                     )}
//                     placeholder="Título del producto"
//                   />

//                   {errors.productName && (
//                     <p className="text-red-500 text-sm">
//                       El nombre es requerido
//                     </p>
//                   )}
//                 </div>

//                 {/* PRICE + STOCK */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Precio ($)
//                     </label>

//                     <input
//                       type="number"
//                       {...register("productPrice", { required: true, min: 1 })}
//                       className={cn(
//                         "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                         { "border-red-500": errors.productPrice }
//                       )}
//                       placeholder="Precio"
//                     />

//                     {errors.productPrice && (
//                       <p className="text-red-500 text-sm">
//                         El precio debe ser mayor a 0
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Actual Stock
//                     </label>

//                     <input
//                       type="number"
//                       {...register("productCurrentStock", { required: true, min: 0 })}
//                       className={cn(
//                         "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                         { "border-red-500": errors.productCurrentStock }
//                       )}
//                       placeholder="Stock"
//                     />

//                     {errors.productCurrentStock && (
//                       <p className="text-red-500 text-sm">
//                         El stock es requerido
//                       </p>
//                     )}
//                   </div>

//                 </div>

//                 {/* ProductCostPrice */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Precio de costo
//                   </label>

//                   <input
//                     type="number"
//                     {...register("productCostPrice", 
//                       { required: true, min: 0 })}
//                     className={cn(
//                       "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                       { "border-red-500": errors.productCostPrice }
//                     )}
//                     placeholder="CostPrice"
//                   />

//                   {errors.productCostPrice && (
//                     <p className="text-red-500 text-sm">
//                       {errors.productCostPrice?.message || "El Costo del Producto es requerido"}
//                     </p>
//                   )}
//                 </div>

//                {/* MinStock + MaxStock */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       MinStock 
//                     </label>

//                     <input
//                       type="number"
//                       {...register("productMinStock", { required: true, min: 1 })}
//                       className={cn(
//                         "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                         { "border-red-500": errors.productMinStock }
//                       )}
//                       placeholder="MinStock"
//                     />

//                     {errors.productMinStock && (
//                       <p className="text-red-500 text-sm">
//                         El MinStock es requerido 
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       MaxStock
//                     </label>

//                     <input
//                       type="number"
//                       {...register("productMaxStock", { required: true, min: 0 })}
//                       className={cn(
//                         "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                         { "border-red-500": errors.productMaxStock }
//                       )}
//                       placeholder="MaxStock"
//                     />

//                     {errors.productMaxStock && (
//                       <p className="text-red-500 text-sm">
//                         El MaxStock es requerido
//                       </p>
//                     )}
//                   </div>

//                 </div>

//                 {/* CATEGORY */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Categoría
//                   </label>

//                   <select
//                     {...register("productCategoryId")}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg"
//                   >
//                     <option value="">Seleccionar categoría</option>

//                     {categories.data?.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                   {/* PROVIDERS */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Proveedores
//                   </label>

//                   <select
//                     {...register("productProviderId")}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg"
//                   >
//                     <option value="">Seleccionar proveedores</option>

//                     {providers.data?.map((provider) => (
//                       <option key={provider.id} value={provider.id}>
//                         {provider.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>


//                 {/* DESCRIPTION */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Descripción
//                   </label>

//                   <textarea
//                     {...register("productDescription", { required: true })}
//                     rows={5}
//                     className={cn(
//                       "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                       { "border-red-500": errors.productDescription }
//                     )}
//                     placeholder="Descripción del producto"
//                   />

//                   {errors.productDescription && (
//                     <p className="text-red-500 text-sm">
//                       La descripción es requerida
//                     </p>
//                   )}
//                 </div>

//               </div>
//             </div>
//           </div>

//           {/* SIDEBAR */}
//           <div className="space-y-6">

//             <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">

//               <h2 className="text-xl font-semibold text-slate-800 mb-6">
//                 Imágenes del producto
//               </h2>

//               {/* DROP ZONE */}
//               <div
//                 className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
//                   dragActive
//                     ? "border-blue-400 bg-blue-50"
//                     : "border-slate-300"
//                 }`}
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//               >

//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                   onChange={handleFileChange}
//                 />

//                 <Upload className="mx-auto h-12 w-12 text-slate-400" />

//                 <p className="mt-4 text-slate-700">
//                   Arrastra imágenes o haz clic
//                 </p>
//               </div>

//               {/* CURRENT IMAGES */}
//               <div className="mt-6 grid grid-cols-2 gap-3">

//                  {product.imageURL && (
//                     <img
//                     src={getFullImageUrl(product.imageURL)}
//                     className="rounded-lg object-cover"
//                     />
//                 )}
//               </div>

//               {/* NEW FILES */}
//               {files.length > 0 && (
//                 <div className="mt-6 grid grid-cols-2 gap-3">
//                   {files.map((file, index) => (
//                     <img
//                       key={index}
//                       src={URL.createObjectURL(file)}
//                       className="rounded-lg object-cover"
//                     />
//                   ))}
//                 </div>
//               )}
             
//             </div>

//                {/* PRODUCT STATUS */}
//           <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//             <h2 className="text-lg font-semibold text-slate-800 mb-5">
//               Estado del producto
//             </h2>

//             <div className="space-y-3">

//               {/* Estado activo */}
//               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                 <span className="text-sm font-medium text-slate-700">
//                   Estado
//                 </span>
//                 <span
//                   className={`px-3 py-1 text-xs font-medium rounded-full ${
//                     product.currentStock
//                       ? "bg-green-100 text-green-800"
//                       : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   {product.currentStock ? "Activo" : "Inactivo"}
//                 </span>
//               </div>

//               {/* Inventario */}
//               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                 <span className="text-sm font-medium text-slate-700">
//                   Inventario
//                 </span>
//                 <span
//                   className={`px-3 py-1 text-xs font-medium rounded-full ${product.currentStock}`}
//                 >
//                   {product.currentStock}
//                 </span>
//               </div>

//               {/* Cantidad exacta */}
//               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                 <span className="text-sm font-medium text-slate-700">
//                   Cantidad
//                 </span>
//                 <span className="text-sm font-semibold text-slate-800">
//                   {product.currentStock} unidades
//                 </span>
//               </div>

//               {/* Imágenes */}
//               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
//                 <span className="text-sm font-medium text-slate-700">
//                   Imágenes
//                 </span>
//                 <span className="text-sm text-slate-600">
//                   {(product.imageURL ? 1 : 0) + files.length} imágenes
//                 </span>
//               </div>

//             </div>
//           </div>


//           </div>

//         </div>
//       </div>
//     </form>
//   );
// };

