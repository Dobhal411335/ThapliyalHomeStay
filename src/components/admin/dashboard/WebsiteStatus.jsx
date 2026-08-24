import { Cloud, Database, Mail, CheckCircle2 } from "lucide-react";
import { DashboardCard } from "@/components/admin/common/DashboardCard";
import { StatusBadge } from "@/components/admin/common/StatusBadge";

const services = [
  {
    name: "Cloudinary",
    description: "Image storage",
    icon: Cloud,
    status: "success",
    label: "Connected",
  },
  {
    name: "MongoDB",
    description: "Database",
    icon: Database,
    status: "success",
    label: "Connected",
  },
  {
    name: "Brevo",
    description: "Email service",
    icon: Mail,
    status: "success",
    label: "Connected",
  },
  {
    name: "Environment",
    description: "Configuration",
    icon: CheckCircle2,
    status: "success",
    label: "Healthy",
  },
];

export function WebsiteStatus() {
  return (
    <DashboardCard
      title="Website Status"
      description="Third-party service health"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3.5"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8">
              <service.icon className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-ui text-sm font-medium text-heading">{service.name}</p>
              <p className="font-body text-xs text-muted">{service.description}</p>
            </div>
            <div className="ml-auto">
              <StatusBadge dot status={service.status} label={service.label} />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
