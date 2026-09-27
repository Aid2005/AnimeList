import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AnimeCard from '../components/AnimeCard';
import AuthModal from '../components/AuthModal';
import Slika from '../assets/onePiece.jpg';
import './Home.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockAnimeList = [
    { id: 1, title: 'Attack on Titan', rating: 9.1, image: Slika },
    { id: 2, title: 'Jujutsu Kaisen', rating: 8.9, image: Slika },
    { id: 3, title: 'Death Note', rating: 9.0, image: Slika },
    { id: 4, title: 'Demon Slayer', rating: 8.8, image: Slika },
    { id: 5, title: 'Naruto Shippuden', rating: 8.7, image: Slika }
  ];

  return (
    <div className="home-container">
      <Navbar onLoginClick={() => setIsModalOpen(true)} />
      
      <main className="main-content">
        <h2 className="section-title">Trending Now</h2>
        
        <div className="anime-grid">
          {mockAnimeList.map((anime) => (
            <AnimeCard 
              key={anime.id}
              title={anime.title}
              rating={anime.rating}
              imageUrl={anime.image}
            />
          ))}
        </div>
      </main>

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Home;