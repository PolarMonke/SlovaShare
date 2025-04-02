import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AccountPage.css';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const AccountPage = () => {
    const { t } = useTranslation();
    const { user: currentUser, logout } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileId = id || currentUser?.id;
                if (!profileId) {
                    throw new Error('No user ID specified');
                }

                const response = await axios.get(
                    `http://localhost:5076/users/${profileId}/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );

                setProfileData(response.data);
            }
            catch (err) {
                console.error('Profile load error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load profile');
                
                if (err.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
                else if (err.response?.status === 403) {
                    setError("You don't have permission to view this profile");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser || localStorage.getItem('authToken')) {
            fetchProfileData();
        }
        else {
            navigate('/login');
        }
    }, [id, currentUser, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoading) return <div className="loading">Loading profile...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!profileData) return <div>No profile data available</div>;

    return (
        <div className="account-container">
            <div className="profile-header">
                <img 
                    src={profileData.profileImage || '/img/default.png'} 
                    alt="Profile" 
                    className="profile-image"
                />
                <h1>{profileData.login}</h1>
                {profileData.isCurrentUser && <span className="profile-badge">({t('You')})</span>}
            </div>

            <div className="profile-details">
                <div className="detail-group">
                    <h3>{t('About')}</h3>
                    <p>{profileData.description || t('No Description')}</p>
                </div>

                <div className="detail-group">
                    <h3>{t('Statistics')}</h3>
                    <ul className="stats-list">
                        <li>{t('Stories Started')}: {profileData.storiesStarted || 0}</li>
                        <li>{t('Stories Contributed')}: {profileData.storiesContributed || 0}</li>
                        <li>{t('Likes Received')}: {profileData.likesReceived || 0}</li>
                    </ul>
                </div>

                {profileData.isCurrentUser && (
                    <div className="profile-actions">
                        <button 
                            onClick={() => navigate(`/account/${id}/edit`)}
                            className="edit-button"
                        >
                            {t('Edit Profile')}
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="edit-button"
                        >
                            {t('Log Out')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountPage;