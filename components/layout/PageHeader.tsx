import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 lg:mb-10", className)} data-testid="page-header">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-[clamp(32px,2.6vw,40px)] font-bold tracking-tight leading-tight"
            data-testid="page-title"
          >
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground" data-testid="page-description">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </div>
  );
}
