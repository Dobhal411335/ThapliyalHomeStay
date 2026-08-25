"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getHotelAmenityIcon } from "@/lib/hotelAmenityIcons";

function truncateHtmlByWords(html = "", wordLimit = 55) {
  const raw = String(html || "").trim();
  if (!raw) return "";

  const text = raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = text.split(" ").filter(Boolean);
  if (words.length === 0) return "";
  if (words.length <= wordLimit) return raw;

  return `${words.slice(0, wordLimit).join(" ")}…`;
}

function formatPrice(value) {
  if (value == null || value === "") return null;
  return `₹${new Intl.NumberFormat("en-IN").format(Number(value) || 0)}`;
}

function getRoomCardData(item) {
  const nested = item?.rooms?.[0] || null;
  const priceRows = item?.prices?.[0]?.prices || [];

  const gallery = [
    nested?.mainPhoto?.url,
    ...(nested?.relatedPhotos?.map((img) => img?.url) || []),
    item?.mainPhoto?.url,
    ...(item?.relatedPhotos?.map((img) => img?.url) || []),
  ].filter((url) => typeof url === "string" && url.trim().length > 0);

  const singlePrice =
    nested?.singleOccupancyPrice ??
    priceRows.find((p) => p.type === "01 Pax")?.amount;
  const doublePrice =
    nested?.doubleOccupancyPrice ??
    priceRows.find((p) => p.type === "02 Pax")?.amount;

  return {
    title: nested?.name || item?.title || "Room",
    heading: item?.heading || "",
    code: item?.code || "",
    slug: item?.slug || "",
    description: truncateHtmlByWords(
      nested?.paragraph || item?.paragraph || item?.heading || "",
    ),
    gallery: [...new Set(gallery)],
    amenities: Array.isArray(item?.amenities) ? item.amenities : [],
    singlePrice,
    doublePrice,
    maxOccupancy:
      doublePrice != null ? "02 Pax" : singlePrice != null ? "01 Pax" : null,
    hasExtraBed: priceRows.some((p) => p.type === "Extra Bed"),
  };
}

function StandaloneRoomCard({ item }) {
  const room = getRoomCardData(item);
  if (!room.slug) return null;

  return (
    <article className="group relative flex flex-col gap-5 rounded-2xl border border-border bg-[#f8f5ef] p-4 shadow-sm transition-colors hover:border-heading/20 md:flex-row md:items-stretch md:gap-6 md:p-5">
      <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-xl bg-border md:h-auto md:min-h-[280px] md:w-[380px]">
        {room.gallery.length > 0 ? (
          <Carousel
            className="h-full w-full"
            opts={{ loop: room.gallery.length > 1 }}
          >
            <CarouselContent className="h-full">
              {room.gallery.map((img, idx) => (
                <CarouselItem key={`${room.slug}-${idx}`} className="h-full">
                  <div className="relative h-[240px] w-full md:h-full md:min-h-[280px]">
                    <Image
                      src={img}
                      alt={`${room.title} image ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {room.gallery.length > 1 ? (
              <>
                <CarouselPrevious className="left-2 size-8 border-0 bg-white/80 text-heading shadow-sm hover:bg-white" />
                <CarouselNext className="right-2 size-8 border-0 bg-white/80 text-heading shadow-sm hover:bg-white" />
              </>
            ) : null}
          </Carousel>
        ) : (
          <div className="flex h-full min-h-[240px] items-center justify-center font-body text-sm text-muted md:min-h-[280px]">
            No image
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h3 className="font-heading text-2xl font-medium leading-tight text-heading md:text-3xl">
                {room.title}
              </h3>
              {room.heading ? (
                <p className="font-body text-sm text-gray-500 md:text-base">
                  {room.heading}
                </p>
              ) : null}
            </div>
              {room.code ? (
              <span className="shrink-0 rounded-full border border-gray-500 bg-white px-3 py-1 font-ui text-[10px] uppercase tracking-wider text-black shadow-sm">
                Code: {room.code}
              </span>
            ) : null}
          </div>

          {room.description ? (
            <div
              className="line-clamp-2 font-body text-sm leading-relaxed text-heading [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0"
              dangerouslySetInnerHTML={{ __html: room.description }}
            />
          ) : null}

          {room.amenities.length > 0 ? (
            <div>
              <p className="mb-2 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                Amenities
              </p>
              <TooltipProvider>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 8).map((am, i) => {
                    const label = am?.label || am;
                    const Icon = getHotelAmenityIcon(label);
                    return (
                      <Tooltip key={am?._id || `${label}-${i}`}>
                        <TooltipTrigger className="flex size-10 items-center justify-center rounded-2xl border border-border bg-white text-muted shadow-sm transition-colors hover:border-primary/40 hover:text-heading">
                          <Icon className="size-4" strokeWidth={1.5} />
                        </TooltipTrigger>
                        <TooltipContent className="font-body text-xs">
                          {label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 border-t border-gray-400 pt-3 sm:flex-row sm:gap-6">
                <span className="font-body text-sm text-muted">
                  Single:{" "}
                  <strong className="font-heading text-lg font-medium text-heading">
                    {formatPrice(room.singlePrice) || "On enquiry"}
                  </strong>
                </span>
                <span className="font-body text-sm text-muted">
                  Double:{" "}
                  <strong className="font-heading text-lg font-medium text-heading">
                    {formatPrice(room.doublePrice) || "On enquiry"}
                  </strong>
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 font-ui text-xs text-muted">
                {room.maxOccupancy ? (
                  <span>
                    Max occupancy:{" "}
                    <span className="text-heading">{room.maxOccupancy}</span>
                  </span>
                ) : null}
                <span>
                  Extra bed:{" "}
                  <span className="text-heading">
                    {room.hasExtraBed ? "Available" : "No"}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <Link
                href={`/room/${room.slug}`}
                className="inline-flex h-11 items-center gap-2 rounded-button bg-primary px-6 font-body text-sm text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Details
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function StandaloneRoomsSection({ rooms = [] }) {
  if (!rooms.length) return null;

  return (
    <div className="flex w-full flex-col gap-6 md:p-4">
      {rooms.map((item, idx) => (
        <StandaloneRoomCard key={item._id || idx} item={item} />
      ))}
    </div>
  );
}
