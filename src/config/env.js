import dotenv from "dotenv-safe";

const examplePath = ".env.example";

let cachedEnv = null;

/**
 * Validate and return environment variables.
 * Uses allowEmptyValues during Phase 1 foundation setup.
 */
export function getEnv() {
  if (cachedEnv) return cachedEnv;

  dotenv.config({
    allowEmptyValues: true,
    example: examplePath,
  });

  cachedEnv = {
    mongodbUri: process.env.MONGODB_URI || "",
    jwtSecret: process.env.JWT_SECRET || "",
    jwtExpires: process.env.JWT_EXPIRES || "",
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
    brevoApiKey: process.env.BREVO_API_KEY || "",
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
  };

  return cachedEnv;
}

export default getEnv;
