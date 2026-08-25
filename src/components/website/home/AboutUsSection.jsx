"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock, Sparkles } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutUsSection() {
  const [offerDetails, setOfferDetails] = useState(null);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {


    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/bannerSection1st");
        const data = await response.json();
        setBanners(Array.isArray(data) ? data : []);
      } catch {
        setBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/offerDetails");
        const data = await response.json();
        if (data) setOfferDetails(data);
      } catch {
        /* keep null — section hidden without CMS data */
      }
    };

    fetchBanners();
    fetchOffers();
  }, []);

  const hasText = (value) => typeof value === "string" && value.trim().length > 0;
  const lastMinuteDeal = offerDetails?.lastMinuteDeal;
  const promoBanner = offerDetails?.promoBanner;
  const showLastMinuteDeal =
    lastMinuteDeal &&
    (hasText(lastMinuteDeal.heading) ||
      hasText(lastMinuteDeal.description) ||
      hasText(lastMinuteDeal.link));
  const showPromoBanner =
    promoBanner &&
    (hasText(promoBanner.description) || hasText(promoBanner.link));
  const hasOffers = showLastMinuteDeal || showPromoBanner;
  const showBanners = bannersLoading || banners.length > 0;

  return (
    <>
      {hasOffers && (
        <Section spacing="sm" className="bg-background pt-0">
          <Container>
            <div className="flex flex-col gap-4">
              {showLastMinuteDeal && (
                <div className="flex flex-col items-start justify-between gap-6 rounded-card border border-border bg-surface px-6 py-6 sm:flex-row sm:items-center sm:px-8">
                  <div className="flex items-start gap-5 sm:items-center">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                      <Clock
                        className="size-5 text-primary"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      {hasText(lastMinuteDeal.heading) ? (
                        <h4 className="font-heading text-xl text-heading md:text-2xl">
                          {lastMinuteDeal.heading}
                        </h4>
                      ) : null}
                      {hasText(lastMinuteDeal.description) ? (
                        <p className="mt-1.5 font-body text-sm leading-relaxed text-muted">
                          {lastMinuteDeal.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {hasText(lastMinuteDeal.link) ? (
                    <Link
                      href={lastMinuteDeal.link}
                      className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-button border border-border bg-background px-7 font-body text-sm text-heading transition-colors duration-300 hover:border-heading/30 hover:bg-background sm:w-auto"
                    >
                      Know more
                      <ArrowUpRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : null}
                </div>
              )}

              {showPromoBanner && (
                <div className="flex flex-col items-start justify-between gap-6 rounded-card border border-border bg-surface px-6 py-6 sm:flex-row sm:items-center sm:px-8">
                  <div className="flex items-start gap-5 sm:items-center">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                      <Sparkles
                        className="size-5 text-primary"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    {hasText(promoBanner.description) ? (
                      <p className="font-body text-sm leading-relaxed text-foreground md:text-base">
                        {promoBanner.description}
                      </p>
                    ) : null}
                  </div>
                  {hasText(promoBanner.link) ? (
                    <Link
                      href={promoBanner.link}
                      className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-button bg-primary px-7 font-body text-sm text-primary-foreground transition-colors duration-300 hover:bg-primary-hover sm:w-auto"
                    >
                      Apply
                      <ArrowUpRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      {showBanners && (
        <section className="w-full bg-background">
          {bannersLoading ? (
            <Skeleton className="h-[400px] px-2 w-full rounded-none md:h-[430px]" />
          ) : (
            <div className="flex w-full flex-col">
              {banners.map((item) => (
                <Link
                  key={item._id}
                  href={item.buttonLink || "#"}
                  target={item.buttonLink ? "_blank" : undefined}
                  rel={item.buttonLink ? "noopener noreferrer" : undefined}
                  className="group relative block w-full overflow-hidden bg-border"
                >
                  {/* Desktop */}
                  <div className="relative hidden h-[430px] w-full md:block">
                    {item.image?.url ? (
                      <Image
                        src={item.image.url}
                        alt={item.title || "Promotional banner"}
                        fill
                        sizes="100vw"
                        className="object-cover object-center transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                  {/* Mobile */}
                  <div className="relative h-[330px] px-1 w-full md:hidden">
                    {(item.mobileImage?.url || item.image?.url) ? (
                      <Image
                        src={item.mobileImage?.url || item.image.url}
                        alt={item.title || "Promotional banner"}
                        fill
                        sizes="100vw"
                        className="object-cover object-center transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
