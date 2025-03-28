import { createContext, useContext, useEffect, useState, useRef } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const calledRef = useRef(false);

    const syncAuthState = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setUser(null);
            return false;
        }
        return true;
    };

    const loadUser = async () => {
        if (calledRef.current) return;
        calledRef.current = true;
        
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setLoading(false);
                return;
            }
            
            const response = await api.get('/users/me');
            setUser(response.data);
        } catch (err) {
            console.log('No active session');
            localStorage.removeItem('authToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);
            localStorage.setItem('authToken', response.data.token);
            await loadUser();
            return response.data.user;
        } catch (error) {
            localStorage.removeItem('authToken');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
        } finally {
            localStorage.removeItem('authToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            logout,
            loadUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);