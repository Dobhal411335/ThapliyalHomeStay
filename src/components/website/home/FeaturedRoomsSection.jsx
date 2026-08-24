"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  Bed,
  Coffee,
  Luggage,
  ParkingCircle,
  Phone,
  ShowerHead,
  Snowflake,
  Tv,
  Utensils,
  Wifi,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const amenityIcons = {
  Restaurant: Utensils,
  Bed,
  "Room Phone": Phone,
  Parking: ParkingCircle,
  Shower: ShowerHead,
  "Wi-Fi": Wifi,
  Television: Tv,
  "Bath Tub": Bath,
  Laggage: Luggage,
  "Tea Maker": Coffee,
  "Room AC": Snowflake,
};

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "").trim();
}

function truncateWords(text = "", limit = 18) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) return text;
  return `${words.slice(0, limit).join(" ")}…`;
}

function getPriceList(item) {
  return item?.prices?.[0]?.prices || [];
}

function getMainPrice(priceList) {
  return (
    priceList.find((p) => p.type === "02 Pax") ||
    priceList.find((p) => p.type === "01 Pax") ||
    null
  );
}

function getOccupancyLabel(priceList) {
  if (priceList.some((p) => p.type === "02 Pax")) return "02 Pax";
  if (priceList.some((p) => p.type === "01 Pax")) return "01 Pax";
  return null;
}

export default function FeaturedRoomsSection({ rooms = [] }) {
  if (!rooms.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {rooms.map((item, idx) => {
          const imageUrl = item.mainPhoto?.url || "/placeholder.png";
          const priceList = getPriceList(item);
          const mainPrice = getMainPrice(priceList);
          const occupancy = getOccupancyLabel(priceList);
          const hasExtraBed = priceList.some((p) => p.type === "Extra Bed");
          const description = truncateWords(stripHtml(item.paragraph || ""));
          const amenities = (item.amenities || []).filter(
            (am) => amenityIcons[am.label]
          );

          return (
              <Link
                key={item._id || idx}
                href={`/hotel/${item.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-colors duration-[var(--duration-fast)] hover:border-heading/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-border">
                  <Image
                    src={imageUrl ||"/"}
                    alt={item.title || "Room"}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-smooth)] group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-5 p-5">
                  <div className="flex flex-col gap-3">
                    {description ? (
                      <p className="font-body text-sm leading-relaxed text-foreground line-clamp-3">
                        {description}
                      </p>
                    ) : null}

                    {amenities.length > 0 ? (
                      <div>
                        <p className="mb-2 font-ui text-[10px] uppercase tracking-[0.2em] text-black">
                          Amenities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {amenities.slice(0, 6).map((am, i) => {
                            const Icon = amenityIcons[am.label];
                            return (
                              <span
                                key={am._id || i}
                                title={am.label}
                                className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted"
                              >
                                <Icon
                                  className="size-3.5"
                                  strokeWidth={1.5}
                                  aria-hidden="true"
                                />
                                <span className="sr-only">{am.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-ui text-xs text-black">
                      {occupancy ? (
                        <span>Max occupancy: {occupancy}</span>
                      ) : null}
                      <span>
                        Extra bed: {hasExtraBed ? "Available" : "No"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
                    <div>
                      <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted">
                        Per night
                      </p>
                      <p className="mt-1 font-body text-sm text-heading">
                        {mainPrice?.amount != null
                          ? `₹ ${mainPrice.amount}`
                          : "On request"}
                        {mainPrice?.oldPrice ? (
                          <span className="ml-2 text-muted line-through">
                            ₹ {mainPrice.oldPrice}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <span className="inline-flex border border-black rounded-full px-4 py-2 items-center gap-1 font-ui text-xs uppercase tracking-[0.15em] text-primary transition-colors duration-fast group-hover:text-primary-hover">
                      Details
                      <ArrowUpRight
                        className="size-3.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
          );
        })}
    </div>
  );
}
