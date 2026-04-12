
import { Outlet } from "react-router";
import authIllustration from "../../../public/auth-illustration.jpg";
import { Package } from "lucide-react";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">

      
      <div className="hidden lg:flex relative items-center justify-center p-12 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
        
        {/* Efectos blur */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 text-center max-w-md text-white">
          <img
            src={authIllustration}
            alt="Illustration"
            className="w-80 h-80 object-contain rounded-2xl mx-auto mb-8"
          />

          <h2 className="text-2xl font-semibold mb-3">
            Gestiona tu inventario 
          </h2>

          <p className="text-sm opacity-80 leading-relaxed">
            Controla tus productos, optimiza tus procesos y toma decisiones más rápidas con StockLogic.
          </p>
        </div>
      </div>

      {/* ⚪ RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex flex-col items-center text-center gap-2 mb-8">
         
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Package className="text-white font-bold text-sm" />
            </div>
            <span className="font-semibold text-foreground">StockLogic</span>
          </div>

          {/* Aquí se renderiza Login / Register */}
          <Outlet />

        </div>
      </div>

    </div>
  );
};

export default AuthLayout;

// import { Outlet } from "react-router";

// const AuthLayout = () => {
//   return (
//     <div className="flex min-h-svh flex-col items-center justify-center oklch(98.5% 0 0) p-6 md:p-10">
//       <div className="w-full max-w-sm md:max-w-3xl">
//         <Outlet />
//       </div>
//     </div>
//   )
// }

// export default AuthLayout;