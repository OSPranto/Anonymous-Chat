// ব্রাউজারের জন্য Firebase ইমপোর্ট (CDN Links)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// আপনার অ্যাপের কনফিগারেশন (আপনার দেওয়া তথ্য বসানো হয়েছে)
const firebaseConfig = {
  apiKey: "AIzaSyCz6tTqCEU2-Tm2jToKjJ5OACpSbonwXiE",
  authDomain: "anonymous-chat-d6512.firebaseapp.com",
  databaseURL: "https://anonymous-chat-d6512-default-rtdb.firebaseio.com",
  projectId: "anonymous-chat-d6512",
  storageBucket: "anonymous-chat-d6512.firebasestorage.app",
  messagingSenderId: "922549544704",
  appId: "1:922549544704:web:0025aeb67bcf5a74c0b5e5",
  measurementId: "G-05M7QCFP81"
};

// অ্যাপ এবং ডেটাবেস চালু করা
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ভেরিয়েবল ডিক্লেয়ারেশন
let currentRoom = "";
let myID = Math.random().toString(36).substr(2, 9); 

// HTML এলিমেন্ট ধরা
const roomInput = document.getElementById('roomInput');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const chatWindow = document.getElementById('chatWindow');

// জয়েন বাটন ফাংশন
window.joinRoom = function() {
    const roomName = roomInput.value.trim();
    if (!roomName) {
        alert("Please enter a room name!");
        return;
    }
    
    currentRoom = roomName;
    document.querySelector('.welcome-msg').style.display = 'none';
    
    // ইনপুট বক্স সচল করা
    msgInput.disabled = false;
    sendBtn.disabled = false;
    roomInput.disabled = true;
    
    alert(`You joined the "${currentRoom}" room!`);
    
    // মেসেজ লোড শুরু করা
    loadMessages();
};

// মেসেজ সেন্ড ফাংশন
window.sendMessage = function() {
    const msg = msgInput.value.trim();
    if (msg === "") return;

    const messagesRef = ref(db, `chat_rooms/${currentRoom}`);
    push(messagesRef, {
        text: msg,
        senderID: myID,
        timestamp: Date.now()
    });

    msgInput.value = ""; // ইনপুট ক্লিয়ার
};

// মেসেজ রিসিভ ফাংশন
function loadMessages() {
    const messagesRef = ref(db, `chat_rooms/${currentRoom}`);
    
    onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        displayMessage(data.text, data.senderID);
    });
}

// স্ক্রিনে মেসেজ দেখানো
function displayMessage(text, senderID) {
    const chatWindow = document.getElementById('chat-window');
    const div = document.createElement('div');
    
    div.classList.add('message');
    
    if (senderID === myID) {
        div.classList.add('my-message');
    } else {
        div.classList.add('other-message');
    }
    
    div.innerText = text;
    chatWindow.appendChild(div);
    
    // অটো স্ক্রল
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// About বাটন টগল করার ফাংশন
window.toggleAbout = function() {
    const modal = document.getElementById('aboutModal');
    const currentDisplay = window.getComputedStyle(modal).display;
    
    if (currentDisplay === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}
