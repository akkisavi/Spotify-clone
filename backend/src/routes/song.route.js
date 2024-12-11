import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/authMiddleware.js";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from "../controller/song.controller.js";

const router = Router();

router.get("/", protectRoute, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/showall", getAllSongs);

export default router;
