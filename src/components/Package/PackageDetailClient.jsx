"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  Tag,
  Star,
  Check,
  X,
  AlertTriangle,
  Calculator,
  MessageSquare,
  ShoppingCart,
  PhoneCall,
  MessageCircle,
  Share2,
  Copy,
  ChevronRight,
  ChevronLeft,
  Hotel,
  Bus,
  Utensils,
  Camera,
  Users,
  Ticket,
  ArrowRight,
  Heart,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewForm from "@/components/Package/review-form.jsx";
import PackageMap from "@/components/Package/package-map.jsx";
import PackageCarouselWrapper from "@/components/Package/PackageCarouselWrapper.jsx";
import PackageEnquiryModal from "@/components/Package/PackageEnquiryModal.jsx";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";

const accordionEase = [0.4, 0, 0.2, 1];

function PackageSectionHeader({ eyebrow, title, aside }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
      <div>
        {eyebrow ? (
          <p className="font-ui text-xs uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 font-heading text-2xl font-medium text-heading md:text-3xl">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}

function PackageAccordion({ eyebrow, title, open, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors duration-(--duration-fast) ease-(--ease-smooth)",
          open ? "bg-primary" : "bg-surface hover:bg-primary/10",
        )}
      >
        <span className="flex min-w-0 flex-col">
          {eyebrow ? (
            <span
              className={cn(
                "font-ui text-[11px] uppercase tracking-[0.22em]",
                open ? "text-primary-foreground/80" : "text-primary",
              )}
            >
              {eyebrow}
            </span>
          ) : null}
          <span
            className={cn(
              "font-heading text-lg font-medium md:text-xl",
              open ? "text-primary-foreground" : "text-heading",
            )}
          >
            {title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 transition-transform duration-(--duration-fast) ease-(--ease-smooth)",
            open ? "rotate-180 text-primary-foreground" : "text-primary",
          )}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: accordionEase }}
            className="overflow-hidden"
          >
            <div className="border-t border-border bg-background px-5 py-5">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
