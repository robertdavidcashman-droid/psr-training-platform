import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("", className)} data-testid="stat-card">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-muted-foreground">{title}</p>
          {Icon && (
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-4xl font-bold" data-testid="stat-value">{value}</p>
          {description && (
            <p className="text-base text-muted-foreground mt-2">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-base mt-2",
                trend.value >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
