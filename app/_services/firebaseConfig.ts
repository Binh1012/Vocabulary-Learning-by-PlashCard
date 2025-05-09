import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyBBd4QRRkv25i_wd2mITbWq_Yea00JfZuk",
    authDomain: "flashcardvocabulary-f58d1.firebaseapp.com",
    databaseURL: "https://flashcardvocabulary-f58d1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "flashcardvocabulary-f58d1",
    storageBucket: "flashcardvocabulary-f58d1.appspot.com",
    messagingSenderId: "575888749287",
    appId: "1:575888749287:web:ac8e0886d049a97401a842",
    measurementId: "G-ZSYYY4VNEP"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);

export { app, database };
