import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditAccount.css';

const EditAccount = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        description: '',
        profileImage: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5076/users/${id}/profile`);
                setFormData({
                    login: response.data.login,
                    email: response.data.email,
                    description: response.data.description,
                    profileImage: response.data.profileImage
                });
            }
            catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile');
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5076/users/${id}`, 
                formData, 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        
            setFormData({
                login: response.data.login,
                email: response.data.email,
                description: response.data.description,
                profileImage: response.data.profileImage
            });
            
            navigate(`/account/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    if (isLoading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="edit-account-container">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label>Profile Image URL</label>
                    <input
                        type="url"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleChange}
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="save-button">
                        Save Changes
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(`/account/${id}`)}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAccount;