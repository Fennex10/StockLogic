import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { Title } from "@/inventory/productos/components/Title";
import { Button } from "@/components/ui/button";
import type { Product } from "@/interface/products/product.interface";
import type { CategoriesResponse } from "@/interface/products/categories.reponse";
import { X, SaveAll, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subTitle: string;
  product: Product;
  categories: CategoriesResponse;
  isPending: boolean;

  onSubmit: (
    productLike: Partial<Product > & { files?: File[] }
  ) => Promise<void>;
}

interface FormInputs extends Product  {
  files?: File[];
}

export const ProductForm = ({
  title,
  subTitle,
  product,
  categories,
  onSubmit,
  isPending,
}: Props) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<FormInputs>({
    defaultValues: product,
  });

  useEffect(() => {
    reset(product);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiles([]);
  }, [product, reset]);

  const handleFormSubmit = (data: FormInputs) => {
    onSubmit({
      ...data,
      files,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;

    const newFiles = Array.from(droppedFiles);

    setFiles((prev) => [...prev, ...newFiles]);

    const currentFiles = getValues("files") ?? [];
    setValue("files", [...currentFiles, ...newFiles]);
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
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex justify-between items-center">
        <Title title={title} subtitle={subTitle} />

        <div className="flex justify-end mb-10 gap-4">
          <Button variant="outline" type="button">
            <Link to="/admin/products" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancelar
            </Link>
          </Button>

          <Button type="submit" disabled={isPending}>
            <SaveAll className="w-4 h-4" />
            Guardar cambios
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN FORM */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Información del producto
              </h2>

              <div className="space-y-6">

                {/* NAME */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título del producto
                  </label>

                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className={cn(
                      "w-full px-4 py-3 border border-slate-300 rounded-lg",
                      { "border-red-500": errors.name }
                    )}
                    placeholder="Título del producto"
                  />

                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      El nombre es requerido
                    </p>
                  )}
                </div>

                {/* PRICE + STOCK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Precio ($)
                    </label>

                    <input
                      type="number"
                      {...register("price", { required: true, min: 1 })}
                      className={cn(
                        "w-full px-4 py-3 border border-slate-300 rounded-lg",
                        { "border-red-500": errors.price }
                      )}
                      placeholder="Precio"
                    />

                    {errors.price && (
                      <p className="text-red-500 text-sm">
                        El precio debe ser mayor a 0
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stock
                    </label>

                    <input
                      type="number"
                      {...register("currentStock", { required: true, min: 0 })}
                      className={cn(
                        "w-full px-4 py-3 border border-slate-300 rounded-lg",
                        { "border-red-500": errors.currentStock }
                      )}
                      placeholder="Stock"
                    />

                    {errors.currentStock && (
                      <p className="text-red-500 text-sm">
                        El stock es requerido
                      </p>
                    )}
                  </div>

                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU
                  </label>

                  <input
                    type="text"
                    {...register("sku", {
                      required: true,
                      validate: (value) =>
                        !/\s/.test(value) ||
                        "El SKU no puede contener espacios",
                    })}
                    className={cn(
                      "w-full px-4 py-3 border border-slate-300 rounded-lg",
                      { "border-red-500": errors.sku }
                    )}
                    placeholder="SKU"
                  />

                  {errors.sku && (
                    <p className="text-red-500 text-sm">
                      {errors.sku.message || "El SKU es requerido"}
                    </p>
                  )}
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoría
                  </label>

                  <select
                    {...register("categoryId")}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  >
                    <option value="">Seleccionar categoría</option>

                    {categories.data?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción
                  </label>

                  <textarea
                    {...register("description", { required: true })}
                    rows={5}
                    className={cn(
                      "w-full px-4 py-3 border border-slate-300 rounded-lg",
                      { "border-red-500": errors.description }
                    )}
                    placeholder="Descripción del producto"
                  />

                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      La descripción es requerida
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">

              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Imágenes del producto
              </h2>

              {/* DROP ZONE */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />

                <Upload className="mx-auto h-12 w-12 text-slate-400" />

                <p className="mt-4 text-slate-700">
                  Arrastra imágenes o haz clic
                </p>
              </div>

              {/* CURRENT IMAGES */}
              <div className="mt-6 grid grid-cols-2 gap-3">

                {/* {product.imageURL.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    className="rounded-lg object-cover"
                  />
                ))} */}
                 {product.imageURL && (
                    <img
                    src={product.imageURL}
                    className="rounded-lg object-cover"
                    />
                )}
              </div>

              {/* NEW FILES */}
              {files.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {files.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

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
// import { Title } from "@/inventory/productos/components/Title";
// import { Button } from "@/components/ui/button";
// import type { Products } from "@/interface/products/products.interface";
// import type { Categories } from "@/interface/products/categories.interface";
// import { X, SaveAll, Upload } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Props {
//   title: string;
//   subTitle: string;
//   product: Products;
//   categories: Categories[];
//   isPending: boolean;

//   onSubmit: (
//     productLike: Partial<Products> & { files?: File[] }
//   ) => Promise<void>;
// }

// interface FormInputs extends Products {
//   files?: File[];
// }

// export const ProductForm = ({
//   title,
//   subTitle,
//   product,
//   categories,
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
//   } = useForm<FormInputs>({
//     defaultValues: product,
//   });

//   useEffect(() => {
//     setFiles([]);
//   }, [product]);


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
//             <Link to="/admin/products" className="flex items-center gap-2">
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

//             {/* PRODUCT INFO */}
//             <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
//               <h2 className="text-xl font-semibold text-slate-800 mb-6">
//                 Información del producto
//               </h2>

//               <div className="space-y-6">

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Título del producto
//                   </label>

//                   <input
//                     type="text"
//                     {...register("name", { required: true })}
//                     className={cn(
//                       "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
//                       { "border-red-500": errors.name }
//                     )}
//                     placeholder="Título del producto"
//                   />

//                   {errors.name && (
//                     <p className="text-red-500 text-sm">
//                       El Nombre es requerido
//                     </p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Precio ($)
//                     </label>

//                     <input
//                       type="number"
//                       {...register("price", { required: true, min: 1 })}
//                       className={cn(
//                         "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
//                         { "border-red-500": errors.price }
//                       )}
//                       placeholder="Precio del producto"
//                     />

//                     {errors.price && (
//                       <p className="text-red-500 text-sm">
//                         El precio debe de ser mayor a 0
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Stock del producto
//                     </label>

//                     <input
//                       type="number"
//                       {...register("currentStock", { required: true, min: 1 })}
//                       className={cn(
//                         "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
//                         { "border-red-500": errors.currentStock }
//                       )}
//                       placeholder="Stock del producto"
//                     />

//                     {errors.currentStock && (
//                       <p className="text-red-500 text-sm">
//                         El inventario debe de ser mayor a 0
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     SKU
//                   </label>

//                   <input
//                     type="text"
//                     {...register("sku", {
//                       required: true,
//                       validate: (value) =>
//                         !/\s/.test(value) ||
//                         "El SKU no puede contener espacios",
//                     })}
//                     className={cn(
//                       "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
//                       { "border-red-500": errors.sku }
//                     )}
//                     placeholder="SKU"
//                   />

//                   {errors.sku && (
//                     <p className="text-red-500 text-sm">
//                       {errors.sku.message || "El SKU es requerido"}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Categoría
//                   </label>

//                   <select
//                     {...register("categoryId")}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   >
//                     <option value="">Seleccionar categoría</option>

//                     {categories.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Descripción
//                   </label>

//                   <textarea
//                     {...register("description", { required: true })}
//                     rows={5}
//                     className={cn(
//                       "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
//                       { "border-red-500": errors.description }
//                     )}
//                     placeholder="Descripción del producto"
//                   />

//                   {errors.description && (
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

//             {/* IMAGES */}
//             <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">

//               <h2 className="text-xl font-semibold text-slate-800 mb-6">
//                 Imágenes del producto
//               </h2>

//               <div
//                 className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
//                   dragActive
//                     ? "border-blue-400 bg-blue-50"
//                     : "border-slate-300 hover:border-slate-400"
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

//                 <div className="space-y-4">
//                   <Upload className="mx-auto h-12 w-12 text-slate-400" />

//                   <div>
//                     <p className="text-lg font-medium text-slate-700">
//                       Arrastra las imágenes aquí
//                     </p>

//                     <p className="text-sm text-slate-500">
//                       o haz clic para buscar
//                     </p>
//                   </div>

//                   <p className="text-xs text-slate-400">
//                     PNG, JPG, WebP hasta 10MB
//                   </p>
//                 </div>
//               </div>

//               {/* CURRENT IMAGES */}
//               <div className="mt-6 space-y-3">
//                 <h3 className="text-sm font-medium text-slate-700">
//                   Imágenes actuales
//                 </h3>

//                 <div className="grid grid-cols-2 gap-3">
//                   {product.imageURL.map((image, index) => (
//                     <div key={index} className="relative group">

//                       <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
//                         <img
//                           src={image}
//                           alt="Product"
//                           className="w-full h-full object-cover rounded-lg"
//                         />
//                       </div>

//                       <p className="mt-1 text-xs text-slate-600 truncate">
//                         {image}
//                       </p>

//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* FILES TO UPLOAD */}
//               <div
//                 className={cn("mt-6 space-y-3", {
//                   hidden: files.length === 0,
//                 })}
//               >

//                 <h3 className="text-sm font-medium text-slate-700">
//                   Imágenes por cargar
//                 </h3>

//                 <div className="grid grid-cols-2 gap-3">
//                   {files.map((file, index) => (
//                     <img
//                       key={index}
//                       src={URL.createObjectURL(file)}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   ))}
//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>
//       </div>
//     </form>
//   );
// };