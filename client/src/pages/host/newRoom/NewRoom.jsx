import React, { useContext, useState, useEffect } from "react"; 
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify'; // Thông báo
import 'react-toastify/dist/ReactToastify.css'; // CSS cho thông báo
import { useNavigate } from "react-router-dom"; // Điều hướng trang
import Sidebar from "../../../components/sidebar/SideBar";
import "./newRoom.css";

const NewRoom = () => {
  const { user } = useContext(AuthContext);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [roomData, setRoomData] = useState({
    title: "",
    price: "",
    maxPeople: "",
    desc: "",
    roomNumbers: [], // Thêm trường roomNumbers
  });
  const [newRoomNumber, setNewRoomNumber] = useState(""); // State để lưu số phòng mới
  const navigate = useNavigate();

  // Fetch danh sách tất cả khách sạn
  useEffect(() => {
    const fetchAllHotels = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/hotels/all`);
        setHotels(res.data); // Lưu danh sách khách sạn vào state
      } catch (err) {
        toast.error("Lỗi khi tải danh sách khách sạn.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllHotels();
  }, []);

  // Xử lý khi chọn một khách sạn từ dropdown
  const handleSelectHotel = (e) => {
    setSelectedHotelId(e.target.value);
  };

  // Xử lý khi nhập thông tin phòng
  const handleChange = (e) => {
    setRoomData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Xử lý khi thêm room numbers
  const handleAddRoomNumber = () => {
    if (newRoomNumber) {
      setRoomData((prev) => ({
        ...prev,
        roomNumbers: [...prev.roomNumbers, { number: newRoomNumber }],
      }));
      setNewRoomNumber(""); // Reset trường roomNumber
    } else {
      toast.error("Vui lòng nhập số phòng.");
    }
  };

  // Gửi request tạo phòng mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHotelId) {
      toast.error("Vui lòng chọn một khách sạn.");
      return;
    }

    // Thêm hotelId vào roomData
    const roomDataWithHotelId = {
      ...roomData,
      hotelId: selectedHotelId, // Thêm hotelId vào dữ liệu
    };

    console.log("Sending room data:", roomDataWithHotelId); // Log dữ liệu trước khi gửi

    try {
      await axios.post(`http://localhost:8800/api/rooms/${selectedHotelId}`, roomDataWithHotelId);
      toast.success("Phòng mới đã được tạo thành công!");
      navigate("/host-hotel"); // Điều hướng về danh sách phòng
    } catch (err) {
      console.error("Error during room creation:", err.response?.data || err.message);
      toast.error("Lỗi khi tạo phòng mới.");
    }
  };

  if (loading) return <div>Loading...</div>; // Hiển thị loading khi đang tải dữ liệu

  return (
    <div className="new-room-container">
      <Sidebar />
      <ToastContainer /> {/* ToastContainer để hiển thị thông báo */}
      <div className="form-container">
        <h1>Tạo Phòng Mới</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="hotel">Chọn khách sạn</label>
            <select id="hotel" value={selectedHotelId} onChange={handleSelectHotel}>
              <option value="">-- Chọn khách sạn --</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Loại phòng</label>
            <input
              type="text"
              id="title"
              value={roomData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá</label>
            <input
              type="number"
              id="price"
              value={roomData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxPeople">Số người tối đa</label>
            <input
              type="number"
              id="maxPeople"
              value={roomData.maxPeople}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="desc">Mô tả</label>
            <textarea
              id="desc"
              value={roomData.desc}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="roomNumber">Số phòng mới</label>
            <input
              type="number"
              value={newRoomNumber}
              onChange={(e) => setNewRoomNumber(e.target.value)}
            />
            <button type="button" onClick={handleAddRoomNumber}>Thêm số phòng</button>
          </div>

          <div className="form-group">
            <label>Số phòng đã thêm:</label>
             <ul>
                {roomData.roomNumbers.length > 0 ? (
                roomData.roomNumbers.map((room, index) => (
                <li key={index}>Số phòng: {room.number}</li>
              ))
            ) : (
              <li>Chưa có số phòng nào được thêm.</li>
            )}
            </ul>
          </div>

          <div className="button-container">
            <button type="submit">Tạo Phòng</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewRoom;
