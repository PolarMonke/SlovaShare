import React, { useState, useEffect } from 'react';
import StoryCard from '../components/StoryCard';
import { useTranslation } from 'react-i18next';
import '../styles/Home.css';

function Home() {
    const { t } = useTranslation();
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('http://localhost:5076/stories', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch stories');
                }

                const data = await response.json();
                setStories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (isLoading) return <div className="loading">{t('Loading stories...')}</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="home-container">
            <h1 className="page-title">{t('Latest Stories')}</h1>
            
            <div className="stories-grid">
                {stories.length > 0 ? (
                    stories.map(story => (
                        <StoryCard key={story.id} story={story} />
                    ))
                ) : (
                    <p className="no-stories">{t('No stories found')}</p>
                )}
            </div>
        </div>
    );
}

export default Home;