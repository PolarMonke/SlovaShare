import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiX, FiUpload, FiImage, FiTrash2, FiSave, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import '../styles/EditStoryPage.css';

const EditStoryPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [story, setStory] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isPublic: true,
        coverImageUrl: '',
        tags: []
    });
    
    const [newTag, setNewTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await fetch(`http://localhost:5076/stories/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                if (!response.ok) throw new Error('Story not found');
                
                const data = await response.json();
                setStory(data);
                setFormData({
                    title: data.title,
                    description: data.description || '',
                    isPublic: data.isPublic,
                    coverImageUrl: data.coverImageUrl || '',
                    tags: data.tags || []
                });
            } catch (err) {
                setError(err.message);
                console.error('Error loading story:', err);
            }
        };
        
        if (user) {
            fetchStory();
        } else {
            navigate('/login');
        }
    }, [id, user, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTagInputChange = (e) => {
        setNewTag(e.target.value);
    };

    const addTag = (e) => {
        e.preventDefault();
        const trimmedTag = newTag.trim();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, trimmedTag]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setUploadError(t('Invalid file type. Only JPEG, PNG, GIF, WEBP allowed.'));
            return;
        }
    
        if (file.size > 5 * 1024 * 1024) {
            setUploadError(t('File too large (max 5MB)'));
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            setUploadError('');
            setUploadProgress(10);
    
            const response = await fetch('http://localhost:5076/uploads/story-cover', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });
    
            if (!response.ok) throw new Error('Upload failed');
    
            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                coverImageUrl: data.url
            }));
        } catch (err) {
            setUploadError(err.message || t('Upload failed. Please try again.'));
            console.error('Upload error:', err);
        } finally {
            setUploadProgress(0);
        }
    };

    const deletePart = async (partId) => {
        if (!window.confirm(t('Are you sure you want to delete this part?'))) return;
        
        try {
            const response = await fetch(`http://localhost:5076/stories/${id}/storyparts/${partId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete part');
            
            setStory(prev => ({
                ...prev,
                parts: prev.parts.filter(p => p.id !== partId),
                partsCount: prev.partsCount - 1
            }));
        } catch (err) {
            setError(err.message);
            console.error('Error deleting part:', err);
        }
    };

    const movePartUp = (index) => {
        if (index === 0) return;
        
        const newParts = [...story.parts];
        [newParts[index], newParts[index - 1]] = [newParts[index - 1], newParts[index]];
        
        setStory(prev => ({
            ...prev,
            parts: newParts.map((p, i) => ({ ...p, order: i + 1 }))
        }));
    };

    const movePartDown = (index) => {
        if (index === story.parts.length - 1) return;
        
        const newParts = [...story.parts];
        [newParts[index], newParts[index + 1]] = [newParts[index + 1], newParts[index]];
        
        setStory(prev => ({
            ...prev,
            parts: newParts.map((p, i) => ({ ...p, order: i + 1 }))
        }));
    };

    const saveOrder = async () => {
        try {
            const partIds = story.parts.map(p => p.id);
            const response = await fetch(`http://localhost:5076/stories/${id}/storyparts/order`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(partIds)
            });
            
            if (!response.ok) throw new Error('Failed to save order');
        } catch (err) {
            setError(err.message);
            console.error('Error saving order:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:5076/stories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    isPublic: formData.isPublic,
                    coverImageUrl: formData.coverImageUrl,
                    tags: formData.tags
                })
            });
            
            if (!response.ok) throw new Error(await response.text());
            
            navigate(`/story/${id}`);
        } catch (err) {
            setError(t('Failed to update story. Please try again.'));
            console.error('Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!story) {
        return <div className="loading">{t('Loading...')}</div>;
    }

    if (user?.id !== story.owner.id) {
        return <div className="error">{t('You do not have permission to edit this story')}</div>;
    }

    return (
        <div className="edit-story-page">
            <div className="edit-story-container">
                <h1 className="edit-story-title">{t('Edit Story')}</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                <form className="story-form" onSubmit={handleSubmit}>
                    {/* Title Field */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            {t('Title')} <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                            maxLength={100}
                        />
                    </div>
                    
                    {/* Description Field */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            {t('Description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-textarea"
                            rows={3}
                            maxLength={300}
                        />
                        <div className="character-count">
                            {formData.description.length}/300
                        </div>
                    </div>
                    
                    {/* Tags Field */}
                    <div className="form-group">
                        <label className="form-label">{t('Tags')}</label>
                        <div className="tags-input-container">
                            <input
                                type="text"
                                value={newTag}
                                onChange={handleTagInputChange}
                                className="form-input"
                                placeholder={t('Add tags to help readers find your story')}
                                onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                            />
                            <button 
                                type="button"
                                onClick={addTag}
                                className="add-tag-button"
                                disabled={!newTag.trim()}
                            >
                                <FiPlus />
                            </button>
                        </div>
                        <div className="tags-display">
                            {formData.tags.map(tag => (
                                <span key={tag} className="tag-pill">
                                    {tag}
                                    <button 
                                        type="button"
                                        className="remove-tag"
                                        onClick={() => removeTag(tag)}
                                        aria-label={t('Remove tag')}
                                    >
                                        <FiX size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="form-hint">
                            {t('Add up to 5 tags that describe your story')}
                        </div>
                    </div>
                    
                    {/* Cover Image Field */}
                    <div className="form-group">
                        <label className="form-label">{t('Cover Image')}</label>
                        {formData.coverImageUrl ? (
                            <div className="cover-image-preview">
                                <img 
                                    src={formData.coverImageUrl} 
                                    alt={t('Story cover preview')} 
                                    className="cover-image"
                                />
                                <div className="cover-image-actions">
                                    <button 
                                        type="button"
                                        className="change-image-button"
                                        onClick={() => document.getElementById('coverImage').click()}
                                    >
                                        <FiUpload /> {t('Change Image')}
                                    </button>
                                    <button 
                                        type="button"
                                        className="remove-image-button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            coverImageUrl: ''
                                        }))}
                                    >
                                        <FiX /> {t('Remove')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="image-uploader">
                                <label htmlFor="coverImage" className="upload-label">
                                    <FiImage size={32} className="upload-icon" />
                                    <span className="upload-text">
                                        {t('Upload a cover image (optional)')}
                                    </span>
                                    <span className="upload-hint">
                                        {t('JPEG, PNG, GIF or WEBP. Max 5MB.')}
                                    </span>
                                    <button 
                                        type="button"
                                        className="browse-button"
                                    >
                                        {t('Browse Files')}
                                    </button>
                                </label>
                                <input
                                    type="file"
                                    id="coverImage"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageUpload}
                                    className="file-input"
                                />
                            </div>
                        )}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="upload-progress">
                                <div 
                                    className="upload-progress-bar" 
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                        {uploadError && (
                            <div className="upload-error">{uploadError}</div>
                        )}
                    </div>
                    
                    {/* Story Parts */}
                    <div className="form-group">
                        <label className="form-label">{t('Story Parts')}</label>
                        <div className="parts-list">
                            {story.parts.sort((a, b) => a.order - b.order).map((part, index) => (
                                <div key={part.id} className="part-item">
                                    <div className="part-header">
                                        <span className="part-order">{t('Part')} {part.order}</span>
                                        <span className="part-author">
                                            {t('By')} {part.author.login}
                                        </span>
                                    </div>
                                    <div className="part-content">
                                        {part.content}
                                    </div>
                                    <div className="part-actions">
                                        <button
                                            type="button"
                                            className="move-button"
                                            onClick={() => movePartUp(index)}
                                            disabled={index === 0}
                                        >
                                            <FiArrowUp />
                                        </button>
                                        <button
                                            type="button"
                                            className="move-button"
                                            onClick={() => movePartDown(index)}
                                            disabled={index === story.parts.length - 1}
                                        >
                                            <FiArrowDown />
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => deletePart(part.id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="save-order-button"
                            onClick={saveOrder}
                        >
                            <FiSave /> {t('Save Order')}
                        </button>
                    </div>
                    
                    {/* Privacy Toggle */}
                    <div className="form-group privacy-toggle">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                id="isPublic"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleInputChange}
                                className="toggle-input"
                            />
                            <span className="toggle-slider"></span>
                        </label>
                        <label htmlFor="isPublic" className="privacy-label">
                            {formData.isPublic ? t('Public Story') : t('Private Story')}
                        </label>
                        <div className="privacy-hint">
                            {formData.isPublic 
                                ? t('Anyone can view and contribute to this story')
                                : t('Only you can view and contribute to this story')}
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={isSubmitting || !formData.title}
                        >
                            {isSubmitting ? t('Saving...') : t('Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStoryPage;