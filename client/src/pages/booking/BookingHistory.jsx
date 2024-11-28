import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import axios from "axios"; 
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 
import './bookingHistory.css'; 

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error, reFetch } = useFetch(user ? `http://localhost:8800/api/bookings/history?userId=${user._id}` : null);
  const [canceling, setCanceling] = useState(false); 

  const handleCancelBooking = async (bookingId) => {
    setCanceling(true);
    try {
      await axios.put(`http://localhost:8800/api/bookings/cancel/${bookingId}`);
      toast.success("Đã hủy đặt phòng thành công!"); 
      reFetch(); 
    } catch (err) {
      console.error("Có lỗi khi hủy đặt phòng:", err);
      toast.error("Có lỗi xảy ra khi hủy đặt phòng."); 
    } finally {
      setCanceling(false);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const response = await axios.post(
        `http://localhost:8800/api/payment/pay-deposit`,
        { bookingId } // Dữ liệu gửi lên API
      );
  
      const paymentUrl = response.data.paymentUrl; // URL nhận từ backend VNPay
  
      if (paymentUrl) {
        window.location.href = paymentUrl; // Chuyển hướng đến VNPay
      } else {
        toast.error("Không nhận được URL thanh toán từ VNPay.");
      }
    } catch (err) {
      console.error("Có lỗi khi thực hiện thanh toán:", err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi thực hiện thanh toán.");
    }
  };
  

  if (!user) {
    return <p className="no-bookings">Vui lòng đăng nhập để xem lịch sử đặt phòng.</p>;
  }

  if (loading) return <p className="loader">Đang tải...</p>;
  if (error) return <p className="no-bookings">Đã xảy ra lỗi: {error.message}</p>;

  return (
    <div>
      <Navbar />
      <div className="booking-container">
        <h2>Lịch sử đặt phòng</h2>
        {data.length > 0 ? (
          data.map((booking) => {
            const nights = (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 3600 * 24);
            const deposit = (booking.roomId.price * nights * 0.3).toFixed(2); 

            return (
              <div className={`booking-item ${booking.status}`} key={booking._id}>
                <h3>Khách sạn: {booking.hotelId.name}</h3>
                <p>Phòng: {booking.roomId.title}</p>
                <p>Ngày nhận phòng: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                <p>Ngày trả phòng: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                <p>Số tiền cọc cần thanh toán: {deposit} VNĐ</p>
                <p className={`booking-status ${booking.status}`}>
                  Trạng thái: {booking.status}
                </p>

                {/* Điều kiện hiển thị nút */}
                {booking.status === 'waitingPayment' ? (
                  <>
                    <button className="payment-button" onClick={() => handlePayment(booking._id)}>
                      Thanh toán
                    </button>
                    <button className="cancel-button" onClick={() => handleCancelBooking(booking._id)} disabled={canceling}>
                      {canceling ? "Đang hủy..." : "Hủy đặt phòng"}
                    </button>
                  </>
                ) : null}
              </div>
            );
          })
        ) : (
          <p className="no-bookings">Không có đặt phòng nào.</p>
        )}
      </div>
      <MailList />
      <Footer />
      <ToastContainer /> 
    </div>
  );
};

export default BookingHistory;
