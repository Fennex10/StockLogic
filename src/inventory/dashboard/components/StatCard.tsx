import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: StatCardProps) {
  const changeStyles = {
    positive: "text-green-500",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="rounded-2xl hover:shadow-lg transition-all">
      <CardContent className="p-6 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-semibold mb-2">{value}</p>

          {change && (
            <p className={`text-sm ${changeStyles[changeType]}`}>
              {change}
            </p>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}