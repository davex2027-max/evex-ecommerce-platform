import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await API.post('/users/login', { email, password });
            setUser(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await API.post('/users/register', { name, email, password, role });
            setUser(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
