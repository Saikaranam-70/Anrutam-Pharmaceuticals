import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoClose, IoMenu } from 'react-icons/io5';
import './Navbar.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false); // State to manage menu visibility

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId')
    localStorage.removeItem('doctorId')
    // Redirect to login page after logout
    window.location.href = '/user-login'; // Redirect to user login page
  };

  const isDoctorLoggedIn = !!localStorage.getItem('doctorToken'); // Check if doctorToken exists
  const isUserLoggedIn = !!localStorage.getItem('userToken'); // Check if userToken exists

  return (
    <nav className="navbar">
      <div className="navbar__logo">Amrutam</div>
      <div className={`navbar__toggle ${showMenu ? 'active' : ''}`} onClick={toggleMenu}>
        {showMenu ? <IoClose /> : <IoMenu />}
      </div>
      <ul className={`navbar__links ${showMenu ? 'show' : ''}`}>
        {!isDoctorLoggedIn && !isUserLoggedIn ? (
          <>
            <li><NavLink to="/all-doctors">Home</NavLink></li>
            <li><NavLink to="/register-doctor">Register As Doctor</NavLink></li>
            <li><NavLink to="/doctor-login">Doctor Login</NavLink></li>
            <li><NavLink to="/register-user">Register As User</NavLink></li>
            <li><NavLink to="/user-login">User Login</NavLink></li>
          </>
        ) : isDoctorLoggedIn ? (
          <>
            <li><NavLink to="/d-profile">Profile</NavLink></li>
            
            <li><NavLink to="/appointments">My Appointments</NavLink></li>
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          </>
        ) : isUserLoggedIn ? (
          <>
          <li><NavLink to="/all-doctors">Home</NavLink></li>
            <li><NavLink to="/profile">Profile</NavLink></li>
            {/* <li><NavLink to="/financial-report">Financial Report</NavLink></li> */}
            {/* <li><NavLink to="/wallet">Wallet</NavLink></li> */}
            <li><NavLink to="/user-appointments">My Appointments</NavLink></li>
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          </>
        ) : null}
      </ul>
    </nav>
  );
};

export default Navbar;
