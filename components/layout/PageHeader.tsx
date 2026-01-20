import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 lg:mb-8", className)} data-testid="page-header">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-[clamp(28px,2.4vw,34px)] font-bold tracking-tight leading-tight"
            data-testid="page-title"
          >
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground" data-testid="page-description">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
