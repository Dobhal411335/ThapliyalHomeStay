import { cn } from "@/lib/utils";

const variants = {
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
  info: "bg-primary/10 text-primary",
  neutral: "bg-muted/10 text-muted",
  pending: "bg-warning/10 text-warning",
  active: "bg-success/10 text-success",
  inactive: "bg-muted/10 text-muted",
  unread: "bg-primary/10 text-primary",
  read: "bg-muted/10 text-muted",
};

export function StatusBadge({ status, label, dot }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-ui text-xs font-medium",
        variants[status] ?? variants.neutral,
      )}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            status === "success" || status === "active" ? "bg-success" :
            status === "error" ? "bg-error" :
            status === "warning" || status === "pending" ? "bg-warning" :
            status === "info" || status === "unread" ? "bg-primary" :
            "bg-muted",
          )}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}
