import Link from "next/link";
import { Plus, Upload, Layers, Star, MessageSquare, Settings } from "lucide-react";
import { DashboardCard } from "@/components/admin/common/DashboardCard";

const actions = [
  {
    label: "Create Package",
    description: "Add a new retreat offering",
    href: "/admin/packages/new",
    icon: Plus,
    iconBg: "bg-primary/8",
    iconColor: "text-primary",
  },
  {
    label: "Upload Image",
    description: "Add photos to gallery",
    href: "/admin/gallery/upload",
    icon: Upload,
    iconBg: "bg-success/8",
    iconColor: "text-success",
  },
  {
    label: "Manage Hero",
    description: "Edit homepage hero section",
    href: "/admin/hero",
    icon: Layers,
    iconBg: "bg-warning/8",
    iconColor: "text-warning",
  },
  {
    label: "Manage Testimonials",
    description: "Add or edit guest reviews",
    href: "/admin/testimonials",
    icon: Star,
    iconBg: "bg-primary/8",
    iconColor: "text-primary",
  },
  {
    label: "View Enquiries",
    description: "Review contact requests",
    href: "/admin/enquiries",
    icon: MessageSquare,
    iconBg: "bg-success/8",
    iconColor: "text-success",
  },
  {
    label: "Settings",
    description: "Configure website settings",
    href: "/admin/settings",
    icon: Settings,
    iconBg: "bg-muted/8",
    iconColor: "text-muted",
  },
];

export function QuickActions() {
  return (
    <DashboardCard title="Quick Actions">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-3.5 rounded-xl border border-border/70 px-4 py-3.5 transition-all hover:border-primary/30 hover:bg-primary/3"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${action.iconBg}`}
            >
              <action.icon className={`size-4 ${action.iconColor}`} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-ui text-sm font-medium text-heading group-hover:text-primary">
                {action.label}
              </p>
              <p className="truncate font-body text-xs text-muted">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
