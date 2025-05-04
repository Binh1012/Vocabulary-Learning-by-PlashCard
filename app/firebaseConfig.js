import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// let analytics;

const firebaseConfig = {
    apiKey: "AIzaSyBBd4QRRkv25i_wd2mITbWq_Yea00JfZuk",
    authDomain: "flashcardvocabulary-f58d1.firebaseapp.com",
    databaseURL: "https://flashcardvocabulary-f58d1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "flashcardvocabulary-f58d1",
    storageBucket: "flashcardvocabulary-f58d1.appspot.com",
    messagingSenderId: "575888749287",
    appId: "1:575888749287:web:ac8e0886d049a97401a842",
    measurementId: "G-ZSYYY4VNEP"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ✅ Nếu chạy trên web thì mới lấy analytics
// if (typeof window !== 'undefined') {
//     const { getAnalytics } = await import("firebase/analytics");
//     analytics = getAnalytics(app);
// }

export { app, database };
