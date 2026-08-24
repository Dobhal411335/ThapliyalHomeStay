import mongoose from "mongoose";

const PackageEnquirySchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    packageSnapshot: {
      image: { type: String, default: "" },
      location: { type: String, default: "" },
      duration: { type: Number },
      tourType: { type: String, default: "" },
      price: { type: Number },
      priceUnit: { type: String, default: "" },
      doubleOccupancyPrice: { type: Number, default: 0 },
    },
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
    },
    dates: {
      type: String,
      default: "",
    },
    accommodation: {
      type: String,
      default: "",
    },
    hopes: {
      type: String,
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

export default mongoose.models.PackageEnquiry ||
  mongoose.model("PackageEnquiry", PackageEnquirySchema);
