"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/common/Section";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function PromotionalBannersSection() {
  const [promotionalBanners, setPromotionalBanners] = useState([]);
  const [promoLoading, setPromoLoading] = useState(true);

  useEffect(() => {
    const fetchPromotional = async () => {
      try {
        const res = await fetch("/api/addPromotinalBanner");
        if (!res.ok) {
          setPromotionalBanners([]);
          return;
        }
        const data = await res.json();
        setPromotionalBanners(Array.isArray(data) ? data : []);
      } catch {
        setPromotionalBanners([]);
      } finally {
        setPromoLoading(false);
      }
    };

    fetchPromotional();
  }, []);

  const showPromo = promoLoading || promotionalBanners.length > 0;
  if (!showPromo) return null;

  return (
    <Section spacing="xs" className="bg-background w-full">
      <div className="mx-auto w-full max-w-[2000px] px-2 md:px-8 lg:px-12">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="font-ui text-xs uppercase tracking-[0.25em] text-gray-600">
            Discover
          </p>
          <h2 className="mt-4 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
            Quiet invitations to{" "}
            <em className="italic text-primary">pause</em>.
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-base leading-[1.9] text-foreground">
            A few curated openings — for the days you want stillness, soft
            light, and nothing asking more of you than presence.
          </p>
        </div>

        {promoLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="aspect-16/10 w-full rounded-md md:rounded-image"
              />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: promotionalBanners.length > 2,
            }}
            className="relative w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {promotionalBanners.map((item) => (
                <CarouselItem
                  key={item._id || item.title}
                  className="basis-full pl-4 md:basis-1/3 md:pl-6"
                >
                  <Link
                    href={item.buttonLink || "#"}
                    target={item.buttonLink ? "_blank" : undefined}
                    rel={item.buttonLink ? "noopener noreferrer" : undefined}
                    className="group relative block aspect-16/10 w-full overflow-hidden rounded-image bg-border"
                  >
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.title || "Promotional banner"}
                        className="block h-full w-full object-cover transition-transform duration-slow ease-smooth group-hover:scale-[1.03]"
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-end bg-image-dark/40 opacity-0 transition-opacity duration-(--duration-medium) group-hover:opacity-100">
                      <span className="m-5 inline-flex items-center gap-1.5 font-ui text-xs uppercase tracking-[0.2em] text-white">
                        Explore
                        <ArrowUpRight
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 size-10 border border-black bg-white text-black shadow-none hover:bg-white md:-left-3" />
            <CarouselNext className="right-1 size-10 border border-black bg-white text-black shadow-none hover:bg-white md:-right-3" />
          </Carousel>
        )}
      </div>
    </Section>
  );
}
