"use client";
import { useState, useEffect, useRef } from "react";
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
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [desktopApi, setDesktopApi] = useState();
  const [desktopSelectedIndex, setDesktopSelectedIndex] = useState(0);
  const [mobileApi, setMobileApi] = useState(null);
  const [mobileSelectedIndex, setMobileSelectedIndex] = useState(0);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`/api/addBanner`);
        const data = await response.json();
        setBanners(Array.isArray(data) ? data : []);
      } catch (error) {
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Desktop carousel effect
  useEffect(() => {
    if (!desktopApi) return;
    const onSelect = () => {
      const idx = desktopApi.selectedScrollSnap();
      setDesktopSelectedIndex(idx);
    };
    desktopApi.on("select", onSelect);
    onSelect();
    return () => {
      desktopApi.off("select", onSelect);
    };
  }, [desktopApi]);

  // Mobile carousel effect
  useEffect(() => {
    if (!mobileApi) return;
    const onSelect = () => {
      const idx = mobileApi.selectedScrollSnap();
      setMobileSelectedIndex(idx);
    };
    mobileApi.on("select", onSelect);
    onSelect();
    return () => {
      mobileApi.off("select", onSelect);
    };
  }, [mobileApi]);

  if (isLoading) {
    return (
      <section className="relative h-[100px] md:h-[430px] w-full overflow-hidden z-[160]">
        <Carousel
          className="h-full w-full"
          plugins={[plugin.current]}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="h-full">
            {[...Array(4)].map((_, index) => (
              <CarouselItem key={index} className="h-[100px] md:h-[430px]">
                <div className="relative h-full w-full">
                  <Skeleton className="h-[100px] md:h-full w-full rounded-none" />
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
        {/* Background photo */}
        <Image
          src="/hero.jpg"
          alt="Ganga river at sunset, Rishikesh"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark gradient overlay so text stays readable */}
        <div
          className="absolute inset-0 bg-linear-to-t from-image-dark via-image-dark/55 to-image-dark/10"
          aria-hidden="true"
        />

        <div className="container relative z-10 px-5 md:px-10 md:pb-20 md:pt-40 py-10 lg:px-20">
          <p className="font-ui text-xs uppercase tracking-[0.35em] text-white">
            Rishikesh · Uttarakhand
          </p>

          <h1 className="mt-4 max-w-3xl font-heading text-[2.5rem] leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[4rem]">
            Find your stillness{" "}
            <em className="italic">where the Ganga sings.</em>
          </h1>

          <p className="mt-6 max-w-md font-body text-sm leading-[1.85] text-white/65 lg:text-lg">
            Thapliyal Home Stay is a quiet sanctuary — built for
            travellers who want to slow down, sit with themselves, and return
            softer than they came.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/plan-your-own"
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
    <section className="bg-[#fcf7f1] relative xl:h-full h-full w-full overflow-hidden z-0 group">
      <div className="hidden xl:block w-full h-[calc(100vh-85px)]">
        <div className="hidden xl:block w-full h-full">
          <Carousel
            className="h-[calc(100vh-80px)] w-full"
            plugins={[plugin.current]}
            onMouseLeave={plugin.current.reset}
            setApi={setDesktopApi}
          >
            <CarouselContent className="h-full">
              {banners.map((item, index) => (
                <CarouselItem key={index} className="h-[calc(100vh-80px)]">
                  <Link
                    href={item?.buttonLink || "#"}
                    className="block h-full w-full"
                  >
                    <div className="relative h-[calc(100vh-80px)] w-full flex items-center justify-center bg-black">
                      <Image
                        src={item?.frontImg?.url || " "}
                        alt={item?.title || "Banner Image"}
                        fill
                        quality={100}
                        priority
                        className="object-cover"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious className="left-4 md:left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border rounded-full p-5 bg-white/20 text-white hover:bg-white/40" />
            <CarouselNext className="right-4 md:right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border rounded-full p-5 bg-white/20 text-white hover:bg-white/40" />
          </Carousel>

          {/* Custom Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => desktopApi?.scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === desktopSelectedIndex
                    ? "bg-white w-6"
                    : "bg-white/50"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Carousel */}
      <div className="block xl:hidden relative w-full h-[450px] overflow-hidden">
        <Carousel
          className="w-full h-full"
          plugins={[plugin.current]}
          setApi={setMobileApi}
        >
          <CarouselContent className="h-full ml-0">
            {banners.map((banner, index) => (
              <CarouselItem key={index} className="h-[450px] pl-0">
                <Link
                  href={banner?.buttonLink || "#"}
                  className="block w-full h-full"
                >
                  <div className="relative w-full h-full overflow-hidden bg-black">
                    <Image
                      src={banner?.mobileImg?.url || banner?.frontImg?.url || " "}
                      alt={banner?.title || "MobileBanner Image"}
                      fill
                      quality={100}
                      priority
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Pagination Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => mobileApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === mobileSelectedIndex
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
