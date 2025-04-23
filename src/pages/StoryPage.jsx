import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaComment, FaEdit, FaReply, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../styles/StoryPage.css';

const StoryPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [showAddPartForm, setShowAddPartForm] = useState(false);
    const [newPartContent, setNewPartContent] = useState('');

    useEffect(() => {
        const fetchStoryData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                
                const [storyRes, commentsRes] = await Promise.all([
                    fetch(`http://localhost:5076/stories/${id}`, { headers }),
                    fetch(`http://localhost:5076/stories/${id}/comments`, { headers })
                ]);

                if (!storyRes.ok) throw new Error('Story not found');
                if (!commentsRes.ok) throw new Error('Failed to load comments');

                const storyData = await storyRes.json();
                const commentsData = await commentsRes.json();

                setStory(storyData);
                setComments(commentsData);
                setLikeCount(storyData.likeCount || 0);
                setCommentCount(storyData.commentCount || commentsData.length || 0);

                if (currentUser && token) {
                    try {
                        const likeRes = await fetch(`http://localhost:5076/stories/${id}/likes/status`, { 
                            headers: { Authorization: `Bearer ${token}` } 
                        });
                        if (likeRes.ok) {
                            const likeData = await likeRes.json();
                            setIsLiked(likeData.isLiked);
                        }
                    } catch (err) {
                        console.error('Error checking like status:', err);
                    }
                }
            } catch (err) {
                console.error('Error loading story:', err);
                setError(err.message);
                
                if (err.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStoryData();
    }, [id, currentUser, navigate]);

    const handleAddPart = async (e) => {
        e.preventDefault();
        if (!newPartContent.trim()) return;
    
        try {
            console.log("Sending part content:", newPartContent);
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            const response = await fetch(`http://localhost:5076/stories/${id}/storyparts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newPartContent.trim() })
            });
    
            console.log("Response status:", response.status); // Debug log
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error details:", errorData); // Debug log
                throw new Error(errorData.message || 'Failed to add part');
            }
    
            const newPart = await response.json();
            console.log("New part created:", newPart); // Debug log
            
            setStory(prev => ({
                ...prev,
                parts: [...prev.parts, newPart],
                partsCount: prev.partsCount + 1
            }));
            setNewPartContent('');
            setShowAddPartForm(false);
        } catch (err) {
            console.error('Error adding part:', err);
            setError(err.message || 'Failed to add part. Please try again.');
        }
    };

    const handleEditStory = () => {
        navigate(`/story/${id}/edit`);
    };

    const handleLike = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const oldIsLiked = isLiked;
        const oldLikeCount = likeCount;

        setIsLiked(!oldIsLiked);
        setLikeCount(oldIsLiked ? Math.max(0, oldLikeCount - 1) : oldLikeCount + 1);

        try {
            const response = await fetch(`http://localhost:5076/stories/${id}/likes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setIsLiked(!oldIsLiked);
                setLikeCount(oldIsLiked ? Math.max(0, oldLikeCount - 1) : oldLikeCount + 1);
            }
            if (!response.ok) 
            {    
                throw new Error('Failed to toggle like');
            }
        }
        catch (err) {
            console.error('Error toggling like:', err);
            setError(err.message);
            setIsLiked(oldIsLiked);
            setLikeCount(oldLikeCount);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const response = await fetch(`http://localhost:5076/stories/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: commentText })
            });

            if (!response.ok) throw new Error('Failed to post comment');

            const newComment = await response.json();
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
            setCommentCount(prev => prev + 1);
            setStory(prev => ({
                ...prev,
                commentCount: prev.commentCount + 1
            }));
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">{t('Loading...')}</div>;
    if (error) return <div className="error">{error}</div>;
    if (!story) return <div className="error">{t('Story not found')}</div>;

    const isOwner = currentUser && story && currentUser.id === story.owner.id;

    return (
        <div className="story-page">
            <div className="story-header">
                <div className="story-header-top">
                    <h1 className="story-title">{story.title}</h1>
                    {isOwner && (
                        <button 
                            onClick={handleEditStory}
                            className="edit-story-button"
                            title={t('Edit Story')}
                        >
                            <FaEdit />
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
                <div className="story-parts-header">
                    <h2>{t('Story Parts')}</h2>
                    {currentUser && (
                        <button 
                            onClick={() => setShowAddPartForm(!showAddPartForm)}
                            className="add-part-button"
                        >
                            <FaPlus /> {t('Add Part')}
                        </button>
                    )}
                </div>

                {showAddPartForm && (
                    <form onSubmit={handleAddPart} className="add-part-form">
                        <textarea
                            value={newPartContent}
                            onChange={(e) => setNewPartContent(e.target.value)}
                            placeholder={t('Write your part here...')}
                            required
                        />
                        <div className="add-part-actions">
                            <button type="submit" className="submit-part">
                                {t('Submit Part')}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowAddPartForm(false)}
                                className="cancel-add-part"
                            >
                                {t('Cancel')}
                            </button>
                        </div>
                    </form>
                )}

                {story.parts && story.parts.length > 0 ? (
                    <div className="parts-container">
                        {story.parts.sort((a, b) => a.order - b.order).map(part => (
                            <div key={part.id} className="story-part">
                                <div className="part-header">
                                    <span className="part-order">{t('Part')} {part.order}</span>
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
                
                {currentUser ? (
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
                ) : (
                    <p className="login-prompt">
                        {t('Please login to leave a comment')}
                    </p>
                )}
                
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