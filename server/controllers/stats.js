import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import moment from "moment";

// Lấy thống kê người dùng
export const getUserStats = async (req, res, next) => {
  try {
    // 1. Tổng số người dùng
    const totalUsers = await User.countDocuments();

    // 2. Số người dùng đăng ký trong tháng hiện tại
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const usersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.status(200).json({
      success: true,
      totalUsers,
      usersThisMonth,
    });
  } catch (err) {
    next(err); // Xử lý lỗi chung
  }
};

// Thống kê tổng số đơn booking trong tháng và so sánh với tháng trước
export const getBookingStats = async (req, res, next) => {
  try {
    const startOfMonth = moment().startOf("month").toDate();
    const startOfLastMonth = moment().subtract(1, "month").startOf("month").toDate();
    const endOfLastMonth = moment().subtract(1, "month").endOf("month").toDate();

    // Đếm số lượng đơn booking trong tháng hiện tại
    const bookingsThisMonth = await Booking.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Đếm số lượng đơn booking trong tháng trước
    const bookingsLastMonth = await Booking.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
    });

    // Tính tỷ lệ phần trăm thay đổi so với tháng trước
    let percentageChange = 0;
    if (bookingsLastMonth > 0) {
      percentageChange = ((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth) * 100;
    }

    res.status(200).json({
      success: true,
      bookingsThisMonth,
      bookingsLastMonth,
      percentageChange: percentageChange.toFixed(2), // Lấy 2 chữ số thập phân
    });
  } catch (err) {
    next(err);
  }
};


// Hàm tính tổng số tiền của các booking theo trạng thái trong tháng
export const getBookingRevenueStats = async (req, res, next) => {
  try {
    const startOfMonth = moment().startOf("month").toDate();
    const startOfLastMonth = moment().subtract(1, "month").startOf("month").toDate();
    const endOfLastMonth = moment().subtract(1, "month").endOf("month").toDate();

    // Lấy các booking trong tháng này có trạng thái 'paid' và 'completed'
    const bookingsThisMonth = await Booking.find({
      createdAt: { $gte: startOfMonth },
      status: { $in: ["paid", "completed"] },
    }).populate("roomId"); // Dùng populate để lấy thông tin phòng (price)

    // Lấy các booking trong tháng trước
    const bookingsLastMonth = await Booking.find({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
      status: { $in: ["paid", "completed"] },
    }).populate("roomId");

    // Hàm tính số tiền của mỗi booking
    const calculateBookingAmount = (booking) => {
      const { checkInDate, checkOutDate, status, roomId } = booking;
      const pricePerNight = roomId.price; // Lấy giá phòng từ phòng
      const checkIn = moment(checkInDate);
      const checkOut = moment(checkOutDate);
      const nights = checkOut.diff(checkIn, "days"); // Số đêm giữa ngày nhận và trả phòng

      // Tính số tiền cơ bản của booking
      let amount = pricePerNight * nights;

      // Tính tiền cọc dựa trên trạng thái
      if (status === "paid") {
        // Nếu trạng thái là 'paid', tính 30% tiền cọc
        amount = (amount * 0.3).toFixed(2); // Chỉ tính 30%
      } else if (status === "completed") {
        // Nếu trạng thái là 'completed', tính 100% tiền
        amount = amount.toFixed(2); // Tính đầy đủ
      }

      return parseFloat(amount);
    };

    // Tính tổng tiền cho các booking 'paid' và 'completed' trong tháng này
    const revenueThisMonthPaid = bookingsThisMonth
      .filter((booking) => booking.status === "paid")
      .reduce((total, booking) => total + calculateBookingAmount(booking), 0);

    const revenueThisMonthCompleted = bookingsThisMonth
      .filter((booking) => booking.status === "completed")
      .reduce((total, booking) => total + calculateBookingAmount(booking), 0);

    // Tính tổng tiền cho các booking 'paid' và 'completed' trong tháng trước
    const revenueLastMonthPaid = bookingsLastMonth
      .filter((booking) => booking.status === "paid")
      .reduce((total, booking) => total + calculateBookingAmount(booking), 0);

    const revenueLastMonthCompleted = bookingsLastMonth
      .filter((booking) => booking.status === "completed")
      .reduce((total, booking) => total + calculateBookingAmount(booking), 0);

    // Tính tỷ lệ phần trăm thay đổi so với tháng trước cho 'paid' và 'completed'
    const percentageChangePaid = revenueLastMonthPaid
      ? ((revenueThisMonthPaid - revenueLastMonthPaid) / revenueLastMonthPaid) * 100
      : 0;

    const percentageChangeCompleted = revenueLastMonthCompleted
      ? ((revenueThisMonthCompleted - revenueLastMonthCompleted) / revenueLastMonthCompleted) * 100
      : 0;

    res.status(200).json({
      success: true,
      revenueThisMonthPaid,
      revenueThisMonthCompleted,
      revenueLastMonthPaid,
      revenueLastMonthCompleted,
      percentageChangePaid: percentageChangePaid.toFixed(2),
      percentageChangeCompleted: percentageChangeCompleted.toFixed(2),
    });
  } catch (err) {
    next(err);
  }
};

