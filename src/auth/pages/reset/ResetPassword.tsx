import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/auth/store/auth.store";

export const ResetPassword = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const {resetPassword} = useAuthStore();
  const { token } = useParams(); 

  const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);
  const userPassword = formData.get("userPassword") as string;
  const userPasswordConfirm = formData.get("userPasswordConfirm") as string;

  if (!userPassword || userPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  if (userPassword !== userPasswordConfirm) {
    toast.error("Passwords don't match");
    return;
  }

  if (!token) {
    toast.error("Token inválido o expirado");
    return;
  }

  setIsPosting(true);

  const isValid = await resetPassword(
    userPassword,
    userPasswordConfirm,
    token
  );

    if (isValid) {
        setDone(true);
      } else {
        toast.error("Error restaurando la contraseña");
      }

    setIsPosting(false);
};

  if (done) {
    return (
     
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <Link to="/auth/login">
            <Button className="w-full h-11 rounded-xl auth-gradient text-primary-foreground hover:opacity-90">
              Continuar para iniciar sesión
            </Button>
          </Link>
        </div>
    );
  }

  return (
   
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">Nueva contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              name="userPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa la nueva contraseña"
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
              {showPassword ? "Ocultar" : "Mostral"}
            </button>
          </div>
         
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirm"
              name="userPasswordConfirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirma la nueva contraseña"
              required
              className="h-11 rounded-xl pr-20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPosting}
          className="w-full h-11 rounded-xl auth-gradient text-primary-foreground hover:opacity-90"
        >
          {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPosting ? "Restableciendo..." : "Restablecer contraseña"}
        </Button>
      </form>
  );
};
