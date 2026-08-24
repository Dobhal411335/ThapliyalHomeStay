import mongoose from "mongoose";

const RoomEnquirySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
      trim: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    roomSnapshot: {
      image: { type: String, default: "" },
      code: { type: String, default: "" },
      price: { type: Number },
    },
    enquiryId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    arrival: {
      type: Date,
      required: true,
    },
    roomNo: {
      type: Number,
      required: true,
      min: 1,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
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
      required: true,
      trim: true,
      default: "+91",
    },
    callNo: {
      type: String,
      required: true,
      trim: true,
    },
    altCallNo: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    adult: {
      type: Number,
      required: true,
      min: 1,
    },
    infant: {
      type: Number,
      default: 0,
      min: 0,
    },
    child: {
      type: Number,
      default: 0,
      min: 0,
    },
    specialReq: {
      type: String,
      default: "",
      trim: true,
    },
    offers: {
      type: [String],
      default: [],
    },
    estimatedAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Confirmed", "Closed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.RoomEnquiry ||
  mongoose.model("RoomEnquiry", RoomEnquirySchema);
