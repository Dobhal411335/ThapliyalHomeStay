import WebPage from "@/components/website/webpage/WebPage";

async function getWebpageBySlug(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/create_webpage/by_slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    if (!data || data.error) return null;
    return data;
  } catch (error) {
    console.error("Failed to fetch webpage:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const webpage = await getWebpageBySlug(slug);

  if (!webpage) {
    return { title: "Page" };
  }

  const keywords = Array.isArray(webpage.keywords)
    ? webpage.keywords.filter(Boolean)
    : [];

  return {
    title: webpage.titleLine || webpage.title || "Page",
    ...(keywords.length > 0 ? { keywords } : {}),
  };
}

export default async function ActivityPage({ params }) {
  const { slug } = await params;
  const data = await getWebpageBySlug(slug);
  if (!data) return <div>Page Not found</div>;
  return <WebPage data={data} />;
}
