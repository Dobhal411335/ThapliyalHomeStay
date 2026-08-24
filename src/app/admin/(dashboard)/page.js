import { WelcomeCard } from "@/components/admin/dashboard/WelcomeCard";
import { StatsGrid } from "@/components/admin/dashboard/StatsGrid";
import { CmsGrid } from "@/components/admin/dashboard/CmsGrid";
import { getDashboardEnquiryStats } from "@/services/dashboardStats.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const enquiryStats = await getDashboardEnquiryStats();

  return (
    <div className="flex flex-col gap-8">
      <WelcomeCard />
      <StatsGrid stats={enquiryStats} />
      <CmsGrid />
    </div>
  );
}
