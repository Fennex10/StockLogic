import { useEffect } from "react";
import type { Provider } from "@/interface/providers/provider.interface";
import type { CreateProvider } from "@/interface/providers/create-provider";
import { mapToCreateProvider } from "../../mapping/mapProvider";
import { useForm } from "react-hook-form";
import type { CategoriesResponse } from "@/interface/categories/categories.reponse";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  provider: Provider;
  categories: CategoriesResponse;
  isPending: boolean;
  onSubmit: (
    data: Partial<CreateProvider> & { files?: File[] }
  ) => Promise<void>;
}

interface FormInputs extends CreateProvider {
  color: string;
}

export const ProviderForm = ({
  provider,
  categories,
  onSubmit,
  isPending,
}: Props) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      ...mapToCreateProvider(provider),
    },
  });

  useEffect(() => {
    if (provider && provider.id !== "new") {
      reset({
        ...mapToCreateProvider(provider),
      });
    }
  }, [provider, reset]);

  const handleFormSubmit = (data: FormInputs) => {
    onSubmit(data);
  };


  return (
    <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5"
        >
    
          {/* Nombre */}
          <div className="space-y-2">
            <label>Nombre de la Empresa</label>
            <input
              {...register("providerName", { required: true })}
              className={cn(
                "w-full px-4 py-3 border rounded-lg",
                { "border-red-500": errors.providerName }
              )}
              placeholder="Nombre del proveedor"
            />
            {errors.providerName && (
              <p className="text-red-500 text-sm">Requerido</p>
            )}
          </div>

           <div className="space-y-2">
            <label>Taxt Id Proveedor </label>
            <input
              {...register("providerName", { required: true })}
              className={cn(
                "w-full px-4 py-3 border rounded-lg",
                { "border-red-500": errors.providerTaxId }
              )}
              placeholder="TaxtId"
            />
            {errors.providerTaxId && (
              <p className="text-red-500 text-sm">Requerido</p>
            )}
          </div>


        {/* Persona de Contacto + Telefono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Persona de Contacto 
                </label>

                <input
                    type="text"
                    {...register("providerContactName", { required: true})}
                    className={cn(
                    "w-full px-4 py-3 border border-slate-300 rounded-lg",
                    { "border-red-500": errors.providerContactName }
                    )}
                    placeholder="Nombre del contacto"
                />

                {errors.providerContactName && (
                    <p className="text-red-500 text-sm">
                    Requerido
                    </p>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telefonono
                </label>

                <input
                    type="text"
                    {...register("providerPhone", { required: true})}
                    className={cn(
                    "w-full px-4 py-3 border border-slate-300 rounded-lg",
                    { "border-red-500": errors.providerPhone }
                    )}
                    placeholder="Telefono"
                />

                {errors.providerPhone && (
                    <p className="text-red-500 text-sm">
                    El numero de telefono es requerido
                    </p>
                )}
                </div>

            </div>

          {/* Email */}
          <div className="space-y-2">
            <label>Email</label>
            <input
              {...register("providerEmail", { required: true })}
              className={cn(
                "w-full px-4 py-3 border rounded-lg",
                { "border-red-500": errors.providerEmail }
              )}
              placeholder="Email"
            />
            {errors.providerEmail && (
              <p className="text-red-500 text-sm">Email es requerido</p>
            )}
          </div>

          {/* Direccion */}
          <div className="space-y-2">
            <label>Direccion</label>
            <input
              {...register("providerAddress", { required: true })}
              className={cn(
                "w-full px-4 py-3 border rounded-lg",
                { "border-red-500": errors.providerAddress }
              )}
              placeholder="Direccion"
            />
            {errors.providerEmail && (
              <p className="text-red-500 text-sm">Direccion es requerida</p>
            )}
          </div>

          {/* Direccion */}
          <div className="space-y-2">
            <label>Sitio Web</label>
            <input
              {...register("providerWebsite", { required: true })}
              className={cn(
                "w-full px-4 py-3 border rounded-lg",
                { "border-red-500": errors.providerWebsite }
              )}
              placeholder="Direccion"
            />
            {errors.providerWebsite && (
              <p className="text-red-500 text-sm">WebSite es requerido</p>
            )}
          </div>


    
          {/* Botones */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
    
        </form>
  );
}