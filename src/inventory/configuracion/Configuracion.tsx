
import { motion, type Variants } from "framer-motion";
import { 
  ShieldCheck, 
  Mail, 
  Building2, 
  Globe, 
  Box, 
  Cpu 
} from "lucide-react";

export const Configuracion = () => {
  // Variants tipados para evitar el error de TS que tenías
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl mx-auto py-12 px-6 space-y-16"
    >
      {/* SECCIÓN PERFIL: Enfoque en tipografía y claridad */}
      <section className="space-y-8">
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Información de Cuenta</h2>
          <div className="h-px w-12 bg-blue-600/30 mt-2" />
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-8">
          <div className="h-24 w-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl font-light text-slate-400">
            JD
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-medium tracking-tight text-slate-900">Juan Demo</h1>
            <p className="text-slate-500 flex items-center gap-2">
              Administrador de Sistema <span className="text-slate-300">|</span> <span className="font-mono text-sm uppercase">ID-88291</span>
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20 pt-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase">Correo Electrónico</p>
            <p className="text-lg text-slate-700 flex items-center gap-2">
              <Mail size={16} className="text-slate-300" /> juan@empresa.com
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase">Nivel de Acceso</p>
            <div className="flex items-center gap-2 text-lg text-slate-700">
              <ShieldCheck size={16} className="text-emerald-500" /> 
              <span>Super Usuario (Maestro)</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECCIÓN SISTEMA: Layout de tabla limpia */}
      <section className="space-y-8 pt-8 border-t border-slate-100">
        <motion.div variants={itemVariants} className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Configuración de Plataforma</h2>
          <p className="text-sm text-slate-400">Parámetros actuales del ecosistema StockLogic.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Item 1 */}
          <div className="flex gap-4">
            <div className="mt-1"><Building2 size={20} className="text-slate-400" /></div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Entidad</p>
              <p className="text-base font-semibold text-slate-800 tracking-tight italic">StockLogic Corp.</p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">ID: {`{COMPANY_ID_X}`}</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4">
            <div className="mt-1"><Globe size={20} className="text-slate-400" /></div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Región & Moneda</p>
              <p className="text-base font-semibold text-slate-800 tracking-tight">México (MXN)</p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">ISO 4217 Standard</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-4">
            <div className="mt-1"><Box size={20} className="text-slate-400" /></div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Alertas Globales</p>
              <p className="text-base font-semibold text-slate-800 tracking-tight italic">20 Unidades</p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono font-bold text-orange-400 uppercase">Stock Crítico</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER: Meta-información sutil */}
      <motion.footer 
        variants={itemVariants}
        className="pt-12 flex items-center justify-between border-t border-slate-50 opacity-40 hover:opacity-100 transition-opacity duration-500"
      >
        <div className="flex items-center gap-6 text-[10px] font-medium text-slate-400 tracking-widest uppercase italic">
          <span className="flex items-center gap-1.5"><Cpu size={12}/> V 2.4.0</span>
          <span>© 2026 StockLogic Inc.</span>
        </div>
        <div className="h-px flex-1 bg-slate-100 mx-10" />
        <p className="text-[10px] font-black tracking-[0.3em] text-blue-600">ENCRYPTED DATA</p>
      </motion.footer>
    </motion.div>
  );
};
// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
//   SelectGroup,
//   SelectLabel,
// } from "@/components/ui/select";
// import { toast } from "sonner";
// import { Switch } from "@/components/ui/switch";

// export const Configuracion = () => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("");
//   const [phone, setPhone] = useState("");
//   const [saving, setSaving] = useState(false);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       // Lógica para persistir cambios (ej. llamar a API)
//       // await api.put('/user/profile', { fullName, email, role, phone })
//       console.log({ fullName, email, role, phone });
//       toast.success("Cambios guardados");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error al guardar");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <Card className="max-w-4xl mx-auto">
//         <CardHeader>
//           <CardTitle>Configuración</CardTitle>
//           <CardDescription>Personaliza tu sistema de inventario</CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSave} className="space-y-6">
//             <div className="bg-card p-6 rounded-lg border">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">U</div>
//                 <div>
//                   <div className="font-semibold">Perfil de Usuario</div>
//                   <div className="text-sm text-muted-foreground">Información de tu cuenta</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="fullName">Nombre completo</Label>
//                   <Input id="fullName" name="fullName" placeholder="Ingrese su nombre" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2" />
//                 </div>

//                 <div>
//                   <Label htmlFor="email">Correo electrónico</Label>
//                   <Input id="email" name="email" type="email" placeholder="Ejemplo@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
//                 </div>

//                 <div>
//                   <Label htmlFor="role">Rol</Label>
//                   <Select value={role || undefined} onValueChange={(v) => setRole(v)}>
//                     <SelectTrigger id="role" className="mt-2 w-full">
//                       <SelectValue>{role ? (role === 'ADMIN' ? 'Administrador' : 'Empleado') : 'Selecciona un rol'}</SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Roles</SelectLabel>
//                         <SelectItem value="ADMIN">Administrador</SelectItem>
//                         <SelectItem value="EMPLOYEE">Empleado</SelectItem>
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="phone">Teléfono</Label>
//                   <Input id="phone" name="phone" placeholder="809 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2" />
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
      
//       <Card className="max-w-4xl mx-auto mt-6">
//         <CardHeader>
//           <CardTitle>Notificaciones</CardTitle>
//           <CardDescription>Configura tus alertas</CardDescription>
//         </CardHeader>

//         <CardContent>
//           <div className="space-y-4">
//               <div className="flex items-center justify-between py-4 border-b">
//               <div>
//                 <div className="font-medium">Alertas de stock bajo</div>
//                 <div className="text-sm text-muted-foreground">Recibe notificaciones cuando un producto esté por agotarse</div>
//               </div>
//               <div>
//                 <Switch defaultChecked={false} />
//               </div>
//             </div>

//               <div className="flex items-center justify-between py-4 border-b">
//               <div>
//                 <div className="font-medium">Resumen de ventas</div>
//                 <div className="text-sm text-muted-foreground">Recibe un resumen diario de las ventas</div>
//               </div>
//               <div>
//                 <Switch defaultChecked={false} />
//               </div>
//             </div>

//               <div className="flex items-center justify-between py-4">
//               <div>
//                 <div className="font-medium">Nuevos pedidos</div>
//                 <div className="text-sm text-muted-foreground">Notificaciones para pedidos entrantes</div>
//               </div>
//               <div>
//                 <Switch defaultChecked={false} />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }