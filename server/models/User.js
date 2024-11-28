import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {  // Trường mới để xác định vai trò
      type: String,
      enum: ['user', 'host', 'admin'],  // Các giá trị hợp lệ cho vai trò
      default: 'user',  // Mặc định là user
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel' // Đảm bảo trường wishlist là một mảng tham chiếu đến Hotel
    }],
    reservationList: [{  // Danh sách đặt phòng
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    }],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);