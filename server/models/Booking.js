 import mongoose from "mongoose";

 const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    roomNumber: {
        type: String,
        required: true,
      },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: [
            "waitingConfirmation",  // Chờ xác nhận
            "rejected",
            "confirmed",            // Đã xác nhận
            "waitingPayment",       // Đang chờ thanh toán
            "paid",                 // Đã thanh toán
            "checkIn",              // Check-in
            "cancelled",            // Đã hủy
            "completed"             // Hoàn tất
        ],
        default: "waitingConfirmation",
    },
}, { timestamps: true });


export default mongoose.model("Booking", BookingSchema);