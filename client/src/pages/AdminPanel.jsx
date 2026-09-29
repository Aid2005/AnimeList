import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slika from '../assets/onePiece.jpg';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('addAnime');
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  const mockUsers = [
    { id: 1, name: 'OtakuKing', email: 'otaku@test.com', status: 'Active' },
    { id: 2, name: 'ZoroFan', email: 'zoro@test.com', status: 'Active' }
  ];

  const mockAnime = [
    { id: 1, title: 'One Piece', category: 'Shonen', episodes: 1085, image: Slika },
    { id: 2, title: 'Gintama', category: 'Comedy', episodes: 367, image: Slika }
  ];

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar glass">
        <h2 className="admin-logo">Admin Panel</h2>
        <nav className="admin-nav">
          <button className={activeTab === 'addAnime' ? 'active' : ''} onClick={() => setActiveTab('addAnime')}>Add Anime</button>
          <button className={activeTab === 'allAnime' ? 'active' : ''} onClick={() => setActiveTab('allAnime')}>All Anime</button>
          <button className={activeTab === 'allUsers' ? 'active' : ''} onClick={() => setActiveTab('allUsers')}>All Users</button>
          <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
        </nav>
      </aside>

      <main className="admin-content">
        {activeTab === 'addAnime' && (
          <div className="admin-section glass">
            <h2>Add New Anime</h2>
            <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="4" required></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Episodes</label>
                  <input type="number" min="1" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select>
                    <option value="Trending">Trending</option>
                    <option value="Shonen">Shonen</option>
                    <option value="Comedy">Comedy</option>
                  </select>
                </div>
              </div>
              <div className="form-group file-upload-wrapper">
                <label>Cover Image</label>
                <input type="file" id="admin-file" className="hidden-file-input" onChange={handleFileChange} />
                <label htmlFor="admin-file" className="custom-file-button">
                  <span className="upload-icon">📁</span>
                  <span>{fileName ? fileName : 'Choose Image File'}</span>
                </label>
              </div>
              <button type="submit" className="submit-btn gradient-btn">Save Anime</button>
            </form>
          </div>
        )}

        {activeTab === 'allAnime' && (
          <div className="admin-section glass">
            <h2>All Anime Database</h2>
            <div className="admin-list">
              {mockAnime.map(anime => (
                <div key={anime.id} className="admin-anime-card">
                  <img src={anime.image} alt={anime.title} className="mini-anime-img" />
                  <div className="anime-details">
                    <h3>{anime.title}</h3>
                    <p>{anime.category} • {anime.episodes} Episodes</p>
                  </div>
                  <div className="admin-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'allUsers' && (
          <div className="admin-section glass">
            <h2>Registered Users</h2>
            <div className="admin-list">
              {mockUsers.map(user => (
                <div key={user.id} className="admin-user-card">
                  <div className="user-details">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="admin-actions">
                    <button className="view-btn">View</button>
                    <button className="block-btn">Block</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;