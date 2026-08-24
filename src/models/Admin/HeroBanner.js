import { Schema, models, model } from "mongoose";

const HeroBannerSchema = new Schema({
    buttonLink: { type: String },
    frontImg: { url: { type: String }, key: { type: String } },
    mobileImg: { url: { type: String }, key: { type: String } }
}, { timestamps: true });

export default models.HeroBanner || model("HeroBanner", HeroBannerSchema);