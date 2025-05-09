import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, User } from 'firebase/auth';
import { app } from '@/app/_services/firebaseConfig';
import { Platform } from 'react-native';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth(app);

        // Thiết lập persistence cho web
        const setupPersistence = async () => {
            if (Platform.OS === 'web') {
                try {
                    await setPersistence(auth, browserLocalPersistence);
                } catch (error) {
                    console.error('Error setting persistence:', error);
                }
            }
        };

        setupPersistence().then(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
                setIsLoading(false);
            });

            return () => unsubscribe();
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
