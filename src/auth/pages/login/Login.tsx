import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
// import { SocialButtons } from "@/auth/components/SocialButtons";
import { useAuthStore } from "@/auth/store/auth.store";

export const Login = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {login} = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const userEmail = formData.get("userEmail") as string;
    const userPassword = formData.get("userPassword") as string;

    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
      toast.error("Enter a valid email address");
      setIsPosting(false);
      return;
    }
    if (!userPassword) {
      toast.error("Password is required");
      setIsPosting(false);
      return;
    }

    const isValid = await login(userEmail, userPassword);

    if (isValid) {
        navigate("/dashboard");
       return;     
      }

    toast.error("Correo o/y contraseña no válidos");
    setIsPosting(false);
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="userEmail"
            name="userEmail"
            type="email"
            placeholder="nombre@company.com"
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="userPassword"
              name="userPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="h-11 rounded-xl pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
            Recordarme
          </label>
        </div>

        <Button
          type="submit"
          disabled={isPosting}
          className="w-full h-11 rounded-xl auth-gradient text-primary-foreground hover:opacity-90"
        >
          {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPosting ? "Ingresando..." : "Ingresar"}
        </Button>

        {/* <SocialButtons /> */}

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link to="/auth/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Regístrate
          </Link>
        </p>
      </form>
  );
};

// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Link, useNavigate } from 'react-router';
// import { useState, type FormEvent } from 'react';
// import { toast } from 'sonner';
// import { useAuthStore } from '@/auth/store/auth.store';

// export const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuthStore();
//   const [isPosting, setIsPosting] = useState(false);

//   const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsPosting(true);

//     const formData = new FormData(event.target as HTMLFormElement);
//     const userEmail = formData.get("userEmail") as string;
//     const userPassword = formData.get("userPassword") as string;

//     const isValid = await login(userEmail, userPassword);

//     if (isValid) {
//       navigate("/");
//       return;
//     }

//     toast.error("Correo o/y contraseña no válidos");
//     setIsPosting(false);
//   };

//   return (
//     // Se añade max-w-md y mx-auto para que el formulario esté centrado y no sea gigante
//     <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
//       <Card className="overflow-hidden p-0">
//         <CardContent className="p-0">
//           <form className="p-6 md:p-8" onSubmit={handleLogin}>
//             <div className="flex flex-col gap-6">
//               <div className="flex flex-col items-center text-center">
//                 <h1 className="text-2xl font-bold">StockLogic</h1>
//                 <p className="text-balance text-muted-foreground">
//                   Ingrese a nuestra aplicación
//                 </p>
//               </div>
              
//               <div className="grid gap-2">
//                 <Label htmlFor="userEmail">Correo</Label>
//                 <Input
//                   id="userEmail"
//                   type="email"
//                   name="userEmail"
//                   placeholder="mail@google.com"
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <div className="flex items-center">
//                   <Label htmlFor="userPassword">Contraseña</Label>  
//                 <Link
//                   to="/auth/forgot-password"
//                   className="ml-auto text-sm underline-offset-2 hover:underline">
//                   ¿Olvidaste tu contraseña?
//                 </Link>
                  
//                 </div>
//                 <Input
//                   id="userPassword"
//                   type="password"
//                   name="userPassword"
//                   required
//                   placeholder="Contraseña"
//                 />
//               </div>

//               <Button type="submit" className="w-full" disabled={isPosting}>
//                 {isPosting ? 'Ingresando...' : 'Ingresar'}
//               </Button>

//               <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
//                 <span className="relative z-10 bg-background px-2 text-muted-foreground">
//                   O continúa con
//                 </span>
//               </div>

//               <div className="flex flex-col gap-3">
//               {/* Botón de Apple - Apilado verticalmente */}
//               {/* <Button variant="outline" className="w-full flex items-center justify-center gap-3 h-11">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
//                   <path
//                     d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
//                     fill="currentColor"
//                   />
//                 </svg>
//                 <span>Continuar con Apple</span>
//               </Button> */}

//               {/* Botón de Google - Apilado verticalmente con multi-color */}
//               <Button variant="outline" className="w-full flex items-center justify-center gap-3 h-11">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
//                   <path
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     fill="#4285F4"
//                   />
//                   <path
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     fill="#34A853"
//                   />
//                   <path
//                     d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z"
//                     fill="#FBBC05"
//                   />
//                   <path
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.51 6.14-4.51z"
//                     fill="#EA4335"
//                   />
//                 </svg>
//                 <span>Continuar con Google</span>
//               </Button>
//             </div>
//               <div className="text-center text-sm">
//                 ¿No tienes cuenta?{' '}
//                 <Link
//                   to="/auth/register"
//                   className="underline underline-offset-4 font-medium"
//                 >
//                   Crea una
//                 </Link>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
      
//       <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
//         Haciendo click, estás de acuerdo con{' '}
//         <a href="#">términos y condiciones</a> y{' '}
//         <a href="#">políticas de uso</a>.
//       </div>
//     </div>
//   );
// };


// import { useState, type FormEvent } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Package, Mail, Lock, ArrowRight } from "lucide-react";
// import { toast } from "sonner";
// import { Link, useNavigate } from "react-router";
// import { useAuthStore } from "@/auth/store/auth.store";

// export const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuthStore();

//   const [isPosting, setIsPosting] = useState(false);

//   const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsPosting(true);

//     const formData = new FormData(event.target as HTMLFormElement);
//     const userEmail = formData.get("userEmail") as string;
//     const userPassword = formData.get("userPassword") as string;

//     const isValid = await login(userEmail, userPassword);

//     if (isValid) {
//       navigate("/");
//       return;
//     }

//     toast.error("Correo o/y contraseña no válidos");
//     setIsPosting(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-6">
//       <Card className="w-full max-w-md border-border/50 shadow-xl animate-fade-in">
//         <CardHeader className="text-center space-y-2">

//           <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
//             <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
//               <Package className="w-4 h-4 text-primary-foreground" />
//             </div>
//             <span className="font-semibold text-foreground">
//               Inventory & Demand
//             </span>
//           </div>

//           <CardTitle className="text-2xl font-bold">
//             Iniciar sesión
//           </CardTitle>

//           <CardDescription>
//             Ingresa tus credenciales para acceder al sistema
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleLogin} className="space-y-5">

//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="userEmail">Correo electrónico</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="userEmail"
//                   type="email"
//                   name="userEmail"
//                   placeholder="tu@email.com"
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="space-y-2">

//               <div className="flex items-center justify-between">
//                 <Label htmlFor="userPassword">Contraseña</Label>

//                 <Link
//                   to="/auth/forgot-password"
//                   className="text-sm text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   ¿Olvidaste tu contraseña?
//                 </Link>
//               </div>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="userPassword"
//                   type="password"
//                   name="userPassword"
//                   placeholder="••••••••"
//                   className="pl-10"
//                   required
//                   minLength={6}
//                 />
//               </div>
//             </div>

//             {/* Submit */}
//             <Button type="submit" className="w-full h-10" disabled={isPosting}>
//               {isPosting ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
//               ) : (
//                 <>
//                   Iniciar sesión
//                   <ArrowRight className="w-4 h-4 ml-2" />
//                 </>
//               )}
//             </Button>
//           </form>

//           {/* Register */}
//           <div className="mt-6 text-center">
//             <Link
//               to="/auth/register"
//               className="text-sm text-muted-foreground hover:text-primary transition-colors"
//             >
//               ¿No tienes cuenta? Regístrate
//             </Link>
//           </div>

//         </CardContent>
//       </Card>
//     </div>
//   );
// };