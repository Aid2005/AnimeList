import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AnimeCard from '../components/AnimeCard';
import './MyList.css';

const MyList = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('rating');
  const [currentUser, setCurrentUser] = useState(null);

  const defaultPlaceholder = 'https://via.placeholder.com/200x300?text=No+Cover';

  // Fetch list items from backend
  const fetchUserList = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user-list/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserList(data);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchUserList(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  // Sort list entries based on selected criterion
  const getSortedList = (list) => {
    return [...list].sort((a, b) => {
      if (sortOption === 'rating') {
        const ratingA = a.user_rating || a.average_rating || 0;
        const ratingB = b.user_rating || b.average_rating || 0;
        return ratingB - ratingA;
      } else if (sortOption === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  // Filter entries by list status
  const watchingList = getSortedList(userList.filter(item => item.status === 'Watching'));
  const completedList = getSortedList(userList.filter(item => item.status === 'Completed'));
  const planToWatchList = getSortedList(userList.filter(item => item.status === 'Plan to Watch'));
  const droppedList = getSortedList(userList.filter(item => item.status === 'Dropped'));

  return (
    <div className="my-list-container">
      <Navbar onLoginClick={() => setIsAuthOpen(true)} />
      
      <main className="my-list-main">
        <div className="list-header">
          <h1 className="page-title">My Anime List</h1>
          
          <div className="filter-group">
            <label htmlFor="sort-filter">Filter / Sort by:</label>
            <select 
              id="sort-filter" 
              className="glass-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="rating">Rating (Highest First)</option>
              <option value="name">Name (A - Z)</option>
            </select>
          </div>
        </div>

        {!currentUser ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: '4rem' }}>
            <h2>You must be logged in to view your anime list.</h2>
            <button className="login-btn" style={{ marginTop: '1rem' }} onClick={() => setIsAuthOpen(true)}>Login</button>
          </div>
        ) : loading ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: '4rem' }}>Loading your list...</div>
        ) : userList.length === 0 ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: '4rem' }}>Your list is currently empty. Add anime from the details page!</div>
        ) : (
          <>
            {watchingList.length > 0 && (
              <section className="list-section">
                <h2 className="section-title">Watching ({watchingList.length})</h2>
                <div className="anime-grid">
                  {watchingList.map(item => (
                    <AnimeCard 
                      key={item.list_id} 
                      id={item.anime_id} 
                      title={item.title} 
                      rating={item.user_rating || item.average_rating || 0} 
                      imageUrl={item.cover_image || defaultPlaceholder} 
                    />
                  ))}
                </div>
              </section>
            )}

            {completedList.length > 0 && (
              <section className="list-section">
                <h2 className="section-title">Completed ({completedList.length})</h2>
                <div className="anime-grid">
                  {completedList.map(item => (
                    <AnimeCard 
                      key={item.list_id} 
                      id={item.anime_id} 
                      title={item.title} 
                      rating={item.user_rating || item.average_rating || 0} 
                      imageUrl={item.cover_image || defaultPlaceholder} 
                    />
                  ))}
                </div>
              </section>
            )}

            {planToWatchList.length > 0 && (
              <section className="list-section">
                <h2 className="section-title">Plan to Watch ({planToWatchList.length})</h2>
                <div className="anime-grid">
                  {planToWatchList.map(item => (
                    <AnimeCard 
                      key={item.list_id} 
                      id={item.anime_id} 
                      title={item.title} 
                      rating={item.user_rating || item.average_rating || 0} 
                      imageUrl={item.cover_image || defaultPlaceholder} 
                    />
                  ))}
                </div>
              </section>
            )}

            {droppedList.length > 0 && (
              <section className="list-section">
                <h2 className="section-title">Dropped ({droppedList.length})</h2>
                <div className="anime-grid">
                  {droppedList.map(item => (
                    <AnimeCard 
                      key={item.list_id} 
                      id={item.anime_id} 
                      title={item.title} 
                      rating={item.user_rating || item.average_rating || 0} 
                      imageUrl={item.cover_image || defaultPlaceholder} 
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default MyList;