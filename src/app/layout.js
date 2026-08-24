import { Cormorant_Garamond, Inter, Manrope } from "next/font/google";
import { ToasterProvider } from "@/providers/ToasterProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  buildCompanyMetadata,
  getCompanyBasicInfo,
} from "@/services/companyBasicInfo.service";
import "./globals.css";
import OverlayButton from "@/components/website/OverlayButton";
import EnrollNow from "@/components/website/EnrollNow";
const heading = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const ui = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

export async function generateMetadata() {
  const company = await getCompanyBasicInfo();
  return buildCompanyMetadata(company);
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${ui.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ToasterProvider />
        <TooltipProvider>{children}</TooltipProvider>
        <EnrollNow />
        <OverlayButton />
      </body>
    </html>
  );
}
