"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Globe,
  Link as LinkIcon,
  Phone,
  Quote,
  Share2,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import toast from "react-hot-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ROOM_AMENITY_CATEGORIES } from "@/lib/roomAmenityCategories";
import { getHotelAmenityIcon } from "@/lib/hotelAmenityIcons";
import { getRoomAmenityCategoryIcon } from "@/lib/roomAmenityIcons";
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
function Linkedin({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.54V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
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
const isFilledText = (value) =>
  typeof value === "string" && value.replace(/<[^>]*>/g, "").trim().length > 0;

const cleanTextArray = (items = []) =>
  items.filter((item) => isFilledText(item));

const cleanObjectArray = (items = [], keys = []) =>
  items.filter((item) => keys.some((key) => isFilledText(item?.[key])));

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const HtmlBlock = ({ html, className = "" }) => {
  if (!isFilledText(html)) return null;
  return (
    <div
      className={`prose custom-desc-list max-w-none leading-6 text-justify text-black [&_p]:text-black [&_li]:text-black [&_span]:text-black [&_strong]:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const ImageDotsCarousel = ({ images = [], alt = "" }) => {
  const [api, setApi] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = images.filter((img) => img?.url);

  useEffect(() => {
    if (!api) return undefined;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    return (
      <div className="overflow-hidden bg-surface rounded-image">
        <img
          src={slides[0].url}
          alt={alt}
          className="h-[240px] w-full object-cover md:h-[340px]"
        />
      </div>
    );
  }

  return (
    <div>
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
        <div className="relative overflow-hidden bg-surface rounded-image">
          <CarouselContent className="-ml-0">
            {slides.map((img, idx) => (
              <CarouselItem
                key={img.key || `${img.url}-${idx}`}
                className="pl-0"
              >
                <img
                  src={img.url}
                  alt={`${alt} ${idx + 1}`}
                  className="h-[240px] w-full object-cover md:h-[400px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-3 z-10 size-9 border-0 bg-card/90 text-heading shadow-sm hover:bg-card disabled:hidden" />
          <CarouselNext className="right-3 z-10 size-9 border-0 bg-card/90 text-heading shadow-sm hover:bg-card disabled:hidden" />
        </div>
      </Carousel>
      <div className="mt-3 flex items-center justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show image ${idx + 1}`}
            onClick={() => api?.scrollTo(idx)}
            className={cn(
              "size-2 rounded-full transition-colors",
              idx === activeIndex ? "bg-heading" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
};

const StaticSidebarCard = ({ data }) => {
  const adImage = data.advertisementImage?.url;
  const adUrl = data.advertisementUrl;

  if (adImage) {
    const card = (
      <div className="overflow-hidden h-fit bg-white">
        <img
          src={adImage}
          alt={data.title || "Advertisement"}
          className="h-full w-full object-contain"
        />
      </div>
    );

    if (adUrl) {
      return (
        <a
          href={adUrl}
          target="_blank"
          rel="noreferrer"
          className="block transition hover:opacity-95"
        >
          {card}
        </a>
      );
    }

    return card;
  }
};

const AuthorCard = ({ data }) => {
  const authorName = data.sideThumbName || "";
  const authorRole = data.sideThumbDesignation || "";
  const authorDescription = data.sideThumbDescription || "";
  const authorImage =
    data.sideThumbImage?.url ||
    data.mainProfileImage?.url ||
    data.bannerImage?.url;
  const socials = [
    data.facebookUrl
      ? { href: data.facebookUrl, label: "Facebook", icon: Facebook }
      : null,
    data.instaUrl
      ? { href: data.instaUrl, label: "Instagram", icon: Instagram }
      : null,
    data.youtubeUrl
      ? { href: data.youtubeUrl, label: "Website", icon: Globe }
      : null,
    data.googleUrl
      ? { href: data.googleUrl, label: "Google", icon: Google }
      : null,
  ].filter(Boolean);

  return (
    <div className="rounded-md border border-gray-400 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-800">
        About
      </p>
      <div className="mt-4 flex items-start gap-3">
        {authorImage ? (
          <img
            src={authorImage}
            alt={authorName}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ebe7ff] text-base font-bold text-[#4f46e5]">
            {authorName.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{authorName}</h3>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mt-2 text-gray-800">
            {authorRole}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-600 text-justify">
        {authorDescription}
      </p>
      <div className="mt-5 flex items-center gap-3">
        {socials.length > 0 ? (
          socials.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#4f46e5] hover:text-[#4f46e5]"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))
        ) : (
          <>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600">
              <Globe className="h-4 w-4" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600">
              <Instagram className="h-4 w-4" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600">
              <Google className="h-4 w-4" />
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const ShareCard = ({ slug }) => {
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${slug}` : "";

  const sharePage = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "YatraZone Webpage",
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied for sharing");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share this page");
      }
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Share this package</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={sharePage}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-2 py-3 text-sm font-medium text-gray-700"
        >
          <LinkIcon className="h-4 w-4" />
          Copy Link
        </button>
      </div>
    </div>
  );
};

const WebPage = ({ data }) => {
  // console.log(data)
  const [openAccordion, setOpenAccordion] = useState(0);
  const isDesignTwo = data.templateType === "design1";
  const isDesignThree = data.templateType === "design3";

  const tags = useMemo(
    () => cleanTextArray(data.createTags),
    [data.createTags],
  );
  const paragraphs = useMemo(
    () => cleanObjectArray(data.paragraphSections, ["title", "description"]),
    [data.paragraphSections],
  );
  const tableRows = useMemo(
    () => cleanObjectArray(data.tableRows, ["column1", "column2"]),
    [data.tableRows],
  );
  const highlights = useMemo(
    () => cleanObjectArray(data.highlights, ["title", "point"]),
    [data.highlights],
  );
  const accordionItems = useMemo(
    () => cleanObjectArray(data.accordionTags, ["left", "right"]),
    [data.accordionTags],
  );
  const blockquoteTags = useMemo(
    () => cleanTextArray(data.blockquoteTags),
    [data.blockquoteTags],
  );

  const paragraphImages = [
    data.paragraphFirstImage?.url,
    data.paragraphSecondImage?.url,
  ].filter(Boolean);
  const getSectionImages = (section) => {
    const sectionImages = [
      section?.firstImage?.url,
      section?.secondImage?.url,
    ].filter(Boolean);
    return sectionImages.length > 0 ? sectionImages : paragraphImages;
  };
  const hasTopMetaContent =
    isFilledText(data.firstTitle) ||
    isFilledText(data.secondTitle) ||
    tags.length > 0;
  const hasMainTopImage = !!data.imageFirst?.url;
  const hasTopHeaderContent = hasTopMetaContent || hasMainTopImage;
  const isBannerOnlyTop =
    !isDesignThree && !!data.bannerImage?.url && !hasTopHeaderContent;
  const headerImage =
    data.imageFirst?.url || paragraphImages[0] || data.sideThumbImage?.url;
  const leadParagraph = isDesignTwo ? paragraphs[0] : null;
  const contentParagraphs = isDesignTwo ? paragraphs.slice(1) : paragraphs;
  const designOneLeadParagraph =
    !isDesignTwo && !isDesignThree ? paragraphs[0] : null;
  const leadParagraphImages = leadParagraph
    ? getSectionImages(leadParagraph)
    : paragraphImages;
  const designOneLeadParagraphImages = designOneLeadParagraph
    ? getSectionImages(designOneLeadParagraph)
    : paragraphImages;
  const designOneRemainingParagraphs =
    !isDesignTwo && !isDesignThree ? paragraphs.slice(1) : contentParagraphs;
  const designThreeHeroImages = [
    data.imageFirst?.url,
    data.mainProfileImage?.url,
    data.bannerImage?.url,
    ...(data.imageGallery || []).map((item) => item?.url).filter(Boolean),
  ]
    .filter(Boolean)
    .slice(0, 3);
  const introHighlight = isDesignThree ? highlights[0] : null;
  const remainingHighlights = isDesignThree ? highlights.slice(1) : highlights;
  const isDesignFour = data.templateType === "design4";
  const isDesignFive = data.templateType === "design5";
  const isDesignSix = data.templateType === "design6";
  const isDesignSeven = data.templateType === "design7";
  const isDesignEight = data.templateType === "design8";
  const isDesignNine = data.templateType === "design9";

  if (isDesignFour) {
    return (
      <div className="min-h-screen bg-background font-geist text-gray-900">
        {/* Top Banner */}
        <div
          className="relative h-[250px] md:h-[400px] w-full bg-cover bg-center flex items-end pb-10 pl-6 md:pl-20"
          style={{
            backgroundImage: `url(${data.bannerImage?.url || data.imageFirst?.url || ""})`,
          }}
        >
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {data.firstTitle || ""}
            </h1>
            <p className="text-md md:text-lg font-semibold text-white">
              {data.secondTitle || ""}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Left Column */}
          <div className="space-y-8 border-r border-gray-900 px-5">
            {/* Blockquote Tags */}
            {blockquoteTags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {blockquoteTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-gray-700 text-[12px] font-semibold px-5 py-2 rounded-full border border-gray-200 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Heading & Paragraph (Mapped for all paragraphs) */}
            {paragraphs.map((para, paraIdx) => {
              const paraImages = [
                para?.firstImage?.url,
                para?.secondImage?.url,
              ].filter(Boolean);

              return (
                <section
                  key={paraIdx}
                  className="mb-10 rounded-xl border border-gray-600 bg-background p-6 md:p-8 shadow-sm"
                >
                  {/* Heading */}
                  {isFilledText(para.title) && (
                    <h2 className="mb-5 text-2xl font-bold text-gray-900 md:text-3xl">
                      {para.title}
                    </h2>
                  )}

                  {/* Description */}
                  <div className="prose prose-gray max-w-none leading-8">
                    <HtmlBlock
                      html={para.description}
                      className="text-base text-gray-700"
                    />
                  </div>

                  {/* Images */}
                  {paraImages.length > 0 && (
                    <div
                      className={`mt-8 grid gap-5 ${
                        paraImages.length > 1 ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {paraImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`overflow-hidden rounded-xl shadow-md ${
                            paraImages.length > 1
                              ? "aspect-square"
                              : "h-[280px] sm:h-[320px] md:h-[360px]"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${para.title || "Paragraph"} ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bullet Points */}
                  {para.bulletPoints?.length > 0 && (
                    <div className="mt-8">
                      <ul className="space-y-4">
                        {para.bulletPoints.map(
                          (point, idx) =>
                            isFilledText(point) && (
                              <li
                                key={idx}
                                className="flex items-start gap-4 rounded-lg bg-gray-50 border p-4"
                              >
                                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0" />

                                <span
                                  className="leading-7 text-gray-700"
                                  dangerouslySetInnerHTML={{ __html: point }}
                                />
                              </li>
                            ),
                        )}
                      </ul>
                    </div>
                  )}
                </section>
              );
            })}

            {/* Highlights Section */}
            {highlights?.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Highlights
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border-l-4 border-blue-600 border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      {isFilledText(item.title) && (
                        <h3 className="mb-3 text-lg font-bold text-gray-900">
                          {item.title}
                        </h3>
                      )}

                      {isFilledText(item.point) && (
                        <p className="leading-7 text-gray-600">{item.point}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notices */}
            {data.notices?.length > 0 && (
              <div className="my-10">
                <h2 className="mb-5 text-2xl font-bold text-gray-900">
                  Important Notices
                </h2>

                <div className="space-y-4">
                  {data.notices.map((notice, idx) => {
                    const getNoticeStyles = (type) => {
                      switch (type) {
                        case "warning":
                          return {
                            container: "bg-yellow-50 border-yellow-300",
                            text: "text-yellow-800",
                          };
                        case "info":
                          return {
                            container: "bg-blue-50 border-blue-300",
                            text: "text-blue-800",
                          };
                        case "danger":
                          return {
                            container: "bg-red-50 border-red-300",
                            text: "text-red-800",
                          };
                        case "success":
                          return {
                            container: "bg-green-50 border-green-300",
                            text: "text-green-800",
                          };
                        default:
                          return {
                            container: "bg-yellow-50 border-yellow-300",
                            text: "text-yellow-800",
                          };
                      }
                    };

                    const styles = getNoticeStyles(notice.type);

                    return (
                      <div
                        key={idx}
                        className={`rounded-lg border p-4 ${styles.container}`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`mt-0.5 h-5 w-5 shrink-0 ${styles.text}`}
                          />

                          <div className={`text-md ${styles.text}`}>
                            {notice.title && (
                              <h4 className="mb-1 font-semibold">
                                {notice.title}
                              </h4>
                            )}

                            <p className="leading-6">{notice.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quote Block */}
            {(isFilledText(data.blockquoteDescription) ||
              isFilledText(data.blockquoteLeftTitle) ||
              isFilledText(data.blockquoteMainTitle)) && (
              <div className="relative my-12 rounded-xl border border-gray-100 bg-[#dbe7bc] p-8 md:p-10 shadow-sm">
                {/* Overlapping top-left quote bubble */}
                <div className="absolute -top-5 left-6 md:left-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e40af] text-white shadow-md">
                  <Quote className="h-5 w-5 fill-current" />
                </div>

                <div className="flex flex-col items-start text-left mt-2">
                  {isFilledText(data.blockquoteMainTitle) && (
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      {data.blockquoteMainTitle}
                    </h3>
                  )}

                  <div className="max-w-4xl text-lg leading-relaxed text-gray-700 font-medium prose prose-gray">
                    <HtmlBlock html={data.blockquoteDescription} />
                  </div>

                  {isFilledText(data.blockquoteLeftTitle) && (
                    <div className="mt-6 flex items-center gap-3 text-sm font-bold text-gray-800">
                      <span className="h-[2px] w-8 bg-[#1e40af]/60" />
                      <span>{data.blockquoteLeftTitle}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bold Paragraph */}
            {isFilledText(data.tableTitle) && (
              <div className="mt-10 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {data.tableTitle}
                </h2>

                <div className="mt-2 h-1 w-20 rounded bg-blue-600" />
              </div>
            )}

            <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-background">
                    <th className="border-r border-border px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-heading">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-heading">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tableRows.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-t border-border transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-surface"
                      } hover:bg-background`}
                    >
                      <td className="border-r border-border px-6 py-5 font-semibold text-heading">
                        {row.column1}
                      </td>

                      <td className="px-6 py-5 leading-7 text-foreground">
                        <HtmlBlock html={row.column2} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Advertisements */}
            {((data.advertisements && data.advertisements.length > 0) ||
              data.advertisementImage?.url) && (
              <div className="space-y-4">
                {(data.advertisements && data.advertisements.length > 0
                  ? data.advertisements
                  : [
                      {
                        image: data.advertisementImage,
                        url: data.advertisementUrl,
                      },
                    ]
                ).map(
                  (ad, idx) =>
                    ad.image?.url && (
                      <div
                        key={idx}
                        className="group overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {ad.url ? (
                          <a
                            href={ad.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative overflow-hidden"
                          >
                            <img
                              src={ad.image.url}
                              alt={`Advertisement ${idx + 1}`}
                              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </a>
                        ) : (
                          <img
                            src={ad.image.url}
                            alt={`Advertisement ${idx + 1}`}
                            className="w-full h-auto object-cover"
                          />
                        )}
                      </div>
                    ),
                )}
              </div>
            )}

            {/* Search Location Table */}
            {data.searchLocations?.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Search Locations
                </h3>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_120px] bg-gray-100 border-b border-gray-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-gray-800">
                    <span className="text-sm">Location</span>
                    <span className="text-right text-sm">Total Count</span>
                  </div>

                  {/* Rows */}
                  {data.searchLocations.map((loc, idx) => (
                    <Link
                      key={idx}
                      href={loc?.url}
                      className="grid grid-cols-[1fr_120px] items-center border-b border-gray-200 px-5 py-4 transition-colors hover:bg-gray-50 last:border-b-0"
                    >
                      <span className="font-semibold text-sm text-gray-900">
                        {loc.locationName}
                      </span>

                      <span className="text-right font-bold text-sm text-gray-700">
                        {loc.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <PopularDestinations /> */}
      </div>
    );
  }

  if (isDesignFive) {
    return (
      <div className="min-h-screen bg-background font-geist text-gray-900">
        {/* Top Banner */}
        <div
          className="relative h-[250px] md:h-[400px] w-full bg-cover bg-center flex items-end pb-10 pl-6 md:pl-20"
          style={{
            backgroundImage: `url(${data.bannerImage?.url || data.imageFirst?.url || ""})`,
          }}
        >
          <div className="relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              {data.secondTitle || ""}
            </h1>
            <p className="text-md text-white md:text-lg font-semibold">
              {data.firstTitle || ""}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Top Text Section */}
          <div className="mb-12 max-w-3xl">
            {isFilledText(data.design5Chip) && (
              <div className="inline-block border border-gray-400 rounded-full px-4 py-1 text-sm font-medium text-gray-600 mb-6">
                {data.design5Chip}
              </div>
            )}

            {isFilledText(data.design5MainHeading) && (
              <h2 className="text-2xl md:text-4xl font-serif text-gray-800 leading-snug">
                {data.design5MainHeading}
              </h2>
            )}
          </div>

          {/* Grid Cards Section */}
          {data.gridCards?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {data.gridCards.map((card, idx) => (
                <div key={idx} className="group flex flex-col cursor-pointer">
                  <div className="w-full h-64 md:h-80 overflow-hidden mb-6">
                    {card.image?.url ? (
                      <img
                        src={card.image.url}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      {isFilledText(card.chipName) && (
                        <div className="inline-block border border-gray-400 rounded-full px-3 py-0.5 text-xs font-medium text-gray-600 mb-4">
                          {card.chipName}
                        </div>
                      )}

                      <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                        {card.title}
                      </h3>
                    </div>

                    {isFilledText(card.link) && (
                      <a
                        href={card.link}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black mt-2"
                      >
                        Explore More
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <PopularDestinations /> */}
      </div>
    );
  }

  if (isDesignSix) {
    return (
      <div className="min-h-screen bg-background font-geist text-gray-900">
        {/* Top Banner */}
        <div
          className="relative h-[250px] md:h-[450px] w-full bg-center bg-no-repeat flex items-end pb-10 pl-6 md:pl-20"
          style={{
            backgroundImage: `url(${data.bannerImage?.url || data.imageFirst?.url || ""})`,
          }}
        >
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              {data.firstTitle || ""}
            </h1>
            <p className="text-md md:text-lg font-semibold text-white">
              {data.secondTitle || ""}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="mb-12 max-w-7xl">
            <div className="flex justify-between items-start mb-6">
              {isFilledText(data.design6Chip) && (
                <div className="inline-block border border-gray-400 rounded-full px-4 py-1 text-sm font-medium text-gray-600">
                  {data.design6Chip}
                </div>
              )}
              {isFilledText(data.design6ExploreLink) && (
                <a
                  href={data.design6ExploreLink}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black border border-gray-200 px-4 py-1 rounded-md"
                >
                  Explore Area
                  <svg
                    className="w-4 h-4 ml-1 transform -rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              )}
            </div>

            {isFilledText(data.design6MainHeading) && (
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 leading-tight mb-6">
                {data.design6MainHeading}
              </h2>
            )}

            {isFilledText(data.design6SubHeading) && (
              <p className="text-gray-800 text-sm md:text-lg leading-relaxed mb-8 w-full text-justify">
                {data.design6SubHeading}
              </p>
            )}

            {isFilledText(data.design6Author) && (
              <p className="text-sm font-medium text-gray-800">
                {data.design6Author}
              </p>
            )}
          </div>

          <hr className="my-10 border-gray-300" />

          {/* Mid Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            {isFilledText(data.design6MidHeading) && (
              <h2 className="text-2xl md:text-4xl font-serif text-gray-800 leading-snug max-w-2xl">
                {data.design6MidHeading}
              </h2>
            )}
          </div>

          {/* Team members */}
          {/* Team members */}
          <div className="flex flex-col gap-10">
            {(data.teamCards || []).map((card, idx) => (
              <div
                key={idx}
                className={`mx-auto flex w-full max-w-7xl flex-col gap-5 md:flex-row md:gap-6 border border-border rounded-2xl p-5 md:p-6 ${
                  idx % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="overflow-hidden rounded-2xl bg-gray-100 md:w-[42%]">
                  {card.image?.url ? (
                    <Image
                      src={card.image.url}
                      quality={90}
                      width={500}
                      height={400}
                      alt={card.name || "Team member"}
                      className="h-[320px] w-full object-cover md:h-[500px]"
                    />
                  ) : (
                    <div className="flex h-[320px] items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col md:w-[58%]">
                  <div className="flex-1 rounded-2xl bg-gray-100 border border-gray-200 p-5 md:p-6">
                    {isFilledText(card.name) && (
                      <h3 className="text-xl font-bold text-gray-900 md:text-3xl">
                        {card.name}
                      </h3>
                    )}

                    {isFilledText(card.designation) && (
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {card.designation}
                      </p>
                    )}

                    {isFilledText(card.qualification) && (
                      <p className="mt-4 text-md leading-relaxed text-justify text-gray-700">
                        <span className="font-bold text-gray-900">
                          Qualification:{" "}
                        </span>
                        {card.qualification}
                      </p>
                    )}

                    {isFilledText(card.specialization) && (
                      <p className="mt-3 text-md leading-relaxed text-justify text-gray-700">
                        <span className="font-bold text-gray-900">
                          Specialization:{" "}
                        </span>
                        {card.specialization}
                      </p>
                    )}
                  </div>

                  {/* Bottom info */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />

                      {isFilledText(card.phone) && (
                        <a
                          href={`tel:${card.phone.replace(/[^0-9+]/g, "")}`}
                          className="text-md font-medium text-gray-700 hover:text-gray-900"
                        >
                          {card.phone}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isFilledText(card.facebook) && (
                        <a
                          href={card.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}

                      {isFilledText(card.instagram) && (
                        <a
                          href={card.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}

                      {isFilledText(card.youtube) && (
                        <a
                          href={card.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <PopularDestinations /> */}
      </div>
    );
  }

  if (isDesignSeven) {
    return (
      <div className="min-h-screen bg-background font-geist text-gray-900">
        {/* Top Banner */}
        <div
          className="relative h-[250px] md:h-[400px] w-full bg-cover bg-no-repeat bg-center flex items-end pb-10 pl-6 md:pl-20"
          style={{
            backgroundImage: `url(${data.bannerImage?.url || data.imageFirst?.url || ""})`,
          }}
        >
          {/* <div className="absolute inset-0 bg-black/40"></div> */}
          <div className="relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              {data.secondTitle || ""}
            </h1>
            <p className="text-md md:text-lg font-semibold text-white">
              {data.firstTitle || ""}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="mb-12 max-w-7xl">
            <div className="flex justify-between items-start mb-6">
              {isFilledText(data.design7Chip) && (
                <div className="inline-block border border-gray-400 rounded-full px-4 py-1 text-sm font-medium text-gray-600">
                  {data.design7Chip}
                </div>
              )}
              {isFilledText(data.design7ExploreLink) && (
                <a
                  href={data.design7ExploreLink}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black border border-gray-900 px-6 py-2 rounded-md"
                >
                  Explore Area
                  <svg
                    className="w-4 h-4 ml-1 transform -rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              )}
            </div>

            {isFilledText(data.design7MainHeading) && (
              <h2 className="text-3xl md:text-5xl font-serif text-gray-800 leading-tight mb-6 max-w-3xl">
                {data.design7MainHeading}
              </h2>
            )}

            <hr className="my-10 border-gray-300" />
          </div>

          {/* Gallery Grid */}
          {data.gridCards?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.gridCards.map((card, idx) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden bg-gray-100 aspect-3/4"
                >
                  {card.image?.url ? (
                    <img
                      src={card.image.url}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* Hover Overlay Box */}
                  <div className="absolute bottom-0 left-0 w-[90%] bg-white p-5 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 shadow-lg">
                    {isFilledText(card.chipName) && (
                      <div className="inline-block border border-gray-400 rounded px-3 py-0.5 text-xs font-medium text-gray-600 mb-2">
                        {card.chipName}
                      </div>
                    )}
                    {isFilledText(card.title) && (
                      <a
                        href={
                          card.gallerySlug
                            ? `/gallery/${card.gallerySlug}`
                            : "#"
                        }
                        className="block text-lg font-serif text-[#3b438c] hover:text-black"
                      >
                        {card.title}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <PopularDestinations /> */}
      </div>
    );
  }

  if (isDesignEight) {
    const hotelAmenities = cleanTextArray(data.design8HotelAmenities);
    const selectedRoomAmenities = new Set(
      cleanTextArray(data.design8RoomAmenities),
    );
    const roomAmenityGroups = ROOM_AMENITY_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => selectedRoomAmenities.has(item)),
    })).filter((cat) => cat.items.length > 0);

    return (
      <div className="min-h-screen bg-background font-body text-heading">
        {data.bannerImage?.url && (
          <div
            className="relative h-[100px] w-full bg-cover bg-center md:h-[400px]"
            style={{ backgroundImage: `url(${data.bannerImage.url})` }}
          />
        )}

        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          {isFilledText(data.design8Heading) && (
            <h1 className="font-heading text-2xl leading-tight text-heading md:text-5xl">
              {data.design8Heading}
            </h1>
          )}

          {isFilledText(data.design8Description) && (
            <div className="mt-8">
              <HtmlBlock
                html={data.design8Description}
                className="font-body leading-8 text-justify"
              />
            </div>
          )}

          {hotelAmenities.length > 0 && (
            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              {hotelAmenities.map((label) => {
                const Icon = getHotelAmenityIcon(label);
                return (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 rounded-card border hover:border-primary hover:shadow-md border-border bg-surface px-4 py-3"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-card text-primary">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-body text-sm font-medium text-heading">
                        {label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {roomAmenityGroups.length > 0 && (
            <div className="mt-16 mb-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {roomAmenityGroups.map((cat) => {
                const Icon = getRoomAmenityCategoryIcon(cat.category);
                return (
                  <div
                    key={cat.category}
                    className="rounded-card border border-border bg-card p-5"
                  >
                    <div className="mb-4 flex items-center gap-2 font-heading text-lg text-black">
                      <Icon className="size-5" />
                      {cat.category}
                    </div>
                    <ul className="space-y-2">
                      {cat.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 font-body text-sm text-heading"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isDesignNine) {
    const contentCards = (data.design9Cards || []).filter(
      (card) =>
        isFilledText(card?.heading) ||
        isFilledText(card?.description) ||
        (Array.isArray(card?.images) && card.images.some((img) => img?.url)),
    );

    return (
      <div className="min-h-screen bg-background font-body text-heading">
        {data.bannerImage?.url && (
          <div
            className="relative h-[150px] bg-contain md:bg-cover w-full bg-center md:h-[400px]"
            style={{ backgroundImage: `url(${data.bannerImage.url})` }}
          />
        )}

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-background">
          {(isFilledText(data.design9MiniHeading) ||
            isFilledText(data.design9MainHeading) ||
            isFilledText(data.design9Description)) && (
            <section className="grid gap-2 lg:grid-cols-2 lg:items-start lg:gap-16">
              <div>
                {isFilledText(data.design9MiniHeading) && (
                  <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {data.design9MiniHeading}
                  </p>
                )}
                {isFilledText(data.design9MainHeading) && (
                  <h1 className="mt-3 font-heading text-4xl leading-tight text-heading md:text-5xl">
                    {data.design9MainHeading}
                  </h1>
                )}
              </div>
              {isFilledText(data.design9Description) && (
                <HtmlBlock
                  html={data.design9Description}
                  className="font-body text-muted [&_p]:text-base [&_p]:leading-8"
                />
              )}
            </section>
          )}

          {contentCards.length > 0 && (
            <div className="mt-20 space-y-20 bg-background">
              {contentCards.map((card, idx) => {
                const reverse = idx % 2 === 1;
                return (
                  <section
                    key={`${card.heading}-${idx}`}
                    className="grid items-center gap-5 lg:grid-cols-2 lg:gap-16"
                  >
                    <div className={reverse ? "lg:order-2" : undefined}>
                      {isFilledText(card.heading) && (
                        <h2 className="font-heading text-3xl text-heading">
                          {card.heading}
                        </h2>
                      )}
                      {isFilledText(card.description) && (
                        <HtmlBlock
                          html={card.description}
                          className="mt-4 font-body text-muted [&_p]:text-base [&_p]:leading-8"
                        />
                      )}
                    </div>
                    <div className={reverse ? "lg:order-1" : undefined}>
                      <ImageDotsCarousel
                        images={card.images}
                        alt={card.heading || data.title || "Section image"}
                      />
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-geist font-semibold text-gray-900">
      <div
        className={`w-full border-b border-gray-900 bg-background`}
      >
        <div
          className={`w-full ${
            !isDesignThree && !isBannerOnlyTop ? "md:px-4 sm:px-6" : ""
          }`}
        >
          <div
            className={`grid gap-2 ${isDesignThree ? "grid-cols-1" : isBannerOnlyTop ? "grid-cols-1" : "lg:grid-cols-[520px_minmax(0,1fr)] lg:items-center"}`}
          >
            {isDesignThree ? (
              <div className="overflow-hidden">
                {designThreeHeroImages[0] && (
                  <img
                    src={designThreeHeroImages[0]}
                    alt={data.title}
                    className="h-[240px] w-full object-cover md:h-[350px]"
                  />
                )}
              </div>
            ) : isBannerOnlyTop ? (
              <div className="overflow-hidden">
                <img
                  src={data.bannerImage.url}
                  alt={data.title}
                  className="h-[240px] md:h-[350px] w-full object-cover"
                />
              </div>
            ) : (
              <div className="overflow-hidden">
                {headerImage && (
                  <img
                    src={headerImage}
                    alt={data.title}
                    className="h-[220px] w-full object-contain md:h-[250px]"
                  />
                )}
              </div>
            )}
            {!isDesignThree && (
              <div className="px-5 md:px-10 py-5 ">
                {isFilledText(data.firstTitle) && (
                  <span className="hidden text-md my-3 font-medium text-gray-600 md:block">
                    {data.firstTitle}
                  </span>
                )}
                <h1 className="max-w-4xl text-2xl font-geist font-semibold leading-[1.05] tracking-tight text-black sm:text-5xl">
                  {data.title}
                </h1>
                {isFilledText(data.secondTitle) && (
                  <p className="mt-2 max-w-3xl text-md leading-8 text-gray-700">
                    {data.secondTitle}
                  </p>
                )}
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={tag + idx}
                        className="rounded-md border border-[#d4d4d4] bg-[#efefef] px-2 py-1 text-sm font-medium text-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-7 flex flex-wrap items-center gap-4 text-md text-black">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e4ff] text-sm font-bold text-[#4f46e5]">
                      {(data.sideThumbName || "E").charAt(0)}
                    </span>
                    <span className="text-sm">
                      {data.sideThumbName || "Editorial Team"}
                    </span>
                  </div>
                  <span className="h-6 w-px bg-gray-400" />
                  <span className="text-sm">
                    {formatDate(data.updatedAt || data.createdAt) || ""}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full md:max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className=" bg-background">
          {isDesignThree && (
            <section className="grid gap-6 py-4 md:px-5 md:py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  {data.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span>
                    {data.postedBy?.admin
                      ? "By Admin"
                      : data.sideThumbName || "By Admin"}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>
                    {formatDate(data.updatedAt || data.createdAt) || ""}
                  </span>
                </div>
                {tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={tag + idx}
                        className="rounded-full border border-[#e3dbe8] bg-[#faf7ff] px-3 py-1 text-xs font-semibold text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="lg:justify-self-end">
                <ShareCard slug={data.slug} />
              </div>
            </section>
          )}

          {designOneLeadParagraph && (
            <section className="space-y-5 md:px-5 py-4 md:py-4 sm:px-8">
              {isFilledText(designOneLeadParagraph.title) && (
                <h2 className="text-3xl font-bold leading-tight text-gray-950">
                  {designOneLeadParagraph.title}
                </h2>
              )}
              <HtmlBlock html={designOneLeadParagraph.description} />
              {designOneLeadParagraphImages.length > 0 && (
                <div className="space-y-4">
                  <div
                    className={`grid gap-4 ${designOneLeadParagraphImages.length > 1 ? "sm:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}
                  >
                    {designOneLeadParagraphImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-md bg-[#f8f5ef]"
                      >
                        <img
                          src={image}
                          alt={
                            designOneLeadParagraph.title ||
                            `Lead image ${index + 1}`
                          }
                          className="md:h-[350px] w-full object-cover sm:h-[200px]"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Bullet Points Section */}
                  {designOneLeadParagraph.bulletPoints &&
                    designOneLeadParagraph.bulletPoints.length > 0 &&
                    designOneLeadParagraph.bulletPoints.some((point) =>
                      isFilledText(point),
                    ) && (
                      <div className="space-y-3 mt-4">
                        {designOneLeadParagraph.bulletPoints.map(
                          (point, bulletIdx) =>
                            isFilledText(point) && (
                              <div key={bulletIdx} className="flex gap-3">
                                <span className="h-2 w-2 rounded-full bg-[#6156b0] mt-2 flex-shrink-0" />
                                <p className="text-md leading-6 text-gray-600">
                                  {point}
                                </p>
                              </div>
                            ),
                        )}
                      </div>
                    )}
                </div>
              )}
            </section>
          )}

          <div
            className={`grid gap-10 md:p-5 sm:px-8 bg-background ${isDesignThree ? "grid-cols-1" : isDesignTwo ? "lg:grid-cols-[330px_minmax(0,1fr)] lg:items-start" : "lg:grid-cols-[400px_1fr]"}`}
          >
            {isDesignThree ? (
              <>
                <main className="space-y-10">
                  {contentParagraphs.length > 0 &&
                    contentParagraphs.map((section, index) => {
                      const sectionImages = getSectionImages(section);
                      return (
                        <section
                          key={`${section.title}-${index}`}
                          className="space-y-3"
                        >
                          {isFilledText(section.title) && (
                            <h2 className="text-2xl font-bold leading-tight text-gray-950">
                              {section.title}
                            </h2>
                          )}
                          <HtmlBlock html={section.description} className="text-sm" />
                          {sectionImages.length > 0 && (
                            <div
                              className={`grid gap-4 ${
                                sectionImages.length > 1
                                  ? "grid-cols-1 sm:grid-cols-[2fr_1fr]"
                                  : "grid-cols-1"
                              }`}
                            >
                              {sectionImages.map((image, imgIndex) => (
                                <div
                                  key={`${image}-${imgIndex}`}
                                  className="h-[280px] mt-2 overflow-hidden rounded-image bg-[#f8f5ef] sm:h-[320px] md:h-[360px]"
                                >
                                  <img
                                    src={image}
                                    alt={
                                      section.title ||
                                      `Section image ${imgIndex + 1}`
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {section.bulletPoints &&
                            section.bulletPoints.length > 0 &&
                            section.bulletPoints.some((point) =>
                              isFilledText(point),
                            ) && (
                              <div className="space-y-3 py-3">
                                {section.bulletPoints.map(
                                  (point, bulletIdx) =>
                                    isFilledText(point) && (
                                      <div
                                        key={bulletIdx}
                                        className="flex gap-3"
                                      >
                                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#6156b0]" />
                                        <p className="text-md leading-6 text-gray-600">
                                          {point}
                                        </p>
                                      </div>
                                    ),
                                )}
                              </div>
                            )}
                        </section>
                      );
                    })}

                  {tableRows.length > 0 && (
                    <section className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-950">
                        {data.tableTitle || "Table Information"}
                      </h2>
                      <div className="overflow-hidden rounded-lg border border-border bg-surface">
                        <table className="w-full text-left text-sm">
                          <tbody>
                            {tableRows.map((row, index) => (
                              <tr
                                key={`${row.column1}-${row.column2}-${index}`}
                                className={`border transition-colors ${
                                  index % 2 === 0 ? "bg-background" : "bg-surface"
                                } hover:bg-background`}
                              >
                                <td className="w-1/2 border-r border-border px-4 py-3 font-semibold text-heading">
                                  {row.column1 || "-"}
                                </td>
                                <td className="w-1/2 px-4 py-3 text-foreground">
                                  {isFilledText(row.column2) ? (
                                    <HtmlBlock
                                      html={row.column2}
                                      className="text-sm"
                                    />
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  {(isFilledText(data.blockquoteDescription) ||
                    isFilledText(data.blockquoteMainTitle)) && (
                    <section
                      className={`rounded px-2 gap-2 flex flex-col py-5 text-black ${isDesignTwo ? "max-w-3xl" : ""}`}
                    >
                      <div className="rounded-[24px] border border-gray-800 bg-[linear-gradient(135deg,#fcfaf6,#f7f4ec,#e8efe0)] px-6 py-7 text-heading shadow-[0_20px_50px_rgba(120,135,79,0.12)]">
                        <Quote className="h-7 w-7 text-primary" />
                        {isFilledText(data.blockquoteMainTitle) && (
                          <h2 className="mt-3 text-2xl font-bold leading-tight mb-2 text-heading">
                            {data.blockquoteMainTitle}
                          </h2>
                        )}
                        {isFilledText(data.blockquoteLeftTitle) && (
                          <span className="text-muted">
                            {data.blockquoteLeftTitle}
                          </span>
                        )}
                      </div>
                      <div className="px-1">
                        <div className="my-4 text-black">
                          <HtmlBlock
                            html={data.blockquoteDescription}
                            className="text-black"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {blockquoteTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md w-fit border border-gray-500 px-3 py-2 text-[12px] text-black"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                  {remainingHighlights.length > 0 && (
                    <section className="space-y-5">
                      {introHighlight && (
                        <div className="rounded-md border border-[#e6dccf] bg-[#f4ede3] px-5 py-6 shadow-sm">
                          {isFilledText(introHighlight.title) && (
                            <h2 className="text-2xl font-bold leading-tight text-gray-950">
                              {introHighlight.title}
                            </h2>
                          )}
                          {isFilledText(introHighlight.point) && (
                            <p className="mt-3 text-justify text-base leading-7 text-gray-600">
                              {introHighlight.point}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col gap-4">
                        {remainingHighlights.map((item, index) => (
                          <div
                            key={`${item.title}-${index}`}
                            className="rounded-md border border-gray-200 bg-white px-5 py-5 shadow-sm"
                          >
                            {isFilledText(item.title) && (
                              <h3 className="text-2xl font-bold leading-tight text-gray-950">
                                {item.title}
                              </h3>
                            )}
                            {isFilledText(item.point) && (
                              <p className="mt-2 text-justify text-base leading-7 text-gray-600">
                                {item.point}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </main>
              </>
            ) : (
              <>
                <aside className="space-y-5 lg:sticky lg:top-20 bg-background">
                  <StaticSidebarCard data={data} />
                  <AuthorCard data={data} />
                  <ShareCard slug={data.slug} />
                </aside>

                <main className="space-y-10 bg-background">
                  {isDesignTwo && leadParagraph && (
                    <section className="space-y-5">
                      {isFilledText(leadParagraph.description) && (
                        <HtmlBlock
                          html={leadParagraph.description}
                          className="max-w-none text-left"
                        />
                      )}
                      {isFilledText(leadParagraph.title) && (
                        <h2 className="text-4xl font-bold leading-tight text-gray-950">
                          {leadParagraph.title}
                        </h2>
                      )}

                      {/* Bullet Points Section */}
                      {leadParagraph.bulletPoints &&
                        leadParagraph.bulletPoints.length > 0 &&
                        leadParagraph.bulletPoints.some((point) =>
                          isFilledText(point),
                        ) && (
                          <div className="space-y-3 mt-4">
                            {leadParagraph.bulletPoints.map(
                              (point, bulletIdx) =>
                                isFilledText(point) && (
                                  <div key={bulletIdx} className="flex gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[#6156b0] mt-2 shrink-0" />
                                    <p className="text-sm leading-6 text-gray-600">
                                      {point}
                                    </p>
                                  </div>
                                ),
                            )}
                          </div>
                        )}
                      {leadParagraphImages.length > 0 && (
                        <div
                          className={`grid gap-4 ${leadParagraphImages.length > 1 ? "sm:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}
                        >
                          {leadParagraphImages.map((image, index) => (
                            <div
                              key={`${image}-${index}`}
                              className="overflow-hidden rounded-md bg-[#f8f5ef]"
                            >
                              <img
                                src={image}
                                alt={
                                  leadParagraph.title ||
                                  `Lead image ${index + 1}`
                                }
                                className="md:h-[500px] w-full object-cover sm:h-[200px]"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {(isDesignTwo
                    ? contentParagraphs
                    : designOneRemainingParagraphs
                  ).length > 0 &&
                    (isDesignTwo
                      ? contentParagraphs
                      : designOneRemainingParagraphs
                    ).map((section, index) => {
                      const sectionImages = getSectionImages(section);
                      return (
                        <section
                          key={`${section.title}-${index}`}
                          className="space-y-5"
                        >
                          {isFilledText(section.title) && (
                            <h2
                              className={`${isDesignTwo ? "text-2xl" : "text-3xl"} font-bold leading-tight text-gray-950`}
                            >
                              {section.title}
                            </h2>
                          )}
                          <HtmlBlock html={section.description} />
                          {sectionImages.length > 0 && (
                            <div
                              className={`grid gap-4 ${sectionImages.length > 1 ? "sm:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}
                            >
                              {sectionImages.map((image, imageIndex) => (
                                <div
                                  key={`${image}-${imageIndex}`}
                                  className="overflow-hidden rounded-md bg-[#f8f5ef]"
                                >
                                  <img
                                    src={image}
                                    alt={
                                      section.title ||
                                      `Section image ${imageIndex + 1}`
                                    }
                                    className="md:h-[250px] w-full object-cover sm:h-[200px]"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Bullet Points Section */}
                          {section.bulletPoints &&
                            section.bulletPoints.length > 0 &&
                            section.bulletPoints.some((point) =>
                              isFilledText(point),
                            ) && (
                              <div className="space-y-3 mt-4">
                                {section.bulletPoints.map(
                                  (point, bulletIdx) =>
                                    isFilledText(point) && (
                                      <div
                                        key={bulletIdx}
                                        className="flex gap-3"
                                      >
                                        <span className="h-2 w-2 rounded-full bg-[#6156b0] mt-2 shrink-0" />
                                        <p className="text-sm leading-6 text-gray-600">
                                          {point}
                                        </p>
                                      </div>
                                    ),
                                )}
                              </div>
                            )}
                        </section>
                      );
                    })}

                  {tableRows.length > 0 && (
                    <section className="space-y-4">
                      <h2 className="text-2xl font-bold text-gray-950">
                        {data.tableTitle || "Table Information"}
                      </h2>
                      <div className="overflow-hidden  border-[#ddd5ca] bg-white">
                        <table className="w-full text-left text-sm">
                          <tbody>
                            {tableRows.map((row, index) => (
                              <tr
                                key={`${row.column1}-${row.column2}-${index}`}
                                className={`border border-gray-800 ${
                                  index % 2 === 0 ? "bg-surface" : "bg-background"
                                }`}
                              >
                                <td className="w-1/2 px-4 py-3 font-medium text-black border-r border-b border-gray-400">
                                  {row.column1 || "-"}
                                </td>
                                <td className="w-1/2 px-4 py-3 text-black font-medium border-b border-gray-400">
                                  {isFilledText(row.column2) ? (
                                    <HtmlBlock
                                      html={row.column2}
                                      className="text-sm font-medium"
                                    />
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  {(isFilledText(data.blockquoteDescription) ||
                    isFilledText(data.blockquoteMainTitle)) && (
                    <section
                      className={`rounded px-2 gap-2 flex flex-col py-5 text-black ${isDesignTwo ? "max-w-3xl" : ""}`}
                    >
                      <div className="rounded-[24px] border border-gray-700 bg-[linear-gradient(135deg,#fcfaf6,#f7f4ec,#e8efe0)] px-6 py-7 text-heading shadow-[0_20px_50px_rgba(120,135,79,0.12)]">
                        <Quote className="h-7 w-7 text-primary" />
                        {isFilledText(data.blockquoteMainTitle) && (
                          <h2 className="mt-3 text-2xl font-bold leading-tight mb-2 text-heading">
                            {data.blockquoteMainTitle}
                          </h2> 
                        )}
                        {isFilledText(data.blockquoteLeftTitle) && (
                          <span className="text-muted">
                            {data.blockquoteLeftTitle}
                          </span>
                        )}
                      </div>
                      <div className="px-1">
                        <div className="my-4 text-black">
                          <HtmlBlock
                            html={data.blockquoteDescription}
                            className="text-black"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {blockquoteTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md w-fit border border-gray-500 px-3 py-2 text-[12px] text-black"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {highlights.length > 0 && (
                    <section className="space-y-4">
                      <h2 className="text-2xl font-bold text-gray-950">
                        More details
                      </h2>
                      <div className="grid gap-4 md:grid-cols-1">
                        {highlights.map((item, index) => (
                          <div
                            key={`${item.title}-${index}`}
                            className="rounded-md border border-gray-800 bg-[#fcfaf6] p-5"
                          >
                            {isFilledText(item.title) && (
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.title}
                              </h3>
                            )}
                            {isFilledText(item.point) && (
                              <p className="mt-2 text-sm leading-7 text-gray-600">
                                {item.point}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {accordionItems.length > 0 && (
                    <section className="space-y-6">
                      <h2 className="text-3xl font-bold text-gray-950">
                        Special Note
                      </h2>
                      <div className="space-y-2.5">
                        {accordionItems.map((item, index) => {
                          const isOpen = openAccordion === index;
                          return (
                            <div
                              key={`${item.left}-${index}`}
                              className={`overflow-hidden rounded-lg border transition-all duration-300 ${
                                isOpen
                                  ? "border-[#060606] bg-linear-to-br from-bg-background to-bg-background"
                                  : "border-[#e6dccf] bg-white"
                              }`}
                              style={{
                                transformOrigin: "top",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenAccordion(isOpen ? -1 : index)
                                }
                                className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-all duration-300 ${
                                  isOpen
                                    ? "bg-linear-to-r from-bg-background to-bg-background"
                                    : "hover:bg-bg-background"
                                }`}
                              >
                                <span
                                  className={`font-semibold transition-colors duration-300 ${isOpen ? "text-primary" : "text-gray-900 group-hover:text-gray-950"}`}
                                >
                                  {item.left || `Question ${index + 1}`}
                                </span>
                                <ChevronDown
                                  className={`h-5 w-5 shrink-0 transition-all duration-500 ${
                                    isOpen
                                      ? "rotate-180 text-primary"
                                      : "text-gray-500"
                                  }`}
                                />
                              </button>
                              <div
                                className={`grid transition-all duration-500 ease-in-out ${
                                  isOpen
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                }`}
                              >
                                <div className="overflow-hidden">
                                  <div className="border-t border-[#e6dccf] px-6 py-5 text-sm leading-7 text-gray-700">
                                    {item.right || "No details added yet."}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </main>
              </>
            )}
          </div>
          {/* <PopularDestinations /> */}
        </div>
      </div>
    </div>
  );
};

export default WebPage;
