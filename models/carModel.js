import mongoose from "mongoose"

const carSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: [{ type: String }],
        tags: {
            car_type: { type: String },
            company: { type: String },
            dealer: { type: String },
        },
    },
    { timestamps: true },
)

const Car = mongoose.model("Car", carSchema)
export default Car

