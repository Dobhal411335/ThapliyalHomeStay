"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Skeleton } from "@/components/ui/skeleton";
import FeaturedRoomsSection from "@/components/website/home/FeaturedRoomsSection";

export function FeaturedHotelsHomeSection() {
  const [hotels, setHotels] = useState([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/room?listingType=hotel");
        if (!res.ok) {
          setHotels([]);
          return;
        }
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

    fetchHotels();
  }, []);

  const showHotels = isLoadingHotels || hotels.length > 0;
  if (!showHotels) return null;

  return (
    <Section spacing="sm" className="bg-white overflow-hidden">
      <Container>
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
              Stay
            </p>
            <h2 className="mt-5 font-heading text-4xl leading-[1.15] text-heading md:text-5xl">
              Comfort that feels like{" "}
              <em className="italic text-primary">stillness</em>.
            </h2>
            <p className="mt-5 font-body text-base leading-[1.9] text-foreground">
              Rooms shaped for rest — soft light, thoughtful amenities, and easy
              access to yoga halls and quiet common spaces. A stay that feels
              like home, without asking anything of you.
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
  );
}
