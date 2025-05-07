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
    const [isPartValid, setIsPartValid] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');

    const [editingPartId, setEditingPartId] = useState(null);
    const [editedPartContent, setEditedPartContent] = useState('');

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

    useEffect(() => {
        setIsPartValid(newPartContent.trim().length >= 10);
    }, [newPartContent]);

    const handleAddPart = async (e) => {
        e.preventDefault();
        const trimmedContent = newPartContent.trim();
        
        // Validate part length
        if (trimmedContent.length < 10) {
            setError(t('Part must be at least 10 characters long'));
            return;
        }
    
        try {
            console.log("Sending part content:", trimmedContent);
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
                body: JSON.stringify({ content: trimmedContent })
            });
    
            console.log("Response status:", response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error details:", errorData);
                throw new Error(errorData.message || 'Failed to add part');
            }
    
            const newPart = await response.json();
            console.log("New part created:", newPart);
            
            setStory(prev => ({
                ...prev,
                parts: [...prev.parts, newPart],
                partsCount: prev.partsCount + 1
            }));
            setNewPartContent('');
            setShowAddPartForm(false);
            setError(null);
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

    const handleDeleteComment = async (commentId) => {
        if (!currentUser) return;
        
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5076/stories/${id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
    
            setComments(prev => prev.filter(c => c.id !== commentId));
            setCommentCount(prev => prev - 1);
            
            setStory(prev => prev ? {
                ...prev,
                commentCount: prev.commentCount - 1
            } : prev);
            
        } catch (err) {
            console.error('Error deleting comment:', err);
            setError(err.message);
        }
    };

    const handleReportSubmit = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5076/stories/${id}/reports`, {
                method: 'POST',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                Reason: reportReason,
                Details: reportDetails
                })
            });
        
            if (!response.ok) throw new Error('Failed to submit report');
        
            setShowReportModal(false);
            setReportReason('');
            setReportDetails('');
            alert('Story reported successfully');
        } 
        catch (err) {
            console.error('Error reporting story:', err);
            setError(err.message);
        }
    };

    
    const handleEditPart = (part) => {
        setEditingPartId(part.id);
        setEditedPartContent(part.content);
    };
    
    const handleSaveEdit = async (partId) => {
        try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5076/stories/${id}/storyparts/${partId}`, {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            Content: editedPartContent
            })
        });
    
        if (!response.ok) throw new Error('Failed to update part');
    
        setStory(prev => ({
            ...prev,
            parts: prev.parts.map(p => 
            p.id === partId ? { ...p, content: editedPartContent } : p
            )
        }));
        setEditingPartId(null);
        } catch (err) {
        console.error('Error updating part:', err);
        setError(err.message);
        }
    };
    
    const handleDeletePart = async (partId) => {
        if (!window.confirm(t('Are you sure you want to delete this part?'))) return;
        
        try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5076/stories/${id}/storyparts/${partId}`, {
            method: 'DELETE',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
    
        if (!response.ok) throw new Error('Failed to delete part');
    
        setStory(prev => ({
            ...prev,
            parts: prev.parts.filter(p => p.id !== partId),
            partsCount: prev.partsCount - 1
        }));
        } catch (err) {
        console.error('Error deleting part:', err);
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
                    {!isOwner && currentUser && (
                    <button 
                        onClick={() => setShowReportModal(true)}
                        className="report-button"
                        title={t('Report Story')}
                    >
                        {t('Report')}
                    </button>
                    )}

                    {showReportModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                        <h3>{t('Report Story')}</h3>
                        <div className="form-group">
                            <label>{t('Reason')}</label>
                            <select 
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            required
                            >
                            <option value="">{t('Select a reason')}</option>
                            <option value="Spam">{t('Spam')}</option>
                            <option value="Inappropriate">{t('Inappropriate Content')}</option>
                            <option value="Plagiarism">{t('Plagiarism')}</option>
                            <option value="Other">{t('Other')}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t('Details')}</label>
                            <textarea
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            placeholder={t('Please provide details about your report')}
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setShowReportModal(false)}>
                            {t('Cancel')}
                            </button>
                            <button 
                            onClick={handleReportSubmit}
                            disabled={!reportReason}
                            >
                            {t('Submit Report')}
                            </button>
                        </div>
                        </div>
                    </div>
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
                        onChange={(e) => {
                            setNewPartContent(e.target.value);
                            setIsPartValid(e.target.value.trim().length >= 10);
                        }}
                        placeholder={t('Write your part here (minimum 10 characters)...')}
                        required
                        minLength={10}
                    />
                    <div className="add-part-actions">
                        <button 
                            type="submit" 
                            className={`submit-part ${!isPartValid ? 'disabled' : ''}`}
                            disabled={!isPartValid}
                        >
                            {t('Submit Part')}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setShowAddPartForm(false);
                                setNewPartContent('');
                                setIsPartValid(false);
                            }}
                            className="cancel-add-part"
                        >
                            {t('Cancel')}
                        </button>
                    </div>
                    {!isPartValid && newPartContent.length > 0 && (
                        <div className="validation-message">
                            {t('Part must be at least 10 characters long')}
                        </div>
                    )}
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
                            {(currentUser?.id === part.author.id || isOwner) && (
                                <div className="part-actions">
                                {editingPartId === part.id ? (
                                    <>
                                    <button onClick={() => handleSaveEdit(part.id)}>
                                        {t('Save')}
                                    </button>
                                    <button onClick={() => setEditingPartId(null)}>
                                        {t('Cancel')}
                                    </button>
                                    </>
                                ) : (
                                    <>
                                    <button onClick={() => handleEditPart(part)}>
                                        {t('Edit')}
                                    </button>
                                    <button onClick={() => handleDeletePart(part.id)}>
                                        {t('Delete')}
                                    </button>
                                    </>
                                )}
                                </div>
                            )}
                            </div>
                            <div className="part-content">
                            {editingPartId === part.id ? (
                                <textarea
                                value={editedPartContent}
                                onChange={(e) => setEditedPartContent(e.target.value)}
                                />
                            ) : (
                                part.content
                            )}
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
                                    {(currentUser?.id === comment.author.id || isOwner) && (
                                        <button 
                                            className="delete-comment-button"
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            {t('Delete')}
                                        </button>
                                    )}
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