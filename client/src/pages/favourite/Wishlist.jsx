import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './wishlist.css';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:8800/api/stats/wishlist/${user._id}`);
          setWishlist(response.data);
          setLoading(false);
        } catch (err) {
          setError("Không thể tải danh sách yêu thích.");
          setLoading(false);
        }
      }
    };
    fetchWishlist();
  }, [user]);

  const handleRemoveFromWishlist = async (hotelId) => {
    setRemoving(true);
    try {
      await axios.delete(`http://localhost:8800/api/stats/wishlist/${user._id}/${hotelId}`);
      setWishlist(wishlist.filter((hotel) => hotel._id !== hotelId)); // Cập nhật lại danh sách yêu thích
      toast.success("Khách sạn đã được xóa khỏi danh sách yêu thích.");
    } catch (err) {
      toast.error("Có lỗi khi xóa khách sạn.");
    } finally {
      setRemoving(false);
    }
  };

  if (!user) {
    return <p className="no-wishlist">Vui lòng đăng nhập để xem danh sách yêu thích.</p>;
  }

  if (loading) return <p className="loader">Đang tải...</p>;
  if (error) return <p className="no-wishlist">Đã xảy ra lỗi: {error}</p>;

  return (
    <div>
      <Navbar />
      <div className="wishlist-container">
        <h2>Danh Sách Yêu Thích</h2>
        {wishlist.length > 0 ? (
          wishlist.map((hotel) => (
            <div className={`wishlist-item ${hotel.status}`} key={hotel._id}>
              <img 
                src={hotel.photos.length > 0 ? hotel.photos[0] : "default-image.jpg"} 
                alt={hotel.name} 
                className="wishlist-img" 
              />
              <div>
                <h3>{hotel.name}</h3>
                <p>Địa chỉ: {hotel.address}</p>
                <p>{hotel.desc}</p>
                <p className={`wishlist-status ${hotel.status}`}>
                  Trạng thái: {hotel.status === 'favorited' ? "Đã yêu thích" : "Đã xóa"}
                </p>
                <div className="button-group">
                  <button 
                    type="button" 
                    onClick={() => handleRemoveFromWishlist(hotel._id)} 
                    className="remove-button" 
                    disabled={removing}
                  >
                    {removing ? "Đang xóa..." : "Xóa khỏi yêu thích"}
                  </button>
                  <button type="button" className="payment-button">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-wishlist">Danh sách yêu thích của bạn đang trống.</p>
        )}
      </div>
      <MailList />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Wishlist;
