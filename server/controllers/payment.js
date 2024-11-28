import paymentService from "../service/paymentService.js";
import Booking from "../models/Booking.js";

const paymentController = {
  // Thanh toán tiền cọc
  payDeposit: async (req, res) => {
    const { bookingId } = req.body; // Lấy thông tin booking từ body request

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required." });
    }

    try {
      // Lấy thông tin booking từ database
      const booking = await Booking.findById(bookingId).populate('roomId');
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }

      const pricePerNight = booking.roomId.price; // Lấy giá phòng
      const checkInDate = new Date(booking.checkInDate); // Ngày nhận phòng
      const checkOutDate = new Date(booking.checkOutDate); // Ngày trả phòng
      
      // Tính số đêm
      const nights = (checkOutDate - checkInDate) / (1000 * 3600 * 24);
      const deposit = pricePerNight * nights * 0.3; // Tính 30% tiền cọc

      // Tạo thông tin thanh toán VNPAY
      const orderInfo = `Deposit payment for booking ${bookingId}`;
      const amount = deposit;

      // Gửi yêu cầu tạo thanh toán đến VNPAY
      const paymentUrl = await paymentService.createPayment({ orderInfo, amount });

      res.status(200).json({ paymentUrl });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Xử lý kết quả trả về từ VNPAY sau khi thanh toán thành công
  handlePaymentReturn: async (req, res) => {
    const vnp_ResponseCode = req.query.vnp_ResponseCode;
    const vnp_TxnRef = req.query.vnp_TxnRef;

    if (vnp_ResponseCode === '00') {
      // Thanh toán thành công, cập nhật trạng thái booking thành "paid"
      const booking = await Booking.findOneAndUpdate(
        { _id: vnp_TxnRef }, // Tìm kiếm booking theo TxnRef (bookingId)
        { status: 'paid' }, // Cập nhật trạng thái
        { new: true }
      );

      if (booking) {
        res.status(200).json({ message: "Payment successful. Booking status updated to 'paid'." });
      } else {
        res.status(404).json({ message: "Booking not found." });
      }
    } else {
      res.status(400).json({ message: "Payment failed or cancelled." });
    }
  },
};

export default paymentController;
