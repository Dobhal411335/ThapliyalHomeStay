"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Skeleton } from "@/components/ui/skeleton";
import FeaturedRoomsSection from "@/components/website/home/FeaturedRoomsSection";
import StandaloneRoomsSection from "@/components/website/home/StandaloneRoomsSection";

export default function RoomSection() {
  const [hotels, setHotels] = useState([]);
  const [standaloneRooms, setStandaloneRooms] = useState([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/room?listingType=hotel");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.rooms)
            ? data.rooms
            : [];
        setHotels(
          list.filter(
            (item) => item?.listingType !== "room" && item?.active !== false,
          ),
        );
      } catch {
        setHotels([]);
      } finally {
        setIsLoadingHotels(false);
      }
    };

    const fetchStandaloneRooms = async () => {
      try {
        const res = await fetch("/api/room?listingType=room");
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

    fetchHotels();
    fetchStandaloneRooms();
  }, []);

  const showHotels = isLoadingHotels || hotels.length > 0;
  const showStandaloneRooms = isLoadingRooms || standaloneRooms.length > 0;

  if (!showHotels && !showStandaloneRooms) return null;

  return (
    <>
      {showStandaloneRooms ? (
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
                <p className="mt-5 font-body text-base leading-[1.9] text-gray-800 text-justify" >
                  Our rooms are designed to combine modern comfort with elegant
                  aesthetics. Comfortable beds, inviting interiors, quality
                  furnishings, convenient facilities, and carefully considered
                  details create a relaxing environment where you can unwind
                  after a day of exploring.
                </p>
              </div>
            </div>

            {isLoadingRooms ? (
              <div className="flex flex-col gap-6">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 md:flex-row md:p-5"
                  >
                    <Skeleton className="h-[240px] w-full rounded-xl md:h-[280px] md:w-[380px]" />
                    <div className="flex flex-1 flex-col gap-3">
                      <Skeleton className="h-8 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="mt-auto h-11 w-28 self-end" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <StandaloneRoomsSection rooms={standaloneRooms} />
            )}
          </Container>
        </Section>
      ) : null}

      
      {showHotels ? (
        <Section spacing="sm" className="bg-background overflow-hidden">
          <Container>
            <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="">
                <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
                  Stay
                </p>
                <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
                  Comfort that feels like{" "}
                  <em className="italic text-primary">stillness</em>.
                </h2>
                <p className="mt-5 font-body text-base leading-[1.9] text-foreground">
                  Rooms shaped for rest — soft light, thoughtful amenities, and
                  easy access to yoga halls and quiet common spaces. A stay that
                  feels like home, without asking anything of you.
                </p>
              </div>

              <Link
                href="/accommodation"
                className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-[var(--radius-button)] border border-border bg-surface px-7 font-body text-sm text-heading transition-colors duration-[var(--duration-fast)] hover:border-heading/30 hover:bg-background lg:self-auto"
              >
                View all rooms
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            {isLoadingHotels ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    <Skeleton className="aspect-[4/3] w-full rounded-[var(--radius-image)]" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <FeaturedRoomsSection rooms={hotels} />
            )}
          </Container>
        </Section>
      ) : null}
    </>
  );
}
