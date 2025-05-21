import React from 'react';
import { FaComment, FaReply } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Comment from './Comment';

const CommentsSection = ({
    comments,
    commentCount,
    currentUser,
    commentText,
    isOwner,
    onCommentSubmit,
    onCommentTextChange,
    onDeleteComment
}) => {
    const { t } = useTranslation();

    return (
        <div className="comments-section">
            <h2>{t('Comments')} ({commentCount})</h2>
            
            {currentUser ? (
                <form onSubmit={onCommentSubmit} className="comment-form">
                    <textarea
                        className='universal-textarea'
                        value={commentText}
                        onChange={(e) => onCommentTextChange(e.target.value)}
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
                        <Comment
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            isOwner={isOwner}
                            onDelete={onDeleteComment}
                        />
                    ))
                ) : (
                    <p>{t('No comments yet')}</p>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;