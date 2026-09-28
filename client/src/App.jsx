import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AnimeDetails from './pages/AnimeDetails';
import Profile from './pages/Profile';
import MyList from './pages/MyList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-list" element={<MyList />} />
      </Routes>
    </Router>
  );
}

export default App;