// Hàm tính tổng số tiền của các booking trong 1 ngày, 1 tuần, 1 tháng
export const getBookingTotal = async (req, res, next) => {
  try {
    const todayStart = moment().startOf("day").toDate(); // Bắt đầu ngày hôm nay
    const thisWeekStart = moment().startOf("week").toDate(); // Bắt đầu tuần này
    const thisMonthStart = moment().startOf("month").toDate(); // Bắt đầu tháng này

    // Lọc các booking theo trạng thái 'paid' và 'completed' trong ngày hôm nay
    const bookingsToday = await Booking.find({
      createdAt: { $gte: todayStart },
      status: { $in: ["paid", "completed"] },
    }).populate("roomId");

    // Lọc các booking theo trạng thái 'paid' và 'completed' trong tuần này
    const bookingsThisWeek = await Booking.find({
      createdAt: { $gte: thisWeekStart },
      status: { $in: ["paid", "completed"] },
    }).populate("roomId");

    // Lọc các booking theo trạng thái 'paid' và 'completed' trong tháng này
    const bookingsThisMonth = await Booking.find({
      createdAt: { $gte: thisMonthStart },
      status: { $in: ["paid", "completed"] },
    }).populate("roomId");

    // Hàm tính số tiền của mỗi booking
    const calculateBookingAmount = (booking) => {
      const { checkInDate, checkOutDate, status, roomId } = booking;
      const pricePerNight = roomId.price; // Lấy giá phòng từ phòng
      const checkIn = moment(checkInDate);
      const checkOut = moment(checkOutDate);
      const nights = checkOut.diff(checkIn, "days"); // Số đêm giữa ngày nhận và trả phòng

      // Tính số tiền cơ bản của booking
      let amount = pricePerNight * nights;

      // Tính tiền cọc dựa trên trạng thái
      if (status === "paid") {
        // Nếu trạng thái là 'paid', tính 30% tiền cọc
        amount = (amount * 0.3).toFixed(2); // Chỉ tính 30%
      } else if (status === "completed") {
        // Nếu trạng thái là 'completed', tính 100% tiền
        amount = amount.toFixed(2); // Tính đầy đủ
      }

      return parseFloat(amount);
    };

    // Tính tổng tiền cho các booking 'paid' và 'completed' trong hôm nay
    const revenueToday = bookingsToday.reduce((total, booking) => total + calculateBookingAmount(booking), 0);

    // Tính tổng tiền cho các booking 'paid' và 'completed' trong tuần này
    const revenueThisWeek = bookingsThisWeek.reduce((total, booking) => total + calculateBookingAmount(booking), 0);

    // Tính tổng tiền cho các booking 'paid' và 'completed' trong tháng này
    const revenueThisMonth = bookingsThisMonth.reduce((total, booking) => total + calculateBookingAmount(booking), 0);

    res.status(200).json({
      success: true,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,
    });
  } catch (err) {
    next(err);
  }
};

