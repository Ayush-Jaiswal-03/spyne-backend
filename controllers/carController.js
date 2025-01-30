import Car from "../models/carModel.js"
import { v2 as cloudinary } from "cloudinary";

export const createCar = async (req, res) => {
    // console.log("Received body:", req.body);  // Debugging: Check request data
    // console.log(req.files)
    const { title, description, tags } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
    }

    try {
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            uploadedImages = await Promise.all(
                req.files.map(async (file) => {
                    const base64Image = file.buffer.toString("base64");
                    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
                        upload_preset: "car_management",
                    });
                    return result.secure_url;
                })
            );
        }

        const car = await Car.create({
            user: req.user._id,
            title,
            description,
            tags: JSON.parse(tags),
            images: uploadedImages,
        });

        res.status(201).json(car);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getCars = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: "i" } },
                    { description: { $regex: req.query.keyword, $options: "i" } },
                    { "tags.car_type": { $regex: req.query.keyword, $options: "i" } },
                    { "tags.company": { $regex: req.query.keyword, $options: "i" } },
                    { "tags.dealer": { $regex: req.query.keyword, $options: "i" } },
                ],
            }
            : {}

        const cars = await Car.find({ user: req.user._id, ...keyword })
        res.json(cars)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

export const getCarById = async (req, res) => {
    try {
        // Validate if the ID is a valid ObjectId
        // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        //     return res.status(400).json({ message: "Invalid car ID format" });
        // }
        // console.log("inside function");
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        // console.log("after fetching");
        // Check if the user is authorized to view the car
        if (car.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this car" });
        }
        // console.log("before returning");
        res.json(car);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateCar = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const images = req.files ? req.files.map((file) => file.buffer.toString("base64")) : [];

        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        car.title = title || car.title;
        car.description = description || car.description;
        car.tags = tags || car.tags;
        car.images = [...car.images, ...images];  // Add new images to existing ones

        await car.save();
        res.json(car);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)

        if (car && car.user.toString() === req.user._id.toString()) {
            await Car.deleteOne({ _id: req.params.id });
            res.json({ message: "Car removed" })
        } else {
            res.status(404).json({ message: "Car not found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" })
    }
}

