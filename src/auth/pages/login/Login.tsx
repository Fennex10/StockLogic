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
import { useQueryClient } from "@tanstack/react-query";

export const Login = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {login} = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
        queryClient.clear();
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
