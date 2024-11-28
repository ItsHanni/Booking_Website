import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Hàm để lấy dữ liệu doanh thu trong 6 tháng
const fetchRevenueData = async () => {
  try {
    const response = await axios.get("http://localhost:8800/api/stats/revenue-6-months");
    return response.data;  // Dữ liệu doanh thu từ backend
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return [];
  }
};

const Chart = ({ aspect, title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu doanh thu khi component mount
    const getRevenueData = async () => {
      const revenueData = await fetchRevenueData();
      
      // Chuyển đổi dữ liệu thành dạng phù hợp với biểu đồ
      const formattedData = revenueData.monthlyRevenue.map((revenue, index) => {
        const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]; // Tên tháng từ index
        return {
          name: monthName,
          Total: revenue,  // Sử dụng doanh thu làm giá trị
        };
      });

      setData(formattedData);  // Cập nhật dữ liệu vào state
    };

    getRevenueData();
  }, []);

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
