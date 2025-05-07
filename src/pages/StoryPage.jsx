import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import StoryHeader from '../components/Story/StoryHeader';
import StoryParts from '../components/Story/StoryParts';
import CommentsSection from '../components/Story/CommentsSection';
import ReportModal from '../components/Common/ReportModal';
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
    const [showReportModal, setShowReportModal] = useState(false);

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
                    } 
                    catch (err) {
                        console.error('Error checking like status:', err);
                    }
                }
            } 
            catch (err) {
                console.error('Error loading story:', err);
                setError(err.message);
                
                if (err.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            } 
            finally {
                setLoading(false);
            }
        };

        fetchStoryData();
    }, [id, currentUser, navigate]);

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
            
            if (!response.ok) throw new Error('Failed to toggle like');
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
        } 
        catch (err) {
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
    
            if (!response.ok) throw new Error('Failed to delete comment');
    
            setComments(prev => prev.filter(c => c.id !== commentId));
            setCommentCount(prev => prev - 1);
            
            setStory(prev => prev ? {
                ...prev,
                commentCount: prev.commentCount - 1
            } : prev);
        } 
        catch (err) {
            console.error('Error deleting comment:', err);
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">{t('Loading...')}</div>;
    if (error) return <div className="error">{error}</div>;
    if (!story) return <div className="error">{t('Story not found')}</div>;

    const isOwner = currentUser && story && currentUser.id === story.owner.id;

    return (
        <div className="story-page">
            <StoryHeader 
                story={story}
                isOwner={isOwner}
                isLiked={isLiked}
                likeCount={likeCount}
                onEdit={handleEditStory}
                onLike={handleLike}
                onReport={() => setShowReportModal(true)}
            />

            <StoryParts 
                story={story}
                currentUser={currentUser}
                isOwner={isOwner}
                onUpdateStory={setStory}
            />

            <CommentsSection 
                comments={comments}
                commentCount={commentCount}
                currentUser={currentUser}
                commentText={commentText}
                isOwner={isOwner}
                onCommentSubmit={handleCommentSubmit}
                onCommentTextChange={setCommentText}
                onDeleteComment={handleDeleteComment}
            />

            {showReportModal && (
                <ReportModal 
                    onClose={() => setShowReportModal(false)}
                    onSubmit={(reason, details) => {
                        // Handle report submission
                        const token = localStorage.getItem('authToken');
                        fetch(`http://localhost:5076/stories/${id}/reports`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                Reason: reason,
                                Details: details
                            })
                        })
                        .then(response => {
                            if (!response.ok) throw new Error('Failed to submit report');
                            setShowReportModal(false);
                            alert('Story reported successfully');
                        })
                        .catch(err => {
                            console.error('Error reporting story:', err);
                            setError(err.message);
                        });
                    }}
                />
            )}
        </div>
    );
};

export default StoryPage;