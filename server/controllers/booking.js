import Booking from "../models/Booking.js"; // Giữ lại dòng này
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js"; 
import nodemailer from "nodemailer";
import { sendEmail } from "../utils/sendMail.js";
import moment from "moment"; 

// Đặt phòng
export const bookRoom = async (req, res) => {
  const { userId, hotelId, roomId, roomNumber, checkInDate, checkOutDate } = req.body;

  try {
    // Log dữ liệu nhận được
    console.log("Booking Data:", req.body);

    // Kiểm tra xem tất cả các trường đã được cung cấp
    if (!userId || !hotelId || !roomId || !roomNumber || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Thiếu thông tin đặt phòng." });
    }

    // Tạo một booking mới với roomNumber
    const newBooking = new Booking({
      userId,
      hotelId,
      roomId,
      roomNumber,
      checkInDate,
      checkOutDate,
    });

    // Lưu booking vào cơ sở dữ liệu
    const savedBooking = await newBooking.save();

    // Cập nhật trạng thái phòng, đánh dấu các phòng này là không còn trống
    await Room.updateMany(
      { _id: { $in: roomId } },
      { $set: { available: false } }
    );

    return res.status(200).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error); // Log lỗi chi tiết
    return res.status(500).json({ message: "Đặt phòng thất bại.", error: error.message });
  }
};


export const getUserBookingHistory = async (req, res, next) => {
  const userId = req.query.userId; // Nhận userId từ query params
  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Lấy tất cả các đặt phòng của người dùng
    const bookings = await Booking.find({ userId }).populate('hotelId roomId');

    // Tính 30% tiền cọc cho mỗi đặt phòng
    const bookingsWithDeposit = bookings.map((booking) => {
      const pricePerNight = booking.roomId.price; // Lấy giá phòng từ booking
      const checkInDate = new Date(booking.checkInDate); // Ngày nhận phòng
      const checkOutDate = new Date(booking.checkOutDate); // Ngày trả phòng
      
      // Tính số đêm giữa ngày nhận và trả phòng
      const nights = (checkOutDate - checkInDate) / (1000 * 3600 * 24);
      const deposit = (pricePerNight * nights * 0.3).toFixed(2); // Tính 30% tiền cọc

      return {
        ...booking._doc, // Spread để lấy toàn bộ thông tin booking hiện tại
        deposit: parseFloat(deposit) // Thêm trường deposit vào mỗi booking
      };
    });

    res.status(200).json(bookingsWithDeposit); // Trả về danh sách booking với thông tin cọc
  } catch (err) {
    next(err); // Gọi next để xử lý lỗi
  }
};



// Lấy thông tin đặt phòng từ khách sạn của host và bao gồm thông tin phòng
export const getHostBookings = async (req, res, next) => {
  const hostId = req.query.hostId; // Lấy hostId từ query params

  if (!hostId) {
    return res.status(400).json({ message: "Host ID is required." });
  }

  try {
    // Lấy danh sách khách sạn của host
    const hotels = await Hotel.find({ hostId });

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found for this host." });
    }

    // Lấy danh sách các booking của những khách sạn đó
    const bookings = await Booking.find({
      hotelId: { $in: hotels.map(hotel => hotel._id) }
    })
    .populate({
      path: 'roomId', // Populate thông tin của roomId
      model: 'Room',  // Model tương ứng với room
    })
    .populate({
      path: 'userId', // Populate thông tin của userId
      model: 'User',
    })
    .populate({
      path: 'hotelId', // Populate thông tin của hotelId
      model: 'Hotel',  // Model tương ứng với hotel
    });

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// Xóa đặt phòng
export const deleteBooking = async (req, res, next) => {
  const bookingId = req.params.id;

  try {
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json("Booking has been deleted.");
  } catch (err) {
    next(err);
  }
};
  // API để hủy đặt phòng
export const cancelBooking = async (req, res, next) => {
  const bookingId = req.params.id;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true } // Trả về document đã được cập nhật
    );
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

// Lấy tất cả thông tin đặt phòng
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId')  // Nếu bạn muốn hiển thị thông tin người dùng
      .populate('hotelId') // Nếu bạn muốn hiển thị thông tin khách sạn
      .populate('roomId'); // Nếu bạn muốn hiển thị thông tin phòng

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// Hàm cập nhật trạng thái đặt phòng

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    // Tìm booking bằng bookingId
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Kiểm tra nếu trạng thái hiện tại là 'waitingPayment' và đã qua 2 ngày
    if (booking.status === "waitingPayment") {
      const createdAt = moment(booking.updatedAt || booking.createdAt);
      const now = moment();
      const diffInDays = now.diff(createdAt, 'days');

      if (diffInDays >= 2) {
        await Booking.findByIdAndUpdate(bookingId, { status: "cancelled" });
        return res.status(200).json({ success: true, message: "Booking status automatically updated to 'cancelled' due to payment waiting timeout." });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const userEmail = await User.findById(updatedBooking.userId).select("email");

    let subject, text;

    // Gửi email thông báo
    if (status === "confirmed") {
      subject = "Đơn đặt phòng đã được duyệt";
      text = `Đơn đặt phòng số phòng: ${updatedBooking.roomNumber} của bạn tại Luna đã được duyệt. Hãy đặt cọc 30% để thành công giữ phòng, thời gian giữ phòng là 2 ngày, tính từ thời gian bạn nhận được email.
      Xin chân thành cảm ơn.`;
      await sendEmail(userEmail.email, subject, text);
      await Booking.findByIdAndUpdate(bookingId, { status: "waitingPayment", updatedAt: new Date() });
    } else if (status === "rejected") {
      subject = "Đơn đặt phòng đã bị từ chối";
      text = `Đơn đặt phòng của bạn tại Luna đã không được duyệt. Xin lỗi bạn vì sự bất tiện này.`;
      await sendEmail(userEmail.email, subject, text);
    } else if (status === "paid") {
      subject = "Đơn đặt phòng đã hoàn tất thủ tục";
      text = `Đơn đặt phòng tại Luna đã hoàn tất thủ tục thanh toán. Chúng tôi rất vui khi được chào đón bạn trong thời gian tới!`;
      await sendEmail(userEmail.email, subject, text);
    }

    res.status(200).json({ success: true, message: "Booking status updated and email sent." });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ success: false, message: "Error updating booking status." });
  }
};

