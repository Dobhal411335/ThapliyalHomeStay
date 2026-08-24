import { Schema, models, model } from "mongoose";

const FilterBannerSchema = new Schema(
    {
        image: {
            url: { type: String, required: true },
            key: { type: String },
        },
        buttonLink: { type: String },
    },
    { timestamps: true }
);

export default models.FilterBanner || model("FilterBanner", FilterBannerSchema);
