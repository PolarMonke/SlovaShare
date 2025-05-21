import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FiUpload } from "react-icons/fi";

const ImageUploader = ({ currentImage, onUploadComplete }) => {
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = useState(currentImage || null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files?.length) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        if (!file.type.match('image.*')) {
            setError(t('Please select an image file'));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError(t('Image too large (max 5MB)'));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            setError(null);
            const response = await axios.post('http://localhost:5076/uploads/profile-image', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            if (onUploadComplete) {
                onUploadComplete(response.data.url);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || t('Upload failed'));
            setPreviewUrl(null);
        } finally {
            setUploadProgress(0);
        }
    };

    return (
        <div 
            className={`image-uploader ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {previewUrl ? (
                <div className="image-preview-container">
                    <img 
                        src={previewUrl} 
                        alt={t('Preview')} 
                        className="image-preview"
                    />
                    {uploadProgress > 0 && (
                        <div className="upload-progress">
                            <div 
                                className="upload-progress-bar" 
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                    <div className="image-actions">
                        <button
                            type="button"
                            onClick={() => {
                                setPreviewUrl(null);
                                if (onUploadComplete) onUploadComplete(null);
                            }}
                            className="remove-image-button"
                        >
                            {t('Remove')}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="upload-area">
                    <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    <label htmlFor="file-upload" className="upload-label">
                        <div className="upload-icon">
                            <FiUpload />
                        </div>
                        <div className="upload-text">
                            <p>{t('Drag & drop image here')}</p>
                            <p>{t('or')}</p>
                            <span className="browse-button">
                                {t('Browse files')}
                            </span>
                        </div>
                    </label>
                </div>
            )}
            {error && <div className="upload-error">{error}</div>}
        </div>
    );
};

export default ImageUploader;