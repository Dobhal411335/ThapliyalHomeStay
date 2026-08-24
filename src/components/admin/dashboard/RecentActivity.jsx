import { LogIn, LogOut, ShieldX, Clock } from "lucide-react";
import { DashboardCard } from "@/components/admin/common/DashboardCard";

const activityLog = [
  {
    id: 1,
    event: "LOGIN_SUCCESS",
    email: "admin@gmail.com",
    ip: "203.0.113.42",
    time: "Today, 10:32 PM",
    status: "success",
  },
  {
    id: 2,
    event: "LOGOUT",
    email: "admin@gmail.com",
    ip: "203.0.113.42",
    time: "Today, 08:15 AM",
    status: "neutral",
  },
];

const eventConfig = {
  LOGIN_SUCCESS: {
    label: "Login",
    icon: LogIn,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  LOGOUT: {
    label: "Logout",
    icon: LogOut,
    iconBg: "bg-muted/10",
    iconColor: "text-muted",
  },
  LOGIN_FAILED: {
    label: "Failed login",
    icon: ShieldX,
    iconBg: "bg-error/10",
    iconColor: "text-error",
  },
  SESSION_EXPIRED: {
    label: "Session expired",
    icon: Clock,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
};

export function RecentActivity() {
  return (
    <DashboardCard
      title="Recent Activity"
      description="Authentication log"
    >
      <div className="flex flex-col gap-3">
        {activityLog.map((entry) => {
          const config = eventConfig[entry.event] ?? eventConfig.LOGIN_SUCCESS;
          const Icon = config.icon;

          return (
            <div key={entry.id} className="flex items-start gap-3.5">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
              >
                <Icon className={`size-4 ${config.iconColor}`} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-ui text-sm font-medium text-heading">
                  {config.label}
                </p>
                <p className="font-body text-xs text-muted">
                  {entry.email} · {entry.ip}
                </p>
              </div>
              <span className="shrink-0 font-ui text-xs text-muted">{entry.time}</span>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
