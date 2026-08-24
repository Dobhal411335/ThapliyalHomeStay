import mongoose from "mongoose";

const ContactEnquirySchema = new mongoose.Schema(
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
    plan: {
      type: String,
      trim: true,
      default: "",
    },
    startDate: {
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

export default mongoose.models.ContactEnquiry ||
  mongoose.model("ContactEnquiry", ContactEnquirySchema);
