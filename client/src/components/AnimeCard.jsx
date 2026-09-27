import React from 'react';
import './AnimeCard.css';

const AnimeCard = ({ title, rating, imageUrl }) => {
  return (
    <div className="anime-card">
      <div className="card-image-container">
        <img src={imageUrl} alt={title} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-rating">
          <span className="star">★</span> {rating}
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;