import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  updateHotel,
  getAllHotels,
  getHotelCities,
  getHotels
} from "../controllers/hotel.js";
import {verifyAdmin,verifyHost} from "../utils/verifyToken.js"
const router = express.Router();

//CREATE
router.post("/", createHotel);

//UPDATE
router.put("/:id", verifyHost, updateHotel);
//DELETE
router.delete("/:id", deleteHotel);
//GET

router.get("/find/:id", getHotel);
//GET ALL
router.get("/cities", getHotelCities);

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
router.get("/", getAllHotels);
router.get("/all", getHotels);

export default router;