// ১ নম্বর লাইনে 'import' অবশ্যই ছোট হাতের অক্ষরে হবে
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

// এইচটিএমএল থেকে আইডিগুলো নেওয়া
const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

// পেজ লোড হবার সময় স্লাইডিং প্যানেল রিসেট করা
window.addEventListener('DOMContentLoaded', () => {
    if (container) container.classList.remove('active');
});

// অ্যানিমেশন কন্ট্রোল (সাইন আপ ও লগইন সুইচ)
if (registerBtn) {
    registerBtn.addEventListener('click', () => container.classList.add('active'));
}
if (loginBtn) {
    loginBtn.addEventListener('click', () => container.classList.remove('active'));
}

// ৩. গুগল লগইন (গ্লোবাল ফাংশন)
window.googleLogin = function() {
    signInWithPopup(auth, provider)
        .then(() => {
            window.location.href = "shop.html";
        })
        .catch((err) => {
            console.log("Google Login Cancelled or Failed", err);
        });
};

// ৪. ইমেইল সাইন আপ
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;
        
        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            updateProfile(res.user, { displayName: name }).then(() => {
                window.location.href = "shop.html";
            });
        }).catch(err => alert("রেজিস্ট্রেশন ব্যর্থ: " + err.message));
    });
}

// ৫. ইমেইল লগইন
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => window.location.href = "shop.html")
            .catch(() => alert("ভুল ইমেইল বা পাসওয়ার্ড"));
});
}

// ৬. থ্রি-ডট মেনু লজিক
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
    });
}

window.addEventListener('click', () => {
    if (dropdownMenu) dropdownMenu.style.display = 'none';
});
