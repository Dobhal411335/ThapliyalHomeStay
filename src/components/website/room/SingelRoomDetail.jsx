"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Copy,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { cn } from "@/lib/utils";
import { getHotelAmenityIcon } from "@/lib/hotelAmenityIcons";
import { ROOM_AMENITY_CATEGORIES } from "@/lib/roomAmenityCategories";
import { getRoomAmenityCategoryIcon } from "@/lib/roomAmenityIcons";
import BookingDetails from "@/components/website/room/BookingDetails";
import StandaloneRoomsSection from "@/components/website/home/StandaloneRoomsSection";
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";

function formatPrice(value) {
  if (value == null || value === "") return "—";
  return `₹${new Intl.NumberFormat("en-IN").format(Number(value) || 0)}`;
}

function PaxLabel({ value, className }) {
  const text = String(value || "");
  const match = text.match(/^(.*?)(\s*)(Pax)$/i);
  if (!match) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className}>
      {match[1]}
      {match[2]}
      <span className="text-heading">{match[3]}</span>
    </span>
  );
}

function getPriceRows(data) {
  const prices = data?.prices;
  if (!Array.isArray(prices) || prices.length === 0) return [];
  if (Array.isArray(prices[0]?.prices)) return prices[0].prices;
  if (prices[0]?.type != null) return prices;
  return [];
}

function pickAmount(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const amount = Number(value);
    if (!Number.isNaN(amount) && amount > 0) return amount;
  }
  return null;
}

function stripHtmlPreview(html = "", wordLimit = 48) {
  const text = String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(" ").filter(Boolean);
  if (words.length <= wordLimit) {
    return { preview: text, truncated: false };
  }
  return {
    preview: `${words.slice(0, wordLimit).join(" ")}…`,
    truncated: true,
  };
}

function groupRoomAmenities(selected = []) {
  const selectedSet = new Set(
    selected.map((item) => (typeof item === "string" ? item : item?.label)).filter(Boolean)
  );

  return ROOM_AMENITY_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter((item) => selectedSet.has(item)),
  })).filter((category) => category.items.length > 0);
}

