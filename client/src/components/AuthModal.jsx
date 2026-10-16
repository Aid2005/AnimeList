import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  if (!isOpen) return null;

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setUsername('');
    setPassword('');
    setRepeatPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // --- LOG IN VIA BACKEND API ---
      try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (res.ok) {
          const userData = await res.json(); // Returns { id, username, email, role }
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          if (onLoginSuccess) onLoginSuccess(); 
          onClose();
          window.location.reload();
        } else {
          alert("Invalid username or password!");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Server error during login.");
      }

    } else {
      // --- SIGN UP VIA BACKEND API ---
      if (password !== repeatPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, role: 'user' })
        });

        if (res.ok) {
          alert("Account created successfully! You can now log in.");
          setIsLogin(true);
          setPassword('');
          setRepeatPassword('');
        } else {
          alert("Registration failed. Username or email might already be taken.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("Server error during registration.");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">{isLogin ? 'Welcome Back' : 'Join AnimeList'}</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input 
                type="email" 
                required={!isLogin} 
                placeholder=" " 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <label>Email</label>
            </div>
          )}
          <div className="input-group">
            <input 
              type="text" 
              required 
              placeholder=" " 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input 
              type="password" 
              required 
              placeholder=" " 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <label>Password</label>
          </div>
          {!isLogin && (
            <div className="input-group">
              <input 
                type="password" 
                required 
                placeholder=" " 
                value={repeatPassword} 
                onChange={(e) => setRepeatPassword(e.target.value)} 
              />
              <label>Repeat Password</label>
            </div>
          )}
          <button type="submit" className="submit-btn gradient-btn">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-text">
          <span onClick={toggleMode} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? 'Sign Up instead' : 'Log In instead'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;