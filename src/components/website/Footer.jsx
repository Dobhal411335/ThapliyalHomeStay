"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { site } from "@/constants/site";
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";
import { useEffect, useState } from "react";

function formatPhone(number) {
  const digits = String(number || "").replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return number;
}
function Facebook({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Instagram({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function Youtube({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM10 15.5V8.5L16 12l-6 3.5Z" />
    </svg>
  );
}

function Google({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.42Z" />
      <path d="M12 22c2.7 0 4.96-.9 6.62-2.35l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.06v2.58A10 10 0 0 0 12 22Z" />
      <path d="M6.39 13.98A6.01 6.01 0 0 1 6.08 12c0-.69.12-1.35.31-1.98V7.44H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.56l3.33-2.58Z" />
      <path d="M12 5.89c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 2.89 14.7 2 12 2A10 10 0 0 0 3.06 7.44l3.33 2.58C7.18 7.65 9.39 5.89 12 5.89Z" />
    </svg>
  );
}
export function Footer() {
  const year = new Date().getFullYear();
  const company = useCompanyBasicInfo();
  const [pages, setPages] = useState([])

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch("/api/getAllPages")
        const data = await response.json()
        setPages(data.pages)
      } catch (error) {
        console.error("Error fetching pages:", error)
      }
    }
    fetchPages()
  }, [])
  const companyName = company?.companyName || site.name;
  const footerLogoSrc =
    company?.footerLogo?.url || company?.mainLogo?.url || undefined;

  const addresses = company?.officeAddresses?.length
    ? company.officeAddresses
    : company?.googleAddress
      ? [company.googleAddress]
      : [];
  const phones = company?.contactNumbers || [];
  const emails = company?.emails || [];
  const instagramLink = company?.instagramLink || "";
  const facebookLink = company?.facebookLink || "";
  const youtubeLink = company?.youtubeLink || "";
  const googleLink = company?.googleLink || "";

  const contactItems = [
    ...addresses.map((text) => ({ icon: MapPin, text })),
    ...phones.map((number) => ({
      icon: Phone,
      text: formatPhone(number),
      href: `tel:${String(number).replace(/\D/g, "")}`,
    })),
    ...emails.map((email) => ({
      icon: Mail,
      text: email,
      href: `mailto:${email}`,
    })),
  ];

  const socialItems = [
    ...(instagramLink
      ? [{ icon: Instagram, text: "Instagram", href: instagramLink }]
      : []),
    ...(facebookLink
      ? [{ icon: Facebook, text: "Facebook", href: facebookLink }]
      : []),
    ...(youtubeLink
      ? [{ icon: Youtube, text: "Youtube", href: youtubeLink }]
      : []),
    ...(googleLink
      ? [{ icon: Google, text: "Google", href: googleLink }]
      : []),
  ];

  return (
    <footer className="bg-footer text-white" aria-label="Site footer">
      <div className="container p-5 md:p-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Logo tone="light" name={companyName} imageSrc={footerLogoSrc} />
            <p className="mt-6 max-w-xs font-body text-sm leading-7 text-white">
              A spiritual habitat in Rishikesh for those returning home to
              themselves.
            </p>
          </div>
          <div>
            <h3 className="font-ui text-xs uppercase tracking-[0.2em] text-white">
              Explore
            </h3>
            <ul className="mt-6 space-y-4">
              {pages.filter(page => !page?.link?.includes('policy')).map(page => (
                <Link key={page._id} href={page.url} className="block text-white text-sm font-barlow transition-colors hover:underline">
                  {page.title}
                </Link>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-ui text-xs uppercase tracking-[0.2em] text-white">
              Find us
            </h3>
            {contactItems.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {contactItems.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <item.icon
                      className="mt-1 size-4 shrink-0 text-white"
                      aria-hidden="true"
                    />
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="font-body text-sm hover:underline leading-6 text-white transition-colors hover:text-surface break-all"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="font-body text-sm leading-6 text-white">
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            {socialItems.length > 0 ? (
              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-5 mb-2">
                {socialItems.map((item) => (
                  <li key={item.text}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-body text-sm text-white transition-colors hover:text-surface hover:underline"
                    >
                      <item.icon
                        className="size-4 shrink-0 text-white"
                        aria-hidden="true"
                      />
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="my-5 md:my-2 border-t border-white pt-8 text-center">
          <p className="font-ui text-xs text-white">
            © {year} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
