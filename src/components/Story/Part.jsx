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
                {canEdit && (
                    <div className="part-actions">
                        {isEditing ? (
                            <>
                                <button onClick={() => onEditSave(part.id)}>
                                    {t('Save')}
                                </button>
                                <button onClick={onEditCancel}>
                                    {t('Cancel')}
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={onEditStart}>
                                    {t('Edit')}
                                </button>
                                <button onClick={() => onDelete(part.id)}>
                                    {t('Delete')}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="part-content">
                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={(e) => onEditContentChange(e.target.value)}
                    />
                ) : (
                    part.content
                )}
            </div>
        </div>
    );
};

export default Part;