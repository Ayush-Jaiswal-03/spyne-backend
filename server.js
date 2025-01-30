import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import carRoutes from "./routes/carRoutes.js"
import cloudinary from "cloudinary";
import { fileURLToPath } from "url";
import path from "path";



dotenv.config()

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000
});

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/users", userRoutes)
app.use("/api/cars", carRoutes)
app.get("/api/docs", (req, res) => {
    const filePath = path.join(__dirname, "documentation.txt");
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Error sending file");
        }
    });
});



const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

