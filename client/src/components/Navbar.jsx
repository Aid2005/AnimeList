import React from 'react';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <h1>AnimeList</h1>
      </div>
      
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/notifications">Notifications</a></li>
        <li><a href="/my-list">My List</a></li>
      </ul>

      <div className="nav-actions">
        <input type="text" placeholder="Search anime..." className="search-input" />
        <button className="login-btn" onClick={onLoginClick}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;