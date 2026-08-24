import mongoose from "mongoose";

const EnquiryPageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    countryCode: {
      type: String,
      default: "+91",
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      required: true,
    },
    guests: {
      type: String,
      required: true,
      trim: true,
    },
    dates: {
      type: String,
      trim: true,
      default: "",
    },
    experiences: {
      type: [String],
      default: [],
    },
    accommodation: {
      type: String,
      trim: true,
      default: "",
    },
    dietary: {
      type: String,
      trim: true,
      default: "",
    },
    budget: {
      type: String,
      trim: true,
      default: "",
    },
    hopes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Closed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.EnquiryPage ||
  mongoose.model("EnquiryPage", EnquiryPageSchema);
