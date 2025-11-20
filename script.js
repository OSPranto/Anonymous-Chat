// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize App
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentRoom = "";
let myID = Math.random().toString(36).substr(2, 9); 

const roomInput = document.getElementById('roomInput');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const chatWindow = document.getElementById('chatWindow');

// Join Room Function
window.joinRoom = function() {
    const roomName = roomInput.value.trim();
    if (!roomName) {
        alert("Please enter a room name!");
        return;
    }
    
    currentRoom = roomName;
    document.querySelector('.welcome-msg').style.display = 'none';
    
    msgInput.disabled = false;
    sendBtn.disabled = false;
    roomInput.disabled = true;
    
    alert(`You joined the "${currentRoom}" room!`);
    loadMessages();
};

// Send Message Function
window.sendMessage = function() {
    const msg = msgInput.value.trim();
    if (msg === "") return;

    const messagesRef = ref(db, `chat_rooms/${currentRoom}`);
    push(messagesRef, {
        text: msg,
        senderID: myID,
        timestamp: Date.now()
    });

    msgInput.value = ""; 
};

// Receive Messages Function
function loadMessages() {
    const messagesRef = ref(db, `chat_rooms/${currentRoom}`);
    
    onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        displayMessage(data.text, data.senderID);
    });
}

// Display Message on Screen
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
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// NEW: Function to toggle the About Modal
window.toggleAbout = function() {
    const modal = document.getElementById('aboutModal');
    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}