import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashboardCard } from "@/components/admin/common/DashboardCard";
import { StatusBadge } from "@/components/admin/common/StatusBadge";

const bookings = [
  {
    id: 1,
    name: "Priya Sharma",
    package: "Week of Stillness",
    guests: 2,
    arrival: "15 Aug 2026",
    status: "confirmed",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    package: "Day Sojourn",
    guests: 1,
    arrival: "22 Aug 2026",
    status: "pending",
  },
  {
    id: 3,
    name: "Kavya Nair",
    package: "Month of Becoming",
    guests: 1,
    arrival: "1 Sep 2026",
    status: "confirmed",
  },
  {
    id: 4,
    name: "Rohan Gupta",
    package: "Week of Stillness",
    guests: 2,
    arrival: "8 Sep 2026",
    status: "review",
  },
  {
    id: 5,
    name: "Meera Iyer",
    package: "Day Sojourn",
    guests: 3,
    arrival: "14 Sep 2026",
    status: "pending",
  },
];

const statusMap = {
  confirmed: { status: "success", label: "Confirmed" },
  pending: { status: "pending", label: "Pending" },
  review: { status: "info", label: "Under Review" },
  cancelled: { status: "error", label: "Cancelled" },
};

export function RecentBookings() {
  return (
    <DashboardCard
      title="Recent Bookings"
      description="Latest retreat enquiries and bookings"
      noPadding
      action={
        <Link
          href="/admin/enquiries"
          className="flex items-center gap-1 font-ui text-xs text-primary hover:underline"
        >
          View all <ArrowUpRight className="size-3" />
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-border/50 bg-background/50">
              {["Name", "Package", "Guests", "Arrival Date", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-muted first:pl-6"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr
                key={b.id}
                className="border-b border-border/30 transition-colors last:border-0 hover:bg-background/40"
              >
                <td className="px-6 py-4">
                  <span className="font-body text-sm font-medium text-heading">
                    {b.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-body text-sm text-foreground">{b.package}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-body text-sm text-muted">{b.guests}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-body text-sm text-muted">{b.arrival}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    dot
                    status={statusMap[b.status]?.status ?? "neutral"}
                    label={statusMap[b.status]?.label ?? b.status}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="font-ui text-xs text-primary hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
