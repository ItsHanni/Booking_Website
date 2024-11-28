import Room from "../models/Room.js"; 
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js"

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};


export const getAvailableRooms = async (req, res, next) => {
  const { hotelId, checkInDate, checkOutDate } = req.query;

  try {
    // Lấy tất cả các booking của khách sạn trong khoảng thời gian đã chọn
    const bookings = await Booking.find({
      hotelId,
      $or: [
        { checkInDate: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOutDate: { $lte: checkOutDate, $gt: checkInDate } },
        { checkInDate: { $lte: checkInDate }, checkOutDate: { $gte: checkOutDate } },
      ],
    });

    // Lấy danh sách phòng của khách sạn
    const hotelRooms = await Room.find({ hotelId });

    // Tạo mảng để chứa thông tin roomNumbers còn trống
    const availableRoomNumbers = [];

    // Tạo một mảng chứa các số phòng đã đặt
    const bookedRoomNumbers = bookings.map(booking => booking.roomNumber);

    hotelRooms.forEach(room => {
      if (room.roomNumbers && Array.isArray(room.roomNumbers)) {
        room.roomNumbers.forEach(roomNumber => {

          if (!bookedRoomNumbers.includes(roomNumber.number.toString())) { // So sánh đúng kiểu dữ liệu
            // Nếu roomNumber không bị đặt, thêm vào mảng availableRoomNumbers
            availableRoomNumbers.push({
              roomId: room._id,
              roomNumber: roomNumber.number, // Chỉ cần lấy giá trị số phòng
              title: room.title,
              desc: room.desc,
              price: room.price,
              maxPeople: room.maxPeople,
            });
          }
        });
      }
    });

    res.status(200).json(availableRoomNumbers);
  } catch (err) {
    next(err);
  }
};
