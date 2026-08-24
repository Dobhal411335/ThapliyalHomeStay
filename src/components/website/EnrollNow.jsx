"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, Share2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const EnrollNow = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Hide on admin pages and while printing
  const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/package") || pathname?.startsWith("/plan-your-own") || pathname?.startsWith("/contact") || pathname?.startsWith("/rooms");

  if (isAdminPage || !showPopup) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ThapliyalHomeStay",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="fixed top-1/2 left-0 z-40 flex -translate-y-1/2 flex-col items-center gap-4 rounded-r-2xl bg-white py-3 px-2 shadow-[4px_0_24px_rgba(0,0,0,0.12)] print:hidden">
      <button
        onClick={handleShare}
        className="flex size-8 items-center justify-center rounded-full text-heading transition-transform duration-200 hover:scale-110 hover:text-primary"
        title="Share"
        aria-label="Share"
      >
        <Share2 className="size-5" strokeWidth={2} />
      </button>
      <div className="w-full h-0.5 bg-gray-800 mx-auto"></div>
      <button
        onClick={() => router.push("/plan-your-own")}
        className="flex size-8 items-center justify-center rounded-full border-[2px] border-black text-heading transition-all duration-200 hover:bg-heading hover:text-white"
        title="Enroll Now"
        aria-label="Enroll Now"
      >
        <ArrowUpRight className="size-5" strokeWidth={2} />
      </button>
    </div>
  );
};

export default EnrollNow;
