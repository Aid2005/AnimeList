import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AddToListModal from '../components/AddToListModal';
import './AnimeDetails.css';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch anime details (separated to allow refetching after updates)
  const fetchAnimeDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/anime/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAnime(data);
      }
    } catch (error) {
      console.error("Error fetching anime details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) setCurrentUser(JSON.parse(userStr));

    if (id) {
      fetchAnimeDetails();
      fetchComments();
    }
  }, [id]);

  // Submit a new comment to the database
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    if (!currentUser.id) {
      alert("Error: User ID not found. Please log out and log in again.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anime_id: id,
          user_id: currentUser.id,
          text: newComment
        })
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Delete a comment from database (admin only)
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '5rem' }}>Loading anime details...</div>;
  if (!anime) return <div style={{ color: '#fff', textAlign: 'center', padding: '5rem' }}><h2>Anime not found!</h2></div>;

  return (
    <div className="anime-details-container">
      <Navbar onLoginClick={() => setIsAuthOpen(true)} />
      <main className="details-main">
        <div className="hero-banner">
          <img src={anime.cover_image || BannerImg} alt={anime.title} className="banner-img" />
          <div className="banner-overlay"></div>
        </div>

        <div className="details-content">
          <div className="header-info">
            <h1 className="anime-title">{anime.title}</h1>
            <div className="meta-tags">
              <span className="type-badge">{anime.category || 'Anime'} ({anime.total_episodes || 0} Episodes)</span>
              <span className="rating-badge">★ {anime.average_rating || 0}</span>
            </div>
            {currentUser && (
              <button className="add-list-btn gradient-btn" onClick={() => setIsListModalOpen(true)}>
                + Add to List
              </button>
            )}
          </div>

          <section className="synopsis-section">
            <h2>Synopsis</h2>
            <p>{anime.description || 'No description available for this anime.'}</p>
          </section>

          <section className="comments-section">
            <h2>Discussion ({comments.length})</h2>

            {currentUser ? (
              <form className="comment-form" onSubmit={handleAddComment}>
                <textarea 
                  placeholder="Write your comment..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  rows="3" 
                  required
                ></textarea>
                <button type="submit" className="submit-comment-btn">Post Comment</button>
              </form>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
                <p>You must be logged in to leave a comment.</p>
                <button className="login-btn" style={{ marginTop: '10px' }} onClick={() => setIsAuthOpen(true)}>Login</button>
              </div>
            )}

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="comment-header">
                      <span className="comment-user" style={{ fontWeight: 'bold', color: '#e50914' }}>{comment.user}</span>
                      <span className="comment-date" style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#ccc' }}>
                        {new Date(comment.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="comment-text" style={{ marginTop: '10px' }}>{comment.text}</p>
                  </div>
                  
                  {currentUser && currentUser.role === 'admin' && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)} 
                      style={{ background: 'transparent', border: '1px solid #e50914', color: '#e50914', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <AddToListModal 
        isOpen={isListModalOpen} 
        onClose={() => setIsListModalOpen(false)} 
        animeId={anime.id}
        animeTitle={anime.title}
        totalEpisodes={anime.total_episodes}
        onSuccess={fetchAnimeDetails}
      />
    </div>
  );
};

export default AnimeDetails;