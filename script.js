import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCu8lgGs3Q-qLeedhngQAVXtt8BHOAlWDg",
    authDomain: "ms-sp-97f78.firebaseapp.com",
    projectId: "ms-sp-97f78",
    appId: "1:880638162029:web:b99af5b5518b3e16a13b64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

// ১. পেজ লোড হবার সময় রিসেট করা (লগ আউটের পর ডিজাইন ফিক্স)
window.addEventListener('DOMContentLoaded', () => {
    container.classList.remove('active');
});

// ২. অ্যানিমেশন কন্ট্রোল
registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

// ৩. গুগল লগইন
window.googleLogin = function() {
    signInWithPopup(auth, provider)
        .then(() => window.location.href = "shop.html")
        .catch(() => console.log("Google Login Cancelled"));
};

// ৪. ইমেইল সাইন আপ
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    
    createUserWithEmailAndPassword(auth, email, pass).then((res) => {
        updateProfile(res.user, { displayName: name }).then(() => {
            window.location.href = "shop.html";
        });
    }).catch(err => alert("Error: " + err.message));
});

// ৫. ইমেইল লগইন
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;
    
    signInWithEmailAndPassword(auth, email, pass)
        .then(() => window.location.href = "shop.html")
        .catch(() => alert("ভুল ইমেইল বা পাসওয়ার্ড"));
});

// ৬. মেনু লজিক
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
});

window.addEventListener('click', () => {
    dropdownMenu.style.display = 'none';
});
