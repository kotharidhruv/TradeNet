// Import the functions you need from the SDKs you need


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js"
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBujmIitY5R4E-ta722Hqcm-d9r1Bg3bWY",
  authDomain: "tradenet-a6368.firebaseapp.com",
  projectId: "tradenet-a6368",
  storageBucket: "tradenet-a6368.appspot.com",
  messagingSenderId: "745818693982",
  appId: "1:745818693982:web:478683442cda36ed292fcf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getDatabase()

function displayItems() {
    const itemsRef = ref(db, 'items/');

    onValue(itemsRef, function(snapshot) {
        const users = snapshot.val();
        const currentUser = localStorage.getItem('userId');

        if (currentUser) {
            let filteredItems = [];

            Object.keys(users).forEach(userId => {
                if (userId !== currentUser) {
                    const userItems = users[userId];
                    Object.keys(userItems).forEach(itemId => {
                        userItems[itemId].userId = userId;
                        userItems[itemId].itemId = itemId;
                        filteredItems.push(userItems[itemId]);
                    });
                }
            });

            const itemsList = document.getElementById('itemsList');
            itemsList.innerHTML = '';

            filteredItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');

                const itemLink = document.createElement('a');
                itemLink.href = `../itemDetails/itemDetails.html?userId=${item.userId}&itemId=${item.itemId}`;
                itemLink.style.textDecoration = 'none';

                const itemTitle = document.createElement('h3');
                itemTitle.textContent = item.name;

                const itemDescription = document.createElement('p');
                itemDescription.textContent = item.description;

                itemLink.appendChild(itemTitle);
                itemLink.appendChild(itemDescription);
                itemDiv.appendChild(itemLink);

                itemsList.appendChild(itemDiv);
            });
        } else {
            console.error('User ID not found in localStorage');
        }
    }, (error) => {
        console.error('Error retrieving items:', error);
    });
}

window.onload = displayItems;
