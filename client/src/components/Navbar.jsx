import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>AnimeList</h1>
        </Link>
      </div>
      
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/my-list">My List</Link></li>
      </ul>

      <div className="nav-actions">
        <input type="text" placeholder="Search anime..." className="search-input" />
        <button className="login-btn" onClick={onLoginClick}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;