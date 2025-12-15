import { createContext, useState, useContext, useEffect } from 'react';
import { identityApi } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            identityApi.validate(token)
                .then(() => {
                    const decoded = parseJwt(token);
                    const username = decoded.sub;
                    const role = decoded.role || 'USER';
                    const email = decoded.email || username; // Fallback to username if email not in token
                    setUser({ username, role, email });
                })
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await identityApi.login({ username, password });
            const newToken = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);

            const decoded = parseJwt(newToken);
            const role = decoded.role || 'USER';
            const email = decoded.email || username;
            setUser({ username, role, email });
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            await identityApi.register({ name: username, email, password });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Utility to parse JWT (without library)
function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
}
