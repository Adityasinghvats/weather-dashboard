import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema(
    {
        year: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        temperature: {
            type: String,
            required: true,
            trim: true,
        },
        humidity: {
            type: String,
            required: true,
            trim: true,
        },
        rainfall: {
            type: String,
            required: true,
            trim: true,
        }
    },
    { timestamps: true }
)
dataSchema.index({ year: "text", temperature: "text", humidity: "text", rainfall: "text" });
export const Data = mongoose.model("Data", dataSchema)