import connectDB from "@/lib/connectDB";
import Testimonial from "@/models/Admin/Testimonial";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  TestimonialsBanner,
  TestimonialsList,
} from "@/components/website/testimonials/TestimonialsSections";

async function getTestimonials() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return testimonials.map((item) => ({
      _id: item._id?.toString(),
      titleTag: item.titleTag || "",
      date: item.date || "",
      title: item.title || "",
      name: item.name || "",
      location: item.location || "",
      image: {
        url: item.image?.url || "/placeholder.png",
        key: item.image?.key || "",
      },
    }));
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export const metadata = {
  title: "Testimonials | Thapliyal Home Stay",
  description:
    "Stories from guests who found quiet, clarity, and peace at Thapliyal Home Stay.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <PageWrapper>
      <TestimonialsBanner />
      <TestimonialsList testimonials={testimonials} />
    </PageWrapper>
  );
}
