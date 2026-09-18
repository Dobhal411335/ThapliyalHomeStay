import connectDB from "@/lib/connectDB";
import GallerySection from "@/models/Admin/GallerySection";
import { deleteFileFromCloudinary } from "@/utils/cloudinary/index";

function serializeImages(images = []) {
  return images
    .filter((image) => image?.url && image?.key)
    .map((image) => ({
      url: image.url,
      key: image.key,
    }));
}

async function getOrCreateGalleryDoc() {
  await connectDB();
  let gallery = await GallerySection.findOne();
  if (!gallery) {
    gallery = await GallerySection.create({ images: [] });
  }
  return gallery;
}

export async function getGallerySection() {
  const gallery = await getOrCreateGalleryDoc();
  return {
    _id: String(gallery._id),
    images: serializeImages(gallery.images),
  };
}

export async function saveGalleryImages(images) {
  if (!Array.isArray(images)) {
    throw new Error("Images must be an array");
  }

  const gallery = await getOrCreateGalleryDoc();
  gallery.images = serializeImages(images);
  await gallery.save();

  return {
    _id: String(gallery._id),
    images: serializeImages(gallery.images),
  };
}

export async function deleteGalleryImage(key) {
  if (!key) {
    throw new Error("Image key is required");
  }

  const gallery = await getOrCreateGalleryDoc();
  const imageExists = gallery.images.some((image) => image.key === key);

  if (!imageExists) {
    throw new Error("Image not found");
  }

  await deleteFileFromCloudinary(key);
  gallery.images = gallery.images.filter((image) => image.key !== key);
  await gallery.save();

  return {
    _id: String(gallery._id),
    images: serializeImages(gallery.images),
  };
}
