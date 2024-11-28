import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../../components/sidebar/SideBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import "./list.css";

const List = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8800/api/hotels'); // Lấy tất cả khách sạn
        setHotels(res.data);
      } catch (err) {
        setError(true);
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/hotels/${id}`);
      setHotels(hotels.filter((hotel) => hotel._id !== id));
      toast.success("Khách sạn đã được xóa thành công!");
    } catch (err) {
      console.error("Failed to delete hotel:", err);
      toast.error("Xóa khách sạn thất bại!");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Failed to load hotels.</div>;

  return (
    <div className="list-container">
      <ToastContainer />
      <SideBar />
      <h1 className="title">Danh sách khách sạn</h1>
      <table className="hotel-table">
        <thead>
          <tr>
            <th>Hình Ảnh</th>
            <th>Tên Khách Sạn</th>
            <th>Giá Thấp Nhất</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <tr key={hotel._id}>
                <td>
                  <img src={hotel.photos[0] || "default_image.jpg"} className="hotel-image" alt="Hotel" />
                </td>
                <td>{hotel.name}</td>
                <td>${hotel.cheapestPrice}</td>
                <td>
                  <button className="update-button">Cập nhật</button>
                  <button className="delete-button" onClick={() => handleDelete(hotel._id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không có khách sạn nào được thêm vào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;
