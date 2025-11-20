import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode; // <-- NEW
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-6 mt-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-3">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
