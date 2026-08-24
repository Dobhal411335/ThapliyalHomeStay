import Link from "next/link";
import {
  Inbox,
  PackageSearch,
  MessageSquare,
  AlertCircle,
  BedDouble,
} from "lucide-react";
import { StatCard } from "@/components/admin/common/StatCard";

function buildStats(stats) {
  return [
    {
      icon: MessageSquare,
      title: "Total Enquiries",
      value: String(stats.totalEnquiries),
      description: "Across all enquiry pages",
      href: "/admin/enquiry_page",
    },
    {
      icon: AlertCircle,
      title: "Pending Enquiries",
      value: String(stats.totalPending),
      description: "Awaiting your response",
      href: "/admin/enquiry_page",
      iconBg: "bg-warning/8",
      iconColor: "text-warning",
    },
    {
      icon: PackageSearch,
      title: "Contact Us",
      value: String(stats.contact.total),
      description: `${stats.contact.pending} pending`,
      href: "/admin/contact_us",
    },
    {
      icon: Inbox,
      title: "Enquiry Page",
      value: String(stats.enquiryPage.total),
      description: `${stats.enquiryPage.pending} pending`,
      href: "/admin/enquiry_page",
    },
    {
      icon: PackageSearch,
      title: "Package Enquiries",
      value: String(stats.packageEnquiry.total),
      description: `${stats.packageEnquiry.pending} pending`,
      href: "/admin/enquiries/packages",
    },
    {
      icon: BedDouble,
      title: "Room Enquiries",
      value: String(stats.room.total),
      description: `${stats.room.pending} pending`,
      href: "/admin/room_enquiries",
    },
  ];
}

export function StatsGrid({ stats }) {
  const cards = buildStats(stats);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((stat) => (
        <Link
          key={stat.title}
          href={stat.href}
          className="block transition-transform hover:-translate-y-0.5"
        >
          <StatCard {...stat} />
        </Link>
      ))}
    </div>
  );
}
