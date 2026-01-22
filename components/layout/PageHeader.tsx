import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-10 lg:mb-12", className)} data-testid="page-header">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
            data-testid="page-title"
          >
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-xl leading-relaxed text-muted-foreground" data-testid="page-description">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </div>
  );
}
