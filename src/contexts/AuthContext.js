import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await axios.get('http://localhost:5076/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };
        
        loadUser();
    }, []);

    const login = async (credentials) => {
        const response = await axios.post('http://localhost:5076/users/login', credentials);

        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        setUser(response.data.user);
        
        return response.data.user;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);