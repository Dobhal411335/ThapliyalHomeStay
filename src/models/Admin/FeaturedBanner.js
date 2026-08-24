import { Schema, models, model } from "mongoose";

const FeaturedBannerSchema = new Schema({
    propertyName: { type: String},
    propertyType: { type: String},
    propertySubDestination: { type: String},
    price: { type: String},
    buttonLink: { type: String},
    image: { url: { type: String }, key: { type: String } },
}, { timestamps: true });

export default models.FeaturedBanner || model("FeaturedBanner", FeaturedBannerSchema);