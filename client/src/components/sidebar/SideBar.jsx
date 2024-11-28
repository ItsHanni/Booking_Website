import React from "react"; 
import { NavLink } from "react-router-dom";
import "./sidebar.css";

const SideBar = () => {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Luna</h3>
      <ul className="sidebar-list">
        <li>
          <NavLink to="/" className="sidebar-link" activeClassName="active">
            Trang Chủ
          </NavLink>
        </li>
        <li>
          <NavLink to="/create-room" className="sidebar-link" activeClassName="active">
            Tạo Phòng
          </NavLink>
        </li>
        <li>
          <NavLink to="/rooms" className="sidebar-link" activeClassName="active">
            Danh sách phòng
          </NavLink>
        </li>
        <li>
          <NavLink to="/host-hotel" className="sidebar-link" activeClassName="active">
            Danh Sách khách sạn
          </NavLink>
        </li>
        <li>
          <NavLink to="/bookings" className="sidebar-link" activeClassName="active">
            Đặt Phòng
          </NavLink>
        </li>
      </ul>
      <div className="footer">
        Luna Company
      </div>
    </div>
  );
};

export default SideBar;
