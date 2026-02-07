import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ১. আপনার ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyCu8lgGs3Q-qLeedhngQAVXtt8BHOAlWDg",
    authDomain: "ms-sp-97f78.firebaseapp.com",
    projectId: "ms-sp-97f78",
    appId: "1:880638162029:web:b99af5b5518b3e16a13b64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ২. অ্যানিমেশন লজিক (যা CSS এনিমেশন ট্রিগার করবে)
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.onclick = () => {
    container.classList.add('active'); // এটি CSS এর .active ক্লাস চালু করবে
};

loginBtn.onclick = () => {
    container.classList.remove('active'); // এটি CSS এর .active ক্লাস সরিয়ে দেবে
};

// ৩. থ্রি-ডট মেনু লজিক
const dotBtn = document.querySelector('.three-dots-btn');
const dropdown = document.querySelector('.admin-dropdown');

dotBtn.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
};
window.onclick = () => dropdown.style.display = 'none';

// ৪. সাইন আপ (Firebase)
document.getElementById('registerForm').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    createUserWithEmailAndPassword(auth, email, pass)
        .then((res) => {
            updateProfile(res.user, { displayName: name }).then(() => {
                window.location.href = "shop.html"; // সফল হলে শপ পেজে যাবে
            });
        }).catch(err => alert("রেজিস্ট্রেশন ব্যর্থ: " + err.message));
};

// ৫. লগইন (Firebase)
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            window.location.href = "shop.html";
        }).catch(err => alert("ভুল ইমেইল বা পাসওয়ার্ড!"));
};
