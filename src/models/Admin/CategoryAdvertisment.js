import { Schema, models, model } from "mongoose";

const CategoryAdvertismentSchema = new Schema({
    buttonLink: { type: String},
    image: { url: { type: String }, key: { type: String } },
}, { timestamps: true });

export default models.CategoryAdvertisment || model("CategoryAdvertisment", CategoryAdvertismentSchema);