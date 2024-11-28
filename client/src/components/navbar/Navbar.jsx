import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext); // Thêm dispatch
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook điều hướng

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // Gửi hành động LOGOUT
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
    navigate("/login"); // Điều hướng người dùng về trang login
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="navbar-logo">
          <img src="/assets/Luna.ico" alt="Logo" className="logo" />
          Luna Booking
        </Link>
        {user ? (
          <div className="navUser" onClick={handleDropdownToggle}>
            {user.username}
            {dropdownOpen && (
              <div className="dropdown">
                {user.role === "user" ? (
                  <>
                    <Link to="/history" className="dropdownItem">Đặt phòng</Link>
                    <Link to="/favorites" className="dropdownItem">Yêu thích</Link>
                    <Link className="logoutButton" onClick={handleLogout}>Đăng xuất</Link>
                  </>
                ) : (
                  <>
                    <Link to="/host-hotel" className="dropdownItem">Danh sách khách sạn</Link>
                    <Link to="/host-hotel" className="dropdownItem">Dashboard</Link>
                    <Link className="logoutButton" onClick={handleLogout}>Đăng xuất</Link>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
