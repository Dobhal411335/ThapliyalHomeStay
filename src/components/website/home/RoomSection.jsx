"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Skeleton } from "@/components/ui/skeleton";
import StandaloneRoomsSection from "@/components/website/home/StandaloneRoomsSection";

export default function RoomSection() {
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [standaloneRooms, setStandaloneRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

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

    const fetchStandaloneRooms = async () => {
      try {
        const res = await fetch("/api/room?listingType=room");
        if (!res.ok) {
          setStandaloneRooms([]);
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.rooms)
            ? data.rooms
            : [];
        setStandaloneRooms(
          list.filter(
            (item) => item?.listingType === "room" && item?.active !== false,
          ),
        );
      } catch {
        setStandaloneRooms([]);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchBanners();
    fetchStandaloneRooms();
  }, []);

  const showStandaloneRooms = isLoadingRooms || standaloneRooms.length > 0;
  const showBanners = bannersLoading || banners.length > 0;

  if (!showStandaloneRooms && !showBanners) return null;

  return (
    <>
      {showStandaloneRooms && (
        <Section spacing="sm" className="overflow-hidden bg-surface">
          <Container>
            <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.25em] text-gray-500">
                  Thoughtfully Designed Rooms
                </p>
                <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                  A Distinctive Stay Where Elegance Meets{" "}
                  <em className="italic text-primary">Comfort</em>
                </h2>
                <p className="mt-5 font-body text-base leading-[1.9] text-gray-800 text-justify">
                  Our rooms are designed to combine modern comfort with elegant
                  aesthetics. Comfortable beds, inviting interiors, quality
                  furnishings, convenient facilities, and carefully considered
                  details create a relaxing environment where you can unwind after
                  a day of exploring.
                </p>
              </div>
            </div>

            {isLoadingRooms ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <Skeleton className="aspect-16/10 w-full rounded-none" />
                    <div className="flex flex-col gap-3 p-4 md:p-5">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 rounded-lg" />
                        <Skeleton className="h-8 w-24 rounded-lg" />
                      </div>
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="mt-2 h-11 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <StandaloneRoomsSection rooms={standaloneRooms} />
            )}
          </Container>
        </Section>
      )}

      {showBanners && (
        <section className="w-full bg-background">
          {bannersLoading ? (
            <Skeleton className="h-[400px] w-full rounded-none px-2 md:h-[450px]" />
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
                  <div className="relative hidden h-[400px] w-full md:block">
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
                  <div className="relative h-[350px] w-full px-1 md:hidden">
                    {item.mobileImage?.url || item.image?.url ? (
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
