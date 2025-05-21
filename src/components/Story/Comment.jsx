import React from 'react';
import { Link } from 'react-router-dom';
import { FaReply } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Comment = ({ comment, currentUser, isOwner, onDelete }) => {
    const { t } = useTranslation();
    const canDelete = currentUser?.id === comment.author.id || isOwner;

    return (
        <div className="comment">
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
                {canDelete && (
                    <button 
                        className="delete-comment-button"
                        onClick={() => onDelete(comment.id)}
                    >
                        {t('Delete')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Comment;