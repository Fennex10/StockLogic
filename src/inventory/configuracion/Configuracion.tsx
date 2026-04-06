import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export const Configuracion = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Lógica para persistir cambios (ej. llamar a API)
      // await api.put('/user/profile', { fullName, email, role, phone })
      console.log({ fullName, email, role, phone });
      toast.success("Cambios guardados");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>Personaliza tu sistema de inventario</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">U</div>
                <div>
                  <div className="font-semibold">Perfil de Usuario</div>
                  <div className="text-sm text-muted-foreground">Información de tu cuenta</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input id="fullName" name="fullName" placeholder="Ingrese su nombre" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" name="email" type="email" placeholder="Ejemplo@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select value={role || undefined} onValueChange={(v) => setRole(v)}>
                    <SelectTrigger id="role" className="mt-2 w-full">
                      <SelectValue>{role ? (role === 'ADMIN' ? 'Administrador' : 'Empleado') : 'Selecciona un rol'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="EMPLOYEE">Empleado</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" name="phone" placeholder="809 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2" />
                </div>
              </div>

              <div className="mt-6">
                <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>Configura tus alertas</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b">
              <div>
                <div className="font-medium">Alertas de stock bajo</div>
                <div className="text-sm text-muted-foreground">Recibe notificaciones cuando un producto esté por agotarse</div>
              </div>
              <div>
                <Switch defaultChecked={false} />
              </div>
            </div>

              <div className="flex items-center justify-between py-4 border-b">
              <div>
                <div className="font-medium">Resumen de ventas</div>
                <div className="text-sm text-muted-foreground">Recibe un resumen diario de las ventas</div>
              </div>
              <div>
                <Switch defaultChecked={false} />
              </div>
            </div>

              <div className="flex items-center justify-between py-4">
              <div>
                <div className="font-medium">Nuevos pedidos</div>
                <div className="text-sm text-muted-foreground">Notificaciones para pedidos entrantes</div>
              </div>
              <div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}