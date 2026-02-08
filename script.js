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

// ফায়ারবেস কনফিগারেশন
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

// সেশন দীর্ঘস্থায়ী করা
setPersistence(auth, browserLocalPersistence);

// --- ১. কাস্টম প্রফেশনাল পপ-আপ কন্ট্রোল ---
window.showModal = (email) => {
    const modal = document.getElementById('customModal');
    if(modal) {
        document.getElementById('modalMessage').innerText = `আমরা ${email} ঠিকানায় একটি লিঙ্ক পাঠিয়েছি। ভেরিফাই করার পর আপনি সরাসরি শপে চলে যাবেন।`;
        modal.style.display = 'flex';
    }
}

window.closeModal = () => {
    const modal = document.getElementById('customModal');
    if(modal) modal.style.display = 'none';
}

// --- ২. অটো-রিডাইরেক্ট চেক (লগইন করা থাকলে) ---
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        window.location.href = "shop.html"; 
    }
});

// --- ৩. সাইন-আপ লজিক (Auto-Redirect সেটিংস সহ) ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        // লিঙ্কে ক্লিক করার পর যেখানে ফিরে যাবে
        const actionCodeSettings = {
            url: window.location.origin + '/shop.html', // অটোমেটিক আপনার শপ পেজের লিঙ্ক নিবে
            handleCodeInApp: true,
        };

        createUserWithEmailAndPassword(auth, email, pass).then((res) => {
            // ইমেইল ভেরিফিকেশন লিঙ্ক পাঠানো
            sendEmailVerification(res.user, actionCodeSettings).then(() => {
                showModal(email); // সেই সুন্দর পপআপটি দেখাবে
                
                updateProfile(res.user, { displayName: name }).then(() => {
                    set(ref(db, 'users/' + res.user.uid), {
                        username: name, email: email, role: "customer", joinedAt: serverTimestamp()
                    });
                });
            });
        }).catch(err => alert("Error: " + err.message));
    });
}

// --- ৪. সাইন-ইন লজিক ---
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
                alert("আপনার ইমেইলটি এখনো ভেরিফাই করা হয়নি। দয়া করে জিমেইল চেক করুন।");
            }
        }).catch(() => alert("ভুল ইমেইল অথবা পাসওয়ার্ড।"));
    });
}

// --- ৫. স্লাইডিং এনিমেশন (SignIn/SignUp Toggle) ---
const container = document.getElementById('container');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

if (registerBtn) registerBtn.addEventListener('click', () => container.classList.add('active'));
if (loginBtn) loginBtn.addEventListener('click', () => container.classList.remove('active'));

// গুগল লগইন
window.googleLogin = function() {
    signInWithPopup(auth, provider).then(() => window.location.href = "shop.html");
};
        
