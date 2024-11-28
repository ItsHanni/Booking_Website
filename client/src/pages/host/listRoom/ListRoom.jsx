import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../../components/sidebar/SideBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import "./listRoom.css";

const List = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8800/api/rooms'); // Lấy tất cả khách sạn
        setRooms(res.data);
      } catch (err) {
        setError(true);
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/rooms/${id}`);
      setRooms(rooms.filter((room) => room._id !== id));
      toast.success("Phòng đã được xóa thành công!");
    } catch (err) {
      console.error("Failed to delete room:", err);
      toast.error("Xóa phòng thất bại!");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Failed to load rooms.</div>;

  return (
    <div className="list-container">
      <ToastContainer />
      <SideBar />
      <h1 className="title">Danh sách khách sạn</h1>
      <table className="hotel-table">
        <thead>
          <tr>
            <th>Loại phòng</th>
            <th>Giá phòng</th>
            <th>Sô người tối đa</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room._id}>
                <td>{room.title}</td>
                <td>${room.price}</td>
                <td>{room.maxPeople}</td>
                <td>
                  <button className="update-button">Cập nhật</button>
                  <button className="delete-button" onClick={() => handleDelete(room._id)}>Xóa</button>
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
