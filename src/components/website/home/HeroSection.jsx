"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [desktopApi, setDesktopApi] = useState();
  const [desktopSelectedIndex, setDesktopSelectedIndex] = useState(0);
  const [mobileApi, setMobileApi] = useState(null);
  const [mobileSelectedIndex, setMobileSelectedIndex] = useState(0);
  const [mobileViewportHeight, setMobileViewportHeight] = useState(null);
  const desktopPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );
  const mobilePlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`/api/addBanner`);
        const data = await response.json();
        setBanners(Array.isArray(data) ? data : []);
      } catch {
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!desktopApi) return;
    const onSelect = () => {
      setDesktopSelectedIndex(desktopApi.selectedScrollSnap());
    };
    desktopApi.on("select", onSelect);
    onSelect();
    return () => {
      desktopApi.off("select", onSelect);
    };
  }, [desktopApi]);

  const syncMobileHeight = useCallback(() => {
    if (!mobileApi) return;
    const slides = mobileApi.slideNodes();
    const index = mobileApi.selectedScrollSnap();
    const activeSlide = slides[index];
    if (!activeSlide) return;

    const nextHeight = Math.ceil(activeSlide.getBoundingClientRect().height);
    if (nextHeight > 0) {
      setMobileViewportHeight(nextHeight);
    }
  }, [mobileApi]);

  useEffect(() => {
    if (!mobileApi) return;

    const onSelect = () => {
      setMobileSelectedIndex(mobileApi.selectedScrollSnap());
      // Wait a frame so the active slide image can settle
      requestAnimationFrame(() => syncMobileHeight());
    };

    mobileApi.on("select", onSelect);
    mobileApi.on("reInit", onSelect);
    onSelect();

    return () => {
      mobileApi.off("select", onSelect);
      mobileApi.off("reInit", onSelect);
    };
  }, [mobileApi, syncMobileHeight]);

  // Recalculate when banners change / images finish loading
  useEffect(() => {
    if (!mobileApi || banners.length === 0) return undefined;

    const slides = mobileApi.slideNodes();
    const images = slides.flatMap((slide) =>
      Array.from(slide.querySelectorAll("img")),
    );

    const handleLoad = () => syncMobileHeight();
    images.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", handleLoad);
    });

    syncMobileHeight();
    window.addEventListener("resize", syncMobileHeight);

    return () => {
      images.forEach((img) => img.removeEventListener("load", handleLoad));
      window.removeEventListener("resize", syncMobileHeight);
    };
  }, [mobileApi, banners, syncMobileHeight]);

  if (isLoading) {
    return (
      <section className="relative z-[160] h-[100px] w-full overflow-hidden md:h-[430px]">
        <Carousel className="h-full w-full" plugins={[desktopPlugin.current]}>
          <CarouselContent className="h-full">
            {[...Array(4)].map((_, index) => (
              <CarouselItem key={index} className="h-[100px] md:h-[430px]">
                <div className="relative h-full w-full">
                  <Skeleton className="h-[100px] w-full rounded-none md:h-full" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative flex min-h-[calc(100vh-80px)] items-end overflow-hidden bg-image-dark">
        <Image
          src="/hero.jpg"
          alt="Ganga river at sunset, Rishikesh"
          fill
          priority
          className="object-cover object-center"
        />

        <div
          className="absolute inset-0 bg-linear-to-t from-image-dark via-image-dark/55 to-image-dark/10"
          aria-hidden="true"
        />

        <div className="container relative z-10 px-5 py-10 md:px-10 md:pt-40 md:pb-20 lg:px-20">
          <p className="font-ui text-xs uppercase tracking-[0.35em] text-white">
            Rishikesh · Uttarakhand
          </p>

          <h1 className="mt-4 max-w-3xl font-heading text-[2.5rem] leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[4rem]">
            Find your stillness{" "}
            <em className="italic">where the Ganga sings.</em>
          </h1>

          <p className="mt-6 max-w-md font-body text-sm leading-[1.85] text-white/65 lg:text-lg">
            OnlyHotel is a quiet sanctuary — built for travellers who want to
            slow down, sit with themselves, and return softer than they came.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/retreats"
              className="inline-flex h-11 items-center gap-2 rounded-button bg-primary px-7 font-body text-sm text-white transition-colors hover:bg-primary-hover"
            >
              Explore retreats
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-button border border-white/30 px-7 font-body text-sm text-white/90 transition-colors hover:border-white/60 hover:bg-white/10"
            >
              Plan a visit
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="group relative z-0 w-full bg-[#fcf7f1] xl:overflow-hidden">
      <div className="hidden h-[calc(100vh-85px)] w-full xl:block">
        <div className="hidden h-full w-full xl:block">
          <Carousel
            className="h-[calc(100vh-85px)] w-full"
            plugins={[desktopPlugin.current]}
            onMouseLeave={desktopPlugin.current.reset}
            setApi={setDesktopApi}
          >
            <CarouselContent className="h-full">
              {banners.map((item, index) => (
                <CarouselItem key={index} className="h-[calc(100vh-85px)]">
                  <Link
                    href={item?.buttonLink || "#"}
                    className="block h-full w-full"
                  >
                    <div className="relative h-full w-full overflow-hidden bg-black">
                      <Image
                        src={item?.frontImg?.url || "/placeholder.png"}
                        alt={item?.title || "Banner Image"}
                        fill
                        quality={100}
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-4 rounded-full border bg-white/20 p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-white/40 md:left-16" />
            <CarouselNext className="right-4 rounded-full border bg-white/20 p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-white/40 md:right-16" />
          </Carousel>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => desktopApi?.scrollTo(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === desktopSelectedIndex
                    ? "w-6 bg-white"
                    : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile — height follows active slide only (fixes tallest-slide gap) */}
      <div className="relative block w-full xl:hidden">
        <Carousel
          className="w-full"
          plugins={[mobilePlugin.current]}
          setApi={setMobileApi}
        >
          <div
            className="overflow-hidden transition-[height] duration-300 ease-out"
            style={
              mobileViewportHeight
                ? { height: mobileViewportHeight }
                : undefined
            }
          >
            <CarouselContent className="ml-0 items-start">
              {banners.map((banner, index) => {
                const src =
                  banner?.mobileImg?.url ||
                  banner?.frontImg?.url ||
                  "/placeholder.png";

                return (
                  <CarouselItem key={index} className="basis-full pl-0">
                    <Link
                      href={banner?.buttonLink || "#"}
                      className="block w-full leading-none"
                    >
                      {/* Native img keeps true natural height (no forced aspect) */}
                      <img
                        src={src}
                        alt={banner?.title || "Mobile banner"}
                        className="block h-auto w-full"
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "auto"}
                        onLoad={syncMobileHeight}
                      />
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </div>

          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => mobileApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === mobileSelectedIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>
    </section>
  );
}
