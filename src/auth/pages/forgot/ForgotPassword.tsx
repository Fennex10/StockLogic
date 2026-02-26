import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/auth/store/auth.store";

export const ForgorPassword = () => {
  const navigate = useNavigate();
  const {forgotPassword} = useAuthStore()
  
  const [isPosting, setIsPosting] = useState(false);
  
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true)

    const formData = new FormData(event.target as HTMLFormElement);

    const userEmail = formData.get('userEmail') as string;
    
    const isValid = await forgotPassword(userEmail);
    if (isValid) {
       navigate('/');
       return;   
    }
     
    toast.error('Correo o/y contrasena no validos');
    setIsPosting(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-border/50 shadow-lg animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Package className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Inventory & Demand</span>
          </div>

          <CardTitle className="text-2xl font-bold">
            Olvide mi Contrasena
          </CardTitle>

          <CardDescription>
            Ingresa tu correo para validar tu correo 
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="userEmail"
                  type="email"
                  name="userEmail"
                  placeholder="tu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPosting}>
              {isPosting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
              ) : (
                <>
                  Verficar correo 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}