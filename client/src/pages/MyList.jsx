import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AnimeCard from '../components/AnimeCard';
import Slika from '../assets/onePiece.jpg';
import './MyList.css';

const MyList = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const watchingList = [
    { id: 1, title: 'One Piece', rating: 9.5, image: Slika },
    { id: 2, title: 'Jujutsu Kaisen', rating: 8.9, image: Slika }
  ];
  
  const completedList = [
    { id: 3, title: 'Death Note', rating: 9.0, image: Slika },
    { id: 4, title: 'Demon Slayer', rating: 8.8, image: Slika },
    { id: 5, title: 'Naruto Shippuden', rating: 8.7, image: Slika }
  ];

  const planToWatchList = [
    { id: 6, title: 'Solo Leveling', rating: 8.5, image: Slika }
  ];

  const droppedList = [
    { id: 7, title: 'Boruto', rating: 5.4, image: Slika }
  ];

  return (
    <div className="my-list-container">
      <Navbar onLoginClick={() => setIsAuthOpen(true)} />
      
      <main className="my-list-main">
        <div className="list-header">
          <h1 className="page-title">My Anime List</h1>
          
          <div className="filter-group">
            <label htmlFor="sort-filter">Filter by:</label>
            <select id="sort-filter" className="glass-select">
              <option value="rating">Rating</option>
              <option value="name">Name</option>
              <option value="content">Content</option>
            </select>
          </div>
        </div>

        <section className="list-section">
          <h2 className="section-title">Watching</h2>
          <div className="anime-grid">
            {watchingList.map(anime => (
              <AnimeCard key={anime.id} id={anime.id} title={anime.title} rating={anime.rating} imageUrl={anime.image} />
            ))}
          </div>
        </section>

        <section className="list-section">
          <h2 className="section-title">Completed</h2>
          <div className="anime-grid">
            {completedList.map(anime => (
              <AnimeCard key={anime.id} id={anime.id} title={anime.title} rating={anime.rating} imageUrl={anime.image} />
            ))}
          </div>
        </section>

        <section className="list-section">
          <h2 className="section-title">Plan to Watch</h2>
          <div className="anime-grid">
            {planToWatchList.map(anime => (
              <AnimeCard key={anime.id} id={anime.id} title={anime.title} rating={anime.rating} imageUrl={anime.image} />
            ))}
          </div>
        </section>

        <section className="list-section">
          <h2 className="section-title">Dropped</h2>
          <div className="anime-grid">
            {droppedList.map(anime => (
              <AnimeCard key={anime.id} id={anime.id} title={anime.title} rating={anime.rating} imageUrl={anime.image} />
            ))}
          </div>
        </section>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default MyList;