import React, { useState, useEffect } from "react";
import axios from "axios";
import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

// Hàm gọi API để lấy tổng doanh thu trong ngày, tuần và tháng
const fetchRevenueData = async () => {
  try {
    const response = await axios.get("http://localhost:8800/api/stats/total-booking-stats");
    return response.data;  // Dữ liệu doanh thu từ backend
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return {
      revenueToday: 0,
      revenueThisWeek: 0,
      revenueThisMonth: 0,
    };
  }
};

const Featured = () => {
  const [revenueToday, setRevenueToday] = useState(0);
  const [revenueThisWeek, setRevenueThisWeek] = useState(0);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);

  useEffect(() => {
    const getRevenueData = async () => {
      const revenueData = await fetchRevenueData();

      // Cập nhật trạng thái với dữ liệu doanh thu
      setRevenueToday(revenueData.revenueToday);
      setRevenueThisWeek(revenueData.revenueThisWeek);
      setRevenueThisMonth(revenueData.revenueThisMonth);
    };

    getRevenueData();
  }, []);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={70} text={"70%"} strokeWidth={5} />
        </div>
        <p className="title">Tổng số tiền trong ngày</p>
        <p className="amount">{revenueToday.toLocaleString()} VND</p>
        <p className="desc">Các khoản thanh toán gần đây.</p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Trong tuần</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">{revenueThisWeek.toLocaleString()} VND</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Trong tháng</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">{revenueThisMonth.toLocaleString()} VND</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
