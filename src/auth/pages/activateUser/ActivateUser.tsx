import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/auth/store/auth.store";

export const ActivateUser = () => {

 const { token } = useParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const { activateUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const activate = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      const ok = await activateUser(token);

      if (ok) {
        setStatus("success");

        // redirigir después
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setStatus("error");
      }
    };

    activate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Activando tu cuenta...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>

        <p className="text-sm text-muted-foreground">
          Tu cuenta ha sido activada correctamente.
        </p>

        <Button
          onClick={() => navigate("/auth/login")}
          className="w-full h-11 rounded-xl auth-gradient text-primary-foreground"
        >
          Ir a iniciar sesión
        </Button>
      </div>
    );
  }

  // ❌ ERROR
  return (
    <div className="space-y-5 text-center">
      <div className="flex justify-center">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>

      <p className="text-sm text-muted-foreground">
        El enlace es inválido o ha expirado.
      </p>

      <Link
        to="/auth/register"
        className="text-sm font-medium text-primary hover:text-primary/80"
      >
        Crear cuenta nuevamente
      </Link>
    </div>
  );
};