import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import EditProfileModal from '../components/EditProfileModal';
import AnimeCard from '../components/AnimeCard';
import Slika from '../assets/onePiece.jpg';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [editModalConfig, setEditModalConfig] = useState({ isOpen: false, type: '' });
  
  const [userData, setUserData] = useState({
    name: 'OtakuKing',
    avatar: 'https://via.placeholder.com/150/1a1a1a/e50914?text=OK',
    banner: Slika,
    watchedCount: 142
  });

  const recentAnimeList = [
    { id: 1, title: 'Attack on Titan', rating: 9.1, image: Slika },
    { id: 2, title: 'Jujutsu Kaisen', rating: 8.9, image: Slika },
    { id: 3, title: 'Death Note', rating: 9.0, image: Slika },
    { id: 4, title: 'Demon Slayer', rating: 8.8, image: Slika }
  ];

  const handleSaveProfile = (newData) => {
    if (editModalConfig.type === 'avatar') {
      setUserData({ ...userData, avatar: newData.image, name: newData.name });
    } else {
      setUserData({ ...userData, banner: newData.image });
    }
  };

  return (
    <div className="profile-container">
      <Navbar onLoginClick={() => setIsAuthOpen(true)} />

      <main className="profile-main">
        <div 
          className="profile-banner" 
          onClick={() => setEditModalConfig({ isOpen: true, type: 'banner' })}
        >
          <img src={userData.banner} alt="Banner" className="banner-img" />
          <div className="edit-overlay">
            <span>Change Banner</span>
          </div>
        </div>

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
            <p className="profile-stats">Watched Anime: <span>{userData.watchedCount}</span></p>
          </div>
          
          <button 
            className="go-to-list-btn gradient-btn"
            onClick={() => navigate('/my-list')}
          >
            Go to My Anime List
          </button>
        </div>

        <section className="recent-anime-section">
          <h2 className="section-title">Recently Watched</h2>
          <div className="anime-grid">
            {recentAnimeList.map((anime) => (
              <AnimeCard 
                key={anime.id}
                id={anime.id}
                title={anime.title}
                rating={anime.rating}
                imageUrl={anime.image}
              />
            ))}
          </div>
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