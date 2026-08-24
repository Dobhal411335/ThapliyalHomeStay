import { cn } from "@/lib/utils";

export function DashboardCard({ title, description, action, children, className, noPadding }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] bg-white ring-1 ring-border/50",
        !noPadding && "p-6",
        className,
      )}
    >
      {(title || action) && (
        <div className={cn("flex items-center justify-between", !noPadding && "mb-5", noPadding && "p-6 pb-0")}>
          <div>
            {title && (
              <h3 className="font-ui text-sm font-semibold text-heading">{title}</h3>
            )}
            {description && (
              <p className="mt-0.5 font-body text-xs text-muted">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
