import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const trendConfig = {
  up: { icon: TrendingUp, color: "text-success" },
  down: { icon: TrendingDown, color: "text-error" },
  neutral: { icon: Minus, color: "text-muted" },
};

export function StatCard({ icon: Icon, title, value, description, trend, iconColor, iconBg }) {
  const trendInfo = trend ? trendConfig[trend.direction] ?? trendConfig.neutral : null;
  const TrendIcon = trendInfo?.icon;

  return (
    <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-border/50">
      <div className="flex items-start justify-between">
        {/* Icon badge */}
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            iconBg ?? "bg-primary/8",
          )}
        >
          <Icon className={cn("size-5", iconColor ?? "text-primary")} aria-hidden="true" />
        </div>

        {/* Trend */}
        {trend && trendInfo && (
          <span
            className={cn(
              "flex items-center gap-0.5 font-ui text-xs font-medium",
              trendInfo.color,
            )}
          >
            <TrendIcon className="size-3" aria-hidden="true" />
            {trend.value}
          </span>
        )}
      </div>

      <p className="mt-4 font-heading text-[2rem] leading-none text-heading">
        {value}
      </p>
      <p className="mt-1.5 font-ui text-xs font-medium text-muted">{title}</p>
      {description && (
        <p className="mt-1 font-body text-xs text-muted/60">{description}</p>
      )}
    </div>
  );
}
