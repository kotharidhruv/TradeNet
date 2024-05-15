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
let currentSlide = 1;

function changeSlide() {
  let slides = document.querySelectorAll(".slide");

  let lastSlide = currentSlide;
  currentSlide++;

  if (lastSlide < 0) {
    lastSlide = slides.length - 1;
  }
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  slides[lastSlide].classList.toggle("show");
  slides[currentSlide].classList.toggle("show");
}

const signout = document.getElementById('signout');
signout.onclick= function(){
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

function displayPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
}


    

document.addEventListener('DOMContentLoaded', function() {
    displayRandomItems();
    
    const popupShown = localStorage.getItem('popupShown');
    const userId = localStorage.getItem('userId');
    if (!userId) {
        displayPopup();
    }
});




function displayRandomItems() {
    const itemsRef = ref(db, 'items/');
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = ''; 

    onValue(itemsRef, function(snapshot) {
        const users = snapshot.val();
        const currentUser = localStorage.getItem('userId');

        if (currentUser) {
            let allItems = [];

            Object.keys(users).forEach(userId => {
                if (userId !== currentUser) {
                    const userItems = users[userId];
                    Object.keys(userItems).forEach(itemId => {
                        userItems[itemId].userId = userId;
                        userItems[itemId].itemId = itemId;
                        allItems.push(userItems[itemId]);
                    });
                }
            });

            const randomIndices = [];
            while (randomIndices.length < 3) {
                const randomIndex = Math.floor(Math.random() * allItems.length);
                if (!randomIndices.includes(randomIndex)) {
                    randomIndices.push(randomIndex);
                }
            }

            randomIndices.forEach(index => {
                const item = allItems[index];
                const itemId = item.itemId;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('random-item');

                itemDiv.style.width = 'calc(33.33% - 20px)'; 

                const itemLink = document.createElement('a');
                itemLink.href = `../itemDetails/itemDetails.html?userId=${item.userId}&itemId=${item.itemId}`;
                itemLink.style.textDecoration = 'none';

                const itemImageContainer = document.createElement('div');
                itemImageContainer.classList.add('image-container');

                const itemImage = document.createElement('img');

                getDownloadURL(storageRef(storage, `images/${itemId}`)).then((url) => {
                    itemImage.onload = function() {
                        const targetWidth = 200; 
                        const targetHeight = 300; 
                        const aspectRatio = this.width / this.height;

                        
                        if (aspectRatio > 1) {
                            this.width = targetWidth;
                            this.height = targetWidth / aspectRatio;
                        } else {
                            this.height = targetHeight;
                            this.width = targetHeight * aspectRatio;
                        }
                    };
                    itemImage.src = url;
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                    itemImage.src = 'placeholder.jpg'; // 
                });

                const itemText = document.createElement('div');
                itemText.classList.add('text');

                const itemTitle = document.createElement('h3');
                itemTitle.textContent = item.name;

                const itemDescription = document.createElement('p');
                itemDescription.textContent = item.description;

                itemImageContainer.appendChild(itemImage);
                itemText.appendChild(itemTitle);
                itemText.appendChild(itemDescription);
                itemLink.appendChild(itemImageContainer);
                itemLink.appendChild(itemText);
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
