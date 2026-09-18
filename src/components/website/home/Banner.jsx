"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function Banner() {
  const [bannerSection2nd, setBannerSection2nd] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  useEffect(() => {
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
    fetchBanners();
    fetchPackages();
  }, []);
  const formatNumeric = (num) => new Intl.NumberFormat("en-IN").format(num);
  const showPackages = packagesLoading || packages.length > 0;
  const showBanners = bannersLoading || bannerSection2nd.length > 0;

  return (
    <>

      {showPackages && (
        <Section spacing="sm" className="bg-white overflow-hidden">
          <Container>
            <div className="mb-12">
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
                Journeys
              </p>
              <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                You Will
                <em className="italic text-primary"> Experience</em>.
              </h2>
              <p className="mt-5 text-justify font-body text-base leading-[1.9] text-black">
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
                      className="group flex h-full flex-col rounded-card border border-border bg-white p-4"
                    >
                      <div className="relative mx-auto mb-6 h-[450px] w-[650px] max-w-full shrink-0 overflow-hidden rounded-image bg-border">
                        <Image
                          src={
                            item?.basicDetails?.thumbnail?.url ||
                            "/placeholder.png"
                          }
                          alt={item?.packageName || "Tour package"}
                          fill
                          sizes="650px"
                          quality={100}
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
                            dangerouslySetInnerHTML={{
                              __html: descriptionHtml,
                            }}
                          />
                        ) : null}

                        <div className="mt-auto pt-8">
                          <Link
                            href={`/package/${item.slug}`}
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-button border border-gray-400 bg-foreground/10 px-5 font-body text-sm text-black transition-colors hover:border-heading/40 hover:bg-foreground hover:text-white"
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
                  );
                })}
              </div>
            )}
          </Container>
        </Section>
      )}
      {showBanners && (
        <Section spacing="sm" className="bg-white w-full">
          <div className="w-full">
            {bannersLoading ? (
              <Skeleton className="h-[350px] px-2 w-full rounded-none md:h-[450px]" />
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
                    <div className="relative hidden h-[300px] md:h-[400px] w-full md:block">
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
                    <div className="relative h-[350px] w-full md:hidden">
                      {item.mobileImage?.url || item.image?.url ? (
                        <Image
                          src={item.mobileImage?.url || item.image.url}
                          alt={item.title || "Promotional banner"}
                          fill
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
