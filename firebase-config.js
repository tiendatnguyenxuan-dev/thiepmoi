// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGkjNuwDRw9MBPL1H1UJjpCFjsKRTf2po",
    authDomain: "thiepmoi-7ee26.firebaseapp.com",
    databaseURL: "https://thiepmoi-7ee26-default-rtdb.firebaseio.com",
    projectId: "thiepmoi-7ee26",
    storageBucket: "thiepmoi-7ee26.firebasestorage.app",
    messagingSenderId: "70680449613",
    appId: "1:70680449613:web:7eacac48143bb091978204"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const database = firebase.database();

console.log('🔥 Firebase initialized successfully!');
