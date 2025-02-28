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

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const profileForm = document.getElementById('profileForm');
const imageInput = document.getElementById('imageInput');
const profileImage = document.getElementById('profileImage');
const addClubBtn = document.getElementById('addClub');
const clubsList = document.getElementById('clubsList');

// Check authentication state
auth.onAuthStateChanged(async (user) => {
    if (user) {
        document.getElementById('userEmail').textContent = user.email;
        loadProfileData(user.uid);
        loadProfileImage(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

// Load profile data from Firestore
async function loadProfileData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('fullName').value = data.fullName || '';
            document.getElementById('userName').textContent = data.fullName || 'Your Name';
            document.getElementById('college').value = data.college || '';
            document.getElementById('branch').value = data.branch || '';
            document.getElementById('year').value = data.year || '';
            document.getElementById('bio').value = data.bio || '';

            if (data.clubs && data.clubs.length > 0) {
                clubsList.innerHTML = '';
                data.clubs.forEach(club => addClubInput(club));
            }
        }
    } catch (error) {
        console.error("Error loading profile:", error);
        alert('Error loading profile data');
    }
}

// Load profile image from Storage
async function loadProfileImage(userId) {
    try {
        const url = await storage.ref(`profile-images/${userId}/profile.jpg`).getDownloadURL();
        profileImage.src = url;
    } catch (error) {
        console.log('No profile image found, using default');
        profileImage.src = 'tag.png';
    }
}

// Handle profile image upload
imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Please upload an image smaller than 5MB');
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert('Please login first');
        return;
    }

    try {
        // Show loading state
        profileImage.style.opacity = '0.5';
        
        // Create a unique filename
        const timestamp = Date.now();
        const fileName = `profile.jpg`;
        
        // Create storage reference
        const storageRef = storage.ref(`profile-images/${user.uid}/${fileName}`);
        
        // Create file metadata including the content type
        const metadata = {
            contentType: file.type,
        };

        // Upload the file and metadata
        const uploadTask = storageRef.put(file, metadata);

        // Listen for upload progress
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Handle progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.error("Error uploading image:", error);
                alert('Error uploading image: ' + error.message);
                profileImage.style.opacity = '1';
            }, 
            async () => {
                // Handle successful upload
                try {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    
                    // Update profile image in UI
                    profileImage.src = downloadURL;
                    profileImage.style.opacity = '1';
                    
                    // Store the image URL in Firestore
                    await db.collection('users').doc(user.uid).update({
                        profileImageUrl: downloadURL,
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                    });

                    console.log('Profile image updated successfully');
                } catch (error) {
                    console.error("Error getting download URL:", error);
                    alert('Error updating profile image');
                    profileImage.style.opacity = '1';
                }
            }
        );

    } catch (error) {
        console.error("Error handling upload:", error);
        alert('Error uploading image: ' + error.message);
        profileImage.style.opacity = '1';
    }
});

// Add new club input field
function addClubInput(value = '') {
    const div = document.createElement('div');
    div.className = 'club-input';
    div.innerHTML = `
        <input type="text" class="club-name" value="${value}" placeholder="Enter club name">
        <button type="button" class="remove-club">×</button>
    `;
    
    div.querySelector('.remove-club').addEventListener('click', () => {
        div.remove();
    });
    
    clubsList.appendChild(div);
}

// Add club button click handler
addClubBtn.addEventListener('click', () => {
    addClubInput();
});

// Handle form submission
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    const clubs = Array.from(document.querySelectorAll('.club-name'))
        .map(input => input.value.trim())
        .filter(value => value !== '');

    const profileData = {
        fullName: document.getElementById('fullName').value,
        college: document.getElementById('college').value,
        branch: document.getElementById('branch').value,
        year: document.getElementById('year').value,
        bio: document.getElementById('bio').value,
        clubs: clubs,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('users').doc(user.uid).set(profileData, { merge: true });
        document.getElementById('userName').textContent = profileData.fullName;
        alert('Profile updated successfully!');
    } catch (error) {
        console.error("Error updating profile:", error);
        alert('Error updating profile');
    }
});

// Initialize with one empty club input
addClubInput();