import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiX, FiUpload, FiImage } from 'react-icons/fi';
import '../api/i18n';
import '../styles/NewStoryForm.css';

const NewStoryForm = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isPublic: true,
        coverImageUrl: '',
        initialContent: '',
        tags: []
    });
    
    const [newTag, setNewTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');

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
    
        // Validate file
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
    
            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Upload failed');
                } catch (jsonError) {
                    throw new Error(response.statusText || 'Upload failed');
                }
            }
    
            const data = await response.json();
            
            if (!data.url) {
                throw new Error('No URL returned from server');
            }
    
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5076/stories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    isPublic: formData.isPublic,
                    coverImageUrl: formData.coverImageUrl,
                    initialContent: formData.initialContent,
                    storyTags: formData.tags
                })
            });
            
            if (!response.ok) {
                throw new Error(await response.text());
            }
            
            const data = await response.json();
            navigate(`/stories/${data.id}`);
        } catch (err) {
            setError(t('Failed to create story. Please try again.'));
            console.error('Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="new-story-page">
            <div className="new-story-container">
                <h1 className="new-story-title">{t('Create New Story')}</h1>
                
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
                            placeholder={t('Give your story a title')}
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
                            placeholder={t('Briefly describe your story')}
                            rows={3}
                            maxLength={300}
                        />
                        <div className="character-count">
                            {formData.description.length}/300
                        </div>
                    </div>
                    
                    {/* Content Field */}
                    <div className="form-group">
                        <label htmlFor="initialContent" className="form-label">
                            {t('Your Story')} <span className="required">*</span>
                        </label>
                        <textarea
                            id="initialContent"
                            name="initialContent"
                            value={formData.initialContent}
                            onChange={handleInputChange}
                            className="form-textarea content-textarea"
                            placeholder={t('Write the beginning of your story here...')}
                            required
                            rows={8}
                        />
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
                            disabled={isSubmitting || !formData.title || !formData.initialContent}
                        >
                            {isSubmitting ? t('Publishing...') : t('Publish Story')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewStoryForm;