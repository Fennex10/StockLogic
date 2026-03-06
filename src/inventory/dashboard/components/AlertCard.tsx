import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AlertItem {
  id: string;
  productName: string;
  currentStock: number;
  minStock: number;
}

interface AlertCardProps {
  alerts: AlertItem[];
}

export function AlertCard({ alerts }: AlertCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-destructive/10">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>

        <div>
          <CardTitle className="text-lg">
            Alertas de Stock Bajo
          </CardTitle>
          <CardDescription>
            {alerts.length} productos necesitan reabastecimiento
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-80 pr-3">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted border hover:bg-muted/70 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium mb-1">
                    {alert.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Stock actual: {alert.currentStock} | Mínimo:{" "}
                    {alert.minStock}
                  </p>
                </div>

                <Badge variant="destructive">Bajo</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}