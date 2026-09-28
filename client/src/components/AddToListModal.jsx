import React, { useState } from 'react';
import './AddToListModal.css';

const AddToListModal = ({ isOpen, onClose, animeTitle }) => {
  const [status, setStatus] = useState('watching');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Add to My List</h2>
        <p className="modal-subtitle">Configure list status for <strong>{animeTitle}</strong></p>

        <form className="list-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="plan_to_watch">Plan to Watch</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          {status === 'watching' && (
            <div className="form-group">
              <label htmlFor="progress">Episodes Watched</label>
              <input type="number" id="progress" min="0" placeholder="e.g. 12" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user-rating">Your Rating</label>
            <select id="user-rating" defaultValue="10">
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

          <button type="submit" className="submit-btn gradient-btn" onClick={onClose}>
            Save to List
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddToListModal;