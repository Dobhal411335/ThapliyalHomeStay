"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function FacebookIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InstaBlog({ section = "frontend" }) {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [facebookPosts, setFacebookPosts] = useState([]);
  const [isInstaLoading, setIsInstaLoading] = useState(true);
  const [isFbLoading, setIsFbLoading] = useState(true);

  useEffect(() => {
    const fetchFacebookPosts = async () => {
      try {
        const res = await fetch(`/api/facebook-posts`);
        const data = await res.json();
        setFacebookPosts(Array.isArray(data) ? data : []);
      } catch {
        setFacebookPosts([]);
      } finally {
        setIsFbLoading(false);
      }
    };

    const fetchInstagramPosts = async () => {
      try {
        const res = await fetch(`/api/instagram-posts`);
        const data = await res.json();
        setInstagramPosts(Array.isArray(data) ? data : []);
      } catch {
        setInstagramPosts([]);
      } finally {
        setIsInstaLoading(false);
      }
    };

    fetchFacebookPosts();
    fetchInstagramPosts();
  }, []);

  const isLoading = isInstaLoading || isFbLoading;

  const allPosts = [...instagramPosts, ...facebookPosts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  if (!isLoading && allPosts.length === 0) return null;

  const itemBasis =
    allPosts.length <= 3
      ? allPosts.length === 1
        ? "basis-full"
        : allPosts.length === 2
          ? "basis-1/2"
          : "basis-1/3"
      : "basis-[45%] sm:basis-1/3 md:basis-1/5";

  return (
    <section className="w-full overflow-hidden bg-background py-10 md:py-12">
      <div className="w-full px-3">
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="h-48 w-[45%] shrink-0 md:rounded-image rounded-md sm:w-1/3 md:w-1/5"
              />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{ align: "start", loop: allPosts.length > 3 }}
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {allPosts.map((post, idx) => {
                const isFacebook = post.type === "facebook";
                const Icon = isFacebook ? FacebookIcon : InstagramIcon;

                return (
                  <CarouselItem
                    key={post._id || idx}
                    className={`pl-4 ${itemBasis}`}
                  >
                    <a
                      href={post.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block h-48 w-full overflow-hidden md:rounded-image rounded-md border border-border bg-border"
                    >
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={
                            isFacebook
                              ? "Facebook post"
                              : "Instagram post"
                          }
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 768px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.03]"
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center bg-image-dark/45 opacity-0 transition-opacity duration-[var(--duration-medium)] group-hover:opacity-100">
                        <Icon className="size-10 text-white" />
                        <span className="sr-only">
                          Open {isFacebook ? "Facebook" : "Instagram"} post
                        </span>
                      </div>
                    </a>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-1 size-10 border-border bg-surface text-heading shadow-none hover:bg-background" />
            <CarouselNext className="right-1 size-10 border-border bg-surface text-heading shadow-none hover:bg-background" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
