import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {string} folder - The folder in Cloudinary to upload to.
 * @returns {Promise<Object>} The Cloudinary upload result.
 */
export const uploadImageToCloudinary = async (fileBuffer, folder = 'ThapliyalHomeStay') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes a file from Cloudinary by its public ID.
 * @param {string} publicId - The Cloudinary public ID (key) of the file to delete.
 * @returns {Promise<Object>} The Cloudinary deletion result.
 */
export const deleteFileFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Failed to delete Cloudinary image with key ${publicId}:`, error);
    throw error;
  }
};
