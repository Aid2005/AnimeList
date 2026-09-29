import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AnimeCard from '../components/AnimeCard';
import Slika from '../assets/onePiece.jpg';
import './Home.css';

const Home = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const trendingList = [
    { id: 1, title: 'Attack on Titan', rating: 9.1, image: Slika },
    { id: 2, title: 'Jujutsu Kaisen', rating: 8.9, image: Slika }
  ];

  const shonenList = [
    { id: 3, title: 'Naruto Shippuden', rating: 8.7, image: Slika },
    { id: 4, title: 'Bleach', rating: 8.2, image: Slika },
    { id: 5, title: 'One Piece', rating: 9.5, image: Slika }
  ];

  const comedyList = [
    { id: 6, title: 'Gintama', rating: 9.2, image: Slika },
    { id: 7, title: 'Grand Blue', rating: 8.4, image: Slika }
  ];

  return (
    <div className="home-container">
      <Navbar onLoginClick={() => setIsAuthOpen(true)} />
      
      <main className="main-content">
        <section className="home-section">
          <h2 className="section-title">Trending Now</h2>
          <div className="anime-grid">
            {trendingList.map((anime) => (
              <AnimeCard key={anime.id} id={anime.id} title={anime.title} rating={anime.rating} imageUrl={anime.image} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <h2 className="section-title">Action & Shonen</h2>
          <div className="anime-grid">
            {shonenList.map((anime) => (
              <AnimeCard key={anime.id} id={anime.id} title={anime.title} rating={anime.rating} imageUrl={anime.image} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <h2 className="section-title">Comedy</h2>
          <div className="anime-grid">
            {comedyList.map((anime) => (
              <AnimeCard key={anime.id} id={anime.id} title={anime.title} rating={anime.rating} imageUrl={anime.image} />
            ))}
          </div>
        </section>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default Home;