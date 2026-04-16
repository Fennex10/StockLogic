// import { useAuthStore } from "@/auth/store/auth.store";
// import { motion, type Variants } from "framer-motion";
// import { 
//   ShieldCheck, 
//   Mail, 
//   Building2, 
//   Globe, 
//   Cpu,
//   AlertTriangle,
//   ExternalLink
// } from "lucide-react";
// import { useProducts } from "../productos/hooks/useProducts";
// // import { useSales } from "../ventas/hooks/useSales";
// // import { useCategories } from "../categories/hooks/useCategories";

// // Asumiendo que estos vienen de tus hooks de datos


// export const Configuracion = () => {
//   // Animaciones mejoradas para un feeling más "smooth"
// const { user } = useAuthStore();
// const {data: products} = useProducts();

//   const productsList = products?.data ?? [];
 
   

//   const lowStockAlerts = productsList
//     .filter(p => (p.currentStock ?? 0) <= (p.minStock ?? 0))
//     .map(p => ({
//       id: p.id,
//       productName: p.name,
//       currentStock: p.currentStock,
//       minStock: p.minStock
//     }));

//   const containerVariants: Variants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.05, delayChildren: 0.1 }
//     }
//   };

//   const itemVariants: Variants = {
//     hidden: { opacity: 0, y: 15 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
//   };

//   // Helper para iniciales
//   const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

//   return (
//     <motion.div 
//       variants={containerVariants}
//       initial="hidden"
//       animate="show"
//       className="w-full max-w-5xl mx-auto py-10 px-6 space-y-20"
//     >
//       {/* SECCIÓN PERFIL */}
//       <section className="relative">
//         <motion.div variants={itemVariants} className="mb-10">
//           <h2 className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-2">Cuenta Personal</h2>
//           <div className="h-[2px] w-8 bg-blue-500 rounded-full" />
//         </motion.div>

//         <div className="flex flex-col md:flex-row md:items-center gap-10">
//           <motion.div variants={itemVariants} className="relative group">
//             <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-3xl font-light text-slate-400 shadow-sm transition-all duration-500 group-hover:border-blue-200 group-hover:shadow-md">
//               {user?.userName ? getInitials(user.userName) : "JD"}
//             </div>
//             <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-500">
//               <ShieldCheck size={16} />
//             </div>
//           </motion.div>

//           <motion.div variants={itemVariants} className="space-y-4 flex-1">
//             <div>
//               <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
//                 {user?.userName || "Usuario Demo"}
//               </h1>
//               <p className="text-slate-500 mt-1 flex items-center gap-2 font-medium">
//                 {user?.roleCode || "Administrador"} 
//                 <span className="text-slate-300">•</span> 
//                 <span className="font-mono text-[13px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
//                   ID-{user?.id?.toString().slice(-5) || "88291"}
//                 </span>
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-8 pt-2">
//               <div className="space-y-1">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
//                 <div className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
//                   <Mail size={14} className="opacity-70" />
//                   <span className="text-[15px]">{user?.email || "juan@empresa.com"}</span>
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</p>
//                 <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
//                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                   <span className="text-[13px] font-semibold">Activo ahora</span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* SECCIÓN SISTEMA */}
//       <section className="space-y-10 pt-10 border-t border-slate-100">
//         <motion.div variants={itemVariants} className="flex flex-col gap-1">
//           <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Configuración Global</h2>
//           <p className="text-[13px] text-slate-400">Contexto operativo de {`StockLogic Corp`}.</p>
//         </motion.div>

//         <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Card 1: Entidad */}
//           <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
//             <Building2 size={18} className="text-slate-400 mb-4 group-hover:text-blue-500 transition-colors" />
//             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Entidad Principal</p>
//             <p className="text-lg font-semibold text-slate-800">StockLogic Corp.</p>
//             <p className="text-[11px] font-mono text-slate-400 mt-2 bg-slate-50 p-1.5 rounded">DOM-REG-2026</p>
//           </div>

//           {/* Card 2: Región */}
//           <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
//             <Globe size={18} className="text-slate-400 mb-4 group-hover:text-blue-500 transition-colors" />
//             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Localización</p>
//             <p className="text-lg font-semibold text-slate-800">República Dominicana</p>
//             <div className="flex items-center gap-2 mt-2">
//                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">DOP (RD$)</span>
//                <span className="text-[11px] text-slate-400">GMT-4</span>
//             </div>
//           </div>

