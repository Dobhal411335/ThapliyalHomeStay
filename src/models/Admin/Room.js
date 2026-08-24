import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  code: { type: String, required: true },
  titleLine: { type: String, default: "" },
  keywords: { type: [String], default: [] },
  paragraph: { type: String },
  mainPhoto: { url: { type: String }, key: { type: String } },
  relatedPhotos: [{ url: { type: String }, key: { type: String } }],
  singleOccupancyPrice: { type: Number, default: 0 },
  doubleOccupancyPrice: { type: Number, default: 0 },
  amenities: [{ type: String }],
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
});

export default mongoose.models.Room || mongoose.model('Room', roomSchema);