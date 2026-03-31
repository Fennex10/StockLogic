import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Building2, Key, Mail, UserCheck, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { CreateUserManager } from "@/interface/userManager/create-user-manager";
import type { UserManager } from "@/interface/userManager/userManager.interface";
import type { UserRolesResponse } from "@/interface/userManager/roles/roles.response";
import { mapToCreateProvider } from "../mapping/mapUserManager";

interface Props {
  user: UserManager;
  roles: UserRolesResponse;
  isPending: boolean;
  onSubmit: (data: Partial<CreateUserManager>) => Promise<void>;
}

interface FormInputs extends CreateUserManager {
  color: string;
}

export const UserManagerForm = ({ user, roles, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      ...mapToCreateProvider(user),
    },
  });

  useEffect(() => {
    reset(mapToCreateProvider(user));
  }, [user, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("userPassword");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Contenedor Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Usuario - Ahora col-span-2 para consistencia total o 1 si quieres pares */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="userName" className="text-sm font-medium flex items-center gap-2 ml-1">
            <Building2 className="h-4 w-4 text-primary/60" /> Nombre de Usuario
          </Label>
          <Input
            id="userName"
            {...register("userName", { required: "El nombre es obligatorio" })}
            className={cn("h-12 rounded-xl bg-background border-muted-foreground/20 focus:border-primary/50 transition-all shadow-sm", {
              "border-destructive ring-destructive/10": errors.userName,
            })}
            placeholder="Ej: jmendez"
          />
          {errors.userName && <p className="text-destructive text-xs mt-1 ml-1">{errors.userName.message}</p>}
        </div>

        {/* Email - Ahora ocupa todo el ancho disponible para no verse "pequeño" */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="userEmail" className="text-sm font-medium flex items-center gap-2 ml-1">
            <Mail className="h-4 w-4 text-primary/60" /> Correo Electrónico
          </Label>
          <Input
            id="userEmail"
            type="email"
            {...register("userEmail", { 
                required: "El email es obligatorio",
                pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } 
            })}
            className={cn("h-12 rounded-xl bg-background border-muted-foreground/20 shadow-sm", { 
              "border-destructive": errors.userEmail 
            })}
            placeholder="correo@ejemplo.com"
          />
          {errors.userEmail && <p className="text-destructive text-xs mt-1 ml-1">{errors.userEmail.message}</p>}
        </div>

        {/* Password - Fila compartida para ahorrar espacio vertical pero con mismo alto */}
        <div className="space-y-2">
          <Label htmlFor="userPassword" className="text-sm font-medium flex items-center gap-2 ml-1">
            <Key className="h-4 w-4 text-primary/60" /> Contraseña
          </Label>
          <Input
            id="userPassword"
            type="password"
            {...register("userPassword", { 
              required: user.id === 'new' ? "La contraseña es obligatoria" : false,
              minLength: { value: 6, message: "Mínimo 6 caracteres" }
            })}
            className={cn("h-12 rounded-xl bg-background border-muted-foreground/20 shadow-sm", {
              "border-destructive": errors.userPassword,
            })}
            placeholder="••••••••"
          />
          {errors.userPassword && <p className="text-destructive text-xs mt-1 ml-1">{errors.userPassword.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="userPasswordConfirm" className="text-sm font-medium flex items-center gap-2 ml-1">
            <ShieldCheck className="h-4 w-4 text-primary/60" /> Confirmar Contraseña
          </Label>
          <Input
            id="userPasswordConfirm"
            type="password"
            {...register("userPasswordConfirm", { 
              validate: (value) => value === password || "Las contraseñas no coinciden"
            })}
            className={cn("h-12 rounded-xl bg-background border-muted-foreground/20 shadow-sm", {
              "border-destructive": errors.userPasswordConfirm,
            })}
            placeholder="••••••••"
          />
          {errors.userPasswordConfirm && <p className="text-destructive text-xs mt-1 ml-1">{errors.userPasswordConfirm.message}</p>}
        </div>

        {/* Role Select - Ocupa todo el ancho para cerrar el bloque de inputs */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="roles" className="text-sm font-medium flex items-center gap-2 ml-1">
            <UserCheck className="h-4 w-4 text-primary/60" /> Rol asignado
          </Label>
          <div className="relative">
            <select
              {...register("userRoleId", { required: "Seleccionar un rol es obligatorio" })}
              className={cn(
                "w-full h-12 px-4 bg-background border border-muted-foreground/20 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm",
                { "border-destructive": errors.userRoleId }
              )}
            >
              <option value="">Seleccionar un rol corporativo...</option>
              {roles.data?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground/60">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          {errors.userRoleId && <p className="text-destructive text-xs mt-1 ml-1">{errors.userRoleId.message}</p>}
        </div>
      </div>

      {/* Botones de acción mejorados */}
      <div className="flex items-center justify-end gap-4 pt-8 border-t border-muted/40">
        <Button 
          type="button" 
          variant="outline" 
          className="rounded-xl px-8 h-12 border-muted-foreground/20 hover:bg-muted/50 transition-colors"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isPending}
          className="rounded-xl px-10 h-12 shadow-md shadow-primary/20 bg-primary hover:bg-primary/95 transition-all active:scale-[0.98]"
        >
          {isPending ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Guardando...</span>
            </div>
          ) : (
            user.id === 'new' ? "Crear cuenta" : "Actualizar datos"
          )}
        </Button>
      </div>
    </form>
  );
};

// import type { CreateUserManager } from "@/interface/userManager/create-user-manager";
// import type { UserManager } from "@/interface/userManager/userManager.interface";
// import { useForm } from "react-hook-form";
// import { mapToCreateProvider } from "../mapping/mapUserManager";
// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Building2, Key, Mail, UserCheck, } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import type { UserRolesResponse } from "@/interface/userManager/roles/roles.response";
// import { cn } from "@/lib/utils";


// interface Props {
//   user: UserManager;
//   roles: UserRolesResponse;
//   isPending: boolean;
//   onSubmit: (data: Partial<CreateUserManager>) => Promise<void>;
// }

// interface FormInputs extends CreateUserManager {
//   color: string;
// }

// export const UserManagerForm = ({ user, roles, onSubmit, isPending }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       ...mapToCreateProvider(user),
//     },
//   });

//   useEffect(() => {
//       reset(mapToCreateProvider(user))
//   }, [user, reset]);

//   const handleFormSubmit = (data: FormInputs) => {
//     onSubmit(data);
    
//   };
  
//     return (
//      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
//         {/* Nombre de la Empresa */}
//         <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="userName" className="text-sm font-semibold flex items-center gap-2">
//             <Building2 className="h-4 w-4 text-muted-foreground" /> Introducir nombre de usuario 
//           </Label>
//           <Input
//             id="userName"
//             {...register("userName", { required: "El nombre es obligatorio" })}
//             className={cn("h-11 transition-all focus-visible:ring-primary/20", {
//               "border-destructive ring-destructive/20": errors.userName,
//             })}
//             placeholder="Juan Perez..."
//           />
//           {errors.userName && (
//             <p className="text-destructive text-xs font-medium">{errors.userName.message}</p>
//           )}
//         </div>
        
//         {/* Email */}
//         <div className="space-y-2">
//           <Label htmlFor="userEmail" className="text-sm font-semibold flex items-center gap-2">
//             <Mail className="h-4 w-4 text-muted-foreground" /> Correo Electrónico
//           </Label>
//           <Input
//             id="userEmail"
//             type="email"
//             {...register("userEmail", { required: "El email es obligatorio" })}
//             className={cn("h-11", { "border-destructive": errors.userEmail })}
//             placeholder="contacto@empresa.com"
//           />
//           {errors.userEmail && (
//             <p className="text-destructive text-xs font-medium">Email es requerido</p>
//           )}
//         </div>

//          {/* password */}
//          <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="userPassword" className="text-sm font-semibold flex items-center gap-2">
//             <Key className="h-4 w-4 text-muted-foreground" /> Coloque su contrasena
//           </Label>
//           <Input
//             id="userPassword"
//             {...register("userPassword", { required: "La contrasena es obligatoria" })}
//             className={cn("h-11 transition-all focus-visible:ring-primary/20", {
//               "border-destructive ring-destructive/20": errors.userPassword,
//             })}
//             placeholder="*******"
//           />
//           {errors.userName && (
//             <p className="text-destructive text-xs font-medium">{errors.userPassword?.message}</p>
//           )}
//         </div>

//         {/* confirmPassword */}
//          <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="userPasswordConfirm" className="text-sm font-semibold flex items-center gap-2">
//             <Key className="h-4 w-4 text-muted-foreground" /> Confirma la contrasena 
//           </Label>
//           <Input
//             id="userPasswordConfirm"
//             {...register("userPasswordConfirm", { required: "Confirmar la contrasena es obligatorio" })}
//             className={cn("h-11 transition-all focus-visible:ring-primary/20", {
//               "border-destructive ring-destructive/20": errors.userPasswordConfirm,
//             })}
//             placeholder="*******"
//           />
//           {errors.userPasswordConfirm && (
//             <p className="text-destructive text-xs font-medium">{errors.userPasswordConfirm?.message}</p>
//           )}
//         </div>

       
//          <div>
//             <Label htmlFor="roles" className="text-sm font-semibold flex items-center gap-2">
//             <UserCheck className="h-4 w-4 text-muted-foreground" /> Seleciona el Role
//           </Label>

//             <select
//                 {...register("userRoleId")}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg"
//             >
//                 <option value="">Seleccionar Roles</option>

//                 {roles.data?.map((role) => (
//                 <option key={role.id} value={role.id}>
//                     {role.name}
//                 </option>
//                 ))}
//             </select>
//             </div>

//       </div>

//       {/* Botones de Acción */}
//       <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
//         <Button 
//           type="button" 
//           variant="outline" 
//         //   disabled={isPending}
//           className="rounded-xl px-6"
//         >
//           Cancelar
//         </Button>
//         <Button 
//           type="submit" 
//           disabled={isPending}
//           className="rounded-xl px-8 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
//         >
//           {isPending ? (
//             <span className="flex items-center gap-2">
//               <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               Guardando...
//             </span>
//           ) : "Guardar Proveedor"}
//         </Button>
//       </div>
//     </form>
//   )
// }
