// components/Story/Part.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const Part = ({
    part,
    currentUser,
    isOwner,
    isEditing,
    editedContent,
    onEditStart,
    onEditCancel,
    onEditSave,
    onEditContentChange,
    onDelete
}) => {
    const { t } = useTranslation();
    const canEdit = currentUser?.id === part.author.id || isOwner;

    return (
        <div className="story-part">
            <div className="part-header">
                <span className="part-order">{t('Part')} {part.order}</span>
                <span className="part-author">
                    {t('By')} {part.author.login}
                </span>
            </div>
            
            <div className="part-content-container">
                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={(e) => onEditContentChange(e.target.value)}
                        className="universal-textarea"
                    />
                ) : (
                    <div className="part-content">
                        {part.content}
                    </div>
                )}
            </div>

            {canEdit && (
                <div className="part-actions">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => onEditSave(part.id)}
                                className="save-edit-button"
                            >
                                {t('Save')}
                            </button>
                            <button 
                                onClick={onEditCancel}
                                className="cancel-edit-button"
                            >
                                {t('Cancel')}
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={onEditStart}
                                className="edit-part-button"
                            >
                                {t('Edit')}
                            </button>
                            <button 
                                onClick={() => onDelete(part.id)}
                                className="delete-part-button"
                            >
                                {t('Delete')}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Part;