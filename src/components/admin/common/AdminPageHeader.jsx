import { cn } from "@/lib/utils";

export function AdminPageHeader({ title, description, action, className }) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-heading">{title}</h1>
          {description && (
            <p className="mt-1.5 max-w-xl font-body text-sm text-muted">
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <hr className="mt-6 border-border" />
    </div>
  );
}
