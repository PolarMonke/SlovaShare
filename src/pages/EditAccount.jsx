import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/EditAccount.css';
import { useTranslation } from 'react-i18next';

const EditAccount = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        login: '',
        description: '',
        profileImage: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user || user.id !== parseInt(id)) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5076/users/${id}/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );
                
                setFormData({
                    login: response.data.login,
                    description: response.data.description || '',
                    profileImage: response.data.profileImage || ''
                });
            }
            catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile');
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:5076/users/${id}`, 
                {
                    login: formData.login,
                    description: formData.description,
                    profileImage: formData.profileImage
                },
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            
            navigate(`/account/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    if (isLoading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="edit-account-container">
            <h1>{t("Edit Profile")}</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label>{t("Username")}</label>
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("Description")}</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder={t("Description Placeholder")}
                    />
                </div>

                <div className="form-group">
                    <label>{t("Profile Image URL")}</label>
                    <input
                        type="url"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                    {formData.profileImage && (
                        <img 
                            src={formData.profileImage} 
                            alt="Profile preview" 
                            className="profile-image-preview"
                        />
                    )}
                </div>

                <div className="button-group">
                    <button type="submit" className="save-button">
                        {t("Save Changes")}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(`/account/${id}`)}
                        className="cancel-button"
                    >
                        {t("Cancel")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAccount;