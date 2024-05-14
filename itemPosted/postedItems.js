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
initializeApp(firebaseConfig);
const auth = getAuth()
const db = getDatabase()
const userId = localStorage.getItem('userId')




function displayPostedItems() {
    const postedItemsList = document.getElementById('postedItemsList');
    postedItemsList.innerHTML = ''; 

    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    const itemsRef = ref(db,'items/' + userId);


    onValue(itemsRef, function(snapshot) {
        const data = snapshot.val();
        if (!data) {
            console.log('No posted items found');
            return;
        }


        Object.keys(data).forEach((itemId) => {
            const itemData = data[itemId];
            console.log(itemData); 

   
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const titleElement = document.createElement('h3');
            titleElement.textContent = itemData.name;
            itemDiv.appendChild(titleElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = itemData.description;
            itemDiv.appendChild(descriptionElement);

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            actionsDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            actionsDiv.appendChild(deleteButton);

            itemDiv.appendChild(actionsDiv);

            postedItemsList.appendChild(itemDiv);
        });
    }, function(error) {
        console.error('Error retrieving posted items:', error);
    });
}

displayPostedItems();