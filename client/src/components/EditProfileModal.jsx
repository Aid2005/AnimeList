import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, type, onSave, currentData }) => {
  const [nameValue, setNameValue] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');

  // Sync state with current user data whenever the modal opens
  useEffect(() => {
    if (isOpen && currentData) {
      setNameValue(currentData.name || '');
      setPreviewUrl('');
      setFileName('');
    }
  }, [isOpen, currentData]);

  if (!isOpen) return null;

  // Convert selected image file to Base64 format for localStorage persistence
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result returns a Base64 encoded data URL (data:image/...)
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save new Base64 image if uploaded; otherwise retain the existing image
    onSave({ 
      image: previewUrl || (type === 'avatar' ? currentData?.avatar : currentData?.banner), 
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