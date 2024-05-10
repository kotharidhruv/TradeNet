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

    // Get the file input element
    const fileInput = postItemForm['itemImage'];

    // Get the selected file
    const file = fileInput.files[0];

    try {
        // Save item data to Firebase Realtime Database
        await set(ref(db, `items/${userId}/${itemID}`), {
            name: itemName,
            description: itemDescription,
            imageURL: '' // Placeholder for the image URL
        });

        // Upload the image to Firebase Storage
        const storage = getStorage();
        const storageReference = storageRef(storage, `images/${itemID}`); // Use storageRef function to get a reference
        await uploadBytes(storageReference, file); // Upload file bytes directly

        // Get the image download URL
        const downloadURL = await getDownloadURL(storageReference);

        // Update the item data with the image URL
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

// Check if user is signed in
onAuthStateChanged(auth, (user) => {
    const postItemForm = document.getElementById('postItemForm');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (localStorage.getItem('userId')) {
            // User is signed in, enable form submission
            await handleFormSubmit(e);
        } else {
            // User is not signed in, display a message or redirect to sign-in page
            alert('Please sign in to post items.');
            // You can redirect to sign-in page using window.location.href = 'signin.html';
        }
    };

    // Attach submit event listener only if user is signed in
    if (user) {
        postItemForm.addEventListener('submit', handleSubmit);
    }
});
