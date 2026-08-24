import Image from "next/image";

export function PlanHero() {
  return (
    <section className="relative flex md:min-h-[80vh] min-h-[60vh] items-end overflow-hidden bg-image-dark">
      <Image
        src="/plan-your-way.png"
        alt="Plan your way"
        fill
        priority
        className="object-cover object-center"
      />
      {/* Hero background */}
      <div
        className="absolute inset-0 bg-linear-to-r from-image-dark/90 via-image-dark/50 to-transparent"
        aria-hidden="true"
      />
      {/* Warm amber overlay for the dusk/diya mood & bottom fade */}
      <div
        className="absolute inset-0 bg-linear-to-t from-[#fcf7f1] via-transparent to-black/30"
        aria-hidden="true"
      />
      
      {/* Extra bottom fade for a smoother transition to the background section below */}
      <div
        className="absolute inset-x-0 bottom-0 md:h-20 h-10 bg-linear-to-t from-background via-background/90 to-transparent"
        aria-hidden="true"
      />

      <div className="container relative z-10 md:px-20 pt-30 px-5">
        {/* Eyebrow */}
        <p className="flex items-center gap-2 font-ui text-xs uppercase tracking-[0.3em] text-white/80">
          <span className="text-primary/80" aria-hidden="true">✿</span>
          Design your own retreat
        </p>

        {/* Heading */}
        <h1 className="mt-5 max-w-3xl font-heading text-3xl leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
          Tell us your <em className="text-white/90">rhythm.</em>{" "}
          We&apos;ll shape the stay around it.
        </h1>

        {/* Subtitle */}
        <p className="mb-40 mt-10 max-w-xl font-body text-sm leading-[1.85] text-white/80">
          If our Day, Week or Month plans don&apos;t quite match your dates or
          your hopes — sketch your own. Pick a date range, the experiences
          you&apos;d like, and we&apos;ll craft a quiet itinerary that&apos;s
          yours alone.
        </p>
      </div>
    </section>
  );
}
