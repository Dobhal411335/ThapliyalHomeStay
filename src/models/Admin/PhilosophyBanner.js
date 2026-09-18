import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, default: "" },
    key: { type: String, default: "" },
  },
  { _id: false }
);

const PhilosophyBannerSchema = new Schema(
  {
    philosophyTrustImage: {
      type: ImageSchema,
      default: () => ({ url: "", key: "" }),
    },
    ctaHowItWorksImage: {
      type: ImageSchema,
      default: () => ({ url: "", key: "" }),
    },
  },
  { timestamps: true }
);

export default models.PhilosophyBanner ||
  model("PhilosophyBanner", PhilosophyBannerSchema);
