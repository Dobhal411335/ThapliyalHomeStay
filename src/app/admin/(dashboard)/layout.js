import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { CompanyBasicInfoProvider } from "@/providers/CompanyBasicInfoProvider";
import { getCompanyBasicInfo } from "@/services/companyBasicInfo.service";

export default async function DashboardLayout({ children }) {
  const companyBasicInfo = await getCompanyBasicInfo();

  return (
    <CompanyBasicInfoProvider value={companyBasicInfo}>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </CompanyBasicInfoProvider>
  );
}