//           {/* Card 3: Alertas Reales */}
//           <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
//             <AlertTriangle size={18} className={`mb-4 ${lowStockAlerts.length > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
//             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estado de Inventario</p>
//             <p className="text-lg font-semibold text-slate-800">
//                {lowStockAlerts.length} <span className="text-sm font-normal text-slate-500">Alertas activas</span>
//             </p>
//             <button className="text-[11px] font-bold text-orange-600 mt-3 flex items-center gap-1 hover:underline">
//                VER PRODUCTOS CRÍTICOS <ExternalLink size={10} />
//             </button>
//           </div>
//         </motion.div>
//       </section>

//       {/* FOOTER */}
//       <motion.footer 
//         variants={itemVariants}
//         className="pt-10 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 gap-6"
//       >
//         <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase opacity-60">
//           <span className="flex items-center gap-2"><Cpu size={14}/> Engine v3.0.1</span>
//           <span>© 2026 StockLogic Inc.</span>
//         </div>
//         <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent mx-10" />
//         <div className="flex items-center gap-2">
//            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
//            <p className="text-[10px] font-black tracking-[0.3em] text-blue-600 uppercase">Secure Environment</p>
//         </div>
//       </motion.footer>
//     </motion.div>
//   );
// };

// import { User, Shield, Database, Globe, AlertTriangle, ExternalLink, Mail, Building2, Cpu, CheckCircle } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { useAuthStore } from "@/auth/store/auth.store";
// import { useProducts } from "../productos/hooks/useProducts";

// export const Configuracion = () => {

//   const { user } = useAuthStore();
// const {data: products} = useProducts();

//   const productsList = products?.data ?? [];
 
   
//   const lowStockAlerts = productsList
//     .filter(p => (p.currentStock ?? 0) <= (p.minStock ?? 0))
//     .map(p => ({
//       id: p.id,
//       productName: p.name,
//       currentStock: p.currentStock,
//       minStock: p.minStock
//     }));

//   const getInitials = (name: string) =>
//     name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();

//   return (
//     <div className="space-y-6 max-w-5xl">
//       {/* Profile Section */}
//       <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "50ms" }}>
//         <div className="flex items-center gap-3 mb-6">
//           <div className="rounded-lg bg-primary/10 p-2">
//             <User className="h-5 w-5 text-primary" />
//           </div>
//           <div>
//             <h2 className="font-semibold text-foreground">Cuenta Personal</h2>
//             <p className="text-sm text-muted-foreground">Tu perfil y acceso</p>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-6">
//           {/* Avatar + Status */}
//           <div className="flex flex-col items-center gap-3">
//             <div className="relative">
//               <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
//                 {getInitials(user?.userName ?? "")}
//               </div>
//               <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[hsl(var(--success))] border-2 border-card" />
//             </div>
//             <Badge variant="secondary" className="text-xs font-medium">
//               Activo
//             </Badge>
//           </div>

//           {/* Info Grid */}
//           <div className="flex-1 grid gap-4 sm:grid-cols-2">
//             <div className="space-y-1">
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Nombre
//               </p>
//               <p className="text-sm font-semibold text-foreground">
//                 {user?.userName}
//               </p>
//             </div>
//             <div className="space-y-1">
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Rol
//               </p>
//               <div className="flex items-center gap-2">
//                 <Shield className="h-3.5 w-3.5 text-primary" />
//                 <p className="text-sm font-semibold text-foreground">
//                   {user?.roleCode}
//                 </p>
//               </div>
//             </div>
//             <div className="space-y-1">
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 Email
//               </p>
//               <div className="flex items-center gap-2">
//                 <Mail className="h-3.5 w-3.5 text-muted-foreground" />
//                 <p className="text-sm text-foreground">{user?.email}</p>
//               </div>
//             </div>
//             <div className="space-y-1">
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                 ID Usuario
//               </p>
//               <p className="text-sm font-mono text-muted-foreground">
//                 {user?.id}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* System Config - Bento Grid */}
//       <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="rounded-lg bg-[hsl(var(--success))]/10 p-2">
//             <Database className="h-5 w-5 text-[hsl(var(--success))]" />
//           </div>
//           <div>
//             <h2 className="font-semibold text-foreground">Configuración Global</h2>
//             <p className="text-sm text-muted-foreground">
//               Contexto operativo de StockLogic Corp.
//             </p>
//           </div>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {/* Card: Entidad */}
//           <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow duration-200">
//             <Building2 className="h-8 w-8 text-primary mb-3" />
//             <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
//               Entidad Principal
//             </p>
//             <p className="text-base font-semibold text-foreground">
//               StockLogic Corp.
//             </p>
//             <p className="text-xs text-muted-foreground mt-1 font-mono">
//               DOM-REG-2026
//             </p>
//           </div>

