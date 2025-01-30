import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { createCar, getCars, getCarById, updateCar, deleteCar } from "../controllers/carController.js"
import multer from "multer";

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, upload.array("images"), createCar)
router.get("/", protect, getCars)
router.get("/:id", protect, getCarById)
router.put("/:id", protect, upload.array("images"), updateCar)
router.delete("/:id", protect, deleteCar)

export default router

