import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AddToListModal from '../components/AddToListModal';
import BannerImg from '../assets/onePiece.jpg';
import './AnimeDetails.css';

const AnimeDetails = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'OtakuKing', text: 'This arc is absolutely top tier animation!', date: '2 hours ago' },
    { id: 2, user: 'ZoroFan99', text: 'Best episode of the season hands down.', date: '1 day ago' }
  ]);
  const [newComment, setNewComment] = useState('');

  const animeData = {
    title: 'One Piece / Special Edition',
    type: 'TV Series (1000+ Episodes)',
    rating: 8.9,
    synopsis: 'Monkey D. Luffy sets off on an epic journey with his pirate crew to discover the ultimate treasure known as One Piece and become the next Pirate King. Along the way, they face terrifying foes, unravel world mysteries, and forge unbreakable bonds of camaraderie.'
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      user: 'You',
      text: newComment,
      date: 'Just now'
    };

    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  return (
    <div className="anime-details-container">
      <Navbar onLoginClick={() => setIsAuthOpen(true)} />

      <main className="details-main">
        {/* Large Hero Banner Header */}
        <div className="hero-banner">
          <img src={BannerImg} alt={animeData.title} className="banner-img" />
          <div className="banner-overlay"></div>
        </div>

        {/* Info Content Section */}
        <div className="details-content">
          <div className="header-info">
            <h1 className="anime-title">{animeData.title}</h1>
            <div className="meta-tags">
              <span className="type-badge">{animeData.type}</span>
              <span className="rating-badge">★ {animeData.rating}</span>
            </div>

            <button 
              className="add-list-btn gradient-btn"
              onClick={() => setIsListModalOpen(true)}
            >
              + Add to List
            </button>
          </div>

          {/* Synopsis Section */}
          <section className="synopsis-section">
            <h2>Synopsis</h2>
            <p>{animeData.synopsis}</p>
          </section>

          {/* Comments Section */}
          <section className="comments-section">
            <h2>Discussion ({comments.length})</h2>

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

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-card glass">
                  <div className="comment-header">
                    <span className="comment-user">{comment.user}</span>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AddToListModal 
        isOpen={isListModalOpen} 
        onClose={() => setIsListModalOpen(false)} 
        animeTitle={animeData.title}
      />
    </div>
  );
};

export default AnimeDetails;