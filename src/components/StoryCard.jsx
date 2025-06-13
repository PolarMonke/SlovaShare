import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaComment } from 'react-icons/fa';
import '../styles/StoryCard.css';
import { createContext, useContext, useState, useEffect } from 'react';

const StoryCard = ({ story }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark');
        
        const handleStorageChange = () => {
            const currentTheme = localStorage.getItem('theme');
            setIsDarkMode(currentTheme === 'dark');
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleCardClick = () => {
        navigate(`/story/${story.id}`);
    };

    const handleSearch = (tag) => {
        navigate(`/search?tags=${tag}`);
    };

    const placeholderImage = isDarkMode 
        ? '/img/cover-placeholder-dark.png' 
        : '/img/cover-placeholder-light.png';

    return (
        <div className="story-card" onClick={handleCardClick}>
            <Link to={`/story/${story.id}`} className="story-link">
                <div className="story-cover">
                    <img 
                        src={story.coverImageUrl || placeholderImage} 
                        alt={story.title} 
                        className="cover-image"
                        onError={(e) => {
                            e.target.src = placeholderImage;
                        }}
                    />
                </div>
                <div className="story-content">
                    <h3 className="story-title">{story.title}</h3>
                    <p className="story-description">{story.description || t('No description available')}</p>
                    <div className="story-meta">
                        <span className="meta-item">
                            {t('By')} <Link to={`/account/${story.owner.id}`} className="author-link">
                                {story.owner.login}
                            </Link>
                        </span>
                        <span className="meta-item">{new Date(story.createdAt).toLocaleDateString()}</span>
                        <span className="meta-item">
                            {story.partsCount} {t('parts', { count: story.partsCount })}
                        </span>
                    </div>
                    <div className="story-stats">
                        <span className="stat-item">
                            <FaHeart className="stat-icon" />
                            {story.likeCount}
                        </span>
                        <span className="stat-item">
                            <FaComment className="stat-icon" />
                            {story.commentCount}
                        </span>
                    </div>
                    <div className="story-tags">
                        {story.tags.map(tag => (
                            <button key={tag} className="tag" onClick={(e) => {
                                handleSearch(tag); 
                                e.stopPropagation();
                            }}>{tag}</button>
                        ))}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default StoryCard;