import express from "express";
import { createRoom,getAvailableRooms, deleteRoom, getRoom, getRooms, updateRoom, updateRoomAvailability } from "../controllers/room.js";
import { verifyAdmin, verifyHost } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/available", getAvailableRooms);

// Các route khác
router.post("/:hotelid", createRoom);
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", verifyHost, updateRoom);
router.delete("/:id/:hotelid", verifyHost, deleteRoom);
router.get("/:id", getRoom);
router.get("/", getRooms);

export default router;
