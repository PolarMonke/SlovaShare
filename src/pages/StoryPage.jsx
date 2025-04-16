import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaComment, FaEdit, FaTrash, FaReply } from 'react-icons/fa';
import '../styles/StoryPage.css';

const StoryPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await fetch(`http://localhost:5076/stories/${id}`);
                if (!response.ok) throw new Error('Story not found');
                const data = await response.json();
                setStory(data);
                setLikeCount(data.likeCount);
                fetchComments();
                checkIfLiked();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:5076/stories/${id}/comments`);
                if (!response.ok) throw new Error('Failed to load comments');
                const data = await response.json();
                setComments(data);
            } catch (err) {
                console.error('Error loading comments:', err);
            }
        };

        const checkIfLiked = async () => {
            try {
                const response = await fetch(`http://localhost:5076/stories/${id}/like/status`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsLiked(data.isLiked);
                }
            } catch (err) {
                console.error('Error checking like status:', err);
            }
        };

        fetchStory();
    }, [id]);

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:5076/stories/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                setIsLiked(result.liked);
                setLikeCount(prev => result.liked ? prev + 1 : prev - 1);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const response = await fetch(`http://localhost:5076/stories/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: commentText })
            });

            if (response.ok) {
                const newComment = await response.json();
                setComments(prev => [newComment, ...prev]);
                setCommentText('');
                // Update comment count in story
                setStory(prev => ({
                    ...prev,
                    commentCount: prev.commentCount + 1
                }));
            }
        } catch (err) {
            console.error('Error submitting comment:', err);
        }
    };

    if (loading) return <div className="loading">{t('Loading...')}</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="story-page">
            <div className="story-header">
                <h1 className="story-title">{story.title}</h1>
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
                        onClick={handleLike}
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
            
            <div className="story-content">
                <h2>{t('Story Parts')}</h2>
                {story.parts && story.parts.length > 0 ? (
                    <div className="parts-container">
                        {story.parts.sort((a, b) => a.order - b.order).map(part => (
                            <div key={part.id} className="story-part">
                                <div className="part-header">
                                    <span className="part-order">Part {part.order}</span>
                                    <span className="part-author">
                                        {t('By')} {part.author.login}
                                    </span>
                                </div>
                                <div className="part-content">
                                    {part.content}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{t('No parts available')}</p>
                )}
            </div>
            
            <div className="comments-section">
                <h2>{t('Comments')} ({story.commentCount})</h2>
                
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={t('Write your comment here...')}
                        required
                    />
                    <button type="submit" className="submit-comment">
                        <FaComment /> {t('Post Comment')}
                    </button>
                </form>
                
                <div className="comments-list">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="comment">
                                <div className="comment-header">
                                    <Link to={`/account/${comment.author.id}`} className="comment-author">
                                        {comment.author.login}
                                    </Link>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="comment-content">
                                    {comment.content}
                                </div>
                                <div className="comment-actions">
                                    <button className="reply-button">
                                        <FaReply /> {t('Reply')}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>{t('No comments yet')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryPage;