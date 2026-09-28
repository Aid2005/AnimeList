import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({ id, title, rating, imageUrl }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/anime/${id}`);
  };

  return (
    <div className="anime-card" onClick={handleCardClick}>
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