/**
 * Cloudinary client configuration and upload helpers.
 * Phase 2: upload, replace, and delete media assets.
 */
export function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  };
}

export async function uploadImage() {
  throw new Error("Cloudinary upload is not configured yet.");
}

export async function deleteImage() {
  throw new Error("Cloudinary delete is not configured yet.");
}
