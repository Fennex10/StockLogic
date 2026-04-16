import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import {
  Mail,
  User,
  Key,
  ShieldCheck,
  Loader2,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { CreateUserManager } from "@/interface/userManager/create-user-manager";
import type { UserManager } from "@/interface/userManager/userManager.interface";
import type { UserRolesResponse } from "@/interface/userManager/roles/roles.response";
import { mapToCreateUser } from "../mapping/mapUserManager";

interface Props {
  user: UserManager;
  roles: UserRolesResponse;
  isPending: boolean;
  onSubmit: (data: Partial<CreateUserManager>) => Promise<void>;
}

/* 🔥 Animaciones */
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const UserManagerForm = ({ user, roles, onSubmit, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateUserManager>({
    defaultValues: mapToCreateUser(user),
  });

  useEffect(() => {
    reset(mapToCreateUser(user));
  }, [user, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("userPassword");

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto space-y-10"
    >
      {/* HEADER */}
      <motion.div variants={item} className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          {user.id === "new" ? "Crear Usuario" : "Editar Usuario"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Configura la información y permisos del usuario
        </p>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* USERNAME */}
        <motion.div variants={item} className="space-y-2">
          <span className="text-xs text-muted-foreground">Usuario</span>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition" />
            <Input
              {...register("userName", { required: "Requerido" })}
              placeholder="jmendez"
              className={cn(
                "pl-10 h-11 bg-muted/40 border border-transparent focus:border-border focus:bg-background transition",
                errors.userName && "border-destructive"
              )}
            />
          </div>
        </motion.div>

        {/* EMAIL */}
        <motion.div variants={item} className="space-y-2">
          <span className="text-xs text-muted-foreground">Email</span>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition" />
            <Input
              type="email"
              {...register("userEmail", {
                required: "Requerido",
                pattern: { value: /^\S+@\S+$/, message: "Email inválido" },
              })}
              placeholder="correo@ejemplo.com"
              className={cn(
                "pl-10 h-11 bg-muted/40 border border-transparent focus:border-border focus:bg-background transition",
                errors.userEmail && "border-destructive"
              )}
            />
          </div>
        </motion.div>

        {/* PASSWORD */}
        <motion.div variants={item} className="space-y-2">
          <span className="text-xs text-muted-foreground">Contraseña</span>
          <div className="relative group">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition" />
            <Input
              type="password"
              {...register("userPassword", {
                required: user.id === "new" ? "Requerido" : false,
                minLength: { value: 6, message: "Min 6 caracteres" },
              })}
              className="pl-10 h-11 bg-muted/40 border border-transparent focus:border-border focus:bg-background transition"
            />
          </div>
        </motion.div>

        {/* CONFIRM PASSWORD */}
        <motion.div variants={item} className="space-y-2">
          <span className="text-xs text-muted-foreground">Confirmar</span>
          <div className="relative group">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition" />
            <Input
              type="password"
              {...register("userPasswordConfirm", {
                validate: (v) => v === password || "No coincide",
              })}
              className="pl-10 h-11 bg-muted/40 border border-transparent focus:border-border focus:bg-background transition"
            />
          </div>
        </motion.div>

        {/* ROLE */}
        <motion.div variants={item} className="md:col-span-2 space-y-2">
          <span className="text-xs text-muted-foreground">Rol</span>
          <select
            {...register("userRoleId", { required: true })}
            className="w-full h-11 px-3 bg-muted/40 border border-transparent rounded-md text-sm focus:border-border focus:bg-background transition"
          >
            <option value="">Seleccionar rol...</option>
            {roles.data?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* ACTIONS */}
      <motion.div
        variants={item}
        className="flex justify-end gap-3 pt-6"
      >
        <Button
          type="button"
          variant="ghost"
          className="h-10 px-5"
          onClick={() => reset()}
        >
          Descartar
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 bg-foreground text-background bg-primary hover:bg-foreground/90 flex items-center gap-2"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {user.id === "new" ? "Crear Usuario" : "Guardar Usuario"}
        </Button>
      </motion.div>
    </motion.form>
  );
};
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Building2, Key, Mail, UserCheck, ShieldCheck, User } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";

// import type { CreateUserManager } from "@/interface/userManager/create-user-manager";
// import type { UserManager } from "@/interface/userManager/userManager.interface";
// import type { UserRolesResponse } from "@/interface/userManager/roles/roles.response";
// import { mapToCreateUser } from "../mapping/mapUserManager";

// interface Props {
//   user: UserManager;
//   roles: UserRolesResponse;
//   isPending: boolean;
//   onSubmit: (data: Partial<CreateUserManager>) => Promise<void>;
// }

// export const UserManagerForm = ({ user, roles, onSubmit, isPending }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm<CreateUserManager>({
//     defaultValues: {
//       ...mapToCreateUser(user),
//     },
//   });

//   useEffect(() => {
//     reset(mapToCreateUser(user));
//   }, [user, reset]);

//   // eslint-disable-next-line react-hooks/incompatible-library
//   const password = watch("userPassword");

//   // Clase común para los inputs basada en tu imagen (menos redondeado, borde suave)
//   const inputStyle = "pl-10 h-11 rounded-lg border-muted-foreground/20 bg-background focus:ring-1 focus:ring-primary/30 transition-all shadow-none";

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      
//       {/* SECCIÓN: Información Personal */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="p-2 bg-primary/10 rounded-lg">
//             <User className="h-4 w-4 text-primary" />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-foreground">Perfil de Usuario</h3>
//             <p className="text-[12px] text-muted-foreground">Datos principales de acceso e identidad</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="userName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 ml-1">
//               Nombre de Usuario
//             </Label>
//             <div className="relative group">
//               <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
//               <Input
//                 id="userName"
//                 {...register("userName", { required: "El nombre es obligatorio" })}
//                 className={cn(inputStyle, { "border-destructive": errors.userName })}
//                 placeholder="Ej: jmendez"
//               />
//             </div>
//             {errors.userName && <p className="text-destructive text-[11px] font-medium ml-1">{errors.userName.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="userEmail" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 ml-1">
//               Correo Electrónico
//             </Label>
//             <div className="relative group">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
//               <Input
//                 id="userEmail"
//                 type="email"
//                 {...register("userEmail", { 
//                     required: "El email es obligatorio",
//                     pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } 
//                 })}
//                 className={cn(inputStyle, { "border-destructive": errors.userEmail })}
//                 placeholder="correo@ejemplo.com"
//               />
//             </div>
//             {errors.userEmail && <p className="text-destructive text-[11px] font-medium ml-1">{errors.userEmail.message}</p>}
//           </div>
//         </div>
//       </div>

//       <Separator className="opacity-50" />

//       {/* SECCIÓN: Seguridad y Permisos */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="p-2 bg-amber-500/10 rounded-lg">
//             <ShieldCheck className="h-4 w-4 text-amber-600" />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-foreground">Seguridad y Roles</h3>
//             <p className="text-[12px] text-muted-foreground">Credenciales y nivel de acceso</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="userPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 ml-1">
//               Contraseña
//             </Label>
//             <div className="relative group">
//               <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-amber-600 transition-colors" />
//               <Input
//                 id="userPassword"
//                 type="password"
//                 {...register("userPassword", { 
//                   required: user.id === 'new' ? "La contraseña es obligatoria" : false,
//                   minLength: { value: 6, message: "Mínimo 6 caracteres" }
//                 })}
//                 className={cn(inputStyle, { "border-destructive": errors.userPassword })}
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="userPasswordConfirm" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 ml-1">
//               Confirmar Contraseña
//             </Label>
//             <div className="relative group">
//               <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-amber-600 transition-colors" />
//               <Input
//                 id="userPasswordConfirm"
//                 type="password"
//                 {...register("userPasswordConfirm", { 
//                   validate: (value) => value === password || "No coincide"
//                 })}
//                 className={cn(inputStyle, { "border-destructive": errors.userPasswordConfirm })}
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           <div className="space-y-2 md:col-span-2">
//             <Label htmlFor="roles" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 ml-1">
//               Rol corporativo
//             </Label>
//             <div className="relative group">
//               <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />
//               <select
//                 {...register("userRoleId", { required: "Seleccionar un rol es obligatorio" })}
//                 className={cn(
//                   "w-full h-11 pl-10 pr-10 border border-muted-foreground/20 rounded-lg bg-background appearance-none focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-sm",
//                   { "border-destructive": errors.userRoleId }
//                 )}
//               >
//                 <option value="">Seleccionar un rol...</option>
//                 {roles.data?.map((role) => (
//                   <option key={role.id} value={role.id}>{role.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6">
//         <Button type="button" variant="ghost" className="w-full sm:w-auto rounded-lg px-6 h-11">
//           Cancelar
//         </Button>
//         <Button 
//           type="submit" 
//           disabled={isPending}
//           className="w-full sm:w-auto rounded-lg px-8 h-11 shadow-sm bg-primary hover:bg-primary/90 transition-all active:scale-95"
//         >
//           {isPending ? "Guardando..." : user.id === 'new' ? "Crear cuenta" : "Guardar cambios"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Building2, Key, Mail, UserCheck, ShieldCheck, User} from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";

// import type { CreateUserManager } from "@/interface/userManager/create-user-manager";
// import type { UserManager } from "@/interface/userManager/userManager.interface";
// import type { UserRolesResponse } from "@/interface/userManager/roles/roles.response";
// import { mapToCreateProvider } from "../mapping/mapUserManager";

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
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       ...mapToCreateProvider(user),
//     },
//   });

//   useEffect(() => {
//     reset(mapToCreateProvider(user));
//   }, [user, reset]);

//   const password = watch("userPassword");

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      
//       {/* SECCIÓN: Información Personal */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="p-2 bg-primary/10 rounded-lg">
//             <User className="h-4 w-4 text-primary" />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold">Perfil de Usuario</h3>
//             <p className="text-[12px] text-muted-foreground">Datos principales de acceso e identidad</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="userName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
//               Nombre de Usuario
//             </Label>
//             <div className="relative group">
//               <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
//               <Input
//                 id="userName"
//                 {...register("userName", { required: "El nombre es obligatorio" })}
//                 className={cn("pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all shadow-none", {
//                   "border-destructive focus:ring-destructive/10": errors.userName,
//                 })}
//                 placeholder="Ej: jmendez"
//               />
//             </div>
//             {errors.userName && <p className="text-destructive text-[11px] font-medium ml-1">{errors.userName.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="userEmail" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
//               Correo Electrónico
//             </Label>
//             <div className="relative group">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
//               <Input
//                 id="userEmail"
//                 type="email"
//                 {...register("userEmail", { 
//                     required: "El email es obligatorio",
//                     pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } 
//                 })}
//                 className={cn("pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all shadow-none", { 
//                   "border-destructive": errors.userEmail 
//                 })}
//                 placeholder="correo@ejemplo.com"
//               />
//             </div>
//             {errors.userEmail && <p className="text-destructive text-[11px] font-medium ml-1">{errors.userEmail.message}</p>}
//           </div>
//         </div>
//       </div>

//       <Separator className="opacity-50" />

//       {/* SECCIÓN: Seguridad y Permisos */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="p-2 bg-amber-500/10 rounded-lg">
//             <ShieldCheck className="h-4 w-4 text-amber-600" />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold">Seguridad y Roles</h3>
//             <p className="text-[12px] text-muted-foreground">Credenciales y nivel de acceso al sistema</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="userPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
//               Contraseña
//             </Label>
//             <div className="relative group">
//               <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-amber-600 transition-colors" />
//               <Input
//                 id="userPassword"
//                 type="password"
//                 {...register("userPassword", { 
//                   required: user.id === 'new' ? "La contraseña es obligatoria" : false,
//                   minLength: { value: 6, message: "Mínimo 6 caracteres" }
//                 })}
//                 className={cn("pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all shadow-none", {
//                   "border-destructive": errors.userPassword,
//                 })}
//                 placeholder="••••••••"
//               />
//             </div>
//             {errors.userPassword && <p className="text-destructive text-[11px] font-medium ml-1">{errors.userPassword.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="userPasswordConfirm" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
//               Confirmar Contraseña
//             </Label>
//             <div className="relative group">
//               <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-amber-600 transition-colors" />
//               <Input
//                 id="userPasswordConfirm"
//                 type="password"
//                 {...register("userPasswordConfirm", { 
//                   validate: (value) => value === password || "No coincide"
//                 })}
//                 className={cn("pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all shadow-none", {
//                   "border-destructive": errors.userPasswordConfirm,
//                 })}
//                 placeholder="••••••••"
//               />
//             </div>
//             {errors.userPasswordConfirm && <p className="text-destructive text-[11px] font-medium ml-1">{errors.userPasswordConfirm.message}</p>}
//           </div>

//           {/* Role Select Mejorado */}
//           <div className="space-y-2 md:col-span-2">
//             <Label htmlFor="roles" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
//               Rol corporativo
//             </Label>
//             <div className="relative group">
//               <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors z-10" />
//               <select
//                 {...register("userRoleId", { required: "Seleccionar un rol es obligatorio" })}
//                 className={cn(
//                   "w-full h-11 pl-10 pr-10 bg-muted/30 border-transparent rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all shadow-none text-sm",
//                   { "border-destructive": errors.userRoleId }
//                 )}
//               >
//                 <option value="">Seleccionar un rol corporativo...</option>
//                 {roles.data?.map((role) => (
//                   <option key={role.id} value={role.id}>{role.name}</option>
//                 ))}
//               </select>
//               <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground/40">
//                 <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
//               </div>
//             </div>
//             {errors.userRoleId && <p className="text-destructive text-[11px] font-medium ml-1">{errors.userRoleId.message}</p>}
//           </div>
//         </div>
//       </div>

//       {/* FOOTER: Acciones */}
//       <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6">
//         <Button 
//           type="button" 
//           variant="ghost" 
//           className="w-full sm:w-auto rounded-xl px-6 h-11 text-muted-foreground"
//         >
//           Cancelar
//         </Button>
//         <Button 
//           type="submit" 
//           disabled={isPending}
//           className="w-full sm:w-auto rounded-xl px-8 h-11 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
//         >
//           {isPending ? (
//             <div className="flex items-center gap-2">
//               <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               <span>Guardando...</span>
//             </div>
//           ) : (
//             user.id === 'new' ? "Crear cuenta" : "Guardar cambios"
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// };

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Building2, Key, Mail, UserCheck, ShieldCheck } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";

// import type { CreateUserManager } from "@/interface/userManager/create-user-manager";
// import type { UserManager } from "@/interface/userManager/userManager.interface";
// import type { UserRolesResponse } from "@/interface/userManager/roles/roles.response";
// import { mapToCreateProvider } from "../mapping/mapUserManager";

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
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm<FormInputs>({
//     defaultValues: {
//       ...mapToCreateProvider(user),
//     },
//   });

//   useEffect(() => {
//     reset(mapToCreateProvider(user));
//   }, [user, reset]);

//   // eslint-disable-next-line react-hooks/incompatible-library
//   const password = watch("userPassword");

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//       {/* Contenedor Grid Principal */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* Usuario - Ahora col-span-2 para consistencia total o 1 si quieres pares */}
//         <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="userName" className="text-sm font-medium flex items-center gap-2 ml-1">
//             <Building2 className="h-4 w-4 text-primary/60" /> Nombre de Usuario
//           </Label>
//           <Input
//             id="userName"
//             {...register("userName", { required: "El nombre es obligatorio" })}
//             className={cn("h-12 rounded-xl bg-background border-muted-foreground/20 focus:border-primary/50 transition-all shadow-sm", {
//               "border-destructive ring-destructive/10": errors.userName,
//             })}
//             placeholder="Ej: jmendez"
//           />
//           {errors.userName && <p className="text-destructive text-xs mt-1 ml-1">{errors.userName.message}</p>}
//         </div>

//         {/* Email - Ahora ocupa todo el ancho disponible para no verse "pequeño" */}
//         <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="userEmail" className="text-sm font-medium flex items-center gap-2 ml-1">
//             <Mail className="h-4 w-4 text-primary/60" /> Correo Electrónico
//           </Label>
//           <Input
//             id="userEmail"
//             type="email"
//             {...register("userEmail", { 
//                 required: "El email es obligatorio",
//                 pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } 
//             })}
//             className={cn("h-12 rounded-xl bg-background border-muted-foreground/20 shadow-sm", { 
//               "border-destructive": errors.userEmail 
//             })}
//             placeholder="correo@ejemplo.com"
//           />
//           {errors.userEmail && <p className="text-destructive text-xs mt-1 ml-1">{errors.userEmail.message}</p>}
//         </div>

//         {/* Password - Fila compartida para ahorrar espacio vertical pero con mismo alto */}
//         <div className="space-y-2">
//           <Label htmlFor="userPassword" className="text-sm font-medium flex items-center gap-2 ml-1">
//             <Key className="h-4 w-4 text-primary/60" /> Contraseña
//           </Label>
//           <Input
//             id="userPassword"
//             type="password"
//             {...register("userPassword", { 
//               required: user.id === 'new' ? "La contraseña es obligatoria" : false,
//               minLength: { value: 6, message: "Mínimo 6 caracteres" }
//             })}
//             className={cn("h-12 rounded-xl bg-background border-muted-foreground/20 shadow-sm", {
//               "border-destructive": errors.userPassword,
//             })}
//             placeholder="••••••••"
//           />
//           {errors.userPassword && <p className="text-destructive text-xs mt-1 ml-1">{errors.userPassword.message}</p>}
//         </div>

//         {/* Confirm Password */}
//         <div className="space-y-2">
//           <Label htmlFor="userPasswordConfirm" className="text-sm font-medium flex items-center gap-2 ml-1">
//             <ShieldCheck className="h-4 w-4 text-primary/60" /> Confirmar Contraseña
//           </Label>
//           <Input
//             id="userPasswordConfirm"
//             type="password"
//             {...register("userPasswordConfirm", { 
//               validate: (value) => value === password || "Las contraseñas no coinciden"
//             })}
//             className={cn("h-12 rounded-xl bg-background border-muted-foreground/20 shadow-sm", {
//               "border-destructive": errors.userPasswordConfirm,
//             })}
//             placeholder="••••••••"
//           />
//           {errors.userPasswordConfirm && <p className="text-destructive text-xs mt-1 ml-1">{errors.userPasswordConfirm.message}</p>}
//         </div>

//         {/* Role Select - Ocupa todo el ancho para cerrar el bloque de inputs */}
//         <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="roles" className="text-sm font-medium flex items-center gap-2 ml-1">
//             <UserCheck className="h-4 w-4 text-primary/60" /> Rol asignado
//           </Label>
//           <div className="relative">
//             <select
//               {...register("userRoleId", { required: "Seleccionar un rol es obligatorio" })}
//               className={cn(
//                 "w-full h-12 px-4 bg-background border border-muted-foreground/20 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm",
//                 { "border-destructive": errors.userRoleId }
//               )}
//             >
//               <option value="">Seleccionar un rol corporativo...</option>
//               {roles.data?.map((role) => (
//                 <option key={role.id} value={role.id}>
//                   {role.name}
//                 </option>
//               ))}
//             </select>
//             <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground/60">
//               <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
//                 <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
//               </svg>
//             </div>
//           </div>
//           {errors.userRoleId && <p className="text-destructive text-xs mt-1 ml-1">{errors.userRoleId.message}</p>}
//         </div>
//       </div>

//       {/* Botones de acción mejorados */}
//       <div className="flex items-center justify-end gap-4 pt-8 border-t border-muted/40">
//         <Button 
//           type="button" 
//           variant="outline" 
//           className="rounded-xl px-8 h-12 border-muted-foreground/20 hover:bg-muted/50 transition-colors"
//         >
//           Cancelar
//         </Button>
//         <Button 
//           type="submit" 
//           disabled={isPending}
//           className="rounded-xl px-10 h-12 shadow-md shadow-primary/20 bg-primary hover:bg-primary/95 transition-all active:scale-[0.98]"
//         >
//           {isPending ? (
//             <div className="flex items-center gap-3">
//               <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               <span>Guardando...</span>
//             </div>
//           ) : (
//             user.id === 'new' ? "Crear cuenta" : "Actualizar datos"
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// };

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
