import { models, Schema, model } from "mongoose";

const PackageSchema = new Schema({
    reviews: { type: [Schema.Types.ObjectId], ref: "Review" },
    link: { type: String },
    active: { type: Boolean },
    order: { type: Number },
    packageCode: { type: String },
    packageName: { type: String },
    slug: { type: String, unique: true },
    titleLine: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    isDirect: { type: Boolean, default: false },
    price: { type: Number },
    priceUsd: { type: Number, default: 0 },
    doubleOccupancyPrice: { type: Number, default: 0 },
    doubleOccupancyPriceUsd: { type: Number, default: 0 },
    priceUnit: { type: String },
    basicDetails: {
        thumbnail: { url: { type: String }, key: { type: String } },
        imageBanner: { url: { type: String }, key: { type: String } },
        location: { type: String },
        groupBooking: { type: String },
        tourType: { type: String },
        duration: { type: Number },
        notice: { type: String },
        smallDesc: { type: String },
        fullDesc: { type: String },
        highlights: [
            {
                highlightName: { type: String },
                highlightDesc: [{ type: String }],
            }
        ],
        tableData: [
            {
                tableName: { type: String },
                tableDesc: [{ type: String }],
            }
        ],
        nightStops: [{ type: String }],
    },
    info: [{
        typeOfSelection: { type: String },
        selectionTitle: { type: String },
        selectionDesc: { type: String },
        selectionHighlight: [
            {
                highlightName: { type: String },
                highlightDesc: [{ type: String }],
            }
        ],
        selectionTable: [
            {
                tableName: { type: String },
                tableDesc: [{ type: String }],
            }
        ],
        order: { type: Number },
    }],
    gallery: [{
        url: { type: String },
        key: { type: String },
    }],
    hotels: [{
        days: { type: String },
        cityName: { type: String },
        hotelName: { type: String },
    }],
    summary: [{
        days: { type: String },
        description: [{ type: String }],
    }],
    includePackage: [{
        selectionTable: [
            {
                tableName: { type: String },
                tableDesc: [{ type: String }],
            }
        ],
        selectionHighlight: [
            {
                highlightName: { type: String },
                highlightDesc: [{ type: String }],
            }
        ],
        selectionDesc: { type: String },
        order: { type: Number },
    }],
    createPlanType: [{
        day: { type: String },
        state: { type: String },
        city: { type: String },
    }],
    vehiclePlan: {
        vehicleName1: { type: String },
        vehicleName2: { type: String },
        vehicleName3: { type: String },
        vehiclePrice1: { type: Number },
        vehiclePrice2: { type: Number },
        vehiclePrice3: { type: Number },
        pickup: {
            state: { type: String },
            city: { type: String },
            price1: { type: String },
            price2: { type: String },
            price3: { type: String },
            vehicleType: [String],
        },
        drop: {
            state: { type: String },
            city: { type: String },
            price1: { type: String },
            price2: { type: String },
            price3: { type: String },
            vehicleType: [String],
        }
    },
    isTrending: { type: Boolean, default: false },
});

export default models.Package || model("Package", PackageSchema);