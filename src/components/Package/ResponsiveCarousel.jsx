"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarClock, ArrowUpRight } from "lucide-react";

const ResponsiveCarousel = ({ packages, formatNumericStr }) => {
  const formatNumeric = new Function("return " + formatNumericStr)();

  if (!Array.isArray(packages) || packages.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      <Carousel
        opts={{ align: "start", loop: false }}
        className="mx-auto w-full max-w-[1280px]"
      >
        <CarouselContent className="-ml-4">
          {packages.map((item, index) => (
            <CarouselItem
              key={item?._id || item?.slug || index}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-border/50">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={
                      item?.basicDetails?.thumbnail?.url || "/placeholder.png"
                    }
                    alt={item?.packageName || "Tour package image"}
                    fill
                    quality={50}
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-ui text-xs font-medium text-primary">
                    {item?.basicDetails?.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 shrink-0" />
                      {item?.basicDetails?.location || "—"}
                    </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3.5 shrink-0" />
                      {item?.basicDetails?.duration || 0} Days{" "}
                      {Math.max((item?.basicDetails?.duration || 1) - 1, 0)}{" "}
                      Nights
                    </span>
                  </div>

                  <h4 className="font-sans text-md font-medium leading-snug text-black line-clamp-2">
                    {item?.packageName || "Untitled package"}
                  </h4>

                  <div className="line-clamp-2 min-h-[4rem] font-body text-sm text-muted">
                    {typeof item?.basicDetails?.smallDesc === "string" &&
                    item.basicDetails.smallDesc.trim() ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.basicDetails.smallDesc,
                        }}
                      />
                    ) : (
                      <span>No description available</span>
                    )}
                  </div>

                  <div className="mt-auto flex w-full items-center justify-center gap-3 pt-4">
                    {/* <div className="min-w-0">
                      <p className="font-ui text-[11px] uppercase tracking-[0.08em] text-muted">
                        Starting from
                      </p>
                      <p className="font-heading text-xl font-medium text-heading">
                        {item?.price === 0 ? (
                          "XXXX*"
                        ) : (
                          <>
                            ₹{formatNumeric(item?.price)}
                            <span className="text-base">*</span>
                          </>
                        )}
                      </p>
                      <p className="font-ui text-xs text-muted">Onwards</p>
                    </div> */}
                    <Link
                      href={`/package/${item.slug}`}
                      className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-button border border-border px-5 font-body text-sm transition-colors bg-foreground text-white hover:border-heading/40 w-full"
                    >
                      View Details
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          variant="default"
          size="icon"
          className="top-1/2 left-0 z-10 size-10 -translate-y-1/2 rounded-full border border-black bg-white text-black shadow-sm hover:bg-primary-hover disabled:opacity-40 md:-left-3"
        />
        <CarouselNext
          variant="default"
          size="icon"
          className="top-1/2 right-0 z-10 size-10 -translate-y-1/2 rounded-full border border-black bg-white text-black shadow-sm hover:bg-primary-hover disabled:opacity-40 md:-right-3"
        />
      </Carousel>
    </div>
  );
};

export default ResponsiveCarousel;