//           {/* Card: Localización */}
//           <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow duration-200">
//             <Globe className="h-8 w-8 text-primary mb-3" />
//             <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
//               Localización
//             </p>
//             <p className="text-base font-semibold text-foreground">
//               República Dominicana
//             </p>
//             <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
//               <span className="flex items-center gap-1">
//                 <span className="font-medium">DOP (RD$)</span>
//               </span>
//               <span>•</span>
//               <span>GMT-4</span>
//             </div>
//           </div>

//           {/* Card: Alertas */}
//           <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
//             <AlertTriangle
//               className={`h-8 w-8 mb-3 ${
//                 lowStockAlerts.length > 0
//                   ? "text-[hsl(var(--warning))]"
//                   : "text-muted-foreground"
//               }`}
//             />
//             <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
//               Estado de Inventario
//             </p>
//             <p className="text-base font-semibold text-foreground">
//               {lowStockAlerts.length} Alertas activas
//             </p>
//             {lowStockAlerts.length > 0 && (
//               <button className="mt-2 text-xs text-primary font-medium flex items-center gap-1 hover:underline">
//                 VER PRODUCTOS CRÍTICOS
//                 <ExternalLink className="h-3 w-3" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

   

//       {/* Footer */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "200ms" }}>
//         <div className="flex items-center gap-2">
//           <Cpu className="h-3.5 w-3.5" />
//           <span>Engine v3.0.1</span>
//           <span>•</span>
//           <span>© 2026 StockLogic Inc.</span>
//         </div>
//         <div className="flex items-center gap-1.5">
//           <Shield className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
//           <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
//           <span>Secure Environment</span>
//         </div>
//       </div>
//     </div>
//   );
// }

import { User, Shield, Database, Globe, AlertTriangle, ExternalLink, Mail, Building2, Cpu, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/auth/store/auth.store";
import { useProducts } from "../productos/hooks/useProducts";

export const Configuracion = () => {
  const { user } = useAuthStore();
  const { data: products } = useProducts();

  const productsList = products?.data ?? [];
  
  const lowStockAlerts = productsList
    .filter(p => (p.currentStock ?? 0) <= (p.minStock ?? 0))
    .map(p => ({
      id: p.id,
      productName: p.name,
      currentStock: p.currentStock,
      minStock: p.minStock
    }));

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    // CAMBIO: Se eliminó max-w-5xl y se puso w-full para corregir el espacio a la derecha
    <div className="space-y-6 w-full">
      {/* Profile Section */}
      <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-blue-500/10 p-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Cuenta Administrativa</h2>
            <p className="text-sm text-muted-foreground">Tu perfil y acceso</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials(user?.userName ?? "")}
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            <Badge variant="secondary" className="text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
              Activo
            </Badge>
          </div>

          <div className="flex-1 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre</p>
              <p className="text-sm font-semibold text-foreground">{user?.userName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rol</p>
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-indigo-500" />
                <p className="text-sm font-semibold text-foreground">{user?.roleCode}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <p className="text-sm text-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ID Usuario</p>
              <p className="text-sm font-mono text-muted-foreground">{user?.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Config */}
      <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-emerald-500/10 p-2">
            <Database className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Configuración Global</h2>
            <p className="text-sm text-muted-foreground">Contexto operativo de StockLogic Corp.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card: Entidad */}
          <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <Building2 className="h-8 w-8 text-blue-500 mb-3" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Entidad Principal</p>
            <p className="text-base font-semibold text-foreground">StockLogic Corp.</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">DOM-REG-2026</p>
          </div>

          {/* Card: Localización */}
          <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <Globe className="h-8 w-8 text-indigo-500 mb-3" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Localización</p>
            <p className="text-base font-semibold text-foreground">República Dominicana</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="font-medium">DOP (RD$)</span>
              <span>•</span>
              <span>GMT-4</span>
            </div>
          </div>

          {/* Card: Alertas */}
          <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <AlertTriangle className={`h-8 w-8 mb-3 ${lowStockAlerts.length > 0 ? "text-amber-500" : "text-slate-300"}`} />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Estado de Inventario</p>
            <p className="text-base font-semibold text-foreground">{lowStockAlerts.length} Alertas activas</p>
            {lowStockAlerts.length > 0 && (
              <button className="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline">
                VER PRODUCTOS CRÍTICOS <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 text-xs text-muted-foreground border-t border-border mt-6">
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5" />
          <span>Engine v3.0.1 • © 2026 StockLogic Inc.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          <span>Secure Environment</span>
        </div>
      </div>
    </div>
  );
}