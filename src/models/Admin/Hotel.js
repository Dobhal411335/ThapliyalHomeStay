import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  code: { type: String, required: true },
  titleLine: { type: String, default: "" },
  keywords: { type: [String], default: [] },
  heading: { type: String },
  paragraph: { type: String },
  mainPhoto: { url: { type: String }, key: { type: String } },
  relatedPhotos: [{ url: { type: String }, key: { type: String } }],
  prices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RoomPrice' }],
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RoomAmenities' }],
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
});

export default mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);