// Hàm tính tổng số tiền của các booking trong 6 tháng
export const getBookingRevenueLast6Months = async (req, res, next) => {
  try {
    const sixMonthsAgo = moment().subtract(6, "months").startOf("month").toDate(); // Thời điểm 6 tháng trước

    // Lọc các booking có ngày tạo từ 6 tháng trước
    const bookings = await Booking.find({
      createdAt: { $gte: sixMonthsAgo },
      status: { $in: ["paid", "completed"] },
    }).populate("roomId");

    // Hàm tính số tiền của mỗi booking
    const calculateBookingAmount = (booking) => {
      const { checkInDate, checkOutDate, status, roomId } = booking;
      const pricePerNight = roomId.price; // Lấy giá phòng từ phòng
      const checkIn = moment(checkInDate);
      const checkOut = moment(checkOutDate);
      const nights = checkOut.diff(checkIn, "days"); // Số đêm giữa ngày nhận và trả phòng

      // Tính số tiền cơ bản của booking
      let amount = pricePerNight * nights;

      // Tính tiền cọc dựa trên trạng thái
      if (status === "paid") {
        // Nếu trạng thái là 'paid', tính 30% tiền cọc
        amount = (amount * 0.3).toFixed(2); // Chỉ tính 30%
      } else if (status === "completed") {
        // Nếu trạng thái là 'completed', tính 100% tiền
        amount = amount.toFixed(2); // Tính đầy đủ
      }

      return parseFloat(amount);
    };

    // Tính tổng doanh thu cho mỗi tháng trong 6 tháng qua
    let monthlyRevenue = [0, 0, 0, 0, 0, 0]; // Mảng để chứa doanh thu của từng tháng (6 tháng)
    const currentMonth = moment().month(); // Lấy tháng hiện tại (0-11)

    // Lặp qua tất cả các booking để tính tổng doanh thu cho từng tháng
    bookings.forEach((booking) => {
      const bookingDate = moment(booking.createdAt); // Lấy ngày tạo booking
      const bookingMonth = bookingDate.month(); // Lấy tháng của booking (0-11)

      // Tính doanh thu của booking
      const bookingAmount = calculateBookingAmount(booking);

      // Lưu tổng doanh thu vào tháng tương ứng trong mảng monthlyRevenue
      const monthIndex = (currentMonth - bookingMonth + 12) % 12; // Tính toán chỉ số tháng trong 6 tháng
      if (monthIndex < 6) {
        monthlyRevenue[monthIndex] += bookingAmount;
      }
    });

    // Đảm bảo mảng monthlyRevenue chỉ chứa doanh thu trong 6 tháng gần nhất
    monthlyRevenue = monthlyRevenue.reverse();

    res.status(200).json({
      success: true,
      monthlyRevenue,
    });
  } catch (err) {
    next(err);
  }
};


export const addToWishlist = async (req, res, next) => {
  const { userid, hotelId } = req.params; // Lấy userId và hotelId từ params

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra khách sạn có tồn tại không
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Kiểm tra wishlist có tồn tại không, nếu không thì khởi tạo là mảng trống
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Kiểm tra nếu khách sạn đã có trong wishlist của user rồi
    if (user.wishlist.includes(hotelId)) {
      return res.status(400).json({ message: "Hotel already in wishlist" });
    }

    // Thêm khách sạn vào wishlist
    user.wishlist.push(hotelId);
    await user.save();

    res.status(200).json({ message: "Hotel added to wishlist" });
  } catch (err) {
    next(err);
  }
};

export const getWishlist = async (req, res, next) => {
  const { userid } = req.params; // Lấy userId từ params

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(userid).populate('wishlist'); // Populate 'wishlist' để lấy thông tin khách sạn
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra nếu người dùng không có wishlist
    if (!user.wishlist || user.wishlist.length === 0) {
      return res.status(404).json({ message: "No hotels in wishlist" });
    }

    // Trả về thông tin khách sạn trong wishlist
    const hotelsInWishlist = await Hotel.find({
      '_id': { $in: user.wishlist }
    });

    res.status(200).json(hotelsInWishlist); // Trả về danh sách khách sạn trong wishlist
  } catch (err) {
    next(err);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  const { userid, hotelid } = req.params;

  try {
    // Tìm người dùng và xóa khách sạn khỏi wishlist
    const user = await User.findByIdAndUpdate(
      userid,
      { $pull: { wishlist: hotelid } },  // Xóa khách sạn khỏi wishlist
      { new: true }  // Trả về bản ghi đã cập nhật
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về danh sách wishlist đã cập nhật
    res.status(200).json({ message: "Hotel removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
};
