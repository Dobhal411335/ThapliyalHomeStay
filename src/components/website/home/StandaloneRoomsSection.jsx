"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  ChevronRight,
  Users,
} from "lucide-react";

function truncateHtmlByWords(html = "", wordLimit = 28) {
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
  if (words.length <= wordLimit) return text;

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

  const fromPrice =
    [singlePrice, doublePrice]
      .filter((value) => value != null && value !== "" && Number(value) > 0)
      .map(Number)
      .sort((a, b) => a - b)[0] ?? null;

  const personCount = doublePrice != null ? 2 : singlePrice != null ? 1 : null;
  const hasExtraBed = priceRows.some((p) => p.type === "Extra Bed");

  const features = [];
  if (personCount != null) {
    features.push({
      icon: Users,
      label: `${personCount} ${personCount === 1 ? "Person" : "Persons"}`,
    });
  }
  if (hasExtraBed) {
    features.push({
      icon: BedDouble,
      label: "Extra Bed",
    });
  }

  return {
    title: nested?.name || item?.title || "Room",
    slug: item?.slug || "",
    description: truncateHtmlByWords(
      nested?.paragraph || item?.paragraph || item?.heading || "",
    ),
    image: gallery[0] || null,
    fromPrice,
    features,
  };
}

function StandaloneRoomCard({ item }) {
  const room = getRoomCardData(item);
  if (!room.slug) return null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-colors hover:border-heading/20">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-border">
        {room.image ? (
          <Image
            src={room.image}
            alt={room.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center font-body text-sm text-muted">
            No image
          </div>
        )}

        {room.fromPrice != null ? (
          <div className="absolute left-3 top-3 rounded-lg bg-surface px-3 py-1.5 shadow-sm">
            <p className="font-ui text-[10px] uppercase tracking-[0.12em] text-muted">
              From
            </p>
            <p className="font-heading text-lg leading-none text-heading">
              {formatPrice(room.fromPrice)}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-5">
        {room.features.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {room.features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 font-body text-xs text-heading"
              >
                <Icon
                  className="size-3.5 text-primary"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {label}
              </span>
            ))}
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="font-heading text-xl leading-snug text-heading md:text-2xl">
            {room.title}
          </h3>
          {room.description ? (
            <p className="font-body text-sm leading-relaxed text-muted-foreground">
              {room.description}
            </p>
          ) : null}
        </div>

        <Link
          href={`/room/${room.slug}`}
          className="mt-auto flex w-full overflow-hidden rounded-xl border border-border"
        >
          <span className="flex flex-1 items-center justify-center bg-white px-4 py-3 font-ui text-xs font-semibold uppercase tracking-[0.14em] text-black transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            Book Your Stay Now
          </span>
          <span className="flex w-12 items-center justify-center border-l border-border bg-white text-black transition-colors duration-300 group-hover:border-primary-hover group-hover:bg-primary-hover group-hover:text-primary-foreground">
            <ChevronRight className="size-5" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </article>
  );
}

export default function StandaloneRoomsSection({ rooms = [] }) {
  if (!rooms.length) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
      {rooms.map((item, idx) => (
        <StandaloneRoomCard key={item._id || idx} item={item} />
      ))}
    </div>
  );
}
