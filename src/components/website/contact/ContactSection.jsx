"use client";

import { Phone, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";
import Image from "next/image";
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";
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
/* ── Contact detail block ─────────────────────────── */
function ContactBlock({ label, children }) {
  return (
    <div>
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────── */
export function ContactSection() {
  const companyInfo = useCompanyBasicInfo();

  const contactNumbers = companyInfo?.contactNumbers?.length > 0 ? companyInfo.contactNumbers : [""];
  const emails = companyInfo?.emails?.length > 0 ? companyInfo.emails : ["hello@example.com"];
  const officeAddresses = companyInfo?.officeAddresses?.length > 0 ? companyInfo.officeAddresses : [""];

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* ── Left — contact info ───────────────────── */}
          <div>
            {/* Eyebrow */}
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Reach out
            </p>

            {/* Heading */}
            <h1 className="mt-4 font-heading text-5xl leading-[1.05] text-heading md:text-6xl">
              Begin with a <em className="italic text-primary">quiet hello.</em>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-sm font-body text-sm leading-[1.85] text-foreground">
              Send us a note, call us, or WhatsApp if it&apos;s easier. We
              answer ourselves — no bots, no rush.
            </p>

            {/* Contact details */}
            <div className="mt-10 flex flex-col gap-8">
              {/* WhatsApp / Call */}
              <ContactBlock label="WhatsApp / Call">
                <div className="flex flex-col gap-5">
                  {contactNumbers.map((num, i) => {
                    const waPhone = num.replace(/\D/g, "");
                    const telPhone = num.replace(/\s+/g, "");
                    return (
                      <div key={i}>
                        <p className="text-lg font-medium text-heading">
                          {num}
                        </p>
                        <div className="mt-2 flex items-center gap-5">
                          <a
                            href={`https://wa.me/${waPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-body text-sm text-foreground transition-colors hover:text-primary"
                          >
                            <MessageCircle
                              className="size-3.5 text-primary"
                              aria-hidden="true"
                            />
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${telPhone}`}
                            className="inline-flex items-center gap-1.5 font-body text-sm text-foreground transition-colors hover:text-primary"
                          >
                            <PhoneCall
                              className="size-3.5 text-primary"
                              aria-hidden="true"
                            />
                            Call
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ContactBlock>

              {/* Email */}
              <ContactBlock label="Write to us">
                <div className="flex flex-col gap-3">
                  {emails.map((email, i) => (
                    <a
                      key={i}
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 font-body text-base text-heading transition-colors hover:text-primary"
                    >
                      <Mail className="size-4 text-primary" aria-hidden="true" />
                      {email}
                    </a>
                  ))}
                </div>
              </ContactBlock>

              {/* Address */}
              <ContactBlock label="Find us">
                <div className="flex flex-col gap-4">
                  {officeAddresses.map((addr, i) => (
                    <address key={i} className="flex items-start gap-2 font-body text-sm not-italic leading-relaxed text-foreground">
                      <MapPin
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {addr}
                    </address>
                  ))}
                </div>
              </ContactBlock>

              {/* Social Media */}
              {(companyInfo?.facebookLink ||
                companyInfo?.instagramLink ||
                companyInfo?.youtubeLink ||
                companyInfo?.googleLink) && (
                <ContactBlock label="Social Media">
                  <div className="flex flex-wrap items-center gap-4">
                    {companyInfo.facebookLink && (
                      <a
                        href={companyInfo.facebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-body text-sm text-heading transition-colors hover:text-primary"
                      >
                        <Facebook className="size-4 text-primary" aria-hidden="true" />
                        Facebook
                      </a>
                    )}
                    {companyInfo.instagramLink && (
                      <a
                        href={companyInfo.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-body text-sm text-heading transition-colors hover:text-primary"
                      >
                        <Instagram className="size-4 text-primary" aria-hidden="true" />
                        Instagram
                      </a>
                    )}
                    {companyInfo.youtubeLink && (
                      <a
                        href={companyInfo.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-body text-sm text-heading transition-colors hover:text-primary"
                      >
                        <Youtube className="size-4 text-primary" aria-hidden="true" />
                        YouTube
                      </a>
                    )}
                    {companyInfo.googleLink && (
                      <a
                        href={companyInfo.googleLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-body text-sm text-heading transition-colors hover:text-primary"
                      >
                        <Google className="size-4 text-primary" aria-hidden="true" />
                        Google
                      </a>
                    )}
                  </div>
                </ContactBlock>
              )}
            </div>

            <div className="relative mt-10 h-52 w-full overflow-hidden rounded-[var(--radius-image)] bg-border">
              <Image
                src="/cta1.png"
                alt="Warmth close-up"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* ── Right — enquiry form ──────────────────── */}
          <div className="lg:pt-20">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
