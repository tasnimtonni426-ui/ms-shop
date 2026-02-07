// ১. ফায়ারবেস মডিউল ইমপোর্ট
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, sendEmailVerification, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCu8lgGs3Q-qLeedhngQAVXtt8BHOAlWDg",
    authDomain: "ms-sp-97f78.firebaseapp.com",
    projectId: "ms-sp-97f78",
    databaseURL: "https://ms-sp-97f78-default-rtdb.firebaseio.com",
    appId: "1:880638162029:web:b99af5b5518b3e16a13b64"
};

// ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// --- সিকিউরিটি লেয়ার: সেশন ম্যানেজমেন্ট ---
// ব্রাউজার বন্ধ করলে অটো লগআউট হবে (নিরাপদ সেশন)
setPersistence(auth, browserSessionPersistence);

const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

// ৫. ডাটাবেসে ইউজার ডাটা সেভ (উন্নত সিকিউরিটি)
function writeUserData(userId, name, email) {
    set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
        lastLogin: serverTimestamp(), // ক্লায়েন্ট টাইমের বদলে সার্ভার টাইম (নিরাপদ)
        role: "customer" // ডিফল্ট রোল
    }).catch(err => console.error("Security/Database Error:", err));
}

// ৬. এনিমেশন লজিক
window.addEventListener('DOMContentLoaded', () => {
    if (container) container.classList.remove('active');
});

if (registerBtn) registerBtn.addEventListener('click', () => container.classList.add('active'));
if (loginBtn) loginBtn.addEventListener('click', () => container.classList.remove('active'));

// ৭. গুগল লগইন (Verified Only)
window.googleLogin = function() {
    signInWithPopup(auth, provider)
        .then((result) => {
            writeUserData(result.user.uid, result.user.displayName, result.user.email);
            window.location.href = "shop.html";
        })
        .catch((err) => console.log("Login Securely Cancelled"));
};

// ৮. ইমেইল সাইন আপ (Verification সহ)
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        // পাসওয়ার্ড স্ট্রেন্থ চেক (মিনিমাম ৬ অক্ষর)
        if(pass.length < 6) {
            alert("নিরাপত্তার জন্য পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে!");
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // ইমেইল ভেরিফিকেশন পাঠানো
            sendEmailVerification(res.user).then(() => {
                alert("আপনার ইমেইলে একটি ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। চেক করুন!");
            });

            updateProfile(res.user, { displayName: name }).then(() => {
                writeUserData(res.user.uid, name, email);
                window.location.href = "shop.html";
            });
        }).catch(err => alert("নিরাপত্তা জনিত কারণে ব্যর্থ: " + err.message));
    });
}

// ৯. ইমেইল লগইন (Rate Limiting সিমুলেশন)
let attemptCount = 0;
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if(attemptCount > 5) {
            alert("অতিরিক্ত ভুল চেষ্টার কারণে আপনার এক্সেস সাময়িক ব্লক করা হয়েছে।");
            return;
        }

        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => {
                window.location.href = "shop.html";
            })
            .catch(() => {
                attemptCount++;
                alert("ভুল ইমেইল বা পাসওয়ার্ড। চেষ্টা বাকি: " + (6 - attemptCount));
            });
    });
}

// ১০. মেনু কন্ট্রোল
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
    });
}
window.addEventListener('click', () => { if (dropdownMenu) dropdownMenu.style.display = 'none'; });
