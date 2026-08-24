import connectDB from "@/lib/connectDB";
import Webpage from "@/models/Admin/Webpage";
import { notFound } from "next/navigation";
import GalleryDetailClient from "./GalleryDetailClient";
export async function generateMetadata({ params }) {
  await connectDB();
  const { slug } = await params;
  const webpage = await Webpage.findOne({ "gridCards.gallerySlug": slug });
  
  if (!webpage) return { title: "Gallery Not Found" };

  const galleryCard = webpage.gridCards.find(card => card.gallerySlug === slug);
  return {
    title: galleryCard?.title || "Gallery",
    description: galleryCard?.galleryDescription || "",
  };
}

export default async function GalleryDetailPage({ params }) {
  await connectDB();
  const { slug } = await params;
  
  // Find the Webpage that contains this gallery slug
  const webpage = await Webpage.findOne({ "gridCards.gallerySlug": slug });
  
  if (!webpage) {
    notFound();
  }

  // Extract the specific grid card
  const galleryCard = webpage.gridCards.find(card => card.gallerySlug === slug);

  if (!galleryCard) {
    notFound();
  }

  // Next.js Server Components require props passed to Client Components to be serializable
  const serializedWebpage = JSON.parse(JSON.stringify(webpage));
  const serializedGalleryCard = JSON.parse(JSON.stringify(galleryCard));

  return <GalleryDetailClient galleryCard={serializedGalleryCard} webpage={serializedWebpage} />;
}
