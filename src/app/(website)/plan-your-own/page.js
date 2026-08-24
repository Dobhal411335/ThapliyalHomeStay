import { PlanHero } from "@/components/website/plan-your-own/PlanHero";
import { PlanForm } from "@/components/website/plan-your-own/PlanForm";

export const metadata = {
  title: "Plan Your Own Retreat",
  description:
    "Design a retreat that fits your rhythm. Tell us your dates, the experiences you'd like, and we'll craft a quiet, personalised itinerary for your stay in Rishikesh.",
};

export default function PlanYourOwnPage() {
  return (
    <>
      <PlanHero />
      <PlanForm />
    </>
  );
}
