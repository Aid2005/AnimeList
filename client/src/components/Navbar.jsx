import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLoginClick }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Search feature states
  const [searchTerm, setSearchTerm] = useState('');
  const [allAnime, setAllAnime] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuth(authStatus);

    // Verify admin role
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.role === 'admin') {
        setIsAdmin(true);
      }
    }

    // Fetch complete catalog for client-side search filtering
    const fetchAnimeForSearch = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/anime');
        if (res.ok) {
          const data = await res.json();
          setAllAnime(data);
        }
      } catch (error) {
        console.error("Error fetching anime list for search:", error);
      }
    };

    fetchAnimeForSearch();
  }, []);

  // Close search dropdown when clicking outside the container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter anime titles dynamically as user types
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setSearchResults([]);
      setIsDropdownOpen(false);
    } else {
      const filtered = allAnime.filter(anime =>
        anime.title.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      setIsDropdownOpen(true);
    }
  };

  // Navigate directly to selected anime details
  const handleSelectAnime = (animeId) => {
    setSearchTerm('');
    setIsDropdownOpen(false);
    navigate(`/anime/${animeId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    setIsAuth(false);
    setIsAdmin(false);
    navigate('/'); 
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>AnimeList</h1>
        </Link>
      </div>
      
      <ul className="nav-links">
        {isAuth && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/my-list">My List</Link></li>
            {isAdmin && (
              <li><Link to="/admin" style={{ color: '#e50914' }}>Admin Panel</Link></li>
            )}
          </>
        )}
      </ul>

      <div className="nav-actions">
        {/* Search input with live dropdown menu */}
        <div className="search-container" ref={searchRef}>
          <input 
            type="text" 
            placeholder="Search anime..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm.trim() !== '' && setIsDropdownOpen(true)}
          />

          {isDropdownOpen && (
            <div className="search-dropdown glass">
              {searchResults.length > 0 ? (
                searchResults.map((anime) => (
                  <div 
                    key={anime.id} 
                    className="search-result-item"
                    onClick={() => handleSelectAnime(anime.id)}
                  >
                    <img 
                      src={anime.cover_image || 'https://via.placeholder.com/40x50'} 
                      alt={anime.title} 
                      className="search-result-img"
                    />
                    <div className="search-result-info">
                      <span className="search-result-title">{anime.title}</span>
                      <span className="search-result-meta">★ {anime.average_rating || 0}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-no-results">No anime found</div>
              )}
            </div>
          )}
        </div>
        
        {isAuth ? (
          <button className="login-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="login-btn" onClick={() => onLoginClick && onLoginClick()}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;