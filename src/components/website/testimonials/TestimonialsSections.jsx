import Image from "next/image";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Quote } from "lucide-react";

export function TestimonialsBanner() {
  return (
    <Section
      spacing="sm"
      className="relative overflow-hidden border-b border-border/40 bg-surface"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-secondary/30 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Stories from our guests
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl font-medium leading-[1.1] text-heading md:text-6xl lg:text-7xl">
          Voices of <em className="font-normal italic text-primary">peace.</em>
        </h1>
        <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-muted md:text-lg">
          What people say after leaving Thapliyal Home Stay matters more to us than anything
          we could say about ourselves.
        </p>
      </Container>
    </Section>
  );
}

function TestimonialCard({ testimonial, index }) {
  const imageUrl = testimonial?.image?.url;

  return (
    <article
      className="group border-b border-border/50 py-6 sm:py-8 md:py-12 lg:py-14 last:border-b-0"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="flex flex-col items-center gap-5 sm:gap-6 md:flex-row md:items-start md:gap-8 lg:gap-10">
        {imageUrl ? (
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-full border border-border/60 bg-surface shadow-sm">
            <Image
              src={imageUrl}
              alt={testimonial.name || "Guest"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 64px, 80px"
            />
          </div>
        ) : (
          <div
            className="flex h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface shadow-sm"
            aria-hidden="true"
          >
            <Quote className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
        )}

        <div className="flex-1 text-center md:text-left">
          <div className="mb-3">
            <Quote className="mx-auto h-5 w-5 text-primary md:mx-0 md:h-6 md:w-6" />
          </div>

          {testimonial.titleTag && (
            <h3 className="mb-3 font-heading text-base font-medium tracking-wide text-primary uppercase sm:text-lg">
              {testimonial.titleTag}
            </h3>
          )}

          <blockquote>
            <p className="font-heading text-lg leading-8 sm:text-xl sm:leading-9 md:text-2xl md:leading-10 lg:text-3xl lg:leading-[1.45] xl:text-[2rem]">
              {testimonial.title}
            </p>
          </blockquote>

          <footer className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm tracking-wide text-muted md:justify-start">
            <cite className="not-italic font-semibold uppercase tracking-[0.14em] text-heading">
              {testimonial.name}
            </cite>

            {testimonial.location && (
              <>
                <span className="text-border">•</span>
                <span>{testimonial.location}</span>
              </>
            )}

            {testimonial.date && (
              <>
                <span className="text-border">•</span>
                <time dateTime={testimonial.date}>
                  {new Date(testimonial.date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
          </footer>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsList({ testimonials = [] }) {
  if (!testimonials.length) {
    return (
      <Section spacing="sm">
        <Container>
          <div className="rounded-card border border-dashed border-border bg-surface/60 px-6 md:py-16 text-center">
            <p className="font-heading text-2xl text-heading">
              Stories are gathering.
            </p>
            <p className="mt-3 font-body text-sm text-muted">
              Guest testimonials will appear here soon.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="sm" className="bg-background">
      <Container className="max-w-4xl">
        <div className="divide-y-0">
          {testimonials.map((item, index) => (
            <TestimonialCard
              key={item._id || index}
              testimonial={item}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
