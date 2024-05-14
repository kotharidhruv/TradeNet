import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
import { getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBujmIitY5R4E-ta722Hqcm-d9r1Bg3bWY",
  authDomain: "tradenet-a6368.firebaseapp.com",
  projectId: "tradenet-a6368",
  storageBucket: "tradenet-a6368.appspot.com",
  messagingSenderId: "745818693982",
  appId: "1:745818693982:web:478683442cda36ed292fcf"
};

initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();

// Function to handle form submission
const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Get user input
    const itemName = postItemForm['itemName'].value;
    const itemDescription = postItemForm['itemDescription'].value;
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    const itemID = Date.now().toString(36) + Math.random().toString(36).substr(2);

    const fileInput = postItemForm['itemImage'];

    const file = fileInput.files[0];

    try {
        await set(ref(db, `items/${userId}/${itemID}`), {
            name: itemName,
            description: itemDescription,
            imageURL: '' 
        });

        
        const storage = getStorage();
        const storageReference = storageRef(storage, `images/${itemID}`); 
        await uploadBytes(storageReference, file); 

        
        const downloadURL = await getDownloadURL(storageReference);

        
        await set(ref(db, `items/${userId}/${itemID}`), {
            name: itemName,
            description: itemDescription,
            imageURL: downloadURL
        }, { merge: true });

        console.log('Item posted successfully');
        alert('Item posted successfully');
    } catch (error) {
        console.error('Error posting item:', error);
        alert('Error posting item. Please try again.');
    }
};


onAuthStateChanged(auth, (user) => {
    const postItemForm = document.getElementById('postItemForm');

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (localStorage.getItem('userId')) {
            
            await handleFormSubmit(e);
        } else {
            
            alert('Please sign in to post items.');
            
        }
    };

    
    if (user) {
        postItemForm.addEventListener('submit', handleSubmit);
    }
});
