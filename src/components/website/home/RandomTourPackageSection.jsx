"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin, Star } from "lucide-react";

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

const DESC_WORD_LIMIT = 55;

function truncateHtmlByWords(html = "", wordLimit = DESC_WORD_LIMIT) {
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

export default function RandomTourPackageSection() {
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [bannerSection3rd, setBannerSection3rd] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [consultancyBanner, setConsultancyBanner] = useState([]);
  const [consultancyLoading, setConsultancyLoading] = useState(true);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [promotionalBanners, setPromotionalBanners] = useState([]);
  const [promoLoading, setPromoLoading] = useState(true);
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/getRandomPackages");
        const data = await res.json();
        setPackages(data.packages?.length ? data.packages : []);
      } catch {
        setPackages([]);
      } finally {
        setPackagesLoading(false);
      }
    };
    const fetchFeaturedPackages = async () => {
      try {
        const response = await fetch("/api/featured-packages");
        const data = await response.json();
        setFeaturedPackages(data.data || []);
      } catch {
        setFeaturedPackages([]);
      } finally {
        setPackagesLoading(false);
      }
    };
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
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/bannerSection3rd");
        const data = await response.json();
        setBannerSection3rd(Array.isArray(data) ? data : []);
      } catch {
        setBannerSection3rd([]);
      } finally {
        setBannersLoading(false);
      }
    };

    const fetchConsultancy = async () => {
      try {
        const res = await fetch("/api/addConsultancyBanner");
        const data = await res.json();
        setConsultancyBanner(Array.isArray(data) && data.length ? data : []);
      } catch {
        setConsultancyBanner([]);
      } finally {
        setConsultancyLoading(false);
      }
    };

    fetchPackages();
    fetchBanners();
    fetchConsultancy();
    fetchFeaturedPackages();
    fetchPromotional();
  }, []);

  const formatNumeric = (num) => new Intl.NumberFormat("en-IN").format(num);

  const showBanners = bannersLoading || bannerSection3rd.length > 0;
  const showPackages = packagesLoading || packages.length > 0;
  const showConsultancy = consultancyLoading || consultancyBanner.length > 0;
  const showFeaturedPackages = packagesLoading || featuredPackages.length > 0;
  const showPromo = promoLoading || promotionalBanners.length > 0;

  return (
    <>
      {showPackages && (
        <Section spacing="sm" className="bg-background overflow-hidden">
          <Container>
            <div className="mb-12">
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
                Journeys
              </p>
              <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                You Will
                <em className="italic text-primary"> Experience</em>.
              </h2>
              <p className="mt-5 font-body text-base leading-[1.9] text-foreground">
                Experience the joyful spirit of Rishikesh through yoga,
                meditation, and soulful adventures. Witness the sacred Ganga
                Aarti, explore waterfalls on refreshing hikes, connect with
                nature, meditate beside the Ganga, and immerse yourself in
                healing sound vibrations. A beautiful journey of movement,
                connection, inner peace, and unforgettable moments.
              </p>
            </div>

            {packagesLoading ? (
              <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded-card border border-border bg-white p-6 md:p-8"
                  >
                    <Skeleton className="mb-6 aspect-[4/3] w-full rounded-[var(--radius-image)]" />
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="mt-4 h-8 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                    <div className="mt-6 border-t border-border pt-6">
                      <Skeleton className="h-10 w-32" />
                    </div>
                    <Skeleton className="mt-8 h-10 w-full rounded-button" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-14 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((item) => {
                  const descriptionHtml = truncateHtmlByWords(
                    item?.basicDetails?.smallDesc ||
                    item?.basicDetails?.fullDesc ||
                    "",
                  );
                  const price = Number(item?.price);

                  return (
                    <article
                      key={item._id || item.slug}
                      className="group flex h-full flex-col rounded-card border border-border bg-white p-6"
                    >
                      <div className="relative mb-6 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-image bg-border">
                        <Image
                          src={
                            item?.basicDetails?.thumbnail?.url ||
                            "/placeholder.png"
                          }
                          alt={item?.packageName || "Tour package"}
                          fill
                          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                          quality={60}
                          className="object-cover object-center transition-transform duration-(--duration-slow) ease-(--ease-smooth) group-hover:scale-[1.03]"
                        />
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-sans text-[12px] uppercase tracking-[0.2em] text-black">
                            {item?.basicDetails?.duration
                              ? `${item.basicDetails.duration} Days`
                              : "Flexible"}
                          </span>
                          {Number.isFinite(price) ? (
                            <span className="shrink-0 font-heading text-lg font-medium text-heading">
                              {price === 0
                                ? "On enquiry"
                                : `₹${formatNumeric(price)}*`}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-2 font-sans text-xl text-black line-clamp-2">
                          {item.packageName}
                        </h3>
                        {item?.basicDetails?.location ? (
                          <p className="mt-1 flex items-center gap-1.5 font-body text-md italic text-black">
                            <MapPin className="size-3.5 shrink-0" />
                            {item.basicDetails.location}
                          </p>
                        ) : null}

                        {descriptionHtml ? (
                          <div
                            className="mt-3 line-clamp-4 font-body text-sm leading-relaxed text-muted [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0"
                            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                          />
                        ) : null}

                        <div className="mt-auto pt-8">
                          <Link
                            href={`/package/${item.slug}`}
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-button border border-gray-400 bg-foreground/10 px-5 font-body text-sm text-black transition-colors hover:border-heading/40 hover:bg-foreground hover:text-white"
                          >
                            View Details
                            <ArrowUpRight className="size-4" aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </Container>
        </Section>
      )}
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
      {showBanners && (
        <section className="w-full bg-background">
          {bannersLoading ? (
            <Skeleton className="h-[400px] px-2 w-full rounded-none md:h-[430px]" />
          ) : (
            <div className="flex w-full flex-col">
              {bannerSection3rd.map((item) => (
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
                  <div className="relative h-[500px] w-full md:hidden">
                    {item.mobileImage?.url || item.image?.url ? (
                      <Image
                        src={item.mobileImage?.url || item.image.url}
                        alt={item.title || "Promotional banner"}
                        fill
                        sizes="100vw"
                        className="object-cover object-contain transition-transform duration-[var(--duration-slow)] ease-[var(--ease-smooth)] group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {showFeaturedPackages && (
        <Section spacing="sm" className="bg-background">
          <Container>
            <div className="mb-12 max-w-xl">
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
                Featured
              </p>
              <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                Experiences worth{" "}
                <em className="italic text-primary">lingering</em> over.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-5 md:gap-8 lg:grid-cols-4">
              {packagesLoading
                ? Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    <Skeleton className="md:aspect-4/5 aspect-3/4 w-full md:rounded-image rounded-md" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                ))
                : featuredPackages.map((item) => (
                  <Link
                    key={item._id}
                    href={item.link || "#"}
                    className="group flex flex-col gap-4"
                  >
                    <div className="relative md:aspect-4/5 aspect-3/4 w-full overflow-hidden md:rounded-image rounded-md bg-border">
                      {item.image?.url ? (
                        <Image
                          src={item.image.url}
                          alt={item.title || "Featured experience"}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.03]"
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-end bg-image-dark/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="m-5 inline-flex items-center gap-1.5 font-ui text-xs uppercase tracking-[0.2em] text-white">
                          View
                          <ArrowUpRight
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                    <h3 className="font-heading text-xl leading-snug text-heading transition-colors duration-300 group-hover:text-primary md:text-2xl">
                      {item.title}
                    </h3>
                  </Link>
                ))}
            </div>
          </Container>
        </Section>
      )}

      {showConsultancy && (
        <Section spacing="sm" className="bg-background overflow-hidden">
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
                Guidance
              </p>
              <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                Rooted in <em className="italic text-primary">authenticity</em>.
              </h2>
              <p className="mx-auto mt-5 max-w-lg font-body text-base leading-[1.9] text-foreground">
                Thoughtful guidance shaped by tradition — never hurried, never
                mass-produced. Space to ask, listen, and arrive at your own
                pace.
              </p>
            </div>

            {consultancyLoading ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Skeleton className="aspect-[4/3] w-full rounded-[var(--radius-image)] lg:min-h-[420px]" />
                <Skeleton className="min-h-[320px] w-full rounded-[var(--radius-card)]" />
              </div>
            ) : (
              <Carousel
                opts={{ align: "start", loop: consultancyBanner.length > 1 }}
                className="w-full"
              >
                <CarouselContent>
                  {consultancyBanner.map((item, idx) => (
                    <CarouselItem key={item._id || idx} className="w-full">
                      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
                        <div className="relative min-h-[280px] overflow-hidden rounded-[var(--radius-image)] bg-border sm:min-h-[360px] lg:min-h-[420px]">
                          <Image
                            src={item?.image?.url || " "}
                            alt={item?.title || "Consultancy"}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority={idx === 0}
                            className="object-cover"
                          />
                        </div>

                        <div className="flex flex-col justify-center rounded-[var(--radius-card)] border border-border bg-surface p-8 md:p-12">
                          {typeof item.rating === "number" &&
                            item.rating > 0 ? (
                            <div className="mb-6 flex items-center gap-3">
                              <div
                                className="flex items-center gap-1"
                                aria-label={`${item.rating} out of 5`}
                              >
                                {Array.from({ length: 5 }).map((_, star) => (
                                  <Star
                                    key={star}
                                    className={`size-4 ${star < item.rating
                                      ? "fill-warning text-warning"
                                      : "text-border"
                                      }`}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <span className="font-ui text-xs text-muted">
                                {item.rating}/5
                              </span>
                            </div>
                          ) : null}

                          <h3 className="font-heading text-3xl leading-tight text-heading md:text-4xl">
                            {item.title}
                          </h3>

                          {item.shortDescription ? (
                            <p className="mt-5 font-body text-base leading-[1.9] text-foreground line-clamp-5">
                              {item.shortDescription}
                            </p>
                          ) : null}

                          {item.buttonLink ? (
                            <div className="mt-10">
                              <Link
                                href={item.buttonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-7 font-body text-sm text-primary-foreground transition-colors duration-[var(--duration-fast)] hover:bg-primary-hover"
                              >
                                Explore
                                <ArrowUpRight
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </Link>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {consultancyBanner.length > 1 ? (
                  <>
                    <CarouselPrevious className="left-2 hidden size-10 border-border bg-surface text-heading shadow-none hover:bg-background md:flex lg:-left-5" />
                    <CarouselNext className="right-2 hidden size-10 border-border bg-surface text-heading shadow-none hover:bg-background md:flex lg:-right-5" />
                  </>
                ) : null}
              </Carousel>
            )}
          </Container>
        </Section>
      )}
    </>
  );
}
