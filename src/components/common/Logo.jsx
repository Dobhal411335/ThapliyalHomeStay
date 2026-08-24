import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { site } from "@/constants/site";

export function Logo({
  tone = "dark",
  className,
  showBadge = true,
  name,
  imageSrc,
  imageAlt,
}) {
  const displayName = name || site.name;
  const src = imageSrc || "/logo.png";

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 transition-opacity hover:opacity-80",
        className
      )}
    >
      {showBadge && (
        <Image
          width={150}
          height={150}
          src={src}
          alt={imageAlt || `${displayName} logo`}
          className="size-10 md:size-12 rounded-full object-cover"
        />
      )}
      <span
        className={cn(
          "font-heading text-xl tracking-tight",
          tone === "light" ? "text-surface" : "text-heading"
        )}
      >
        {displayName}
      </span>
    </Link>
  );
}
