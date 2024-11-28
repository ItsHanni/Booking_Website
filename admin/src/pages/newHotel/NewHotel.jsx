import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import "./newHotel.scss";

const NewHotel = () => {
  const [hotelData, setHotelData] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    distance: "",
    title: "",
    desc: "",
    cheapestPrice: "",
    featured: false,
    photos: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Thêm trạng thái cho thông báo
  const [errorMessage, setErrorMessage] = useState(""); // Thêm trạng thái cho thông báo lỗi

  // Hàm xử lý thay đổi trong các input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelData({
      ...hotelData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Hàm xử lý thay đổi ảnh được chọn
  const handleFileChange = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);

    // Tạo URL xem trước hình ảnh
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  // Hàm tạo khách sạn mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo FormData để upload hình ảnh lên Cloudinary
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
      formData.append("upload_preset", "upload");
    });

    try {
      const uploadRes = await Promise.all(
        selectedFiles.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/djqfhed9n/image/upload",
            data
          );
          return response.data.url;
        })
      );
      setHotelData({ ...hotelData, photos: uploadRes });

      // Gửi dữ liệu khách sạn lên server
      const res = await axios.post("http://localhost:8800/api/hotels", hotelData);
      
      // Xử lý thông báo thành công
      setSuccessMessage("Khách sạn đã được tạo thành công!");
      setErrorMessage(""); // Đặt lại thông báo lỗi nếu có

      // Xử lý form sau khi tạo khách sạn thành công
      setHotelData({
        name: "",
        type: "",
        city: "",
        address: "",
        distance: "",
        title: "",
        desc: "",
        cheapestPrice: "",
        featured: false,
        photos: [],
      });
      setSelectedFiles([]);
      setImagePreviewUrls([]);
    } catch (err) {
      console.error("Error creating hotel:", err);
      setErrorMessage("Có lỗi xảy ra khi tạo khách sạn.");
      setSuccessMessage(""); // Đặt lại thông báo thành công nếu có
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Tạo Khách Sạn Mới</h1>
        </div>
        <div className="create-hotel-container">
          <form className="create-hotel-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên khách sạn:</label>
              <input
                type="text"
                name="name"
                value={hotelData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Loại khách sạn:</label>
              <input
                type="text"
                name="type"
                value={hotelData.type}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Thành phố:</label>
              <input
                type="text"
                name="city"
                value={hotelData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={hotelData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Khoảng cách:</label>
              <input
                type="text"
                name="distance"
                value={hotelData.distance}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Tiêu đề:</label>
              <input
                type="text"
                name="title"
                value={hotelData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Mô tả:</label>
              <textarea
                name="desc"
                value={hotelData.desc}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Giá rẻ nhất:</label>
              <input
                type="number"
                name="cheapestPrice"
                value={hotelData.cheapestPrice}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Ảnh khách sạn:</label>
              <input
                type="file"
                name="photos"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <div className="image-previews">
              {imagePreviewUrls.length > 0 &&
                imagePreviewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index}`}
                    className="image-preview"
                  />
                ))}
            </div>
            <div className="form-group">
              <label>Khách sạn nổi bật:</label>
              <input
                type="checkbox"
                name="featured"
                checked={hotelData.featured}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Tạo khách sạn</button>
          </form>

          {/* Thông báo thành công */}
          {successMessage && <div className="success-message">{successMessage}</div>}
          {/* Thông báo lỗi */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
