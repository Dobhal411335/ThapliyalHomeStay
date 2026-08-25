import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";

export function PhilosophySection() {
  return (
    <Section spacing="sm" className="bg-background">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.25em] text-gray-800">
              About US
            </p>
            <h2 className="mt-5 font-heading text-5xl leading-[1.1] text-heading md:text-6xl">
              Where Warm Hospitality Meets
              <br />
              <em className="italic text-primary"> Timeless Experiences</em>
            </h2>
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-sans text-heading leading-[1.9] text-justify">
              Experience warm hospitality, comfortable stays, and thoughtful service in a welcoming atmosphere designed to make every moment memorable. Enjoy a delightful dining experience at our multi-cuisine restaurant, where freshly prepared flavors and comforting favorites come together to satisfy every palate. Whether you&apos;re beginning your day with a delicious breakfast or relaxing over dinner, we make every meal a part of your stay.
            </p>
            <p className="mt-5 font-sans text-heading leading-[1.9] text-justify">
              Located close to the city&apos;s fascinating attractions, we invite you to discover, explore, and experience the spirit of this holy city. Enjoy nearby temples, sacred ghats, riverside walks, vibrant local markets, and peaceful spiritual spaces, or add a little adventure with outdoor activities. Take a leisurely walking tour through the historic lanes and immerse yourself in the culture, traditions, and timeless charm of the destination.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
