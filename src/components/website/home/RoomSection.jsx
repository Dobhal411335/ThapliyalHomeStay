"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Skeleton } from "@/components/ui/skeleton";
import FeaturedRoomsSection from "@/components/website/home/FeaturedRoomsSection";

export default function RoomSection() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/room");
        const data = await res.json();
        if (Array.isArray(data)) {
          setRooms(data);
        } else if (Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        } else {
          setRooms([]);
        }
      } catch {
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (!isLoading && rooms.length === 0) return null;

  return (
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

        {isLoading ? (
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
          <FeaturedRoomsSection rooms={rooms} />
        )}
      </Container>
    </Section>
  );
}
