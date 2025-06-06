import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    Auth,
    UserCredential,
    User,
} from 'firebase/auth';
import { app } from './firebaseConfig';

// Define a custom error interface for better type safety
interface AuthError {
    code: string;
    message: string;
}

const auth: Auth = getAuth(app);

export const signIn = async (email: string, password: string): Promise<void> => {
    try {
        await signInWithEmailAndPassword(auth, email, password).then((result) => {
            console.log(result);
        });
    } catch (error: any) {
        throw { code: error.code, message: error.message } as AuthError;
    }
};

export const signUp = async (email: string, password: string): Promise<void> => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        throw { code: error.code, message: error.message } as AuthError;
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        throw { code: error.code, message: error.message } as AuthError;
    }
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
