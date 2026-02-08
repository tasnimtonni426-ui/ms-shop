// ১. ফায়ারবেস মডিউল ইমপোর্ট
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    updateProfile, 
    sendEmailVerification, 
    setPersistence, 
    browserLocalPersistence, // LocalPersistence ব্যবহার করা হয়েছে যাতে অটো-লগইন থাকে
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// --- অটো-লগইন সেটিংস (বারবার লগইন লাগবে না) ---
setPersistence(auth, browserLocalPersistence);

// --- সিকিউরিটি চেক: লগইন থাকলে সরাসরি শপে পাঠিয়ে দাও ---
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        window.location.href = "shop.html";
    }
});

const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

// ডাটাবেসে ইউজার ডাটা সেভ
function writeUserData(userId, name, email) {
    set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
        lastLogin: serverTimestamp(),
        role: "customer"
    }).catch(err => console.error("Database Error:", err));
}

// এনিমেশন লজিক
if (registerBtn) registerBtn.addEventListener('click', () => container.classList.add('active'));
if (loginBtn) loginBtn.addEventListener('click', () => container.classList.remove('active'));

// গুগল লগইন
window.googleLogin = function() {
    signInWithPopup(auth, provider)
        .then((result) => {
            writeUserData(result.user.uid, result.user.displayName, result.user.email);
            window.location.href = "shop.html";
        })
        .catch((err) => console.log("Login Cancelled"));
};

// ইমেইল সাইন আপ (ইমেইল ভেরিফিকেশন সহ)
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        if(pass.length < 6) {
            alert("নিরাপত্তার জন্য পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে!");
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // ১. ভেরিফিকেশন ইমেইল পাঠানো
            sendEmailVerification(res.user).then(() => {
                alert("আপনার জিমেইলে একটি ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। লিঙ্কটি কনফার্ম করে তারপর লগইন করুন।");
                
                // ২. প্রোফাইল আপডেট ও ডাটাবেসে সেভ
                updateProfile(res.user, { displayName: name }).then(() => {
                    writeUserData(res.user.uid, name, email);
                    // ভেরিফাই না করা পর্যন্ত লগআউট করে রাখা ভালো
                    signOut(auth).then(() => {
                        location.reload(); 
                    });
                });
            });
        }).catch(err => alert("ব্যর্থ: " + err.message));
    });
}

// ইমেইল লগইন (ভেরিফিকেশন চেক সহ)
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        
        signInWithEmailAndPassword(auth, email, pass)
            .then((res) => {
                // চেক করো ইমেইল ভেরিফাইড কি না
                if (res.user.emailVerified) {
                    window.location.href = "shop.html";
                } else {
                    alert("আপনার ইমেইলটি এখনো ভেরিফাই করা হয়নি। জিমেইল চেক করুন।");
                    signOut(auth);
                }
            })
            .catch((err) => {
                alert("ভুল ইমেইল বা পাসওয়ার্ড অথবা ভেরিফিকেশন বাকি।");
            });
    });
}

// মেনু কন্ট্রোল
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
    });
}
window.addEventListener('click', () => { if (dropdownMenu) dropdownMenu.style.display = 'none'; });
