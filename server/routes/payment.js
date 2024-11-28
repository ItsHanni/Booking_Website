import express from "express";
import paymentController from "../controllers/payment.js";

const router = express.Router();

// Route thanh toán cọc
router.post("/pay-deposit", paymentController.payDeposit);

// Route xử lý kết quả trả về từ VNPAY
router.get("/return", paymentController.handlePaymentReturn);

export default router;
