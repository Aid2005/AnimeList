import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h2 className="modal-title">{isLogin ? 'Welcome Back' : 'Join AnimeList'}</h2>
        <p className="modal-subtitle">
          {isLogin ? 'Enter your details to access your account' : 'Create an account to track your favorite anime'}
        </p>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="input-group">
              {/* Prazan prostor u placeholderu je trik za CSS floating labele */}
              <input type="email" id="email" required placeholder=" " />
              <label htmlFor="email">Email</label>
            </div>
          )}
          
          <div className="input-group">
            <input type="text" id="username" required placeholder=" " />
            <label htmlFor="username">Username</label>
          </div>
          
          <div className="input-group">
            <input type="password" id="password" required placeholder=" " />
            <label htmlFor="password">Password</label>
          </div>
          
          {!isLogin && (
            <div className="input-group">
              <input type="password" id="repeat-password" required placeholder=" " />
              <label htmlFor="repeat-password">Repeat Password</label>
            </div>
          )}
          
          {isLogin && <a href="#" className="forgot-pass">Forgot password?</a>}
          
          <button type="submit" className="submit-btn gradient-btn">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;