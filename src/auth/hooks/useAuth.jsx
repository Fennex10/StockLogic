import { useState } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // For now, mock login
            if (email && password) {
                setUser({ email });
                return { success: true };
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return { user, login, logout, loading };
};
