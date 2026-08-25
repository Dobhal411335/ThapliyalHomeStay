"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getHotelAmenityIcon } from "@/lib/hotelAmenityIcons";

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateWords(text = "", limit = 18) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) return text;
  return `${words.slice(0, limit).join(" ")}…`;
}

function getPriceList(item) {
  if (Array.isArray(item?.prices?.[0]?.prices)) return item.prices[0].prices;
  if (Array.isArray(item?.prices) && item.prices[0]?.type != null) {
    return item.prices;
  }
  return [];
}

function getMainPrice(priceList, nestedRooms = []) {
  const fromList =
    priceList.find((p) => p.type === "02 Pax") ||
    priceList.find((p) => p.type === "01 Pax") ||
    null;
  if (fromList?.amount != null) return fromList;

  let lowest = null;
  for (const room of nestedRooms) {
    const double = Number(room?.doubleOccupancyPrice);
    const single = Number(room?.singleOccupancyPrice);
    const amount =
      Number.isFinite(double) && double > 0
        ? double
        : Number.isFinite(single) && single > 0
          ? single
          : null;
    if (amount == null) continue;
    if (lowest == null || amount < lowest.amount) {
      lowest = {
        amount,
        type:
          Number.isFinite(double) && double > 0 && amount === double
            ? "02 Pax"
            : "01 Pax",
      };
    }
  }
  return lowest;
}

function getOccupancyLabel(priceList, nestedRooms = [], mainPrice) {
  if (priceList.some((p) => p.type === "02 Pax")) return "02 Pax";
  if (priceList.some((p) => p.type === "01 Pax")) return "01 Pax";
  if (mainPrice?.type) return mainPrice.type;
  if (nestedRooms.some((r) => Number(r?.doubleOccupancyPrice) > 0)) {
    return "02 Pax";
  }
  if (nestedRooms.some((r) => Number(r?.singleOccupancyPrice) > 0)) {
    return "01 Pax";
  }
  return null;
}

function getHotelImage(item, nestedRooms = []) {
  if (item?.mainPhoto?.url) return item.mainPhoto.url;
  for (const room of nestedRooms) {
    if (room?.mainPhoto?.url) return room.mainPhoto.url;
    const related = room?.relatedPhotos?.find((img) => img?.url)?.url;
    if (related) return related;
  }
  const relatedHotel = item?.relatedPhotos?.find((img) => img?.url)?.url;
  return relatedHotel || "/placeholder.png";
}

function getHotelDescription(item, nestedRooms = []) {
  const sources = [
    item?.paragraph,
    item?.heading,
    ...nestedRooms.map((room) => room?.paragraph),
  ];
  for (const source of sources) {
    const text = truncateWords(stripHtml(source || ""));
    if (text) return text;
  }
  return "";
}

function formatPrice(amount) {
  return `₹${new Intl.NumberFormat("en-IN").format(Number(amount) || 0)}`;
}

export default function FeaturedRoomsSection({ rooms = [] }) {
  if (!rooms.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {rooms.map((item, idx) => {
        const nestedRooms = Array.isArray(item?.rooms) ? item.rooms : [];
        const imageUrl = getHotelImage(item, nestedRooms);
        const priceList = getPriceList(item);
        const mainPrice = getMainPrice(priceList, nestedRooms);
        const occupancy = getOccupancyLabel(priceList, nestedRooms, mainPrice);
        const hasExtraBed = priceList.some((p) => p.type === "Extra Bed");
        const description = getHotelDescription(item, nestedRooms);
        const amenities = Array.isArray(item?.amenities) ? item.amenities : [];

        return (
          <Link
            key={item._id || idx}
            href={`/hotel/${item.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-colors duration-[var(--duration-fast)] hover:border-heading/20"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-border">
              <Image
                src={imageUrl}
                alt={item.title || "Hotel"}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-smooth)] group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-5 p-5">
              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-xl font-medium text-heading line-clamp-2">
                  {item.title || "Hotel"}
                </h3>

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
                        const label = am?.label || am;
                        const Icon = getHotelAmenityIcon(label);
                        return (
                          <span
                            key={am?._id || `${label}-${i}`}
                            title={label}
                            className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted"
                          >
                            <Icon
                              className="size-3.5"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            <span className="sr-only">{label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-x-4 gap-y-1 font-ui text-xs text-black">
                  {occupancy ? <span>Max occupancy: {occupancy}</span> : null}
                  <span>Extra bed: {hasExtraBed ? "Available" : "No"}</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
                <div>
                  <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted">
                    Per night
                  </p>
                  <p className="mt-1 font-body text-sm text-heading">
                    {mainPrice?.amount != null
                      ? formatPrice(mainPrice.amount)
                      : "On request"}
                    {mainPrice?.oldPrice ? (
                      <span className="ml-2 text-muted line-through">
                        {formatPrice(mainPrice.oldPrice)}
                      </span>
                    ) : null}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-black px-4 py-2 font-ui text-xs uppercase tracking-[0.15em] text-primary transition-colors duration-fast group-hover:text-primary-hover">
                  Details
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
