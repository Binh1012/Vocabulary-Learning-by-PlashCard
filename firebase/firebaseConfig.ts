import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDaBl1cBAOTXdTYM64O3SQFCbvUTKATjaU",
    authDomain: "hoquyly-f6f7ebc1.firebaseapp.com",
    databaseURL: "https://hoquyly-f6f7ebc1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hoquyly-f6f7ebc1",
    storageBucket: "hoquyly-f6f7ebc1.appspot.com",
    messagingSenderId: "171360208685",
    appId: "1:171360208685:web:91bcabb424dc69681435a4",
    measurementId: "G-YTQE6KJ6FC"
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const database: Database = getDatabase(app);
