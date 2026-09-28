import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';

const MyList = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white' }}>
      <Navbar onLoginClick={() => setIsAuthOpen(true)} />
      <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#e50914' }}>My Anime List</h1>
        <p>This page will be configured later.</p>
      </main>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default MyList;