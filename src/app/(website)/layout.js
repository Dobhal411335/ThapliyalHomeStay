import { Navbar } from "@/components/website/Navbar";
import { Footer } from "@/components/website/Footer";
import { GoogleTrackingTag } from "@/components/website/GoogleTrackingTag";
import { CompanyBasicInfoProvider } from "@/providers/CompanyBasicInfoProvider";
import { getCompanyBasicInfo } from "@/services/companyBasicInfo.service";

export default async function WebsiteLayout({ children }) {
  const companyBasicInfo = await getCompanyBasicInfo();
  return (
    <CompanyBasicInfoProvider value={companyBasicInfo}>
      <GoogleTrackingTag html={companyBasicInfo?.googleTrackingTag} />
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CompanyBasicInfoProvider>
  );
}
