import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { onAuthStateChanged ,User} from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';


interface AuthContextType {
    user: any;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User|null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
