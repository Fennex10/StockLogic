import { useEffect } from "react";
import type { Provider } from "@/interface/providers/provider.interface";
import type { CreateProvider } from "@/interface/providers/create-provider";
import { mapToCreateProvider } from "../../mapping/mapProvider";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Asumiendo que usas Shadcn
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone, MapPin, Globe, CreditCard, User } from "lucide-react";

interface Props {
  provider: Provider;
  isPending: boolean;
  onSubmit: (data: Partial<CreateProvider> & { files?: File[] }) => Promise<void>;
}

interface FormInputs extends CreateProvider {
  color: string;
}

export const ProviderForm = ({ provider, onSubmit, isPending }: Props) => {
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
    // if (provider && provider.id !== "new") {
      reset(mapToCreateProvider(provider))
      // reset({
      //   ...mapToCreateProvider(provider),
      // });
    // }
  }, [provider, reset]);

  const handleFormSubmit = (data: FormInputs) => {
    onSubmit(data);
    
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Nombre de la Empresa */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="providerName" className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" /> Nombre de la Empresa
          </Label>
          <Input
            id="providerName"
            {...register("providerName", { required: "El nombre es obligatorio" })}
            className={cn("h-11 transition-all focus-visible:ring-primary/20", {
              "border-destructive ring-destructive/20": errors.providerName,
            })}
            placeholder="Ej. Suministros Globales S.A."
          />
          {errors.providerName && (
            <p className="text-destructive text-xs font-medium">{errors.providerName.message}</p>
          )}
        </div>

        {/* Tax ID */}
        <div className="space-y-2">
          <Label htmlFor="providerTaxId" className="text-sm font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" /> Tax ID / RNC
          </Label>
          <Input
            id="providerTaxId"
            {...register("providerTaxId", { required: "El Tax ID es obligatorio" })}
            className={cn("h-11", { "border-destructive": errors.providerTaxId })}
            placeholder="001-000000-0"
          />
          {errors.providerTaxId && (
            <p className="text-destructive text-xs font-medium">Requerido</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="providerEmail" className="text-sm font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" /> Correo Electrónico
          </Label>
          <Input
            id="providerEmail"
            type="email"
            {...register("providerEmail", { required: "El email es obligatorio" })}
            className={cn("h-11", { "border-destructive": errors.providerEmail })}
            placeholder="contacto@empresa.com"
          />
          {errors.providerEmail && (
            <p className="text-destructive text-xs font-medium">Email es requerido</p>
          )}
        </div>

        {/* Persona de Contacto */}
        <div className="space-y-2">
          <Label htmlFor="providerContactName" className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" /> Persona de Contacto
          </Label>
          <Input
            id="providerContactName"
            {...register("providerContactName", { required: true })}
            className={cn("h-11", { "border-destructive": errors.providerContactName })}
            placeholder="Nombre del representante"
          />
          {errors.providerContactName && (
            <p className="text-destructive text-xs font-medium">Requerido</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="providerPhone" className="text-sm font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" /> Teléfono
          </Label>
          <Input
            id="providerPhone"
            {...register("providerPhone", { required: true })}
            className={cn("h-11", { "border-destructive": errors.providerPhone })}
            placeholder="+1 (809) 000-0000"
          />
          {errors.providerPhone && (
            <p className="text-destructive text-xs font-medium">Número requerido</p>
          )}
        </div>

        {/* Dirección */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="providerAddress" className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" /> Dirección Física
          </Label>
          <Input
            id="providerAddress"
            {...register("providerAddress", { required: true })}
            className={cn("h-11", { "border-destructive": errors.providerAddress })}
            placeholder="Calle, Número, Ciudad, País"
          />
          {errors.providerAddress && (
            <p className="text-destructive text-xs font-medium">Dirección requerida</p>
          )}
        </div>

        {/* Sitio Web */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="providerWebsite" className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" /> Sitio Web
          </Label>
          <Input
            id="providerWebsite"
            {...register("providerWebsite", { required: true })}
            className={cn("h-11", { "border-destructive": errors.providerWebsite })}
            placeholder="https://wwww.empresa.com"
          />
          {errors.providerWebsite && (
            <p className="text-destructive text-xs font-medium">Sitio web requerido</p>
          )}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          disabled={isPending}
          className="rounded-xl px-6"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isPending}
          className="rounded-xl px-8 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </span>
          ) : "Guardar Proveedor"}
        </Button>
      </div>
    </form>
  );
};

// import { useEffect } from "react";
// import type { Provider } from "@/interface/providers/provider.interface";
// import type { CreateProvider } from "@/interface/providers/create-provider";
// import { mapToCreateProvider } from "../../mapping/mapProvider";
// import { useForm } from "react-hook-form";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// interface Props {
//   provider: Provider;
//   isPending: boolean;
//   onSubmit: (
//     data: Partial<CreateProvider> & { files?: File[] }
//   ) => Promise<void>;
// }

// interface FormInputs extends CreateProvider {
//   color: string;
// }

// export const ProviderForm = ({
//   provider,
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
//       ...mapToCreateProvider(provider),
//     },
//   });

//   useEffect(() => {
//     if (provider && provider.id !== "new") {
//       reset({
//         ...mapToCreateProvider(provider),
//       });
//     }
//   }, [provider, reset]);

//   const handleFormSubmit = (data: FormInputs) => {
//     onSubmit(data);
//   };


//   return (
//     <form
//           onSubmit={handleSubmit(handleFormSubmit)}
//           className="space-y-5"
//         >
    
//           {/* Nombre */}
//           <div className="space-y-2">
//             <label>Nombre de la Empresa</label>
//             <input
//               {...register("providerName", { required: true })}
//               className={cn(
//                 "w-full px-4 py-3 border rounded-lg",
//                 { "border-red-500": errors.providerName }
//               )}
//               placeholder="Nombre del proveedor"
//             />
//             {errors.providerName && (
//               <p className="text-red-500 text-sm">Requerido</p>
//             )}
//           </div>

//            <div className="space-y-2">
//             <label>Taxt Id Proveedor </label>
//             <input
//               {...register("providerTaxId", { required: true })}
//               className={cn(
//                 "w-full px-4 py-3 border rounded-lg",
//                 { "border-red-500": errors.providerTaxId }
//               )}
//               placeholder="TaxtId"
//             />
//             {errors.providerTaxId && (
//               <p className="text-red-500 text-sm">Requerido</p>
//             )}
//           </div>


//         {/* Persona de Contacto + Telefono */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                 <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Persona de Contacto 
//                 </label>

//                 <input
//                     type="text"
//                     {...register("providerContactName", { required: true})}
//                     className={cn(
//                     "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                     { "border-red-500": errors.providerContactName }
//                     )}
//                     placeholder="Nombre del contacto"
//                 />

//                 {errors.providerContactName && (
//                     <p className="text-red-500 text-sm">
//                     Requerido
//                     </p>
//                 )}
//                 </div>

//                 <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Telefonono
//                 </label>

//                 <input
//                     type="text"
//                     {...register("providerPhone", { required: true})}
//                     className={cn(
//                     "w-full px-4 py-3 border border-slate-300 rounded-lg",
//                     { "border-red-500": errors.providerPhone }
//                     )}
//                     placeholder="Telefono"
//                 />

//                 {errors.providerPhone && (
//                     <p className="text-red-500 text-sm">
//                     El numero de telefono es requerido
//                     </p>
//                 )}
//                 </div>

//             </div>

//           {/* Email */}
//           <div className="space-y-2">
//             <label>Email</label>
//             <input
//               {...register("providerEmail", { required: true })}
//               className={cn(
//                 "w-full px-4 py-3 border rounded-lg",
//                 { "border-red-500": errors.providerEmail }
//               )}
//               placeholder="Email"
//             />
//             {errors.providerEmail && (
//               <p className="text-red-500 text-sm">Email es requerido</p>
//             )}
//           </div>

//           {/* Direccion */}
//           <div className="space-y-2">
//             <label>Direccion</label>
//             <input
//               {...register("providerAddress", { required: true })}
//               className={cn(
//                 "w-full px-4 py-3 border rounded-lg",
//                 { "border-red-500": errors.providerAddress }
//               )}
//               placeholder="Direccion"
//             />
//             {errors.providerAddress && (
//               <p className="text-red-500 text-sm">Direccion es requerida</p>
//             )}
//           </div>

//           {/* Direccion */}
//           <div className="space-y-2">
//             <label>Sitio Web</label>
//             <input
//               {...register("providerWebsite", { required: true })}
//               className={cn(
//                 "w-full px-4 py-3 border rounded-lg",
//                 { "border-red-500": errors.providerWebsite }
//               )}
//               placeholder="Direccion"
//             />
//             {errors.providerWebsite && (
//               <p className="text-red-500 text-sm">WebSite es requerido</p>
//             )}
//           </div>
  
//           {/* Botones */}
//           <div className="flex justify-end gap-3 pt-2">
//             <Button type="submit" disabled={isPending}>
//               {isPending ? "Guardando..." : "Guardar"}
//             </Button>
//           </div>
    
//         </form>
//   );
// }