// Import Firebase and required functions (Added functions for Time and Presence)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, set, onDisconnect, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Firebase Configuration (Using your provided config)
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Global Variables
let currentRoom = "";
let myID = Math.random().toString(36).substr(2, 9); // Unique ID for this user
let myUsername = "";

// HTML Elements
const usernameInput = document.getElementById('usernameInput');
const roomInput = document.getElementById('roomInput');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const joinBtn = document.getElementById('joinBtn');
const chatInterface = document.getElementById('chat-interface');
const chatWindow = document.getElementById('chat-window');
const roomTitleDisplay = document.getElementById('roomTitle');
const userCountDisplay = document.getElementById('userCount');
const aboutBtn = document.getElementById('aboutBtn');

// Feature 2: Notification Sound (using a public domain beep sound)
const notificationSound = new Audio('https://www.soundjay.com/buttons/beep-07.mp3'); 

// Utility Function: Format Timestamp (Feature 1)
function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}
// Join Room Function - UPDATED
window.joinRoom = function() {
    const username = usernameInput.value.trim();
    const roomName = roomInput.value.trim();

    if (!username || !roomName) {
        alert("Please enter both your name and a room name!");
        return;
    }

    myUsername = username;
    currentRoom = roomName;
    
    // UI Update (Hiding the About/Contact Button)
    document.querySelector('.welcome-msg').style.display = 'none';
    chatInterface.style.display = 'block'; 
    roomTitleDisplay.innerText = `Room: ${currentRoom}`;

    // Disable inputs
    usernameInput.disabled = true;
    roomInput.disabled = true;
    joinBtn.disabled = true;
    msgInput.disabled = false;
    sendBtn.disabled = false;
    
    // Core Fix: Hide the About/Contact button after joining
    aboutBtn.style.display = 'none'; // <-- CORE FIX

    // Clear old messages and load new ones
    chatWindow.innerHTML = ''; 
    loadMessages();
    
    // Feature 3: Initialize User Presence
    setupPresence();
};

// Send Message Function
window.sendMessage = function() {
    const msg = msgInput.value.trim();
    if (msg === "") return;

    const messagesRef = ref(db, `chat_rooms/${currentRoom}`);
    push(messagesRef, {
        text: msg,
        senderID: myID,
        senderName: myUsername,
        timestamp: serverTimestamp() // Use server timestamp for accuracy
    });

    msgInput.value = "";
};

// Message Listener (Load Messages)
function loadMessages() {
    const messagesRef = ref(db, `chat_rooms/${currentRoom}`);
    
    onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        // Pass all data including new timestamp and senderName
        displayMessage(data.text, data.senderID, data.senderName, data.timestamp);
    });
}

// Feature 3: User Counter (Presence Setup)
function setupPresence() {
    const roomPresenceRef = ref(db, `room_presence/${currentRoom}/${myID}`);
    
    // 1. Set what happens when user disconnects (removes them from the list)
    onDisconnect(roomPresenceRef).remove();
    
    // 2. Set user's status to online
    set(roomPresenceRef, {
        name: myUsername,
        timestamp: serverTimestamp()
    });

    // 3. Listen for changes in the room's presence list (Update Counter)
    const roomPresenceListRef = ref(db, `room_presence/${currentRoom}`);
    onValue(roomPresenceListRef, (snapshot) => {
        // Count how many users are present
        const count = snapshot.exists() ? snapshot.size : 0;
        userCountDisplay.innerText = count;
    });
}

// Display Message on Screen (Features 1 & 2 Integrated)
function displayMessage(text, senderID, senderName, timestamp) {
    const div = document.createElement('div');
    div.classList.add('message');
    
    // Apply styling based on sender
    if (senderID === myID) {
        div.classList.add('my-message');
    } else {
        div.classList.add('other-message');
        // Feature 2: Play sound for incoming messages
        notificationSound.play();
    }
    
    // Create the header div for Name and Time (Feature 1)
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('message-header');

    // Name 
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('sender-name');
    nameSpan.innerText = senderName;

    // Time (Feature 1)
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('timestamp');
    timeSpan.innerText = formatTime(timestamp); 

    // Message Content
    const textP = document.createElement('p');
    textP.innerText = text;

    // Assemble the message bubble
    headerDiv.appendChild(nameSpan);
    headerDiv.appendChild(timeSpan);
    div.appendChild(headerDiv);
    div.appendChild(textP);

    chatWindow.appendChild(div);
    
    // Auto Scroll
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// About button function
window.toggleAbout = function() {
    const modal = document.getElementById('aboutModal');
    const currentDisplay = window.getComputedStyle(modal).display;
    
    if (currentDisplay === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

