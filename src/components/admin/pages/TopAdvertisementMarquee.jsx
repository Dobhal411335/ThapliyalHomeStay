"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function BannerItems({ banners, keyPrefix, ariaHidden = false }) {
  return (
    <div
      className="flex min-w-[100vw] shrink-0 items-center justify-around gap-6 px-4 md:gap-8 md:px-6"
      aria-hidden={ariaHidden || undefined}
    >
      {banners.map((b) => (
        <span
          key={`${keyPrefix}-${b._id}`}
          className="inline-flex items-center whitespace-nowrap text-white"
        >
          <Link
            href={b.buttonLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium hover:underline sm:text-sm md:text-sm"
            tabIndex={ariaHidden ? -1 : undefined}
          >
            {b.title}
          </Link>
        </span>
      ))}
    </div>
  );
}

export default function TopAdvertisementMarquee() {
  const [banners, setBanners] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/topAdvertismentBanner");
        const data = await response.json();
        const activeBanners = data.filter((b) => b.isActive !== false);
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error fetching top advertisements:", error);
      }
    };
    fetchBanners();
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-[#0f172a] py-[6px]">
      <div
        className="flex h-4 items-center md:h-5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex w-max animate-marquee ${isPaused ? "marquee-paused" : ""}`}
        >
          <BannerItems banners={banners} keyPrefix="a" />
          <BannerItems banners={banners} keyPrefix="b" ariaHidden />
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
          will-change: transform;
        }

        .marquee-paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
