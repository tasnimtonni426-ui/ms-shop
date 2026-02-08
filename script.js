import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// --- মডাল কন্ট্রোল ---
window.showModal = (email) => {
    document.getElementById('modalMessage').innerText = `আমরা ${email} ঠিকানায় একটি লিঙ্ক পাঠিয়েছি। ভেরিফাই করে তারপর লগইন করুন।`;
    document.getElementById('customModal').style.display = 'flex';
}
window.closeModal = () => {
    document.getElementById('customModal').style.display = 'none';
}

// --- সিকিউরিটি চেক: ভেরিফাইড না হলে শপে যেতে পারবে না ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            // যদি ভেরিফাইড থাকে তবেই শপে যাবে
            if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
                window.location.href = "shop.html";
            }
        } else {
            // যদি ভেরিফাইড না থাকে, তাকে শপ থেকে বের করে লগইন পেজে পাঠাবে
            if (window.location.pathname.includes("shop.html")) {
                alert("দয়া করে আগে আপনার ইমেইল ভেরিফাই করুন!");
                signOut(auth).then(() => {
                    window.location.href = "index.html";
                });
            }
        }
    }
});

// --- সাইন আপ লজিক ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // ১. ভেরিফিকেশন লিঙ্ক পাঠানো
            sendEmailVerification(res.user).then(() => {
                // ২. প্রফেশনাল পপআপ দেখানো
                showModal(email);
                
                // ৩. ডাটাবেসে তথ্য রাখা
                set(ref(db, 'users/' + res.user.uid), {
                    username: name, email: email, joinedAt: serverTimestamp()
                });

                // ৪. সাথে সাথে লগআউট করা (যাতে সে ভেরিফাই করার আগে ঢুকতে না পারে)
                signOut(auth);
            });
        }).catch(err => alert("Error: " + err.message));
    });
}

// --- লগইন লজিক ---
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
                alert("আপনার ইমেইলটি এখনো ভেরিফাই করা হয়নি। দয়া করে আপনার জিমেইল চেক করুন।");
                signOut(auth);
            }
        }).catch(() => alert("ভুল ইমেইল অথবা পাসওয়ার্ড।"));
    });
}

// এনিমেশন বাটন কন্ট্রোল (SignUp/SignIn Toggle)
const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
if (registerBtn) registerBtn.addEventListener('click', () => container.classList.add('active'));
if (loginBtn) loginBtn.addEventListener('click', () => container.classList.remove('active'));

window.googleLogin = function() {
    signInWithPopup(auth, provider).then(() => window.location.href = "shop.html");
};
    
