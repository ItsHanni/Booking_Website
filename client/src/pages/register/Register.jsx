import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./register.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
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
      toast.error("Vui lòng chọn một ảnh.");
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
        img: imageUrl, // Thêm URL của ảnh vào dữ liệu
      });

      toast.success("Đăng ký thành công!");
      navigate("/login"); // Chuyển hướng đến trang login sau khi đăng ký thành công
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Đã xảy ra lỗi trong quá trình đăng ký.");
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div>
      <Navbar/>
      <Header type="list" />
      <div className="register">
        <form onSubmit={handleRegister}>
          <h2>Đăng ký</h2>
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
        <ToastContainer />
      </div>    
    </div>
  );
};

export default Register;
