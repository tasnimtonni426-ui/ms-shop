// ১. মডিউল ইমপোর্ট এবং কনফিগ আগের মতোই থাকবে...
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, sendEmailVerification, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCu8lgGs3Q-qLeedhngQAVXtt8BHOAlWDg",
    authDomain: "ms-sp-97f78.firebaseapp.com",
    projectId: "ms-sp-97f78",
    databaseURL: "https://ms-sp-97f78-default-rtdb.firebaseio.com",
    appId: "1:880638162029:web:b99af5b5518b3e16a13b64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence);

// --- লগইন করা থাকলে সরাসরি শপে রিডাইরেক্ট ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "shop.html";
    }
});

// মডাল কন্ট্রোল ফাংশন
window.showModal = (email) => {
    document.getElementById('modalMessage').innerText = `আমরা ${email} ঠিকানায় একটি লিঙ্ক পাঠিয়েছি। দয়া করে ইনবক্স চেক করে লিঙ্কটি ভেরিফাই করুন।`;
    document.getElementById('customModal').style.display = 'flex';
}
window.closeModal = () => {
    document.getElementById('customModal').style.display = 'none';
}

// --- সাইন আপ লজিক (ভেরিফিকেশন সহ) ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // ভেরিফিকেশন লিঙ্ক পাঠানো
            sendEmailVerification(res.user);
            
            // কাস্টম প্রফেশনাল পপআপ দেখানো
            showModal(email);
            
            updateProfile(res.user, { displayName: name }).then(() => {
                set(ref(db, 'users/' + res.user.uid), {
                    username: name, email: email, role: "customer", joinedAt: serverTimestamp()
                });
            });
        }).catch(err => alert("Error: " + err.message));
    });
}

// --- সাইন ইন লজিক (সরাসরি লগইন হবে, কোনো বাধা নেই) ---
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => {
                // ভেরিফিকেশন চেক না করেই শপে নিয়ে যাবে
                window.location.href = "shop.html";
            })
            .catch((err) => alert("ভুল ইমেইল বা পাসওয়ার্ড।"));
    });
}

// গুগল লগইন এবং অন্যান্য এনিমেশন কোড আগের মতোই থাকবে...
