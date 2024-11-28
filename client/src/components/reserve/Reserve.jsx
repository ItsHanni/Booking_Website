import { useContext, useState } from "react"; 
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import "./reserve.css";

const Reserve = ({ setOpen, hotelId }) => {
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const checkInDate = new Date(dates[0].startDate);
  const checkOutDate = new Date(dates[0].endDate);

  // Gọi API để lấy danh sách roomNumbers trống
  const { data: availableRoomNumbers, loading, error } = useFetch(
    `/rooms/available?hotelId=${hotelId}&checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}`
  );

  const handleSelectRoom = (roomId) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động gửi form mặc định
  
    if (selectedRooms.length > 0) {
      const bookingData = {
        userId: user ? user._id : null,
        hotelId,
        roomId: selectedRooms,
        roomNumber: selectedRooms.map(roomId => 
          availableRoomNumbers.find(room => room.roomId === roomId).roomNumber
        )[0], // Lấy số phòng đầu tiên và chuyển thành chuỗi
        checkInDate: checkInDate.toISOString().split("T")[0], // YYYY-MM-DD
        checkOutDate: checkOutDate.toISOString().split("T")[0],
      };
  
      console.log("Booking Data:", bookingData); // Kiểm tra dữ liệu
  
      try {
        const response = await fetch("http://localhost:8800/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });
  
        const result = await response.json();
        if (response.ok) {
          toast.success("Đặt phòng thành công!");
          setOpen(false);
        } else {
          toast.error("Đặt phòng thất bại: " + result.message);
        }
      } catch (error) {
        console.error("Error booking room:", error);
        toast.error("Đã xảy ra lỗi khi đặt phòng.");
      }
    } else {
      toast.warning("Vui lòng chọn ít nhất một phòng.");
    }
  };
  
  
  // Nhóm các phòng có cùng ID
  const groupedRooms = availableRoomNumbers.reduce((acc, room) => {
    const existing = acc.find((r) => r.roomId === room.roomId);
    if (existing) {
      existing.roomNumbers.push(room.roomNumber);
    } else {
      acc.push({ ...room, roomNumbers: [room.roomNumber] });
    }
    return acc;
  }, []);

  return (
    <div className="reserve">
      <form className="rContainer" onSubmit={handleBooking}>
        <span className="rClose" onClick={() => setOpen(false)}>✖</span>
        <h2 className="rTitle">Các phòng trống</h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p>Đã xảy ra lỗi: {error.message}</p>
        ) : groupedRooms.length > 0 ? (
          groupedRooms.map((item) => (
            <div className="rItem" key={item.roomId}>
              <div className="rItemInfo">
                <h3 className="rRoomTitle">{item.title}</h3>
                <div className="rDesc">{item.desc}</div>
                <div className="rMax">
                  Max people: <b>{item.maxPeople}</b>
                </div>
                <div className="rPrice">Giá: {item.price} VNĐ</div>
              </div>
              <div className="rSelectRooms">
                {item.roomNumbers.map((roomNumber, index) => (
                  <div className="room" key={index}>
                    <label>{roomNumber}</label>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectRoom(item.roomId)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Đã hết phòng.</p>
        )}
        <button className="rButton" type="submit" disabled={selectedRooms.length === 0}>
          Đặt phòng
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Reserve;
