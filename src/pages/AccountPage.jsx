import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AccountPage.css';

const AccountPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:5076/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
            });
            setUserData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
            if (err.response?.status === 401) {
            navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
        };

        fetchUserData();
    }, [id, navigate]);

    if (isLoading) return <div className="loading">Loading profile...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!userData) return <div>No user data found</div>;

    return (
        <div className="account-container">
        <div className="profile-header">
            <img 
            src={userData.profileImage || '/img/default.png'} 
            alt="Profile" 
            className="profile-image"
            />
            <h1>{userData.login}</h1>
        </div>

        <div className="profile-details">
            <div className="detail-group">
            <h3>About</h3>
            <p>{userData.description || 'No description yet'}</p>
            </div>

            <div className="detail-group">
            <h3>Statistics</h3>
            <ul className="stats-list">
                <li>Stories Started: {userData.stats?.storiesStarted || 0}</li>
                <li>Stories Contributed: {userData.stats?.storiesContributed || 0}</li>
                <li>Likes Received: {userData.stats?.likesReceived || 0}</li>
            </ul>
            </div>

            {userData.id === parseInt(localStorage.getItem('userId')) && (
            <button 
                onClick={() => navigate(`/account/${id}/edit`)}
                className="edit-button"
            >
                Edit Profile
            </button>
            )}
        </div>
        </div>
    );
};

export default AccountPage;