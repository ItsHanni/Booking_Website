import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const New = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // State để lưu thông báo

  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage({ text: "Vui lòng chọn một ảnh.", type: "error" });
      return;
    }

    // Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "upload"); // Thay thế bằng preset của bạn

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/djqfhed9n/image/upload", // Thay thế bằng Cloud Name của bạn
        formData
      );

      const imageUrl = response.data.secure_url; // Lấy URL của ảnh đã upload

      // Gửi thông tin đăng ký đến server
      await axios.post("http://localhost:8800/api/auth/register", {
        username,
        email,
        password,
        country,
        city,
        phone,
        img: imageUrl,
        role: "host",
      });

      setMessage({ text: "Đăng ký thành công!", type: "success" });
    } catch (error) {
      if (error.response) {
        setMessage({
          text: error.response.data.message || "Đã xảy ra lỗi trong quá trình đăng ký.",
          type: "error",
        });
      } else {
        setMessage({ text: "Đã xảy ra lỗi. Vui lòng thử lại.", type: "error" });
      }
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Tạo tài khoản Host</h1>
        </div>
      <div className="register">
        <form onSubmit={handleRegister}>
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          <input
            type="text"
            placeholder="Tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Quốc gia"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Thành phố"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100px", height: "100px", marginTop: "10px" }}
            />
          )}
          <button type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default New;
