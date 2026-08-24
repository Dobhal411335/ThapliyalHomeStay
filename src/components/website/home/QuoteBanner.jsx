export function QuoteBanner() {
  return (
    <section className="relative flex md:min-h-64 min-h-48 items-center justify-center overflow-hidden bg-image-dark md:py-24 py-10">
      {/* Quote banner background image — replace with next/image in Phase 2 */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-image-dark/40 via-image-dark/80 to-image-dark/40"
        aria-hidden="true"
      />
      <div className="container relative z-10 text-center">
        <blockquote>
          <p className="mx-auto max-w-2xl font-heading text-2xl italic leading-relaxed text-white/90 md:text-3xl">
            &ldquo;The river will hold whatever you bring to it.&rdquo;
          </p>
        </blockquote>
      </div>
    </section>
  );  
}
