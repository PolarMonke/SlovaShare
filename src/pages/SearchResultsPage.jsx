import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StoryCard from '../components/StoryCard';
import '../styles/SearchResultsPage.css';

const SearchResultsPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('q') || '';
        const tags = searchParams.getAll('tag') || [];
        
        setSelectedTags(tags);
        fetchResults(query, tags, page);
    }, [location.search, page]);

    const fetchResults = async (query, tags, pageNum) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (query) params.append('query', query);
            tags.forEach(tag => params.append('tags', tag));
            params.append('page', pageNum);
            params.append('pageSize', 10);

            const response = await fetch(`http://localhost:5076/search?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTagClick = (tag) => {
        const searchParams = new URLSearchParams(location.search);
        const currentTags = searchParams.getAll('tag');
        
        if (currentTags.includes(tag)) {
            searchParams.delete('tag', tag);
        } else {
            searchParams.append('tag', tag);
        }
        
        navigate(`/search?${searchParams.toString()}`);
    };

    if (loading) return <div className="loading">{t('Loading...')}</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="search-results-container">
            <h1>{t('Search Results')}</h1>
            
            {results?.results?.length > 0 ? (
                <>
                    <div className="results-grid">
                        {results.results.map(story => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>
                    
                    <div className="pagination">
                        {page > 1 && (
                            <button onClick={() => setPage(p => p - 1)}>
                                {t('Previous')}
                            </button>
                        )}
                        {results.totalCount > page * results.pageSize && (
                            <button onClick={() => setPage(p => p + 1)}>
                                {t('Next')}
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p>{t('No results found')}</p>
            )}
        </div>
    );
};

export default SearchResultsPage;