import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaEdit } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const StoryHeader = ({ story, isOwner, isLiked, likeCount, onEdit, onLike, onReport }) => {
    const { t } = useTranslation();

    return (
        <div className="story-header">
            <div className="story-header-top">
                <h1 className="story-title">{story.title}</h1>
                {isOwner && (
                    <button 
                        onClick={onEdit}
                        className="edit-story-button"
                        title={t('Edit Story')}
                    >
                        <FaEdit />
                    </button>
                )}
                {!isOwner && (
                    <button 
                        onClick={onReport}
                        className="report-button"
                        title={t('Report Story')}
                    >
                        {t('Report')}
                    </button>
                )}
            </div>
            
            <div className="story-meta">
                <span className="meta-item">
                    {t('By')} <Link to={`/account/${story.owner.id}`} className="author-link">
                        {story.owner.login}
                    </Link>
                </span>
                <span className="meta-item">
                    {new Date(story.createdAt).toLocaleDateString()}
                </span>
                <span className="meta-item">
                    {story.partsCount} {t('parts', { count: story.partsCount })}
                </span>
            </div>
            
            {story.coverImageUrl && (
                <div className="story-cover">
                    <img src={story.coverImageUrl} alt={story.title} />
                </div>
            )}
            
            <p className="story-description">{story.description}</p>
            
            <div className="story-actions">
                <button 
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={onLike}
                >
                    <FaHeart /> {likeCount}
                </button>
                <button className="comment-button">
                    <FaComment /> {story.commentCount}
                </button>
            </div>
            
            <div className="story-tags">
                {story.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default StoryHeader;