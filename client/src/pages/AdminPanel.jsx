import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('addAnime');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  // Verify admin authorization on mount
  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

    // Redirect non-admin or unauthenticated users to home page
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  // State for backend data (Anime and Users)
  const [animeList, setAnimeList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_episodes: '',
    category: 'Trending',
    cover_image: ''
  });

  // Fetch all anime from the database
  const fetchAnime = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/anime');
      const data = await res.json();
      setAnimeList(data);
    } catch (error) {
      console.error("Error fetching anime list:", error);
    }
  };

  // Fetch all registered users from the database
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (error) {
      console.error("Error fetching users list:", error);
    }
  };

  useEffect(() => {
    fetchAnime();
    fetchUsers(); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:5000/api/anime/${editingId}` 
      : 'http://localhost:5000/api/anime';
    const method = editingId ? 'PUT' : 'POST';

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('total_episodes', formData.total_episodes);
    formDataToSend.append('category', formData.category);

    if (selectedFile) {
      formDataToSend.append('cover_image', selectedFile);
    } else {
      formDataToSend.append('existing_image', formData.cover_image);
    }

    try {
      const res = await fetch(url, { method: method, body: formDataToSend });
      if (res.ok) {
        setFormData({ title: '', description: '', total_episodes: '', category: 'Trending', cover_image: '' });
        setFileName('');
        setSelectedFile(null);
        setEditingId(null);
        fetchAnime();
        setActiveTab('allAnime');
      }
    } catch (error) {
      console.error("Error saving anime record:", error);
    }
  };

  const handleEdit = (anime) => {
    setEditingId(anime.id);
    setFormData({
      title: anime.title || '',
      description: anime.description || '',
      total_episodes: anime.total_episodes || '',
      category: anime.category || 'Trending',
      cover_image: anime.cover_image || ''
    });

    if (anime.cover_image && anime.cover_image.includes('/uploads/')) {
      setFileName(anime.cover_image.split('/uploads/').pop());
    } else {
      setFileName('');
    }

    setSelectedFile(null);
    setActiveTab('addAnime');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', total_episodes: '', category: 'Trending', cover_image: '' });
    setFileName('');
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this anime?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/anime/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAnime();
    } catch (error) {
      console.error("Error deleting anime:", error);
    }
  };

  // Delete user from database
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers(); 
      } else {
        alert("Failed to delete user account.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar glass">
        <h2 className="admin-logo">Admin Panel</h2>
        <nav className="admin-nav">
          <button className={activeTab === 'addAnime' ? 'active' : ''} onClick={() => setActiveTab('addAnime')}>
            {editingId ? 'Edit Anime' : 'Add Anime'}
          </button>
          <button className={activeTab === 'allAnime' ? 'active' : ''} onClick={() => setActiveTab('allAnime')}>
            All Anime
          </button>
          <button className={activeTab === 'allUsers' ? 'active' : ''} onClick={() => setActiveTab('allUsers')}>
            All Users
          </button>
          <button className="back-home-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        {activeTab === 'addAnime' && (
          <div className="admin-section glass">
            <h2>{editingId ? 'Edit Anime' : 'Add New Anime'}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Episodes</label>
                  <input type="number" name="total_episodes" min="1" value={formData.total_episodes} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Trending">Trending</option>
                    <option value="Shonen">Shonen</option>
                    <option value="Comedy">Comedy</option>
                  </select>
                </div>
              </div>

              <div className="form-group file-upload-wrapper">
                <label>Cover Image</label>
                <input type="file" id="admin-file" className="hidden-file-input" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="admin-file" className="custom-file-button">
                  <span className="upload-icon">📁</span>
                  <span>{fileName ? fileName : 'Choose Image File'}</span>
                </label>
              </div>
              
              <div className="form-buttons-row">
                <button type="submit" className="submit-btn gradient-btn">
                  {editingId ? 'Update Anime' : 'Save Anime'}
                </button>
                {editingId && (
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'allAnime' && (
          <div className="admin-section glass">
            <h2>All Anime Database</h2>
            <div className="admin-list">
              {animeList.map(anime => (
                <div key={anime.id} className="admin-anime-card">
                  <img src={anime.cover_image || Slika} alt={anime.title} className="mini-anime-img" />
                  <div className="anime-details">
                    <h3>{anime.title}</h3>
                    <p>{anime.category} • {anime.total_episodes} Episodes</p>
                  </div>
                  <div className="admin-actions">
                    <button className="edit-btn" onClick={() => handleEdit(anime)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(anime.id)}>Delete</button>
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
              {usersList.length === 0 ? (
                <p>No registered users found in database.</p>
              ) : (
                usersList.map(user => (
                  <div key={user.id} className="admin-user-card">
                    <div className="user-details">
                      <h3>{user.username} {user.role === 'admin' && <span style={{color: '#e50914', fontSize: '14px'}}>(Admin)</span>}</h3>
                      <p>{user.email}</p>
                    </div>
                    <div className="admin-actions">
                      {user.role !== 'admin' && (
                        <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                          Delete Account
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;