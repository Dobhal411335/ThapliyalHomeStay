"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import {
  BedDouble,
  Car,
  Flower2,
  MapPin,
  MapPinned,
  Smile,
  Ticket,
  UtensilsCrossed,
  Users,
  Wifi,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";

const FALLBACK_IMAGE = "/placeholder.png";

const stats = [
  { icon: Smile, value: 2, suffix: "K+", label: "Happy Customers" },
  { icon: Ticket, value: 1500, suffix: "+", label: "Packages Sold" },
  { icon: MapPinned, value: 20, suffix: "+", label: "Destinations" },
  { icon: Users, value: 365, suffix: "+", label: "24X7 Support" },
];

function formatStat(value) {
  return Math.round(value).toLocaleString("en-US");
}

function AnimatedStatNumber({ value, suffix }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${formatStat(latest)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, suffix]);

  return (
    <span ref={ref} className="tabular-nums font-sans">
      0{suffix}
    </span>
  );
}

export function PhilosophyTrustSection() {
  const [trustImage, setTrustImage] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("/api/philosophyBanner");
        const result = await res.json();
        const url = result?.data?.philosophyTrustImage?.url;
        if (result?.success && url) {
          setTrustImage(url);
        }
      } catch {
        /* keep fallback */
      }
    };

    fetchImage();
  }, []);

  return (
    <>
      <Section spacing="sm" className="bg-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-ui text-xs uppercase tracking-[0.28em] text-muted">
              Your Perfect Stay Begins Here.
            </p>
            <h2 className="mt-5 font-heading text-3xl leading-[1.2] text-heading md:text-4xl lg:text-5xl">
              Exceptional Hospitality, tailored services and the experience of
              unique holidays
            </h2>
            <p className="mx-auto text-justify md:text-center mt-6 max-w-2xl font-body text-sm leading-[1.9] text-black md:text-base">
              Experience the perfect blend of comfort, elegance, and warm
              hospitality at our deluxe hotel. From thoughtfully designed rooms
              and modern amenities to personalized service and a welcoming
              atmosphere, we ensure every moment of your stay is relaxing and
              memorable. Whether you are travelling for business or leisure, our
              commitment to exceptional hospitality makes your stay truly
              special.
            </p>
            <Link
              href="/about-us"
              className="mt-8 inline-flex h-11 items-center rounded-button bg-primary px-8 font-body text-sm text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Explore Our Story
            </Link>
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="bg-background">
        <Container>
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8 xl:gap-10">
            {/* Left column */}
            <div className="flex flex-col">
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
                About US
              </p>
              <h2 className="mt-4 font-heading text-4xl leading-[1.12] text-heading md:text-5xl xl:text-[3.25rem]">
                Where Warm Hospitality Meets{" "}
                <em className="italic text-primary">Timeless Experiences</em>
              </h2>

              <div className="mt-5 space-y-4 text-justify text-sm leading-[1.85] text-black">
                <p className="text-black">
                  Experience warm hospitality, comfortable stays, and thoughtful
                  service in a welcoming atmosphere. Enjoy freshly prepared
                  flavors at our multi-cuisine restaurant, offering delightful
                  meals from breakfast to dinner.
                </p>
                <p className="text-black">
                  Ideally located near the city&apos;s fascinating attractions,
                  temples, sacred ghats, vibrant local markets, and peaceful
                  spiritual spaces, we invite you to explore the timeless charm
                  and rich culture of this holy city.
                </p>
              </div>

              <div className="mt-8 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {stats.map(({ icon: Icon, value, suffix, label }) => (
                    <div
                      key={label}
                      className="flex flex-col rounded-card bg-surface p-3.5 md:p-4 border"
                    >
                      <span className="inline-flex size-7 items-center justify-center rounded-full border border-primary/35 text-primary">
                        <Icon
                          className="size-3.5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                      <p className="mt-3 font-heading text-xl font-semibold tracking-tight text-heading md:text-2xl">
                        <AnimatedStatNumber value={value} suffix={suffix} />
                      </p>
                      <p className="mt-1 font-body text-xs text-muted-foreground md:text-sm">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col justify-between rounded-card bg-surface p-4 md:p-5">
                  <div>
                    <h3 className="font-heading text-lg leading-snug text-heading md:text-2xl">
                      Where sacred tradition meets modern warmth.
                    </h3>
                    <p className="mt-3 font-body text-sm leading-[1.75] text-black">
                      Nestled in the heart of the city, we welcome you with
                      genuine hospitality just moments away from its most
                      fascinating landmarks. Discover ancient temples, sacred
                      ghats, serene riverside walks, and vibrant local markets.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex h-10 w-fit items-center rounded-button bg-primary px-6 font-body text-sm text-primary-foreground transition-colors hover:bg-primary-hover"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            {/* Right column — full image */}
            <div className="relative min-h-[28rem] overflow-hidden rounded-image lg:min-h-full">
              <Image
                src={trustImage}
                alt="Deluxe luxury room"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority={false}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
