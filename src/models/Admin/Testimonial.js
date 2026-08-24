import { Schema, models, model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    titleTag: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: { type: String, default: "" },
      key: { type: String, default: "" },
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default models.Testimonial || model("Testimonial", TestimonialSchema);
