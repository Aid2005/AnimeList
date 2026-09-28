import React, { useState } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, type, onSave, currentData }) => {
  const [nameValue, setNameValue] = useState(currentData?.name || '');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      image: previewUrl || (type === 'avatar' ? currentData.avatar : currentData.banner), 
      name: nameValue 
    });
    setPreviewUrl('');
    setFileName('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">
          {type === 'avatar' ? 'Edit Profile' : 'Edit Banner'}
        </h2>
        
        <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          {type === 'avatar' && (
            <div className="input-group">
              <input 
                type="text" 
                id="edit-name" 
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder=" " 
                required 
              />
              <label htmlFor="edit-name">Username</label>
            </div>
          )}

          <div className="file-upload-wrapper">
            <span className="upload-label">Upload Image from PC</span>
            <input 
              type="file" 
              id="file-input"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden-file-input"
            />
            <label htmlFor="file-input" className="custom-file-button">
              <span className="upload-icon">📁</span>
              <span>{fileName ? fileName : 'Choose Image File'}</span>
            </label>
          </div>

          {previewUrl && (
            <div className="preview-container">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className={type === 'avatar' ? 'avatar-preview' : 'banner-preview'}
              />
            </div>
          )}
          
          <button type="submit" className="submit-btn gradient-btn" style={{ marginTop: '1.5rem' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;