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

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const itemId = urlParams.get('itemId');


getDownloadURL(storageRef(storage, `images/${itemId}`)).then((url) => {
   
    const itemImg = document.createElement('img');
    itemImg.src = url;

    
    document.body.appendChild(itemImg);
}).catch((error) => {
    console.error('Error getting download URL:', error);
});


onValue(ref(db, `items/${userId}/${itemId}`), function(snapshot) {
    const item = snapshot.val();
    if (item) {
        
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-details');

        const itemName = document.createElement('h2');
        itemName.textContent = item.name;

        const itemDescription = document.createElement('p');
        itemDescription.textContent = item.description;

       
        itemContainer.appendChild(itemName);
        itemContainer.appendChild(itemDescription);

        
        document.body.appendChild(itemContainer);

        
        const contactLink = document.createElement('a');
        contactLink.textContent = 'Contact User';
        contactLink.href = `/contactDetails/contact.html?userId=${userId}`; ndChild(contactLink);
    } else {
        console.error('Item not found');
    }
}, (error) => {
    console.error('Error retrieving item details:', error);
});