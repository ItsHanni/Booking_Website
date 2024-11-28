import express from "express";
import { getUserStats,
    getBookingStats,
    getBookingRevenueStats,
    getBookingTotal,
    getBookingRevenueLast6Months,
    addToWishlist,
    getWishlist,
    removeFromWishlist
 } from "../controllers/stats.js";

const router = express.Router();

// Route thống kê
router.get("/userStats", getUserStats);
router.get("/bookingStats", getBookingStats);
router.get("/revenue-stats", getBookingRevenueStats); 
router.get("/total-booking-stats", getBookingTotal);
router.get("/revenue-6-months", getBookingRevenueLast6Months);
// Thêm khách sạn vào wishlist
router.post("/wishlist/:userid/:hotelId", addToWishlist);
router.get("/wishlist/:userid", getWishlist);
router.delete("/wishlist/:userid/:hotelid", removeFromWishlist);


export default router;
