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
const storage = getStorage();

const userId = localStorage.getItem('userId');

window.setInterval(changeSlide, 5000);
let currentSlide = 0;

function changeSlide() {
    const slides = document.querySelectorAll(".slide");
    let lastSlide = currentSlide;
    currentSlide = (currentSlide + 1) % slides.length;
    slides[lastSlide].classList.toggle("show");
    slides[currentSlide].classList.toggle("show");
}

function signOut() {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

function displayRandomItems() {
    const itemsRef = ref(db, 'items/');

    onValue(itemsRef, function(snapshot) {
        const users = snapshot.val();
        const currentUser = localStorage.getItem('userId');

        if (currentUser) {
            let allItems = [];

            // Iterate over each user
            Object.keys(users).forEach(userId => {
                // Exclude items posted by the current user
                if (userId !== currentUser) {
                    // Push items of this user to allItems array
                    const userItems = users[userId];
                    Object.keys(userItems).forEach(itemId => {
                        // Add userId and itemId to each item
                        userItems[itemId].userId = userId;
                        userItems[itemId].itemId = itemId;
                        allItems.push(userItems[itemId]);
                    });
                }
            });

            const itemsList = document.getElementById('itemsList');
            itemsList.innerHTML = '';

            // Generate three random indices
            const randomIndices = [];
            while (randomIndices.length < 3) {
                const randomIndex = Math.floor(Math.random() * allItems.length);
                if (!randomIndices.includes(randomIndex)) {
                    randomIndices.push(randomIndex);
                }
            }

            // Display three random items
            randomIndices.forEach(index => {
                const item = allItems[index];
                const itemId = item.itemId;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');

                const itemLink = document.createElement('a');
                itemLink.href = `../itemDetails/itemDetails.html?userId=${item.userId}&itemId=${item.itemId}`;
                itemLink.style.textDecoration = 'none';

                const itemTitle = document.createElement('h3');
                itemTitle.textContent = item.name;

                const itemDescription = document.createElement('p');
                itemDescription.textContent = item.description;

                const itemImage = document.createElement('img');

                getDownloadURL(storageRef(storage, `images/${itemId}`)).then((url) => {
                    itemImage.src = url;
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                    // Handle missing image here (e.g., display a placeholder)
                    itemImage.src = 'placeholder.jpg'; // Provide a placeholder image URL
                });

                

                itemLink.appendChild(itemTitle);
                itemLink.appendChild(itemDescription);
                itemDiv.appendChild(itemImage);
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

// Call displayRandomItems function when the window loads
window.onload = displayRandomItems;
