import { useState, type FormEvent } from "react";
import { Link} from "react-router";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/auth/store/auth.store";

export const ForgotPassword = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {forgotPassword} = useAuthStore();
  // const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  setIsPosting(true);

  const formData = new FormData(event.target as HTMLFormElement);
  const email = formData.get("userEmail") as string;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    toast.error("Enter a valid email address");
    setIsPosting(false);
    return;
  }

  const isValid = await forgotPassword(email);

  if (isValid) {
    await new Promise((r) => setTimeout(r, 1500));
    setSentEmail(email);
    setSent(true);
    setIsPosting(false);
    return;
  }
}

  if (sent) {
    return (
      
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
              Hemos enviado un enlace de recuperación a{" "}
              <span className="font-medium text-foreground">{sentEmail}</span>.
              <br />
              ¿No recibiste el correo? Revisa spam o{" "}
              <button
                onClick={() => setSent(false)}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                intenta con otro email
              </button>
            </p>
          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir a iniciar sesión
          </Link>
        </div>
  
    );
  }

  return (
   
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="userEmail"
            type="email"
            placeholder="nombre@company.com"
            required
            className="h-11 rounded-xl"
          />
        </div>

        <Button
          type="submit"
          disabled={isPosting}
          className="w-full h-11 rounded-xl auth-gradient text-primary-foreground hover:opacity-90"
        >
          {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPosting ? "Enviando..." : "Enviar enlace de recuperación"}
        </Button>

        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a iniciar sesión
        </Link>
      </form>
  );
};


