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

// Signup Handler
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Update user profile with username
            userCredential.user.updateProfile({
                displayName: username
            });
            
            // Redirect to login page
            window.location.href = 'login.html';
        })
        .catch((error) => {
            alert(error.message);
        });
});