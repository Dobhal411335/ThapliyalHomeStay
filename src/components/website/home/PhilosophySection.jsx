import { Sunrise, Flame, Mountain, Landmark } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";

const features = [
  { icon: Sunrise, label: "Sunrise yoga" },
  { icon: Flame, label: "Ganga Aarti" },
  { icon: Mountain, label: "Himalayan hikes" },
  { icon: Landmark, label: "Temple visits" },
];

export function PhilosophySection() {
  return (
    <Section spacing="sm" className="bg-background">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
              Our Retreats
            </p>
            <h2 className="mt-5 font-heading text-5xl leading-[1.1] text-heading md:text-6xl">
              Yoga, Meditation &
              <em className="italic text-primary"> Ayurvedic</em> Retreats.
            </h2>
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-sans text-heading leading-[1.9]">
              Our yoga and meditation retreat is a journey into self-discovery,
              stillness, and the joy of being present. Breathe deeply, move
              mindfully, meditate, rest, and reconnect with yourself.
            </p>
            <p className="mt-5 font-sans text-heading leading-[1.9]">
              But this journey is also about connection. Meet beautiful souls
              from around the world, share stories, laughter, silence, and
              meaningful moments—without judgment, expectations, or labels.
              <br />
              <br />
              Stay with us for 3 to 7 days—it’s up to you. Choose the package
              it’s your time your space,your journey Come as you are. Connect
              deeply. Discover within. And leave with memories, friendships, and
              a little more peace.
            </p>

            <div className="md:mt-10 mt-5 grid grid-cols-2 gap-6 border-t border-border pt-10 sm:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <feature.icon
                    className="size-6 text-black"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-ui text-xs text-black">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
