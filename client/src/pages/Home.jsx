import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AnimeCard from '../components/AnimeCard';
import './Home.css';

const Home = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/anime');
        const data = await res.json();
        setAnimeList(data);
      } catch (error) {
        console.error("Error fetching anime catalog for Home page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  // Filter catalog items by specific category
  const getAnimeByCategory = (catName) => {
    return animeList.filter(
      (anime) => anime.category && anime.category.toLowerCase() === catName.toLowerCase()
    );
  };

  const trendingList = getAnimeByCategory('Trending');
  const shonenList = getAnimeByCategory('Shonen');
  const comedyList = getAnimeByCategory('Comedy');

  // Fallback image URL when cover image is missing
  const defaultPlaceholder = 'https://via.placeholder.com/200x300?text=No+Cover';

  return (
    <div className="home-container">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLoginClick={() => setIsAuthOpen(true)} 
        onLogoutClick={handleLogout}
      />
      
      <main className="main-content">
        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: '3rem' }}>
            Loading anime collection...
          </div>
        ) : (
          <>
            <section className="home-section">
              <h2 className="section-title">Trending Now</h2>
              <div className="anime-grid">
                {trendingList.map((anime) => (
                  <div key={anime.id} style={{ pointerEvents: isAuthenticated ? 'auto' : 'none' }}>
                    <AnimeCard 
                      id={anime.id} 
                      title={anime.title} 
                      rating={anime.average_rating || anime.rating || 0} 
                      imageUrl={anime.cover_image || defaultPlaceholder} 
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="home-section">
              <h2 className="section-title">Action & Shonen</h2>
              <div className="anime-grid">
                {shonenList.map((anime) => (
                  <div key={anime.id} style={{ pointerEvents: isAuthenticated ? 'auto' : 'none' }}>
                    <AnimeCard 
                      id={anime.id} 
                      title={anime.title} 
                      rating={anime.average_rating || anime.rating || 0} 
                      imageUrl={anime.cover_image || defaultPlaceholder} 
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="home-section">
              <h2 className="section-title">Comedy</h2>
              <div className="anime-grid">
                {comedyList.map((anime) => (
                  <div key={anime.id} style={{ pointerEvents: isAuthenticated ? 'auto' : 'none' }}>
                    <AnimeCard 
                      id={anime.id} 
                      title={anime.title} 
                      rating={anime.average_rating || anime.rating || 0} 
                      imageUrl={anime.cover_image || defaultPlaceholder} 
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Home;