export default function SingelRoomDetail({ data, relatedRooms = [] }) {
  const companyInfo = useCompanyBasicInfo();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [carouselApi, setCarouselApi] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const nestedRoom = data?.rooms?.[0] || null;
  const hotelAmenities = Array.isArray(data?.amenities) ? data.amenities : [];
  const categorizedAmenities = useMemo(() =>
    groupRoomAmenities(Array.isArray(nestedRoom?.amenities) ? nestedRoom.amenities : []),
    [nestedRoom?.amenities],
  );

  const gallerySources = [
    nestedRoom?.mainPhoto?.url,
    ...(nestedRoom?.relatedPhotos?.map((img) => img?.url) || []),
    data?.mainPhoto?.url,
    ...(data?.relatedPhotos?.map((img) => img?.url) || []),
  ].filter((img) => typeof img === "string" && img.trim().length > 0);
  const gallery = [...new Set(gallerySources)];

  const priceRows = getPriceRows(data);
  const singlePrice = pickAmount(
    nestedRoom?.singleOccupancyPrice,
    priceRows.find((p) => p.type === "01 Pax")?.amount
  );
  const doublePrice = pickAmount(
    nestedRoom?.doubleOccupancyPrice,
    priceRows.find((p) => p.type === "02 Pax")?.amount
  );
  const extraBedRow = priceRows.find((p) => p.type === "Extra Bed");
  const extraBedPrice = pickAmount(extraBedRow?.amount);
  const hasExtraBed = Boolean(extraBedRow);
  const maxOccupancy = doublePrice != null
    ? "02 Pax"
    : singlePrice != null
      ? "01 Pax"
      : "—";
  const baseRate =
    (doublePrice != null
      ? { type: "02 Pax", amount: doublePrice }
      : null) ||
    (singlePrice != null
      ? { type: "01 Pax", amount: singlePrice }
      : null) ||
    priceRows.find((p) => p.type === "01 Pax") ||
    priceRows.find((p) => p.type === "02 Pax") ||
    null;

  // Normalize rows so the table always prefers nested occupancy when present
  const displayPriceRows = [
    singlePrice != null ? { type: "01 Pax", amount: singlePrice } : priceRows.find((p) => p.type === "01 Pax"),
    doublePrice != null ? { type: "02 Pax", amount: doublePrice } : priceRows.find((p) => p.type === "02 Pax"),
    extraBedPrice != null
      ? { type: "Extra Bed", amount: extraBedPrice }
      : extraBedRow,
  ].filter(Boolean);

  const roomName = nestedRoom?.name || data?.title || "Room";
  const descriptionHtml = nestedRoom?.paragraph || data?.paragraph || "";
  const descriptionMeta = stripHtmlPreview(descriptionHtml);
  const pagePath = data?.slug ? `/room/${data.slug}` : "";
  const whatsappNumber = (
    companyInfo?.whatsappNumber ||
    companyInfo?.contactNumbers?.[0] ||
    ""
  ).replace(/\D/g, "");
  const phoneNumber = (
    companyInfo?.contactNumbers?.[0] ||
    companyInfo?.whatsappNumber ||
    ""
  ).replace(/\D/g, "");

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setActiveImageIdx(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    onSelect();
    return () => carouselApi.off("select", onSelect);
  }, [carouselApi]);

  function getAbsoluteRoomUrl() {
    if (!pagePath) return "";
    if (typeof window !== "undefined") {
      return `${window.location.origin}${pagePath}`;
    }
    return pagePath;
  }

  function getWhatsappMessage() {
    return [
      "Dear Reservations Team,",
      "",
      `I would like to enquire about the room "${roomName}".`,
      "",
      "Please share availability and pricing for my preferred dates.",
      "",
      "--- Room details ---",
      `Room: ${roomName}`,
      data?.title && data.title !== roomName ? `Listing: ${data.title}` : null,
      data?.code ? `Code: ${data.code}` : null,
      singlePrice != null ? `Single occupancy: ${formatPrice(singlePrice)}` : null,
      doublePrice != null ? `Double occupancy: ${formatPrice(doublePrice)}` : null,
      pagePath ? `Page: ${getAbsoluteRoomUrl()}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  function handleCopyLink() {
    const url = getAbsoluteRoomUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied.");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const url = getAbsoluteRoomUrl();
    if (!url) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: roomName,
          text: data?.heading || roomName,
          url,
        });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    handleCopyLink();
  }

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Gallery + room summary */}
      <Section spacing="sm">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_0.95fr] lg:gap-10">
            <div className="min-w-0 overflow-hidden">
              <div className="relative w-full overflow-hidden rounded-image bg-surface">
                {gallery.length > 0 ? (
                  <Carousel
                    className="w-full"
                    opts={{ loop: true }}
                    plugins={[Autoplay({ delay: 4500 })]}
                    setApi={setCarouselApi}
                  >
                    <CarouselContent>
                      {gallery.map((img, idx) => (
                        <CarouselItem key={`${img}-${idx}`}>
                          <div className="relative aspect-square w-full md:aspect-[4/3]">
                            <Image
                              src={img}
                              alt={`${roomName} image ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 55vw"
                              priority={idx === 0}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {gallery.length > 1 ? (
                      <>
                        <CarouselPrevious className="left-3 z-10 size-10 border-0 bg-card/90 text-heading shadow-sm hover:bg-card" />
                        <CarouselNext className="right-3 z-10 size-10 border-0 bg-card/90 text-heading shadow-sm hover:bg-card" />
                      </>
                    ) : null}
                  </Carousel>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center font-body text-sm text-muted">
                    No images available
                  </div>
                )}
              </div>

              {gallery.length > 1 ? (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      type="button"
                      onClick={() => carouselApi?.scrollTo(idx)}
                      className={cn(
                        "relative size-14 shrink-0 overflow-hidden rounded-image border transition-colors sm:size-16",
                        activeImageIdx === idx
                          ? "border-primary"
                          : "border-border"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`${roomName} thumb ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="font-heading text-3xl font-medium leading-tight text-heading md:text-4xl">
                  {roomName}
                </h1>
                {data?.code ? (
                  <span className="shrink-0 rounded-full border border-border bg-white px-3 py-1 font-ui text-xs uppercase tracking-wider text-muted shadow-sm">
                    Code: {data.code}
                  </span>
                ) : null}
              </div>

              {data?.heading ? (
                <p className="font-body text-base text-black md:text-lg">
                  {data.heading}
                </p>
              ) : null}

              {descriptionHtml ? (
                <div className="font-body text-sm leading-relaxed text-heading">
                  {showFullDesc || !descriptionMeta.truncated ? (
                    <div
                      className="prose custom-desc-list max-w-none font-body text-sm leading-relaxed text-heading [&_li]:text-heading [&_p]:text-heading [&_span]:text-heading"
                      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                    />
                  ) : (
                    <p className="line-clamp-4 prose custom-desc-list max-w-none font-body text-sm leading-relaxed text-heading [&_li]:text-heading [&_p]:text-heading [&_span]:text-heading">{descriptionMeta.preview}</p>
                  )}
                  {descriptionMeta.truncated ? (
                    <button
                      type="button"
                      className="mt-1 font-ui text-sm font-medium text-blue-600 hover:underline"
                      onClick={() => setShowFullDesc((v) => !v)}
                    >
                      {showFullDesc ? "Show less" : "Read more"}
                    </button>
                  ) : null}
                </div>
              ) : (
                <p className="font-body text-sm text-muted">No description yet.</p>
              )}

              <p className="font-semibold text-lg text-heading md:text-md">
                {baseRate ? (
                  <>
                    Room Base Rate for{" "}
                    <PaxLabel value={baseRate.type} />{" "}
                    {formatPrice(baseRate.amount)}
                  </>
                ) : (
                  "Rate available on enquiry"
                )}
              </p>

              <div className="overflow-hidden rounded-2xl border border-gray-500 bg-surface/50">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-surface">
                    <tr>
                      <th className="border-b border-r border-gray-500 px-4 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-black">
                        Person
                      </th>
                      <th className="border-b border-gray-500 px-4 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-black">
                        Price For Night
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {["01 Pax", "02 Pax", "Extra Bed"].map((type) => {
                      const row = displayPriceRows.find((p) => p.type === type);
                      if (!row) return null;
                      return (
                        <tr
                          key={type}
                          className="border-b border-gray-500 bg-transparent last:border-b-0"
                        >
                          <td className="border-r border-gray-500 px-4 py-3 font-body text-sm font-medium text-black">
                            <PaxLabel value={type} />
                          </td>
                          <td className="px-4 py-3 font-body text-sm font-medium text-black">
                            {formatPrice(row.amount)}
                          </td>
                        </tr>
                      );
                    })}
                    {displayPriceRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-3 py-4 font-body text-sm text-muted"
                        >
                          Pricing will appear once configured.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 pt-1 font-body text-sm text-black">
                <p className="font-medium text-black">
                  Max occupancy:{" "}
                  <PaxLabel
                    value={maxOccupancy}
                    className="font-medium text-black"
                  />
                </p>
                <p className="font-medium text-black">
                  Extra bed available:{" "}
                  <span className="text-black">
                    {hasExtraBed ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
      <Section spacing="md" className="bg-surface">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-card border border-gray-500 bg-card p-6">
              <h3 className="font-heading text-xl font-medium text-heading">
                Stay notes
              </h3>
              <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-muted">
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Check-in
                  </p>
                  <p className="mt-1">
                    Guests receive arrival guidance before check-in. Front desk
                    staff will greet you on arrival.
                  </p>
                </div>
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Pets
                  </p>
                  <p className="mt-1">Pets are not allowed.</p>
                </div>
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Children
                  </p>
                  <p className="mt-1">
                    Children are welcome. Extra bedding may be available on
                    request.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-card border border-gray-500 bg-card p-6">
              <h3 className="font-heading text-xl font-medium text-heading">
                Timings
              </h3>
              <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-muted">
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Check-in
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>From 12:00 PM</li>
                    <li>Early check-in subject to availability</li>
                  </ul>
                </div>
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Check-out
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>Before 11:00 AM</li>
                    <li>Late check-out subject to availability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      {/* Amenities + booking sidebar */}
      <Section spacing="sm" className="">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
            <div className="space-y-8">
              {(data?.paragraph || hotelAmenities.length > 0 || categorizedAmenities.length > 0) ? (
                <div>
                  {data?.paragraph && nestedRoom?.paragraph ? (
                    <div
                      className="mb-8 prose custom-desc-list max-w-none font-body text-base leading-relaxed text-heading [&_li]:text-heading [&_p]:text-heading [&_span]:text-heading"
                      dangerouslySetInnerHTML={{ __html: data.paragraph }}
                    />
                  ) : null}

                  {hotelAmenities.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {hotelAmenities.map((am, idx) => {
                        const label = am?.label || am;
                        const Icon = getHotelAmenityIcon(label);
                        return (
                          <div
                            key={am?._id || `${label}-${idx}`}
                            className="flex items-center gap-3 rounded-card border border-gray-400 bg-card px-4 py-3"
                          >
                            <span className="flex size-9 items-center justify-center rounded-full bg-surface text-black">
                              <Icon className="size-4" strokeWidth={1.5} />
                            </span>
                            <span className="font-body text-sm text-black">
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {categorizedAmenities.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {categorizedAmenities.map((category) => {
                    const Icon = getRoomAmenityCategoryIcon(category.category);
                    return (
                      <div
                        key={category.category}
                        className="rounded-card border border-gray-400 bg-card p-5"
                      >
                        <div className="mb-4 flex items-center gap-2">
                          <Icon className="size-5 text-black" strokeWidth={1.5} />
                          <h3 className="font-heading text-lg font-medium text-black">
                            {category.category}
                          </h3>
                        </div>
                        <ul className="space-y-2.5">
                          {category.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 font-body text-sm text-black"
                            >
                              <Check className="mt-0.5 size-5 shrink-0 text-green-600" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : hotelAmenities.length === 0 ? (
                <p className="font-body text-sm text-muted">
                  Amenities will appear once configured.
                </p>
              ) : null}
            </div>
              
            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-card border border-gray-400 bg-card p-5 shadow-sm">
                <div className="mb-4 space-y-4">
                  <div>
                    <p className="font-ui text-xs font-semibold uppercase tracking-wide text-muted">
                      Single Occupancy
                    </p>
                    <p className="mt-1 font-heading text-2xl font-medium text-heading">
                      {singlePrice != null ? (
                        <>
                          {formatPrice(singlePrice)}
                          <span className="ml-1 font-ui text-sm font-normal text-muted">
                            /Person
                          </span>
                        </>
                      ) : (
                        "On enquiry"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-ui text-xs font-semibold uppercase tracking-wide text-muted">
                      Double Occupancy
                    </p>
                    <p className="mt-1 font-heading text-2xl font-medium text-heading">
                      {doublePrice != null ? (
                        <>
                          {formatPrice(doublePrice)}
                          <span className="ml-1 font-ui text-sm font-normal text-muted">
                            /Person
                          </span>
                        </>
                      ) : (
                        "On enquiry"
                      )}
                    </p>
                  </div>
                </div>

                <p className="mb-5 font-ui text-xs text-muted">
                  Excluding applicable taxes
                </p>

                <Button
                  type="button"
                  className="h-10 w-full"
                  disabled={!nestedRoom}
                  onClick={() => setBookingOpen(true)}
                >
                  {nestedRoom ? "Book room" : "Make an enquiry"}
                </Button>

                <div className="mt-3 flex gap-2">
                  {phoneNumber ? (
                    <Link
                      href={`tel:+${phoneNumber}`}
                      className="flex items-center justify-center rounded-button border border-gray-600 p-3 text-heading transition-colors hover:bg-surface"
                    >
                      <Phone className="size-4" />
                    </Link>
                  ) : null}
                  {whatsappNumber ? (
                    <Link
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getWhatsappMessage())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-button bg-success py-2.5 font-ui text-xs font-semibold text-white transition-colors hover:bg-success/90"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="rounded-card border border-gray-500 bg-card p-4">
                <h4 className="mb-3 font-semibold text-sm text-black">
                  Share this room
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-button border border-gray-500 py-2.5 font-ui text-xs text-black transition-colors hover:bg-surface hover:text-heading"
                  >
                    <Share2 className="size-4" />
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-button border border-gray-500 py-2.5 font-ui text-xs text-black transition-colors hover:bg-surface hover:text-heading"
                  >
                    <Copy className="size-4" />
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {relatedRooms.length > 0 ? (
        <Section spacing="md">
          <Container>
            <div className="mb-6 space-y-2">
              <h2 className="font-heading text-3xl font-medium text-heading md:text-4xl">
                Related rooms
              </h2>
              <p className="font-body text-sm text-muted md:text-base">
                Explore more standalone rooms you might like.
              </p>
            </div>
            <StandaloneRoomsSection rooms={relatedRooms} />
          </Container>
        </Section>
      ) : null}

      {bookingOpen && nestedRoom ? (
        <BookingDetails
          hotel={data}
          room={nestedRoom}
          listingType="room"
          onClose={() => setBookingOpen(false)}
        />
      ) : null}
    </div>
  );
}
