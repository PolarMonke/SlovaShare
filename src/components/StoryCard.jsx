import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaComment } from 'react-icons/fa';
import '../styles/StoryCard.css';

const StoryCard = ({ story }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/stories/${story.id}`);
    };

    return (
        <div className="story-card" onClick={handleCardClick}>
            <Link to={`/stories/${story.id}`} className="story-link">
                {story.coverImageUrl && (
                    <div className="story-cover">
                        <img 
                            src={story.coverImageUrl} 
                            alt={story.title} 
                            className="cover-image"
                        />
                    </div>
                )}
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
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default StoryCard;