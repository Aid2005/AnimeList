import React, { useState } from 'react';
import './AddToListModal.css';

const AddToListModal = ({ isOpen, onClose, animeId, animeTitle, totalEpisodes, onSuccess }) => {
  const [status, setStatus] = useState('Watching');
  const [episodesWatched, setEpisodesWatched] = useState('');
  const [userRating, setUserRating] = useState('10');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
      alert("You must be logged in to add anime to your list!");
      return;
    }

    const currentUser = JSON.parse(currentUserStr);
    const watchedNum = parseInt(episodesWatched) || 0;

    // Validate episode count against total available episodes
    if (totalEpisodes && watchedNum > totalEpisodes) {
      alert(`Watched episodes (${watchedNum}) cannot exceed total episodes (${totalEpisodes})!`);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/user-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          anime_id: animeId,
          status: status,
          user_rating: parseFloat(userRating),
          episodes_watched: watchedNum
        })
      });

      if (res.ok) {
        alert("Successfully saved to your list!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to save to list.");
      }
    } catch (error) {
      console.error("Error saving to list:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Add to My List</h2>
        <p className="modal-subtitle">Configure list status for <strong>{animeTitle}</strong></p>

        <form className="list-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
              <option value="Plan to Watch">Plan to Watch</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          {status === 'Watching' && (
            <div className="form-group">
              <label htmlFor="progress">
                Episodes Watched {totalEpisodes ? `(Max: ${totalEpisodes})` : ''}
              </label>
              <input 
                type="number" 
                id="progress" 
                min="0" 
                max={totalEpisodes || undefined}
                placeholder={totalEpisodes ? `max ${totalEpisodes}` : "e.g. 12"} 
                value={episodesWatched}
                onChange={(e) => setEpisodesWatched(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user-rating">Your Rating</label>
            <select 
              id="user-rating" 
              value={userRating}
              onChange={(e) => setUserRating(e.target.value)}
            >
              <option value="10">(10) Masterpiece</option>
              <option value="9">(9) Great</option>
              <option value="8">(8) Very Good</option>
              <option value="7">(7) Good</option>
              <option value="6">(6) Fine</option>
              <option value="5">(5) Average</option>
              <option value="4">(4) Bad</option>
              <option value="3">(3) Very Bad</option>
              <option value="2">(2) Horrible</option>
              <option value="1">(1) Appalling</option>
            </select>
          </div>

          <button type="submit" className="submit-btn gradient-btn">
            Save to List
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddToListModal;