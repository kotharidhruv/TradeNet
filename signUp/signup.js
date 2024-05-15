// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBujmIitY5R4E-ta722Hqcm-d9r1Bg3bWY",
        authDomain: "tradenet-a6368.firebaseapp.com",
        projectId: "tradenet-a6368",
        storageBucket: "tradenet-a6368.appspot.com",
        messagingSenderId: "745818693982",
        appId: "1:745818693982:web:478683442cda36ed292fcf"
    };

    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getDatabase();

    const signUp = document.getElementById('signUp');
    signUp.addEventListener("click", function (event) {
        event.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        var cont = false;

        function writeUserData(userId, name, email) {
            set(ref(db, 'user/' + userId), {
                username: name,
                email: email,
                userId: userId
            });
            alert('data added to db');
        }

        function createAcc() {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const userId = user.uid;
                    localStorage.setItem('userId', userId);

                    // Signed up 
                    alert("account created");
                    writeUserData(userId, name, email);
                    cont = true;
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                    cont = false;
                });
        }

        createAcc();
    });
});