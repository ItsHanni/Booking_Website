import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ListHost from "./pages/host/listHotel/List";
import NewRoom from "./pages/host/newRoom/NewRoom";
import History from "./pages/booking/BookingHistory";
import Bookings from "./pages/host/hostBooking/HostBooking"
import Favourite from "./pages/favourite/Wishlist"
import Rooms from "./pages/host/listRoom/ListRoom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/host-hotel" element={<ListHost/>}/>
        <Route path="/create-room" element={<NewRoom/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/bookings" element={<Bookings/>}/>
        <Route path="/rooms" element={<Rooms/>}/>
        <Route path="/favorites" element={<Favourite/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
