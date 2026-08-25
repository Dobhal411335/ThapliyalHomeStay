import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";

export function CtaSection() {
  return (
    <Section spacing="sm" className="bg-background border-b border-gray-300">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
              Ready when you are
            </p>
            <h2 className="mt-5 font-heading text-5xl leading-[1.1] text-heading md:text-6xl">
              Pick a date.
              <br />
              <em className="italic text-primary">We&apos;ll hold the space.</em>
            </h2>
            <p className="mt-7 max-w-sm font-body text-sm leading-[1.9] text-foreground">
              Tell us your dates and what you&apos;re looking for. We&apos;ll
              write back with a quiet plan, never a sales pitch.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-7 font-body text-sm text-white transition-colors hover:bg-primary-hover"
              >
                Start an enquiry
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/plan-your-own"
                className="inline-flex h-11 items-center rounded-[var(--radius-button)] border border-black px-7 font-body text-sm text-black transition-colors hover:border-heading/30 hover:bg-surface"
              >
                See the pace
              </Link>
            </div>
          </div>

          <div className="relative h-96 lg:h-[400px]">
            {/* Photo 1 */}
            <div className="absolute left-0 top-0 h-72 w-52 overflow-hidden rounded-[var(--radius-image)] bg-border lg:h-80 lg:w-64">
              <Image
                src="/sunset.png"
                alt="Sunrise landscape"
                fill
                className="object-cover"
              />
            </div>
            {/* Photo 2 */}
            <div className="absolute bottom-0 right-0 h-64 w-52 overflow-hidden rounded-[var(--radius-image)] bg-muted/20 lg:h-72 lg:w-60">
              <Image
                src="/yoga.png"
                alt="Warmth close-up"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
