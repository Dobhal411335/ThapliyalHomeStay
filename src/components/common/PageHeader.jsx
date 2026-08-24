import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";

export function PageHeader({
  title,
  description,
  eyebrow,
  className,
  children,
}) {
  return (
    <Section spacing="md" className={className}>
      <Container>
        {eyebrow ? (
          <p className="font-ui text-sm uppercase tracking-[0.2em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-3xl font-heading text-5xl leading-tight text-heading md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground">
            {description}
          </p>
        ) : null}
        {children}
      </Container>
    </Section>
  );
}
