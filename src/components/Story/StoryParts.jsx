import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Part from './Part';

const StoryParts = ({ story, currentUser, isOwner, onUpdateStory }) => {
    const { t } = useTranslation();
    const [showAddPartForm, setShowAddPartForm] = useState(false);
    const [newPartContent, setNewPartContent] = useState('');
    const [isPartValid, setIsPartValid] = useState(false);
    const [editingPartId, setEditingPartId] = useState(null);
    const [editedPartContent, setEditedPartContent] = useState('');

    useEffect(() => {
        setIsPartValid(newPartContent.trim().length >= 10);
    }, [newPartContent]);

    const handleAddPart = async (e) => {
        e.preventDefault();
        const trimmedContent = newPartContent.trim();
        
        if (trimmedContent.length < 10) {
            setIsPartValid(false);
            return;
        }
    
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');
    
            const response = await fetch(`http://localhost:5076/stories/${story.id}/storyparts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: trimmedContent })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to add part');
            }
    
            const newPart = await response.json();
            onUpdateStory(prev => ({
                ...prev,
                parts: [...prev.parts, newPart],
                partsCount: prev.partsCount + 1
            }));
            
            setNewPartContent('');
            setShowAddPartForm(false);
        } 
        catch (err) {
            console.error('Error adding part:', err);
        }
    };

    const handleSaveEdit = async (partId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5076/stories/${story.id}/storyparts/${partId}`, {
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
        
            onUpdateStory(prev => ({
                ...prev,
                parts: prev.parts.map(p => 
                    p.id === partId ? { ...p, content: editedPartContent } : p
                )
            }));
            
            setEditingPartId(null);
        } 
        catch (err) {
            console.error('Error updating part:', err);
        }
    };

    const handleDeletePart = async (partId) => {
        if (!window.confirm(t('Are you sure you want to delete this part?'))) return;
        
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5076/stories/${story.id}/storyparts/${partId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) throw new Error('Failed to delete part');
    
            onUpdateStory(prev => ({
                ...prev,
                parts: prev.parts.filter(p => p.id !== partId),
                partsCount: prev.partsCount - 1
            }));
        } 
        catch (err) {
            console.error('Error deleting part:', err);
        }
    };

    return (
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
                        className='universal-textarea'
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
                        <Part
                            key={part.id}
                            part={part}
                            currentUser={currentUser}
                            isOwner={isOwner}
                            isEditing={editingPartId === part.id}
                            editedContent={editedPartContent}
                            onEditStart={() => {
                                setEditingPartId(part.id);
                                setEditedPartContent(part.content);
                            }}
                            onEditCancel={() => setEditingPartId(null)}
                            onEditSave={handleSaveEdit}
                            onEditContentChange={setEditedPartContent}
                            onDelete={handleDeletePart}
                        />
                    ))}
                </div>
            ) : (
                <p>{t('No parts available')}</p>
            )}
        </div>
    );
};

export default StoryParts;