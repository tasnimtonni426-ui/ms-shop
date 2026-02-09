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
    browserLocalPersistence, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ১. ফায়ারবেস কনফিগারেশন
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

// --- ২. পপ-আপ কন্ট্রোল (সুন্দর জিমেইল বাটন সহ) ---
window.showModal = (email) => {
    const modal = document.getElementById('customModal');
    if(modal) {
        document.getElementById('modalMessage').innerHTML = `
            আমরা <b>${email}</b> ঠিকানায় একটি লিঙ্ক পাঠিয়েছি। <br> 
            লিঙ্কে ক্লিক করে ভেরিফাই করার পর আপনি সরাসরি শপে যেতে পারবেন। <br><br>
            <a href="https://mail.google.com/" target="_blank" style="background:#db4437; color:white; padding:10px 15px; text-decoration:none; border-radius:5px; display:inline-block;">জিমেইল চেক করুন</a>
        `;
        modal.style.display = 'flex';
    }
}

window.closeModal = () => {
    const modal = document.getElementById('customModal');
    if(modal) modal.style.display = 'none';
}

// --- ৩. অটো-রিডাইরেক্ট লজিক ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        user.reload().then(() => {
            if (user.emailVerified) {
                // ভেরিফাইড হলে শপে পাঠাবে
                if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
                    window.location.href = "shop.html"; 
                }
            }
        });
    }
});

// --- ৪. সাইন-আপ লজিক (ডাটাবেজ সেভ সরানো হয়েছে) ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        const actionCodeSettings = {
            url: 'https://tasnimtonni426-ui.github.io/ms-shop/shop.html', 
            handleCodeInApp: true,
        };

        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // শুধুমাত্র ডিসপ্লে নাম আপডেট হবে
            updateProfile(res.user, { displayName: name }).then(() => {
                // ভেরিফিকেশন ইমেইল পাঠানো
                sendEmailVerification(res.user, actionCodeSettings).then(() => {
                    showModal(email); 
                });
            });
            // এখানে ডাটাবেজে (set ref) আর কোনো কোড নেই, তাই ভেরিফাই ছাড়া ডাটা সেভ হবে না
        }).catch(err => alert("Error: " + err.message));
    });
}

// --- ৫. সাইন-ইন লজিক ---
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        
        signInWithEmailAndPassword(auth, email, pass).then((res) => {
            if (res.user.emailVerified) {
                window.location.href = "shop.html";
            } else {
                alert("দয়া করে আগে আপনার জিমেইল ভেরিফাই করুন।");
            }
        }).catch(() => alert("ভুল ইমেইল অথবা পাসওয়ার্ড।"));
    });
}

// --- ৬. এনিমেশন ও গুগল লগইন ---
const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener('click', () => container.classList.add('active'));
    loginBtn.addEventListener('click', () => container.classList.remove('active'));
}

window.googleLogin = function() {
    signInWithPopup(auth, provider).then(() => {
        window.location.href = "shop.html";
    }).catch((err) => console.error(err));
};
    
