import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import EditProfileModal from '../components/EditProfileModal';
import AnimeCard from '../components/AnimeCard';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [editModalConfig, setEditModalConfig] = useState({ isOpen: false, type: '' });
  
  // State for user list data from database
  const [userAnimeList, setUserAnimeList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const defaultBannerPlaceholder = 'https://via.placeholder.com/1200x300/151515/ffffff?text=AnimeList+Banner';
  const defaultCardPlaceholder = 'https://via.placeholder.com/200x300?text=No+Cover';

  // 1. Retrieve current logged-in user from localStorage
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  // 2. Default profile details
  const defaultUserData = {
    name: currentUser ? currentUser.username : 'Guest',
    avatar: 'https://via.placeholder.com/150/1a1a1a/e50914?text=User',
    banner: defaultBannerPlaceholder
  };

  // 3. Load user-specific profile configuration
  const [userData, setUserData] = useState(() => {
    if (currentUser) {
      const savedData = localStorage.getItem(`profile_${currentUser.username}`);
      return savedData ? JSON.parse(savedData) : defaultUserData;
    }
    return defaultUserData;
  });

  // Route protection and database fetch for user list
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchUserList = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user-list/${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setUserAnimeList(data);
        }
      } catch (error) {
        console.error("Error fetching user list for profile:", error);
      } finally {
        setLoadingList(false);
      }
    };

    fetchUserList();
  }, [currentUser, navigate]);

  // Calculate actual number of completed anime
  const completedCount = userAnimeList.filter(item => item.status === 'Completed').length;
  
  // Display recent 4 items from the user list
  const recentAnimeList = userAnimeList.slice(0, 4);

  // Handle saving new profile changes
  const handleSaveProfile = (newData) => {
    let updatedProfile = { ...userData };

    if (editModalConfig.type === 'avatar') {
      updatedProfile = {
        ...updatedProfile,
        avatar: newData.image || updatedProfile.avatar,
        name: newData.name !== undefined ? newData.name : updatedProfile.name
      };
    } else if (editModalConfig.type === 'banner') {
      updatedProfile = {
        ...updatedProfile,
        banner: newData.image || updatedProfile.banner
      };
    }

    setUserData(updatedProfile);

    if (currentUser) {
      localStorage.setItem(`profile_${currentUser.username}`, JSON.stringify(updatedProfile));
    }
    
    setEditModalConfig({ isOpen: false, type: '' });
  };

  if (!currentUser) return null;

  return (
    <div className="profile-container">
      <Navbar onLoginClick={() => setIsAuthOpen(true)} />

      <main className="profile-main">
        {/* Banner Header Section */}
        <div 
          className="profile-banner" 
          onClick={() => setEditModalConfig({ isOpen: true, type: 'banner' })}
        >
          <img src={userData.banner} alt="Banner" className="banner-img" />
          <div className="edit-overlay">
            <span>Change Banner</span>
          </div>
        </div>

        {/* Profile Details & Stats Header */}
        <div className="profile-header-content">
          <div 
            className="profile-avatar-wrapper"
            onClick={() => setEditModalConfig({ isOpen: true, type: 'avatar' })}
          >
            <img src={userData.avatar} alt="Avatar" className="profile-avatar" />
            <div className="edit-overlay avatar-overlay">
              <span>Edit</span>
            </div>
          </div>

          <div className="profile-info">
            <h1 className="profile-username">{userData.name}</h1>
            <p className="profile-stats">
              Completed Anime: <span>{completedCount}</span> | Total on List: <span>{userAnimeList.length}</span>
            </p>
          </div>
          
          <button 
            className="go-to-list-btn gradient-btn"
            onClick={() => navigate('/my-list')}
          >
            Go to My Anime List
          </button>
        </div>

        {/* Recently Added / Watched Anime Section */}
        <section className="recent-anime-section">
          <h2 className="section-title">Recently Added / Watched</h2>

          {loadingList ? (
            <p style={{ color: '#ccc' }}>Loading your list...</p>
          ) : recentAnimeList.length === 0 ? (
            <p style={{ color: '#ccc' }}>You have not added any anime to your list yet.</p>
          ) : (
            <div className="anime-grid">
              {recentAnimeList.map((item) => (
                <AnimeCard 
                  key={item.list_id}
                  id={item.anime_id}
                  title={item.title}
                  rating={item.user_rating || item.average_rating || 0}
                  imageUrl={item.cover_image || defaultCardPlaceholder}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <EditProfileModal 
        isOpen={editModalConfig.isOpen}
        type={editModalConfig.type}
        currentData={userData}
        onClose={() => setEditModalConfig({ isOpen: false, type: '' })}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;