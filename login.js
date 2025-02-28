import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
 // Firebase Configuration (Replace with your actual Firebase config)
 const firebaseConfig = {
    apiKey: "AIzaSyCnFKqMPjh8nVtYmcObmlmbhiWL889_sQU",
    authDomain: "vishwanet-4174e.firebaseapp.com",
    projectId: "vishwanet-4174e",
    storageBucket: "vishwanet-4174e.firebasestorage.app",
    messagingSenderId: "598905314918",
    appId: "1:598905314918:web:a60e7c3449f912106a57a7",
    measurementId: "G-XHDB8H7ZNP"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Login Handler
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Redirect to dashboard or home page
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            alert(error.message);
        });
});