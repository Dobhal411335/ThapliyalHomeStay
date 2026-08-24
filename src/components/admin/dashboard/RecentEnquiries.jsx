import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashboardCard } from "@/components/admin/common/DashboardCard";
import { StatusBadge } from "@/components/admin/common/StatusBadge";

const enquiries = [
  {
    id: 1,
    name: "Sunita Rao",
    email: "sunita@example.com",
    date: "27 Jul 2026",
    preview: "Looking for a week-long retreat in September…",
    status: "unread",
  },
  {
    id: 2,
    name: "Dev Malhotra",
    email: "dev@example.com",
    date: "26 Jul 2026",
    preview: "Do you offer private yoga sessions alongside…",
    status: "unread",
  },
  {
    id: 3,
    name: "Asha Pillai",
    email: "asha@example.com",
    date: "25 Jul 2026",
    preview: "My partner and I would like to book the bespoke…",
    status: "read",
  },
];

export function RecentEnquiries() {
  return (
    <DashboardCard
      title="Recent Enquiries"
      description="Latest messages from visitors"
      action={
        <Link
          href="/admin/enquiries"
          className="flex items-center gap-1 font-ui text-xs text-primary hover:underline"
        >
          View all <ArrowUpRight className="size-3" />
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        {enquiries.map((e) => (
          <div
            key={e.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-border/50 p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-ui text-sm font-medium text-heading">
                  {e.name}
                </span>
                <StatusBadge
                  dot
                  status={e.status === "unread" ? "unread" : "read"}
                  label={e.status === "unread" ? "Unread" : "Read"}
                />
              </div>
              <p className="mt-0.5 font-ui text-xs text-muted">{e.email}</p>
              <p className="mt-2 font-body text-sm text-foreground line-clamp-1">
                {e.preview}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-ui text-xs text-muted">{e.date}</span>
            </div>
          </div>
        ))}

        {enquiries.length === 0 && (
          <p className="py-6 text-center font-body text-sm text-muted">
            No enquiries yet.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}
