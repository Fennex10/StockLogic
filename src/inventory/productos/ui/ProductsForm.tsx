import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { Title } from "@/inventory/productos/components/Title";
import { Button } from "@/components/ui/button";
import type { CreateProduct } from "@/interface/products/create-product.interface";
import type { CategoriesResponse } from "@/interface/categories/categories.reponse";
import { mapToCreateProduct } from '../mapping/mapProduct';
import type { Product } from "@/interface/products/product.interface";
import { X, SaveAll, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProvidersResponse } from "@/interface/providers/providers.response";
import { getFullImageUrl } from "@/lib/formatUrl";


interface Props {
  title: string;
  subTitle: string;
  product: Product;
  categories: CategoriesResponse;
  providers: ProvidersResponse;
  isPending: boolean;

  onSubmit: (
    productLike: Partial<CreateProduct> & { files?: File[] }
  ) => Promise<void>;
}

interface FormInputs extends CreateProduct  {
  files?: File[];
}

export const ProductForm = ({
  title,
  subTitle,
  product,
  categories,
  providers,
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
    defaultValues: mapToCreateProduct(product),
  });

useEffect(() => {
  if (product && product.id !== 'new') {
    reset(mapToCreateProduct(product));
  }
}, [product, reset]);

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
            <Link to="/dashboard/products" className="flex items-center gap-2">
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
                    {...register("productName", { required: true })}
                    className={cn(
                      "w-full px-4 py-3 border border-slate-300 rounded-lg",
                      { "border-red-500": errors.productName }
                    )}
                    placeholder="Título del producto"
                  />

                  {errors.productName && (
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
                      {...register("productPrice", { required: true, min: 1 })}
                      className={cn(
                        "w-full px-4 py-3 border border-slate-300 rounded-lg",
                        { "border-red-500": errors.productPrice }
                      )}
                      placeholder="Precio"
                    />

                    {errors.productPrice && (
                      <p className="text-red-500 text-sm">
                        El precio debe ser mayor a 0
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Actual Stock
                    </label>

                    <input
                      type="number"
                      {...register("productCurrentStock", { required: true, min: 0 })}
                      className={cn(
                        "w-full px-4 py-3 border border-slate-300 rounded-lg",
                        { "border-red-500": errors.productCurrentStock }
                      )}
                      placeholder="Stock"
                    />

                    {errors.productCurrentStock && (
                      <p className="text-red-500 text-sm">
                        El stock es requerido
                      </p>
                    )}
                  </div>

                </div>

                {/* ProductCostPrice */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio de costo
                  </label>

                  <input
                    type="number"
                    {...register("productCostPrice", 
                      { required: true, min: 0 })}
                    className={cn(
                      "w-full px-4 py-3 border border-slate-300 rounded-lg",
                      { "border-red-500": errors.productCostPrice }
                    )}
                    placeholder="CostPrice"
                  />

                  {errors.productCostPrice && (
                    <p className="text-red-500 text-sm">
                      {errors.productCostPrice?.message || "El Costo del Producto es requerido"}
                    </p>
                  )}
                </div>

               {/* MinStock + MaxStock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      MinStock 
                    </label>

                    <input
                      type="number"
                      {...register("productMinStock", { required: true, min: 1 })}
                      className={cn(
                        "w-full px-4 py-3 border border-slate-300 rounded-lg",
                        { "border-red-500": errors.productMinStock }
                      )}
                      placeholder="MinStock"
                    />

                    {errors.productMinStock && (
                      <p className="text-red-500 text-sm">
                        El MinStock es requerido 
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      MaxStock
                    </label>

                    <input
                      type="number"
                      {...register("productMaxStock", { required: true, min: 0 })}
                      className={cn(
                        "w-full px-4 py-3 border border-slate-300 rounded-lg",
                        { "border-red-500": errors.productMaxStock }
                      )}
                      placeholder="MaxStock"
                    />

                    {errors.productMaxStock && (
                      <p className="text-red-500 text-sm">
                        El MaxStock es requerido
                      </p>
                    )}
                  </div>

                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoría
                  </label>

                  <select
                    {...register("productCategoryId")}
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

                  {/* PROVIDERS */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Proveedores
                  </label>

                  <select
                    {...register("productProviderId")}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  >
                    <option value="">Seleccionar proveedores</option>

                    {providers.data?.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
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
                    {...register("productDescription", { required: true })}
                    rows={5}
                    className={cn(
                      "w-full px-4 py-3 border border-slate-300 rounded-lg",
                      { "border-red-500": errors.productDescription }
                    )}
                    placeholder="Descripción del producto"
                  />

                  {errors.productDescription && (
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

                 {product.imageURL && (
                    <img
                    src={getFullImageUrl(product.imageURL)}
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

               {/* PRODUCT STATUS */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">
              Estado del producto
            </h2>

            <div className="space-y-3">

              {/* Estado activo */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">
                  Estado
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    product.currentStock
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {product.currentStock ? "Activo" : "Inactivo"}
                </span>
              </div>

              {/* Inventario */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">
                  Inventario
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${product.currentStock}`}
                >
                  {product.currentStock}
                </span>
              </div>

              {/* Cantidad exacta */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">
                  Cantidad
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {product.currentStock} unidades
                </span>
              </div>

              {/* Imágenes */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">
                  Imágenes
                </span>
                <span className="text-sm text-slate-600">
                  {(product.imageURL ? 1 : 0) + files.length} imágenes
                </span>
              </div>

            </div>
          </div>


          </div>

        </div>
      </div>
    </form>
  );
};

