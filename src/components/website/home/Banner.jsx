"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Banner() {
  const [promotionalBanners, setPromotionalBanners] = useState([]);
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [bannerSection2nd, setBannerSection2nd] = useState([]);
  const [promoLoading, setPromoLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {
    const fetchPromotional = async () => {
      try {
        const res = await fetch("/api/addPromotinalBanner");
        const data = await res.json();
        setPromotionalBanners(Array.isArray(data) ? data : []);
      } catch {
        setPromotionalBanners([]);
      } finally {
        setPromoLoading(false);
      }
    };

    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/addFeaturedOffer");
        const data = await res.json();
        setFeaturedOffers(Array.isArray(data) ? data : []);
      } catch {
        setFeaturedOffers([]);
      } finally {
        setOffersLoading(false);
      }
    };

    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/bannerSection2nd");
        const data = await response.json();
        setBannerSection2nd(Array.isArray(data) ? data : []);
      } catch {
        setBannerSection2nd([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchPromotional();
    fetchOffers();
    fetchBanners();
  }, []);

  const showPromo = promoLoading || promotionalBanners.length > 0;
  const showOffers = offersLoading || featuredOffers.length > 0;
  const showBanners = bannersLoading || bannerSection2nd.length > 0;

  return (
    <>
      {showPromo && (
        <Section spacing="sm" className="bg-background w-full">
          <div className="mx-auto w-full max-w-[2000px] px-2 md:px-8 lg:px-12">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-gray-600">
                Discover
              </p>
              <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                Quiet invitations to{" "}
                <em className="italic text-primary">pause</em>.
              </h2>
              <p className="mx-auto mt-5 max-w-lg font-body text-base leading-[1.9] text-foreground">
                A few curated openings — for the days you want stillness,
                soft light, and nothing asking more of you than presence.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8 w-full">
              {promoLoading
                ? Array.from({ length: 2 }).map((_, idx) => (
                  <Skeleton
                    key={idx}
                    className="w-full aspect-[16/9] rounded-md md:rounded-image"
                  />
                ))
                : promotionalBanners.map((item) => (
                  <Link
                    key={item._id || item.title}
                    href={item.buttonLink || "#"}
                    target={item.buttonLink ? "_blank" : undefined}
                    rel={item.buttonLink ? "noopener noreferrer" : undefined}
                    className="group relative block w-full aspect-[16/9] overflow-hidden rounded-image bg-border"
                  >
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.title || "Promotional banner"}
                        className="block w-full h-full object-fill transition-transform duration-slow ease-smooth group-hover:scale-[1.03]"
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-end bg-image-dark/40 opacity-0 transition-opacity duration-[var(--duration-medium)] group-hover:opacity-100">
                      <span className="m-6 inline-flex items-center gap-1.5 font-ui text-xs uppercase tracking-[0.2em] text-white">
                        Explore
                        <ArrowUpRight
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </Section>
      )}

      {showOffers && (
        <Section spacing="sm" className="bg-background">
          <Container>
            <div className="mb-12 max-w-2xl">
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
                Stay with us
              </p>
              <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                Spaces shaped for{" "}
                <em className="italic text-primary">stillness</em>.
              </h2>
              <p className="mt-5 max-w-xl font-body text-base leading-[1.9] text-foreground">
                Trusted stays in and around Rishikesh — transparent booking,
                a light deposit, and the quiet assurance that someone has
                already held the room for you.
              </p>
            </div>

            {offersLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    <Skeleton className="aspect-[4/3] w-full rounded-[var(--radius-image)]" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <Carousel
                opts={{ align: "start", loop: false }}
                className="w-full"
              >
                <CarouselContent className="">
                  {featuredOffers.map((item) => (
                    <CarouselItem
                      key={item._id || item.propertyName}
                      className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 px-2"
                    >
                      <Link
                        href={item.buttonLink || "#"}
                        target={item.buttonLink ? "_blank" : undefined}
                        rel={
                          item.buttonLink ? "noopener noreferrer" : undefined
                        }
                        className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-colors duration-[var(--duration-fast)] hover:border-heading/20"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-border">
                          {item.image?.url ? (
                            <Image
                              src={item.image.url}
                              alt={
                                item.propertyName ||
                                item.title ||
                                "Featured stay"
                              }
                              fill
                              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.03]"
                            />
                          ) : null}
                          {item.subDestination ? (
                            <span className="absolute left-4 top-4 font-ui text-[10px] uppercase tracking-[0.2em] text-white">
                              <span className="rounded-[var(--radius-button)] border border-white/20 bg-image-dark/50 px-3 py-1.5 backdrop-blur-[2px]">
                                {item.subDestination}
                              </span>
                            </span>
                          ) : null}
                        </div>

                        <div className="flex flex-1 flex-col justify-between gap-5 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-heading text-xl leading-snug text-heading line-clamp-2">
                              {item.propertyName}
                            </h3>
                            {item.propertyType ? (
                              <span className="shrink-0 font-ui text-[10px] uppercase tracking-[0.15em] text-muted">
                                {item.propertyType}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
                            <div>
                              <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted">
                                From
                              </p>
                              <p className="mt-1 font-body text-sm text-heading">
                                {item.price
                                  ? `₹ ${item.price}`
                                  : "On request"}
                              </p>
                            </div>
                            <span className="inline-flex items-center gap-1 font-ui text-xs uppercase tracking-[0.15em] text-primary transition-colors duration-[var(--duration-fast)] group-hover:text-primary-hover">
                              Details
                              <ArrowUpRight
                                className="size-3.5"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 size-10 border-border bg-surface text-heading shadow-none hover:bg-background xl:-left-5" />
                <CarouselNext className="right-2 size-10 border-border bg-surface text-heading shadow-none hover:bg-background xl:-right-5" />
              </Carousel>
            )}
          </Container>
        </Section>
      )}

      {showBanners && (
        <Section spacing="sm" className="bg-background w-full">
          <div className="w-full">
            {bannersLoading ? (
              <Skeleton className="h-[400px] px-2 w-full rounded-none md:h-[430px]" />
            ) : (
              <div className="flex flex-col gap-8 w-full">
                {bannerSection2nd.map((item) => (
                 <Link
                  key={item._id}
                  href={item.buttonLink || "#"}
                  target={item.buttonLink ? "_blank" : undefined}
                  rel={item.buttonLink ? "noopener noreferrer" : undefined}
                  className="group relative block w-full overflow-hidden bg-border"
                >
                  <div className="relative hidden h-[300px] md:h-[430px] w-full md:block">
                    {item.image?.url ? (
                      <Image
                        src={item.image.url}
                        alt={item.title || "Promotional banner"}
                        fill
                        sizes="100vw"
                        className="object-cover object-center transition-transform duration-[var(--duration-slow)] ease-[var(--ease-smooth)] group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                  <div className="relative h-[340px] w-full md:hidden">
                    {(item.mobileImage?.url || item.image?.url) ? (
                      <Image
                        src={item.mobileImage?.url || item.image.url}
                        alt={item.title || "Promotional banner"}
                        fill
                        sizes="100vw"
                        className="object-cover object-center transition-transform duration-[var(--duration-slow)] ease-[var(--ease-smooth)] group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                </Link>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}
    </>
  );
}