export default function PackageDetailClient({
  packageDetails,
  reviews,
  packages,
  featuredPackages,
  avgRating,
  formatNumericStr,
}) {
  const companyInfo = useCompanyBasicInfo();
  const whatsappNumber = (companyInfo?.whatsappNumber || companyInfo?.contactNumbers?.[0] || "").replace(/\D/g, "");
  // console.log(packageDetails)
  const [openDayIndex, setOpenDayIndex] = useState(0);
  const [openSections, setOpenSections] = useState({});
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-IN").format(number);
  const formatUsd = (number) => new Intl.NumberFormat("en-US").format(number);
  const hasUsdPrice = (amount) => Number(amount) > 0;

  const duration = packageDetails?.basicDetails?.duration;
  const nights =
    duration != null && duration !== ""
      ? Math.max(Number(duration) - 1, 0)
      : null;
  const priceLabel =
    packageDetails?.price === 0
      ? "XXXX*"
      : packageDetails?.price != null
        ? `₹${formatNumber(packageDetails.price)} / Adult`
        : null;

  const whatsappEnquiryMessage = [
    "Namaste",
    "",
    "I hope you're well. I'd like to enquire about the following package:",
    "",
    `Package: ${packageDetails?.packageName || "—"}`,
    packageDetails?.basicDetails?.location
      ? `Location: ${packageDetails.basicDetails.location}`
      : null,
    duration != null && duration !== ""
      ? `Duration: ${duration} Days / ${nights} Nights`
      : null,
    packageDetails?.basicDetails?.tourType
      ? `Category: ${packageDetails.basicDetails.tourType}`
      : null,
    priceLabel ? `Price: ${priceLabel}` : null,
    packageDetails?.slug
      ? `Page:${process.env.NEXT_PUBLIC_SITE_URL}/package/${packageDetails.slug}`
      : null,
    "",
    "Could you please share availability and more details?",
    "",
    "Thank you!",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const dayPlans =
    packageDetails.info?.filter(
      (info) => info.typeOfSelection === "Day Plan",
    ) || [];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: packageDetails.packageName,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Gallery modal
  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    document.body.style.overflow = "";
  };

  const nextImage = () =>
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () =>
    setGalleryIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );

  // Gallery images from packageDetails
  const galleryImages = packageDetails?.gallery || [];
  // Keyboard navigation for gallery
  useEffect(() => {
    if (!galleryOpen) return;
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galleryOpen, galleryImages.length]);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  // Itinerary summary counts
  const totalDays = dayPlans.length;
  // Inclusions/Exclusions
  const inclusions =
    packageDetails.info?.filter((i) => i.typeOfSelection === "Inclusions") ||
    [];
  const exclusions =
    packageDetails.info?.filter((i) => i.typeOfSelection === "Exclusions") ||
    [];
  const faqs =
    packageDetails.info?.filter(
      (i) => i.typeOfSelection === "Frequently Asked Questions",
    ) || [];
  const importantInfo =
    packageDetails.info?.filter(
      (i) => i.typeOfSelection === "Important Information",
    ) || [];
  const others =
    packageDetails.info?.filter((i) => i.typeOfSelection === "Other") || [];
  const policies =
    packageDetails.info?.filter(
      (i) => i.typeOfSelection === "Policy Content",
    ) || [];
  const hotels = packageDetails.hotels || [];
  const summary =
    packageDetails.info?.filter((i) => i.typeOfSelection === "Summary") || [];
  const validReviews = Array.isArray(reviews)
    ? reviews.filter((r) => r.approved === true || r.status === "approved")
    : [];

  // Night stops for itinerary bar
  const nightStops = packageDetails.basicDetails?.nightStops || [];
  const basicHighlights = Array.isArray(packageDetails.basicDetails?.highlights)
    ? packageDetails.basicDetails.highlights
    : [];
  const basicTableData = Array.isArray(packageDetails.basicDetails?.tableData)
    ? packageDetails.basicDetails.tableData
    : [];
  const includePackageData =
    Array.isArray(packageDetails.includePackage) &&
    packageDetails.includePackage.length > 0
      ? packageDetails.includePackage[0]
      : null;
  const includedDesc = includePackageData?.selectionDesc || "";
  const includedHighlights = includePackageData?.selectionHighlight || "";
  const includedTables = includePackageData?.selectionTable || "";

  return (
    <div className="min-h-screen w-full bg-background font-body">
      {/* ========== HEADER: Package Name + Tags + Itinerary ========== */}
      <div className="w-full border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
            Retreat package
          </p>
          <h1 className="mb-4 font-sans text-3xl font-medium leading-tight text-heading md:text-3xl">
            {packageDetails.packageName}
          </h1>

          {/* Tags row */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {packageDetails.basicDetails?.tourType && (
              <span className="rounded-button border border-border bg-white px-3.5 py-1.5 font-ui text-sm font-medium text-heading">
                {packageDetails.basicDetails.tourType}
              </span>
            )}
            <span className="rounded-button bg-primary px-3.5 py-1.5 font-ui text-sm font-semibold text-primary-foreground">
              {packageDetails.basicDetails?.duration || "7N/8D"} Days
            </span>

            {/* Night stops */}
            {nightStops.length > 0 && (
              <div className="ml-1 flex flex-wrap items-center gap-2">
                {nightStops.map((stop, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-button border border-border bg-surface px-3 py-2"
                  >
                    <span className="font-ui text-sm text-black">•</span>
                    <span className="font-ui text-sm font-medium text-heading">
                      {stop}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== MAIN CONTENT: Left (75%) + Right Sidebar (25%) ========== */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* ===== LEFT CONTENT (75%) ===== */}
          <div className="w-full lg:w-[72%] py-5">
            {/* ========== SUMMARY BANNER ========== */}
            {/* <div className="mb-8 space-y-3 rounded-[var(--radius-card)] border border-border bg-white p-5 md:p-6">
              {packageDetails.basicDetails?.notice && packageDetails.basicDetails.notice.trim() !== "" && (
                <div className="rounded-[var(--radius-input)] border border-error/25 bg-error/8 p-4">
                  <p className="flex items-start gap-2 font-body text-sm font-medium text-error">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Availability Notice — rates are tentative and subject to availability. No booking hold.</span>
                  </p>
                </div>
              )}
            </div> */}
            {/* ---- OVERVIEW ---- */}
            <div className="space-y-10">
              {/* Included in this package */}
                {includePackageData && (
                  <div>
                    <PackageSectionHeader
                      eyebrow="Package"
                      title="Included in this package"
                    />
                    <div className="rounded-[var(--radius-card)] border border-border bg-white p-5 md:p-6">
                      {/* Description */}
                      {includedDesc && (
                        <div className="prose custom-desc-list max-w-none leading-relaxed text-black [&_p]:text-black [&_li]:text-black [&_span]:text-black">
                          <div
                            dangerouslySetInnerHTML={{ __html: includedDesc }}
                          />
                        </div>
                      )}

                      {/* Highlights */}
                      {includedHighlights.length > 0 && (
                        <div className="mt-4 border-t border-border pt-4">
                          <ul className="list-disc space-y-2 pl-5">
                            {includedHighlights.map((hl, hIdx) => (
                              <li key={hIdx}>
                                <p className="font-heading text-lg font-medium text-heading">
                                  {hl.highlightName}
                                </p>
                                {hl.highlightDesc?.length > 0 && (
                                  <ul className="mt-1 list-disc space-y-1 pl-5">
                                    {hl.highlightDesc.map((desc, dIdx) => (
                                      <li
                                        key={dIdx}
                                        className="font-body text-sm text-muted"
                                      >
                                        {desc}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Table */}
                      {includedTables.length > 0 && (
                        <div className="mt-4 pt-4">
                          {includedTables.map((tbl, tIdx) => (
                            <div key={tIdx} className="mb-4">
                              <h5 className="mb-2 font-ui text-sm font-semibold text-heading">
                                {tbl.tableName}
                              </h5>
                              <table className="w-full border-collapse text-sm">
                                <tbody>
                                  {Array.from(
                                    {
                                      length: Math.ceil(
                                        (tbl.tableDesc?.length || 0) / 2,
                                      ),
                                    },
                                    (_, rowIdx) => {
                                      const col1 = tbl.tableDesc[rowIdx * 2];
                                      const col2 =
                                        tbl.tableDesc[rowIdx * 2 + 1];

                                      return (
                                        <tr
                                          key={rowIdx}
                                          className={
                                            rowIdx % 2 === 0
                                              ? "bg-surface hover:bg-border/40"
                                              : "bg-white hover:bg-surface"
                                          }
                                        >
                                          {/* Left */}
                                          <td className="w-[32%] border-b border-r border-border px-6 py-4 font-semibold text-heading">
                                            {col1 || ""}
                                          </td>

                                          {/* Right */}
                                          <td className="w-[68%] border-b border-border px-6 py-4 font-medium text-muted">
                                            {col2 || ""}
                                          </td>
                                        </tr>
                                      );
                                    },
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Description */}
                {packageDetails.basicDetails?.fullDesc && (
                  <div>
                    <PackageSectionHeader eyebrow="Retreat" title="Overview" />
                    <div className="prose custom-desc-list max-w-none leading-relaxed text-heading">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: packageDetails.basicDetails.fullDesc,
                      }}
                    />
                    </div>
                  </div>
                )}
                {basicHighlights.length > 0 && (
                  <div className="mt-4 border-t border-border/60 pt-4">
                    <ul className="list-disc space-y-2 pl-5">
                      {basicHighlights.map((hl, hIdx) => (
                        <li key={hIdx}>
                          <p className="font-heading text-base font-medium text-heading">
                            {hl.highlightName}
                          </p>

                          {hl.highlightDesc?.length > 0 && (
                            <ul className="mt-1 list-disc space-y-1 pl-5">
                              {hl.highlightDesc.map((desc, dIdx) => (
                                <li
                                  key={dIdx}
                                  className="font-body text-sm text-muted"
                                >
                                  {desc}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Table */}
                {basicTableData.length > 0 && (
                  <div className="mt-4 border-t border-border/60 pt-4">
                    {basicTableData.map((tbl, tIdx) => (
                      <div key={tIdx} className="mb-4">
                        <h5 className="mb-2 font-ui text-sm font-semibold text-heading">
                          {tbl.tableName}
                        </h5>
                        <table className="w-full overflow-hidden rounded-[var(--radius-input)] border border-border text-sm">
                          <tbody>
                            {Array.from(
                              {
                                length: Math.ceil(
                                  (tbl.tableDesc?.length || 0) / 2,
                                ),
                              },
                              (_, rowIdx) => {
                                const col1 = tbl.tableDesc[rowIdx * 2];
                                const col2 = tbl.tableDesc[rowIdx * 2 + 1];
                                return (
                                  <tr
                                    key={rowIdx}
                                    className={
                                      rowIdx % 2 === 0
                                        ? "bg-surface"
                                        : "bg-white"
                                    }
                                  >
                                    <td className="border border-border px-3 py-2 font-medium text-heading">
                                      {col1 || ""}
                                    </td>
                                    <td className="border border-border px-3 py-2 font-medium text-muted">
                                      {col2 || ""}
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {/* Map */}
                {packageDetails.info?.filter(
                  (i) => i.typeOfSelection === "Location Map",
                )[0]?.selectionDesc && (
                  <div>
                    <PackageSectionHeader eyebrow="Place" title="Map location" />
                    <PackageMap
                      location={
                        packageDetails.info.filter(
                          (i) => i.typeOfSelection === "Location Map",
                        )[0].selectionDesc
                      }
                    />
                  </div>
                )}

                {faqs.length > 0 && (
                  <div>
                    <PackageSectionHeader
                      eyebrow="Guidance"
                      title="Frequently asked questions"
                    />
                    <div className="space-y-3">
                      {faqs.map((faq, i) => (
                        <details
                          key={i}
                          className="group overflow-hidden rounded-card border border-border bg-surface"
                        >
                          <summary className="flex cursor-pointer items-center justify-between bg-surface px-5 py-3.5 font-ui text-sm font-semibold text-heading transition-colors hover:bg-primary/10 group-open:bg-primary group-open:text-primary-foreground">
                            {faq.selectionTitle}
                            <ChevronRight className="h-4 w-4 text-primary transition-transform group-open:rotate-90 group-open:text-primary-foreground" />
                          </summary>
                          <div className="prose prose-sm custom-desc-list max-w-none px-5 py-4 text-sm text-muted">
                            {faq.selectionDesc ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: faq.selectionDesc,
                                }}
                              />
                            ) : (
                              <p>No description available</p>
                            )}
                            {faq.selectionHighlight?.length > 0 && (
                              <div className="not-prose mt-4 border-t border-border pt-4">
                                <ul className="list-disc space-y-2 pl-5">
                                  {faq.selectionHighlight.map((hl, hIdx) => (
                                    <li key={hIdx}>
                                      <p className="font-heading text-base font-medium text-heading">
                                        {hl.highlightName}
                                      </p>
                                      {hl.highlightDesc?.length > 0 && (
                                        <ul className="mt-1 list-disc space-y-1 pl-5">
                                          {hl.highlightDesc.map(
                                            (desc, dIdx) => (
                                              <li
                                                key={dIdx}
                                                className="font-body text-sm text-muted"
                                              >
                                                {desc}
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {faq.selectionTable?.length > 0 && (
                              <div className="mt-4 pt-4">
                                {faq.selectionTable?.map((tbl, tIdx) => (
                                  <div key={tIdx} className="not-prose mb-4">
                                    <h5 className="mb-2 font-ui text-sm font-semibold text-heading">
                                      {tbl.tableName}
                                    </h5>
                                    <table className="w-full overflow-hidden rounded-[var(--radius-input)] border border-border border-collapse text-sm">
                                      <tbody>
                                        {Array.from(
                                          {
                                            length: Math.ceil(
                                              (tbl.tableDesc?.length || 0) / 2,
                                            ),
                                          },
                                          (_, rowIdx) => {
                                            const col1 =
                                              tbl.tableDesc[rowIdx * 2];
                                            const col2 =
                                              tbl.tableDesc[rowIdx * 2 + 1];
                                            return (
                                              <tr
                                                key={rowIdx}
                                                className={
                                                  rowIdx % 2 === 0
                                                    ? "bg-surface hover:bg-surface"
                                                    : "bg-white hover:bg-surface"
                                                }
                                              >
                                                <td className="w-[32%] border-b border-r border-border !px-2 !py-4 text-sm font-semibold text-wrap text-heading md:!px-6">
                                                  {col1 || ""}
                                                </td>
                                                <td className="w-[68%] border-b border-border !px-2 !py-4 text-sm font-medium text-wrap text-muted md:!px-6">
                                                  {col2 || ""}
                                                </td>
                                              </tr>
                                            );
                                          },
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            <div className="mt-10 space-y-4">
            {dayPlans.length > 0 ? (
              <div>
                <div className="mb-4 flex items-end justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <p className="font-ui text-xs uppercase tracking-[0.25em] text-primary">
                      Itinerary
                    </p>
                    <h2 className="mt-2 font-heading text-2xl font-medium text-heading md:text-3xl">
                      Day plan
                    </h2>
                  </div>
                  <span className="rounded-button bg-primary/10 px-3 py-1 font-ui text-xs font-semibold text-primary">
                    {totalDays} DAY PLAN
                  </span>
                </div>
                <div className="space-y-3">
                  {dayPlans.map((day, index) => {
                    const isOpen = openDayIndex === index;
                    return (
                      <PackageAccordion
                        key={day._id || index}
                        eyebrow={`Day ${index + 1}`}
                        title={day.selectionTitle || `Day ${index + 1}`}
                        open={isOpen}
                        onToggle={() =>
                          setOpenDayIndex((current) =>
                            current === index ? null : index,
                          )
                        }
                      >
                        {day.selectionDesc ? (
                          <div className="prose prose-sm custom-desc-list max-w-none leading-relaxed text-black [&_p]:text-black">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: day.selectionDesc,
                              }}
                            />
                          </div>
                        ) : null}
                        {day.selectionHighlight?.length > 0 ? (
                          <div className="mt-4 border-t border-border/60 pt-4">
                            <ul className="list-disc space-y-2 pl-5">
                              {day.selectionHighlight.map((hl, hIdx) => (
                                <li key={hIdx}>
                                  <p className="text-sm font-semibold text-heading">
                                    {hl.highlightName}
                                  </p>
                                  {hl.highlightDesc?.length > 0 ? (
                                    <ul className="mt-1 list-disc space-y-1 pl-5">
                                      {hl.highlightDesc.map((desc, dIdx) => (
                                        <li
                                          key={dIdx}
                                          className="text-sm text-muted"
                                        >
                                          {desc}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {day.selectionTable?.length > 0 ? (
                          <div className="mt-4 border-t border-border/60 pt-4">
                            {day.selectionTable.map((tbl, tIdx) => (
                              <div key={tIdx} className="mb-4">
                                <h5 className="mb-2 text-md font-semibold text-heading">
                                  {tbl.tableName}
                                </h5>
                                <table className="w-full overflow-hidden rounded-lg border border-border text-sm">
                                  <tbody>
                                    {Array.from(
                                      {
                                        length: Math.ceil(
                                          (tbl.tableDesc?.length || 0) / 2,
                                        ),
                                      },
                                      (_, rowIdx) => {
                                        const col1 = tbl.tableDesc[rowIdx * 2];
                                        const col2 =
                                          tbl.tableDesc[rowIdx * 2 + 1];
                                        return (
                                          <tr
                                            key={rowIdx}
                                            className={
                                              rowIdx % 2 === 0
                                                ? "bg-surface"
                                                : "bg-white"
                                            }
                                          >
                                            <td className="border border-border px-3 py-2 font-medium text-heading">
                                              {col1 || ""}
                                            </td>
                                            <td className="border border-border px-3 py-2 font-medium text-muted">
                                              {col2 || ""}
                                            </td>
                                          </tr>
                                        );
                                      },
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </PackageAccordion>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {/* ---- INCLUDE/EXCLUDE TAB ---- */}
            {(inclusions.length > 0 || exclusions.length > 0) && (
              <section>
                <PackageSectionHeader
                  eyebrow="Package"
                  title="Include / Exclude"
                />
              <PackageAccordion
                title="Inclusions and exclusions"
                open={Boolean(openSections.include)}
                onToggle={() => toggleSection("include")}
              >
              <div className="space-y-8">
                {inclusions.length > 0 && (
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-heading text-xl font-medium text-heading">
                      <Check className="h-5 w-5 text-success" /> Inclusions
                    </h3>
                    <div className="space-y-3">
                      {inclusions.map((item, i) => (
                        <div
                          key={i}
                          className="bg-success/8 border border-success/20 rounded-lg p-4 prose prose-sm max-w-none custom-desc-list"
                        >
                          {item.selectionDesc ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.selectionDesc,
                              }}
                            />
                          ) : (
                            <p>No description available</p>
                          )}

                          {item.selectionHighlight?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-success/25 not-prose">
                              <ul className="list-disc pl-5 space-y-2">
                                {item.selectionHighlight.map((hl, hIdx) => (
                                  <li key={hIdx}>
                                    <p className="text-md font-bold text-heading">
                                      {hl.highlightName}
                                    </p>
                                    {hl.highlightDesc?.length > 0 && (
                                      <ul className="list-disc pl-5 mt-1 space-y-1">
                                        {hl.highlightDesc.map((desc, dIdx) => (
                                          <li
                                            key={dIdx}
                                            className="text-md text-heading"
                                          >
                                            {desc}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.selectionTable?.length > 0 && (
                            <div className="mt-4 pt-4">
                              {item.selectionTable?.map((tbl, tIdx) => (
                                <div key={tIdx} className="mb-4 not-prose">
                                  <h5 className="text-md font-bold text-heading mb-2">
                                    {tbl.tableName}
                                  </h5>
                                  <table className="w-full text-sm border-collapse border border-border rounded overflow-hidden">
                                    <tbody>
                                      {Array.from(
                                        {
                                          length: Math.ceil(
                                            (tbl.tableDesc?.length || 0) / 2,
                                          ),
                                        },
                                        (_, rowIdx) => {
                                          const col1 =
                                            tbl.tableDesc[rowIdx * 2];
                                          const col2 =
                                            tbl.tableDesc[rowIdx * 2 + 1];
                                          return (
                                            <tr
                                              key={rowIdx}
                                              className={
                                                rowIdx % 2 === 0
                                                  ? "bg-surface hover:bg-surface"
                                                  : "bg-white hover:bg-surface"
                                              }
                                            >
                                              <td className="w-[32%] md:!px-6 !px-4 !py-4 text-heading text-wrap font-semibold border-b border-r border-heading/15">
                                                {col1 || ""}
                                              </td>
                                              <td className="w-[68%] md:!px-6 !px-4 !py-4 text-heading text-wrap font-medium border-b border-heading/15">
                                                {col2 || ""}
                                              </td>
                                            </tr>
                                          );
                                        },
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {exclusions.length > 0 && (
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-heading text-xl font-medium text-heading">
                      <X className="h-5 w-5 text-error" /> Exclusions
                    </h3>
                    <div className="space-y-3">
                      {exclusions.map((item, i) => (
                        <div
                          key={i}
                          className="bg-error/8 border border-error/20 rounded-lg p-4 prose prose-sm max-w-none custom-desc-list"
                        >
                          {item.selectionDesc ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.selectionDesc,
                              }}
                            />
                          ) : (
                            <p>No description available</p>
                          )}

                          {item.selectionHighlight?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-error/25 not-prose">
                              <ul className="list-disc pl-5 space-y-2">
                                {item.selectionHighlight.map((hl, hIdx) => (
                                  <li key={hIdx}>
                                    <p className="text-md font-bold text-heading">
                                      {hl.highlightName}
                                    </p>
                                    {hl.highlightDesc?.length > 0 && (
                                      <ul className="list-disc pl-5 mt-1 space-y-1">
                                        {hl.highlightDesc.map((desc, dIdx) => (
                                          <li
                                            key={dIdx}
                                            className="text-md text-heading"
                                          >
                                            {desc}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.selectionTable?.length > 0 && (
                            <div className="mt-4 pt-4">
                              {item.selectionTable?.map((tbl, tIdx) => (
                                <div key={tIdx} className="mb-4 not-prose">
                                  <h5 className="text-md font-bold text-heading mb-2">
                                    {tbl.tableName}
                                  </h5>
                                  <table className="w-full text-sm border-collapse border border-border rounded overflow-hidden">
                                    <tbody>
                                      {Array.from(
                                        {
                                          length: Math.ceil(
                                            (tbl.tableDesc?.length || 0) / 2,
                                          ),
                                        },
                                        (_, rowIdx) => {
                                          const col1 =
                                            tbl.tableDesc[rowIdx * 2];
                                          const col2 =
                                            tbl.tableDesc[rowIdx * 2 + 1];
                                          return (
                                            <tr
                                              key={rowIdx}
                                              className={
                                                rowIdx % 2 === 0
                                                  ? "bg-surface hover:bg-border"
                                                  : "bg-white hover:bg-border"
                                              }
                                            >
                                              <td className="w-[32%] !px-6 !py-4 text-heading font-semibold border-b border-r border-heading/15">
                                                {col1 || ""}
                                              </td>
                                              <td className="w-[68%] !px-6 !py-4 text-heading font-medium border-b border-heading/15">
                                                {col2 || ""}
                                              </td>
                                            </tr>
                                          );
                                        },
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </PackageAccordion>
              </section>
            )}

            {/* ---- ADDITIONAL INFO ---- */}
            {(importantInfo.length > 0 || others.length > 0) && (
              <section>
                <PackageSectionHeader
                  eyebrow="Details"
                  title="Additional Information"
                />
              <PackageAccordion
                title="Important notes and other details"
                open={Boolean(openSections.additional)}
                onToggle={() => toggleSection("additional")}
              >
              <div className="space-y-6">
                {importantInfo.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      ⚠️ Important Information
                    </h3>
                    <div className="space-y-3">
                      {importantInfo.map((info, i) => (
                        <details
                          key={i}
                          className="group border border-warning/30 rounded-lg overflow-hidden"
                        >
                          <summary className="cursor-pointer px-5 py-3.5 text-sm font-semibold text-heading bg-warning/10 hover:bg-warning/20 flex items-center justify-between">
                            {info.selectionTitle}
                            <ChevronRight className="h-4 w-4 text-muted group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className="px-5 py-4 text-sm text-muted prose prose-sm max-w-none custom-desc-list">
                            {info.selectionDesc ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: info.selectionDesc,
                                }}
                              />
                            ) : (
                              <p>No description available</p>
                            )}

                            {info.selectionHighlight?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-success/25 not-prose">
                                <ul className="list-disc pl-5 space-y-2">
                                  {info.selectionHighlight.map((hl, hIdx) => (
                                    <li key={hIdx}>
                                      <p className="text-md font-bold text-heading">
                                        {hl.highlightName}
                                      </p>
                                      {hl.highlightDesc?.length > 0 && (
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                          {hl.highlightDesc.map(
                                            (desc, dIdx) => (
                                              <li
                                                key={dIdx}
                                                className="text-md text-heading"
                                              >
                                                {desc}
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {info.selectionTable?.length > 0 && (
                              <div className="mt-4 pt-4">
                                {info.selectionTable?.map((tbl, tIdx) => (
                                  <div key={tIdx} className="mb-4 not-prose">
                                    <h5 className="text-md font-bold text-heading mb-2">
                                      {tbl.tableName}
                                    </h5>
                                    <table className="w-full text-sm border-collapse border border-border rounded overflow-hidden">
                                      <tbody>
                                        {Array.from(
                                          {
                                            length: Math.ceil(
                                              (tbl.tableDesc?.length || 0) / 2,
                                            ),
                                          },
                                          (_, rowIdx) => {
                                            const col1 =
                                              tbl.tableDesc[rowIdx * 2];
                                            const col2 =
                                              tbl.tableDesc[rowIdx * 2 + 1];
                                            return (
                                              <tr
                                                key={rowIdx}
                                                className={
                                                  rowIdx % 2 === 0
                                                    ? "bg-surface hover:bg-border"
                                                    : "bg-white hover:bg-border"
                                                }
                                              >
                                                <td className="w-[32%] md:!px-6 !px-1 !py-4 text-heading text-wrap font-semibold border-b border-r border-heading/15 text-xs md:text-sm">
                                                  {col1 || ""}
                                                </td>
                                                <td className="w-[68%] md:!px-6 !px-2 !py-4 text-heading text-wrap font-medium border-b border-heading/15 text-sm md:text-sm">
                                                  {col2 || ""}
                                                </td>
                                              </tr>
                                            );
                                          },
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
                {others.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      📋 Other Information
                    </h3>
                    <div className="space-y-3">
                      {others.map((info, i) => (
                        <details
                          key={i}
                          className="group border border-border rounded-lg overflow-hidden"
                        >
                          <summary className="cursor-pointer px-5 py-3.5 text-sm font-semibold text-heading bg-surface hover:bg-surface flex items-center justify-between">
                            {info.selectionTitle}
                            <ChevronRight className="h-4 w-4 text-muted group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className="px-5 py-4 text-sm text-muted prose prose-sm max-w-none custom-desc-list">
                            {info.selectionDesc ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: info.selectionDesc,
                                }}
                              />
                            ) : (
                              <p>No description available</p>
                            )}

                            {info.selectionHighlight?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-success/25 not-prose">
                                <ul className="list-disc pl-5 space-y-2">
                                  {info.selectionHighlight.map((hl, hIdx) => (
                                    <li key={hIdx}>
                                      <p className="text-md font-bold text-heading">
                                        {hl.highlightName}
                                      </p>
                                      {hl.highlightDesc?.length > 0 && (
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                          {hl.highlightDesc.map(
                                            (desc, dIdx) => (
                                              <li
                                                key={dIdx}
                                                className="text-md text-heading"
                                              >
                                                {desc}
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {info.selectionTable?.length > 0 && (
                              <div className="mt-4 pt-4">
                                {info.selectionTable?.map((tbl, tIdx) => (
                                  <div key={tIdx} className="mb-4 not-prose">
                                    <h5 className="text-md font-bold text-heading mb-2">
                                      {tbl.tableName}
                                    </h5>
                                    <table className="w-full text-sm border-collapse border border-border rounded overflow-hidden">
                                      <tbody>
                                        {Array.from(
                                          {
                                            length: Math.ceil(
                                              (tbl.tableDesc?.length || 0) / 2,
                                            ),
                                          },
                                          (_, rowIdx) => {
                                            const col1 =
                                              tbl.tableDesc[rowIdx * 2];
                                            const col2 =
                                              tbl.tableDesc[rowIdx * 2 + 1];
                                            return (
                                              <tr
                                                key={rowIdx}
                                                className={
                                                  rowIdx % 2 === 0
                                                    ? "bg-surface hover:bg-border"
                                                    : "bg-white hover:bg-border"
                                                }
                                              >
                                                <td className="w-[32%] md:!px-6 !px-2 !py-4 text-heading text-wrap font-semibold border-b border-r border-heading/15 text-sm">
                                                  {col1 || ""}
                                                </td>
                                                <td className="w-[68%] md:!px-6 !px-2 !py-4 text-heading text-wrap font-medium border-b border-heading/15 text-sm">
                                                  {col2 || ""}
                                                </td>
                                              </tr>
                                            );
                                          },
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </PackageAccordion>
              </section>
            )}

            {/* ---- POLICY ---- */}
            {policies.length > 0 && (
              <section>
                <PackageSectionHeader eyebrow="Stay" title="Policy Content" />
              <PackageAccordion
                title="Booking and stay policies"
                open={Boolean(openSections.policy)}
                onToggle={() => toggleSection("policy")}
              >
              <div className="space-y-6">
                {policies.map((policy, i) => (
                    <div
                      key={i}
                      className="border border-border rounded-lg p-5"
                    >
                      <h4 className="font-bold text-lg mb-3">
                        {policy.selectionTitle}
                      </h4>
                      <div className="prose prose-sm max-w-none text-muted custom-desc-list">
                        {policy.selectionDesc.split("\n").map((line, li) =>
                          line ? (
                            <p key={li} className="whitespace-pre-line">
                              <span
                                dangerouslySetInnerHTML={{ __html: line }}
                              />
                            </p>
                          ) : (
                            <br key={li} />
                          ),
                        )}
                      </div>
                      {/* Highlights */}
                      {policy.selectionHighlight?.length > 0 && (
                        <div className="mt-4 pt-4">
                          <ul className="list-disc pl-5 space-y-2">
                            {policy.selectionHighlight.map((hl, hIdx) => (
                              <li key={hIdx}>
                                <p className="text-md font-semibold text-heading">
                                  {hl.highlightName}
                                </p>

                                {hl.highlightDesc?.length > 0 && (
                                  <ul className="list-disc pl-5 mt-1 space-y-1">
                                    {hl.highlightDesc.map((desc, dIdx) => (
                                      <li
                                        key={dIdx}
                                        className="text-md text-muted"
                                      >
                                        {desc}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Table */}
                      {policy.selectionTable?.length > 0 && (
                        <div className="mt-4 pt-4 ">
                          {policy.selectionTable.map((tbl, tIdx) => (
                            <div key={tIdx} className="mb-4">
                              <h5 className="text-md font-semibold text-heading mb-2">
                                {tbl.tableName}
                              </h5>
                              <table className="w-full text-sm border-collapse">
                                <tbody>
                                  {Array.from(
                                    {
                                      length: Math.ceil(
                                        (tbl.tableDesc?.length || 0) / 2,
                                      ),
                                    },
                                    (_, rowIdx) => {
                                      const col1 = tbl.tableDesc[rowIdx * 2];
                                      const col2 =
                                        tbl.tableDesc[rowIdx * 2 + 1];

                                      return (
                                        <tr key={rowIdx} className="align-top">
                                          {/* Left */}
                                          <td className="w-[32%] bg-surface px-6 py-4 text-heading font-semibold border-b border-r border-heading/15">
                                            {col1 || ""}
                                          </td>

                                          {/* Right */}
                                          <td className="w-[68%] bg-surface px-6 py-4 text-heading font-medium border-b border-heading/15">
                                            {col2 || ""}
                                          </td>
                                        </tr>
                                      );
                                    },
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
              </PackageAccordion>
              </section>
            )}

            {/* ---- HOTELS ---- */}
            {hotels.length > 0 && (
              <section>
                <PackageSectionHeader eyebrow="Stay" title="Hotels" />
              <PackageAccordion
                title="Accommodation"
                open={Boolean(openSections.hotels)}
                onToggle={() => toggleSection("hotels")}
              >
              <div className="space-y-2 md:space-y-5">
                    <div className="flex items-start px-2 gap-0">
                      <div className="md:w-28 w-20 shrink-0">
                        <span className="font-bold text-heading text-sm md:text-[15px]">
                          Tag :-
                        </span>
                      </div>
                      <div className="flex-1 px-4 border-l-2 border-transparent">
                        <span className="font-bold text-heading text-sm md:text-[15px]">
                          City :-
                        </span>
                      </div>
                      <div className="flex-1 px-1 md:px-4 border-l-2 border-transparent">
                        <span className="font-bold text-heading text-sm md:text-[15px]">
                          Hotel :-
                        </span>
                      </div>
                    </div>

                    {hotels.map((hotel, i) => (
                      <div
                        key={i}
                        className="flex items-center border border-border px-2 py-2 gap-0"
                      >
                        {/* Day Badge */}
                        <div className="md:w-28 w-20 shrink-0">
                          <span className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full">
                            {hotel.days}
                          </span>
                        </div>
                        {/* City */}
                        <div className="flex-1 flex flex-col md:flex-row items-center gap-2 px-4 border-l-2 border-border">
                          <span className="text-heading text-xs md:text-[15px]">
                            {hotel.cityName}
                          </span>
                        </div>
                        {/* Hotel */}
                        <div className="flex-1 flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 border-l-2 border-border">
                          <span className="text-heading text-xs md:text-[15px] text-start md:text-center">
                            {hotel.hotelName}
                          </span>
                        </div>
                      </div>
                    ))}
                {/* Important Notes & Accommodation Policy */}
                <div className="mt-6 bg-warning/10 border border-warning/30 rounded-lg p-5">
                  <h4 className="mb-4 flex items-center gap-2 font-heading text-xl font-medium text-heading">
                    📋 Important Notes & Accommodation Policy
                  </h4>
                  <div className="space-y-3 text-md text-heading">
                    <div>
                      <p className="font-bold  text-heading mb-1">
                        Property Substitution:
                      </p>
                      <p className="">
                        In the event of unforeseen circumstances or operational
                        constraints, the company reserves the right to change
                        the designated hotel to another property of a similar
                        category, subject to availability.
                      </p>
                    </div>
                    <div>
                      <p className="font-bold  text-heading mb-1">
                        Room Configuration:
                      </p>
                      <p>
                        All tour packages are based on double-sharing
                        accommodation only.
                      </p>
                    </div>
                    <div>
                      <p className="font-bold  text-heading mb-1">
                        Single Occupancy Surcharge:
                      </p>
                      <p>
                        Guests requesting a private room (single occupancy) will
                        incur a single supplement fee. The total amount is
                        subject to availability and includes all applicable
                        taxes for the duration of the stay
                      </p>
                    </div>
                    <div>
                      <p className="font-bold  text-heading mb-1">
                        Force Majeure Stays:
                      </p>
                      <p>
                        In the event of flight cancellations or delays caused by
                        adverse weather, technical snags, or other unavoidable
                        situations, any costs arising from additional
                        accommodation or meals beyond the scheduled itinerary
                        must be borne directly by the guest at the location.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </PackageAccordion>
              </section>
            )}

            {/* ---- SUMMARY ---- */}
            {Array.isArray(packageDetails.summary) &&
              packageDetails.summary.length > 0 && (
              <section>
                <PackageSectionHeader eyebrow="Itinerary" title="Summary" />
              <PackageAccordion
                title="Trip summary"
                open={Boolean(openSections.summary)}
                onToggle={() => toggleSection("summary")}
              >
                  <div className="space-y-0">
                      {packageDetails.summary.map((item, i) => (
                        <div key={i} className="flex border-b border-border">
                          {/* Left: Day + Date */}
                          <div className="w-36 shrink-0 py-5 px-4 border-l-4 border-primary bg-surface">
                            <p className="font-bold text-heading text-lg">
                              {item.days}
                            </p>
                          </div>

                          {/* Right: Description grid (2 per row) */}
                          <div className="flex-1 py-5 px-4">
                            {(() => {
                              const descs = item.description || [];
                              // Group descriptions into rows of 2
                              const rows = [];
                              for (let r = 0; r < descs.length; r += 2) {
                                rows.push(descs.slice(r, r + 2));
                              }
                              return rows.map((row, ri) => (
                                <div key={ri}>
                                  {ri > 0 && rows.length > 1 && (
                                    <hr className="border-border my-3" />
                                  )}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-0 md:divide-x md:divide-border">
                                    {row.map((desc, di) => (
                                      <div
                                        key={di}
                                        className="flex items-start gap-3 px-2"
                                      >
                                        <Image
                                          className="w-6 h-6"
                                          src="/square.png"
                                          alt="Check"
                                          width={20}
                                          height={20}
                                        />
                                        <span className="text-sm text-heading">
                                          {desc}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      ))}
                  </div>
              </PackageAccordion>
              </section>
            )}

            {/* ---- REVIEWS ---- */}
            <section>
              <PackageSectionHeader eyebrow="Guests" title="Reviews" />
            <PackageAccordion
              title="Guest experiences"
              open={Boolean(openSections.reviews)}
              onToggle={() => toggleSection("reviews")}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="mb-2 font-heading text-2xl font-medium text-heading">
                    Write a review
                  </h3>
                  <p className="mb-5 font-body text-sm text-muted">
                    No account needed. Your review will appear after a short
                    admin check.
                  </p>
                  <ReviewForm
                    packageName={packageDetails.packageName}
                    packageId={packageDetails._id}
                  />
                </div>

                <div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-heading text-2xl font-medium text-heading">
                      Guest reviews
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <Star className="size-4 fill-warning text-warning" />
                      <span className="font-ui text-sm font-semibold text-heading">
                        {avgRating || 0}
                      </span>
                      <span className="font-ui text-sm text-muted">
                        ({validReviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {validReviews.length > 0 ? (
                      validReviews.map((review) => (
                        <article
                          key={review._id}
                          className="rounded-card border border-border/60 bg-white p-5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="font-heading text-lg font-medium text-heading">
                                {review.name}
                              </h4>
                              {review.title ? (
                                <p className="mt-0.5 font-ui text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                                  {review.title}
                                </p>
                              ) : null}
                            </div>
                            <span className="font-ui text-xs text-muted">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : ""}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                            {[...Array(5)].map((_, si) => (
                              <Star
                                key={si}
                                className={cn(
                                  "size-4",
                                  si < review.rating
                                    ? "fill-warning text-warning"
                                    : "text-border",
                                )}
                              />
                            ))}
                            <span className="ml-1 font-ui text-xs text-muted">
                              ({review.rating}.0)
                            </span>
                          </div>
                          <p className="mt-3 font-body text-sm leading-relaxed text-heading italic">
                            {review.message}
                          </p>
                        </article>
                      ))
                    ) : (
                      <div className="flex flex-col items-center rounded-card border border-dashed border-border bg-surface/50 py-14 text-center">
                        <Star className="mb-3 size-8 text-warning/60" />
                        <p className="font-heading text-xl text-heading">
                          No reviews yet
                        </p>
                        <p className="mt-1 font-body text-sm text-muted">
                          Be the first to share your experience.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </PackageAccordion>
            </section>
            </div>

            {/* ========== SPIRITUAL JOURNEY ========== */}
            {/* <section className="mt-12 mb-8">
              <h3 className="font-bold text-2xl text-center mb-4">Be a part of a spiritual journey.</h3>
              <p className="text-muted text-center w-[90%] mx-auto text-sm mb-6">
                YatraZone is more than just a travel company; we are facilitators of spiritual exploration and cultural
                immersion tailored for Indian pilgrims and global adventurers.
              </p>
              <FeaturedCarouselWrapper
                featuredPackages={JSON.parse(JSON.stringify(featuredPackages))}
              />
            </section> */}
          </div>

          {/* ===== RIGHT SIDEBAR (28%) ===== */}
          <div className="w-full lg:w-[28%]">
            {/* Price Card - Sticky */}
            <div className="sticky top-14 space-y-4">
              {/* Main Price Card */}
              <div className="overflow-hidden rounded-card border border-border bg-white shadow-sm">
                {/* Discount badge */}
                {packageDetails.price > 0 &&
                  packageDetails.basicDetails?.originalPrice >
                    packageDetails.price && (
                    <div className="bg-success px-3 py-1.5 text-center font-ui text-xs font-semibold text-white">
                      Flat{" "}
                      {Math.round(
                        ((packageDetails.basicDetails.originalPrice -
                          packageDetails.price) /
                          packageDetails.basicDetails.originalPrice) *
                          100,
                      )}
                      % off
                    </div>
                  )}
                <div className="p-5">
                  {packageDetails.priceUnit ===
                    "Double Occupancy Per Person Price Only" &&
                  packageDetails.doubleOccupancyPrice > 0 ? (
                    <>
                      <div className="mb-2">
                        <p className="font-ui text-xs font-semibold uppercase tracking-wide text-black mb-0.5">
                          Single Occupancy
                        </p>
                        <div className="flex flex-wrap items-baseline gap-2">
                          {packageDetails.price === 0 ? (
                            <span className="font-heading text-2xl font-medium text-heading">
                              XXXX*
                            </span>
                          ) : (
                            <>
                              <span className="font-sans text-2xl font-medium text-heading">
                                ₹{formatNumber(packageDetails.price)}
                              </span>
                              <span className="font-ui text-xl text-black">
                                /
                              </span>
                              {hasUsdPrice(packageDetails.priceUsd) && (
                                <span className="font-sans text-lg font-medium text-heading">
                                  ${formatUsd(packageDetails.priceUsd)}
                                </span>
                              )}
                              <span className="font-ui text-sm text-black">
                                /Person
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mb-1 rounded-lg py-2">
                        <p className="font-ui text-xs font-semibold uppercase tracking-wide text-black mb-0.5">
                          Double Occupancy
                        </p>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-sans text-2xl font-medium text-heading">
                            ₹{formatNumber(packageDetails.doubleOccupancyPrice)}
                          </span>
                          <span className="font-ui text-xl text-black">/</span>
                          {hasUsdPrice(
                            packageDetails.doubleOccupancyPriceUsd,
                          ) && (
                            <span className="font-sans text-lg font-medium text-heading">
                              $
                              {formatUsd(
                                packageDetails.doubleOccupancyPriceUsd,
                              )}
                            </span>
                          )}
                          <span className="font-ui text-sm text-black">
                            /Person
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mb-1 flex flex-wrap items-baseline gap-2">
                      {packageDetails.price === 0 ? (
                        <span className="font-heading text-3xl font-medium text-heading">
                          XXXX*
                        </span>
                      ) : (
                        <>
                          <span className="font-heading text-3xl font-medium text-heading">
                            ₹{formatNumber(packageDetails.price)}
                          </span>
                          {hasUsdPrice(packageDetails.priceUsd) && (
                            <span className="font-heading text-2xl font-medium text-heading">
                              ${formatUsd(packageDetails.priceUsd)}
                            </span>
                          )}
                          <span className="font-ui text-sm text-black">
                            /Adult
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  {packageDetails.basicDetails?.originalPrice >
                    packageDetails.price && (
                    <p className="mb-1 font-ui text-sm text-black line-through">
                      ₹{formatNumber(packageDetails.basicDetails.originalPrice)}
                    </p>
                  )}
                  <p className="mb-5 font-ui text-xs text-black">
                    Excluding applicable taxes
                  </p>

                  <Button
                    type="button"
                    className="w-full h-10"
                    onClick={() => setEnquiryOpen(true)}
                  >
                    Make an enquiry
                  </Button>

                  {/* Contact buttons */}
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`tel:+919762240419`}
                      target="_blank"
                      className="flex items-center justify-center rounded-button border border-gray-600 p-3 text-heading transition-colors hover:bg-surface"
                    >
                      <PhoneCall className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappEnquiryMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-button bg-success py-2.5 font-ui text-xs font-semibold text-white transition-colors hover:bg-success/90"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Link>
                  </div>
                </div>
              </div>

              {/* Category Type Card */}
              <div className="flex items-center gap-3 rounded-card border border-border bg-white p-4">
                <h4 className="font-ui text-sm font-semibold text-heading">
                  Category
                </h4>
                <p className="font-body text-sm text-muted">
                  {packageDetails.basicDetails?.tourType || "Group Package"}
                </p>
              </div>

              {/* Share Section */}
              <div className="rounded-card border border-border bg-white p-4">
                <h4 className="mb-3 font-ui text-sm font-semibold text-heading">
                  Share this package
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-button border border-border py-2.5 font-ui text-xs text-muted transition-colors hover:bg-surface hover:text-heading"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-button border border-border py-2.5 font-ui text-xs text-muted transition-colors hover:bg-surface hover:text-heading"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                </div>
              </div>

              {/* Plan Your Own Way */}
              {/* {packageDetails.basicDetails?.planCalculator === "Yes" && (
                <div className="rounded-[var(--radius-card)] bg-footer p-5 text-center text-white">
                  <p className="mb-3 font-heading text-lg font-medium">Plan your own way</p>
                  <Link href={`/calculator/${packageDetails._id}`}>
                    <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-button)] bg-primary py-2.5 font-ui text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                      <Calculator className="h-4 w-4" />
                      Package calculator
                    </button>
                  </Link>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* ========== GALLERY SECTION ========== */}
      {galleryImages.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="grid h-75 grid-cols-2 gap-3 overflow-hidden md:h-95 md:grid-cols-4">
            {/* Main large image */}
            <div
              onClick={() => openGallery(0)}
              className="group relative col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-image"
            >
              <Image
                src={
                  galleryImages[0]?.url ||
                  packageDetails.basicDetails?.thumbnail?.url ||
                  ""
                }
                alt="Gallery main"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-button bg-footer/80 px-4 py-2 font-ui text-xs font-semibold text-white backdrop-blur-sm">
                <Camera className="h-3.5 w-3.5" />
                View gallery
              </div>
            </div>
            {/* Secondary images */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                onClick={() => galleryImages[i] && openGallery(i)}
                className="group relative cursor-pointer overflow-hidden rounded-image"
              >
                {galleryImages[i] ? (
                  <Image
                    src={galleryImages[i]?.url}
                    alt={`Gallery ${i}`}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface">
                    <Camera className="h-6 w-6 text-muted" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ========== YOU MIGHT ALSO LIKE ========== */}
      {packages.length > 0 && (
        <div className="mx-auto mt-16 w-full max-w-7xl px-4 pb-16 md:px-8">
          <h3 className="mb-2 font-heading text-3xl font-medium text-heading">
            You might also like
          </h3>
          <p className="mb-8 max-w-2xl font-body text-sm leading-relaxed text-muted">
            Thoughtfully chosen retreats that complement this journey — calm,
            considered, and ready when you are.
          </p>
          <PackageCarouselWrapper
            packages={JSON.parse(JSON.stringify(packages))}
            formatNumeric={formatNumericStr}
          />
        </div>
      )}
      {/* ========== PACKAGE ENQUIRY MODAL ========== */}
      <PackageEnquiryModal
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        packageDetails={packageDetails}
      />

      {/* ========== GALLERY LIGHTBOX MODAL ========== */}
      {galleryOpen && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-100 bg-black/95 flex flex-col"
          onClick={closeGallery}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium">
              {galleryIndex + 1} / {galleryImages.length}
            </span>
            <button
              onClick={closeGallery}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main image area */}
          <div
            className="flex-1 flex items-center justify-center relative px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev button */}
            <button
              onClick={prevImage}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="relative w-full max-w-5xl h-[70vh]">
              <Image
                src={galleryImages[galleryIndex]?.url}
                alt={`Gallery image ${galleryIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Next button */}
            <button
              onClick={nextImage}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div
            className="px-4 py-3 overflow-x-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 justify-center">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`relative w-16 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                    i === galleryIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img?.url}
                    alt={`Thumb ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
