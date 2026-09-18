"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Building2,
  FileSearch,
  Headset,
  IndianRupee,
  MapPin,
  Sparkles,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HOW_IT_WORKS_FALLBACK_IMAGE = "/yoga.png";

const HOW_IT_WORKS_STEPS = [
  {
    icon: FileSearch,
    title: "Choose your stay",
    description:
      "Browse rooms and packages, then share your dates so we can check what's available for you.",
    tone: "bg-[color-mix(in_srgb,var(--error)_32%,white)]",
    iconTone: "text-[var(--error)]",
  },
  {
    icon: WalletCards,
    title: "Confirm & pay",
    description:
      "Review the plan with our team and secure your booking with a simple confirmation deposit.",
    tone: "bg-[color-mix(in_srgb,var(--warning)_38%,white)]",
    iconTone: "text-[var(--warning)]",
  },
  {
    icon: UserRoundCheck,
    title: "Arrive & unwind",
    description:
      "Get your confirmation details and arrive knowing your stay is ready when you are.",
    tone: "bg-[color-mix(in_srgb,var(--success)_34%,white)]",
    iconTone: "text-[var(--success)]",
  },
];

export function CtaSection() {
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [howItWorksImage, setHowItWorksImage] = useState(
    HOW_IT_WORKS_FALLBACK_IMAGE,
  );

  useEffect(() => {
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

    const fetchHowItWorksImage = async () => {
      try {
        const res = await fetch("/api/philosophyBanner");
        const result = await res.json();
        const url = result?.data?.ctaHowItWorksImage?.url;
        if (result?.success && url) {
          setHowItWorksImage(url);
        }
      } catch {
        /* keep fallback */
      }
    };

    fetchOffers();
    fetchHowItWorksImage();
  }, []);
  const showOffers = offersLoading || featuredOffers.length > 0;

  return (
    <>
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
                Trusted stays in and around Rishikesh — transparent booking, a
                light deposit, and the quiet assurance that someone has already
                held the room for you.
              </p>
            </div>

            {offersLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-l-2xl rounded-r-[2.5rem] border border-heading/20 bg-surface"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <Skeleton className="h-52 w-full rounded-none sm:h-64 sm:w-[42%]" />
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <Skeleton className="h-7 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="mt-auto h-11 w-full rounded-button" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Carousel
                opts={{ align: "start", loop: featuredOffers.length > 2 }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {featuredOffers.map((item) => {
                    const destination =
                      item.propertySubDestination || item.subDestination;
                    const priceLabel = item.price
                      ? String(item.price).trim().startsWith("₹")
                        ? item.price
                        : `₹ ${item.price}`
                      : "On request";

                    return (
                      <CarouselItem
                        key={item._id || item.propertyName}
                        className="basis-full pl-4 md:basis-1/2"
                      >
                        <article className="h-full overflow-hidden rounded-l-2xl rounded-r-[2.5rem] border border-heading/25 bg-surface">
                          <div className="flex h-full flex-col sm:flex-row sm:items-stretch">
                            <div className="relative h-52 w-full shrink-0 overflow-hidden bg-border sm:h-auto sm:min-h-64 sm:w-[42%]">
                              {item.image?.url ? (
                                <Image
                                  src={item.image.url}
                                  alt={
                                    item.propertyName ||
                                    item.title ||
                                    "Featured stay"
                                  }
                                  fill
                                  sizes="(max-width: 768px) 100vw, 25vw"
                                  className="object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                                />
                              ) : null}
                            </div>

                            <div className="flex flex-1 flex-col justify-between gap-5 p-5 md:p-6">
                              <div>
                                <h3 className="font-heading text-xl leading-snug text-heading md:text-2xl">
                                  {item.propertyName || "Featured stay"}
                                </h3>

                                <ul className="mt-4 flex flex-col gap-2.5">
                                  {destination ? (
                                    <li className="flex items-start gap-2.5 font-body text-sm text-foreground">
                                      <MapPin
                                        className="mt-0.5 size-4 shrink-0 text-primary"
                                        strokeWidth={1.75}
                                        aria-hidden="true"
                                      />
                                      <span>
                                        <span className="font-medium text-heading">
                                          Destination:{" "}
                                        </span>
                                        {destination}
                                      </span>
                                    </li>
                                  ) : null}
                                  <li className="flex items-start gap-2.5 font-body text-sm text-foreground">
                                    <Building2
                                      className="mt-0.5 size-4 shrink-0 text-primary"
                                      strokeWidth={1.75}
                                      aria-hidden="true"
                                    />
                                    <span>
                                      <span className="font-medium text-heading">
                                        Package Type:{" "}
                                      </span>
                                      {item.propertyType || "Stay"}
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-2.5 font-body text-sm text-foreground">
                                    <IndianRupee
                                      className="mt-0.5 size-4 shrink-0 text-primary"
                                      strokeWidth={1.75}
                                      aria-hidden="true"
                                    />
                                    <span>
                                      <span className="font-medium text-heading">
                                        Package Price:{" "}
                                      </span>
                                      {priceLabel}
                                    </span>
                                  </li>
                                </ul>
                              </div>

                              <Link
                                href={item.buttonLink || "#"}
                                target={item.buttonLink ? "_blank" : undefined}
                                rel={
                                  item.buttonLink
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-button border border-heading/30 bg-background px-7 font-body text-sm text-heading transition-colors duration-(--duration-fast) hover:border-heading/50 hover:bg-surface"
                              >
                                View Details
                                <ArrowUpRight
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </Link>
                            </div>
                          </div>
                        </article>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {featuredOffers.length > 2 ? (
                  <>
                    <CarouselPrevious className="left-2 size-10 border-border bg-surface text-heading shadow-none hover:bg-background md:-left-4" />
                    <CarouselNext className="right-2 size-10 border-border bg-surface text-heading shadow-none hover:bg-background md:-right-4" />
                  </>
                ) : null}
              </Carousel>
            )}
          </Container>
        </Section>
      )}
      <Section spacing="sm" className="border-b border-border bg-background">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            {/* Left: arched visual + help card */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <Sparkles
                className="absolute -left-1 top-10 z-10 size-5 text-heading md:left-2 md:top-14"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <Sparkles
                className="absolute right-6 top-2 z-10 size-4 text-heading md:right-10 md:top-4 md:size-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <div className="relative mx-auto w-[85%] max-w-sm sm:w-[78%]">
                <div className="relative aspect-3/4 overflow-hidden rounded-t-[999px] rounded-b-3xl bg-border">
                  <Image
                    src={howItWorksImage}
                    alt="Guests enjoying their stay"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 80vw, 28vw"
                  />
                </div>

                <div className="absolute bottom-50 -left-5 z-10 w-[55%] max-w-[14rem] -translate-x-1/2 overflow-hidden border border-white shadow-sm sm:bottom-12 sm:w-[48%] sm:max-w-[15rem]">
                  <div className="relative aspect-square">
                    <Image
                      src="/ctas-small.jpeg"
                      alt="Guests checking in at reception"
                      fill
                      className="object-cover object-[center_65%]"
                      sizes="240px"
                    />
                  </div>
                </div>
              </div>

              {/* Floating help card */}
              <div className="relative z-20 mx-auto -mt-16 w-[min(100%,18rem)] rounded-card border border-border bg-surface p-5 shadow-sm sm:absolute sm:bottom-4 sm:right-0 sm:mx-0 sm:mt-0 sm:w-56 md:right-2 lg:right-0">
                <div className="flex size-10 items-center justify-center rounded-full border border-primary/25 bg-background text-primary">
                  <Headset className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-heading text-lg text-heading">
                  Need Help?
                </h3>
                <p className="mt-2 font-body text-xs leading-relaxed text-muted-foreground">
                  Our support team is here to guide you through your booking,
                  any time you need us.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-button bg-primary px-5 font-body text-sm text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right: steps */}
            <div>
              <h2 className="max-w-md font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                How it works in{" "}
                <em className="italic text-primary">3 simple steps</em>
              </h2>

              <ol className="mt-8 flex flex-col gap-4">
                {HOW_IT_WORKS_STEPS.map(
                  ({ icon: Icon, title, description, tone, iconTone }) => (
                    <li
                      key={title}
                      className={`flex items-start gap-4 rounded-card p-5 md:gap-5 md:p-6 ${tone}`}
                    >
                      <span
                        className={`flex size-12 shrink-0 items-center justify-center rounded-full border border-gray-500 bg-surface shadow-sm ${iconTone}`}
                      >
                        <Icon
                          className="size-5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="font-heading text-lg leading-snug text-black md:text-xl">
                          {title}
                        </h3>
                        <p className="mt-2 font-body text-sm leading-relaxed text-black">
                          {description}
                        </p>
                      </div>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
