import { Upload } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

export interface ProductFormData {
  name: string
  sku: string
  category: string
  supplier: string
  purchasePrice: string
  salePrice: string
  stock: string
  minStock: string
  description: string
}

const categories = [
  "Electrónicos",
  "Periféricos",
  "Componentes",
  "Accesorios",
  "Audio",
  "Video",
  "Redes",
  "Software",
]

const suppliers = [
  "Tech Solutions S.A.",
  "Electronics Global",
  "Components Pro",
  "Audio Masters",
  "Peripheral Supplies",
]

export function ProductForm() {

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      supplier: "",
      purchasePrice: "",
      salePrice: "",
      stock: "",
      minStock: "",
      description: "",
    },
  })

  const onSubmit = (data: ProductFormData) => {
    console.log("Producto:", data)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <h2 className="text-2xl font-semibold">
        Nuevo Producto
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* NAME + SKU */}

          <div className="grid md:grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Laptop Dell XPS 15" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="DELL-XPS-001" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

          </div>

          {/* CATEGORY + SUPPLIER */}

          <div className="grid md:grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >

                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >

                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </FormItem>
              )}
            />

          </div>

          {/* PRICES */}

          <div className="grid md:grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de Compra</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de Venta</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

          </div>

          {/* STOCK */}

          <div className="grid md:grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Mínimo</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

          </div>

          {/* DESCRIPTION */}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* IMAGE */}

          <div className="border border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent">
            <Upload className="mx-auto mb-2 w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Subir imagen del producto
            </p>
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end">
            <Button type="submit">
              Crear Producto
            </Button>
          </div>

        </form>
      </Form>
    </div>
  )
}