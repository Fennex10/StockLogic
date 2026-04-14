import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { SocialButtons } from "@/auth/components/SocialButtons";
import { PasswordStrength } from "@/auth/components/PasswordStrength";
import { useAuthStore } from "@/auth/store/auth.store";

export const Register = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {register} = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const companyName = formData.get("companyName") as string;
    const userName = formData.get("userName") as string;
    const companyEmail = formData.get("companyEmail") as string;
    const userPassword = formData.get("userPassword") as string;
    const userPasswordConfirm = formData.get("userPasswordConfirm") as string;

    if (!companyName?.trim()) {
      toast.error("El nombre de la empresa es requerido");
      setIsPosting(false);
      return;
    }
    if (!userName?.trim()) {
      toast.error("El nombre de usuario es requerido");
      setIsPosting(false);
      return;
    }
    // if (!companyEmail || !/\S+@\S+\.\S+/.test(companyEmail)) {
    //   toast.error("Ingrese un correo válido");
    //   setIsPosting(false);
    //   return;
    // }
    if (!userPassword || userPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      setIsPosting(false);
      return;
    }
    if (userPassword !== userPasswordConfirm) {
      toast.error("Las contraseñas no coinciden");
      setIsPosting(false);
      return;
    }

    const isValid = await register(companyName, userName, 
                                  companyEmail, userPassword, userPasswordConfirm);
    
    if (isValid) {
        toast.success("Cuenta creada. Revisa tu correo para activarla");
        navigate('/login');
      } else {
        toast.error('Correo o/y contraseña no válidos');
      }
     
    toast.error('Correo o/y contrasena no validos');
    setIsPosting(false);
  }

  return (
   
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nombre de la empresa</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Mi Empresa S.A."
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userName">Nombre de usuario</Label>
          <Input
            id="userName"
            name="userName"
            placeholder="John Doe"
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyEmail">Correo de la empresa</Label>
          <Input
            id="companyEmail"
            name="companyEmail"
            type="email"
            placeholder="nombre@empresa.com"
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userPassword">Contraseña</Label>
          <div className="relative">
            <Input
              id="userPassword"
              name="userPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Crea una contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userPasswordConfirm">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="userPasswordConfirm"
              name="userPasswordConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="Confirma tu contraseña"
              required
              className="h-11 rounded-xl pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswordConfirm ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPosting}
          className="w-full h-11 rounded-xl auth-gradient text-primary-foreground hover:opacity-90"
        >
          {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPosting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        {/* <SocialButtons /> */}

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Inicia sesión
          </Link>
        </p>
      </form>
    
  );
};




// import { useState, type FormEvent } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Package, Mail, Lock, ArrowRight, User } from "lucide-react";
// import { toast } from "sonner";
// import { Link, useNavigate } from "react-router";
// import { useAuthStore } from "@/auth/store/auth.store";

// export const Register = () => {
  
//   const navigate = useNavigate();
//   const {register} = useAuthStore()
  
//   const [isPosting, setIsPosting] = useState(false);
  
//   const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsPosting(true)
 
//     const formData = new FormData(event.target as HTMLFormElement);
    
//     const companyName = formData.get('companyName') as string;
//     const userName = formData.get('userName') as string;
//     const companyEmail = formData.get('companyEmail') as string;
//     const userPassword = formData.get('userPassword') as string;
//     const userPasswordConfirm = formData.get('userPasswordConfirm') as string;
 
    
//     const isValid = await register(companyName, userName, 
//                                   companyEmail, userPassword, userPasswordConfirm);
    
//     if (isValid) {
//         toast.success("Cuenta creada. Revisa tu correo para activarla");
//         navigate('/login');
//       } else {
//         toast.error('Correo o/y contraseña no válidos');
//       }
     
//     // toast.error('Correo o/y contrasena no validos');
//     setIsPosting(false);
//   }

//   return (
//      <div className="min-h-screen flex items-center justify-center bg-background p-6">
//       <Card className="w-full max-w-md border-border/50 shadow-lg animate-fade-in">
//         <CardHeader className="text-center space-y-2">
//           <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
//             <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
//               <Package className="w-4 h-4 text-primary-foreground" />
//             </div>
//             <span className="font-semibold text-foreground">Inventory & Demand</span>
//           </div>

//           <CardTitle className="text-2xl font-bold">
//             Crear cuenta
//           </CardTitle>

//           <CardDescription>
//             Completa los datos para registrarte
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleRegister} className="space-y-4">

//             <div className="space-y-2">
//               <Label htmlFor="companyName">Nombre de la Compañia</Label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="companyName"
//                   placeholder="Tu negocio aqui"
//                   name="companyName"
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="userName">Nombre completo</Label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="userName"
//                   placeholder="Ingrese su nombre de usuario"
//                   name="userName"
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="companyEmail">Correo electrónico</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="companyEmail"
//                   type="email"
//                   placeholder="tu@email.com"
//                    name="companyEmail"
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="userPassword">Contraseña</Label>
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
            
            
//             <div className="space-y-2">
//               <Label htmlFor="userPasswordConfirm">Confirma tu contraseña</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="userPasswordConfirm"
//                   type="password"
//                   name="userPasswordConfirm"
//                   placeholder="••••••••"               
//                   className="pl-10"
//                   required
//                   minLength={6}
//                 />
//               </div>
//             </div>
            
//              <Button type="submit" className="w-full" disabled={isPosting}>
//               {isPosting ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
//               ) : (
//                 <>
//                   Crear cuenta 
//                   <ArrowRight className="w-4 h-4 ml-2" />
//                 </>
//               )}
//             </Button>

//           </form>

//           <div className="mt-6 text-center">
//             <Link
//               to="/auth/login"
//               className="text-sm text-muted-foreground hover:text-primary transition-colors"
//             >
//               ¿Ya tienes cuenta? Inicia sesión
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }