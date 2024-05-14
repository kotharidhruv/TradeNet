import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBujmIitY5R4E-ta722Hqcm-d9r1Bg3bWY",
    authDomain: "tradenet-a6368.firebaseapp.com",
    projectId: "tradenet-a6368",
    storageBucket: "tradenet-a6368.appspot.com",
    messagingSenderId: "745818693982",
    appId: "1:745818693982:web:478683442cda36ed292fcf"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getDatabase();


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    const usersRef = ref(db, `user/${userId}`); 

    onValue(usersRef, (snapshot) => {
        const user = snapshot.val();
        if (user) {
            const userDetailsContainer = document.createElement('div');

            const userName = document.createElement('h2');
            userName.textContent = user.username; 

            const userEmail = document.createElement('p');
            userEmail.textContent = user.email;

            userDetailsContainer.appendChild(userName);
            userDetailsContainer.appendChild(userEmail);

            const contactDetails = document.getElementById('contactDetails');
            contactDetails.appendChild(userDetailsContainer);
        } else {
            console.error('User not found');
        }
    }, (error) => {
        console.error('Error retrieving user details:', error);
    });
});
