import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import { Mail, User, Key, ShieldCheck, Loader2, Save,} from "lucide-react";
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

    {user.id === "new" && (
          <>
            {/* PASSWORD */}
            <motion.div variants={item} className="space-y-2">
              <span className="text-xs text-muted-foreground">Contraseña</span>
              <div className="relative group">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition" />
                <Input
                  type="password"
                  {...register("userPassword", {
                    required: "Requerido",
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
          </>
        )}

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
          className={cn("h-10 px-6 rounded-md font-medium flex items-center gap-2 transition-all shadow-sm",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "focus-visible:ring-0 focus-visible:outline-none",
                "active:bg-primary")}>
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

  {/* <motion.div variants={item} className="space-y-2">
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
        </motion.div> */}