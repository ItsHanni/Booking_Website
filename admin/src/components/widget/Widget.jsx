import React, { useEffect, useState } from "react";
import axios from "axios";
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

// Hàm gọi API để lấy thông tin thống kê người dùng
const fetchUserStats = async () => {
  try {
    const response = await axios.get("http://localhost:8800/api/stats/userStats"); // Thay URL phù hợp
    return response.data; // Dữ liệu từ API
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { totalUsers: 0, diff: 0 }; // Giá trị mặc định khi có lỗi
  }
};

// Hàm gọi API để lấy thông tin thống kê đơn đặt phòng
const fetchBookingStats = async () => {
  try {
    const response = await axios.get("http://localhost:8800/api/stats/bookingStats"); // Thay URL phù hợp
    return response.data; // Dữ liệu từ API
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    return { totalBookings: 0, diff: 0 }; // Giá trị mặc định khi có lỗi
  }
};

// Hàm gọi API để  tính tổng số tiền của các booking
const fetchBookingRevenueStats = async () => {
  try {
    const response = await axios.get("http://localhost:8800/api/stats/revenue-stats"); // Thay URL phù hợp
    return response.data; // Dữ liệu từ API
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    return { totalBookings: 0, diff: 0 }; // Giá trị mặc định khi có lỗi
  }
};
const Widget = ({ type }) => {
  const [userStats, setUserStats] = useState({ totalUsers: 0, diff: 0 });
  const [bookingStats, setBookingStats] = useState({ totalBookings: 0, diff: 0 });
  const [bookingRevenueStats, setbookingRevenueStats] = useState({ totalBookingsRevenueStats: 0, diff: 0 });

  // Gọi API lấy thông tin người dùng và đơn đặt phòng
  useEffect(() => {
    const getStats = async () => {
      const userData = await fetchUserStats();
      setUserStats(userData); // Cập nhật state với dữ liệu người dùng

      const bookingData = await fetchBookingStats();
      setBookingStats(bookingData); // Cập nhật state với dữ liệu đơn đặt phòng

      const bookingRevenueData = await fetchBookingRevenueStats();
      setbookingRevenueStats(bookingRevenueData ); // Cập nhật state với dữ liệu đơn đặt phòng
    };
    getStats();
  }, []); // Chỉ gọi API khi component mount

  let data;

  switch (type) {
    case "user":
      data = {
        title: "Người dùng",
        isMoney: false,
        link: "See all users",
        amount: userStats.totalUsers,  // Sử dụng số lượng người dùng
        diff: userStats.diff,  // Sự thay đổi % của người dùng
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "Đơn đặt phòng",
        isMoney: false,
        link: "View all orders",
        amount: bookingStats.bookingsThisMonth || 0,  // Kiểm tra giá trị hợp lệ trước khi sử dụng
        diff: bookingStats. percentageChange || 0,  // Kiểm tra giá trị hợp lệ trước khi sử dụng
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "Tiền cọc",
        isMoney: true,
        link: "View net earnings",
        amount: bookingRevenueStats.revenueThisMonthPaid||0,
        diff: bookingRevenueStats.percentageChangePaid||0,
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "Tiền trả phòng",
        isMoney: true,
        link: "See details",
        amount: bookingRevenueStats.revenueThisMonthCompleted||0,
        diff: bookingRevenueStats. percentageChangeCompleted||0,
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  // Kiểm tra giá trị hợp lệ của amount trước khi gọi toLocaleString
  const formattedAmount = data.amount !== undefined ? data.amount.toLocaleString() : "0";

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "₫"} {formattedAmount} {/* Hiển thị số lượng hoặc số tiền */}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className={`percentage ${data.diff >= 0 ? "positive" : "negative"}`}>
          <KeyboardArrowUpIcon />
          {data.diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
