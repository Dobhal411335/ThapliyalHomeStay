import connectDB from "@/lib/connectDB";
import PhilosophyBanner from "@/models/Admin/PhilosophyBanner";
import { deleteFileFromCloudinary } from "@/utils/cloudinary/index";

const IMAGE_FIELDS = ["philosophyTrustImage", "ctaHowItWorksImage"];

function serializeImage(image) {
  if (!image?.url) {
    return { url: "", key: "" };
  }
  return {
    url: image.url,
    key: image.key || "",
  };
}

function serializeDoc(doc) {
  return {
    _id: String(doc._id),
    philosophyTrustImage: serializeImage(doc.philosophyTrustImage),
    ctaHowItWorksImage: serializeImage(doc.ctaHowItWorksImage),
  };
}

async function getOrCreateDoc() {
  await connectDB();
  let doc = await PhilosophyBanner.findOne();
  if (!doc) {
    doc = await PhilosophyBanner.create({});
  }
  return doc;
}

export async function getPhilosophyBanner() {
  const doc = await getOrCreateDoc();
  return serializeDoc(doc);
}

export async function updatePhilosophyBannerImage(field, image) {
  if (!IMAGE_FIELDS.includes(field)) {
    throw new Error("Invalid image field");
  }

  if (!image?.url) {
    throw new Error("Image url is required");
  }

  const doc = await getOrCreateDoc();
  const previousKey = doc[field]?.key;

  doc[field] = serializeImage(image);
  await doc.save();

  if (previousKey && previousKey !== image.key) {
    try {
      await deleteFileFromCloudinary(previousKey);
    } catch {
      /* ignore cleanup failures */
    }
  }

  return serializeDoc(doc);
}

export async function clearPhilosophyBannerImage(field) {
  if (!IMAGE_FIELDS.includes(field)) {
    throw new Error("Invalid image field");
  }

  const doc = await getOrCreateDoc();
  const previousKey = doc[field]?.key;

  if (previousKey) {
    await deleteFileFromCloudinary(previousKey);
  }

  doc[field] = { url: "", key: "" };
  await doc.save();

  return serializeDoc(doc);
}
