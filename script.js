// Store the user accounts and chatroom data
const users = {};
let currentUser = null;
let currentChatroom = null;
const messagesMap = {};

// Load saved data from local storage on page load
window.onload = function() {
    const savedUsername = localStorage.getItem('currentUser');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
    }
    loadUsers();
    loadChatrooms();
};

// Load users from local storage
function loadUsers() {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || {};
    Object.assign(users, savedUsers);
}

// Load chatrooms and messages
function loadChatrooms() {
    const savedChatrooms = JSON.parse(localStorage.getItem('chatrooms')) || {};
    for (const chatroomName in savedChatrooms) {
        addChatroom(chatroomName);
        messagesMap[chatroomName] = savedChatrooms[chatroomName];
    }
}

// Registration
document.getElementById('register-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username) {
        if (users[username]) {
            displayAuthMessage("Username already exists. Please choose another.");
        } else {
            users[username] = true;
            saveUsers();
            displayAuthMessage("Registration successful! You can now log in.");
        }
    } else {
        displayAuthMessage("Please enter a username.");
    }
});

// Login
document.getElementById('login-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (users[username]) {
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    } else {
        displayAuthMessage("Username not found. Please register.");
    }
});

function displayAuthMessage(message) {
    document.getElementById('auth-message').textContent = message;
}

// Add a new chatroom
document.getElementById('create-chatroom').addEventListener('click', function() {
    const chatroomName = document.getElementById('new-chatroom').value;
    if (chatroomName) {
        addChatroom(chatroomName);
        document.getElementById('new-chatroom').value = '';
        messagesMap[chatroomName] = [];
        saveChatrooms();
    }
});

function addChatroom(chatroomName) {
    const chatroomList = document.getElementById('chatroom-list');
    const chatroomItem = document.createElement('li');
    chatroomItem.textContent = chatroomName;

    chatroomItem.addEventListener('click', function() {
        switchChatroom(chatroomName, chatroomItem);
    });
    
    chatroomList.appendChild(chatroomItem);
}

// Switch chatroom
function switchChatroom(chatroomName, clickedChatroom) {
    const chatrooms = document.querySelectorAll('#chatroom-list li');
    chatrooms.forEach(room => room.classList.remove('selected-chatroom'));
    
    currentChatroom = chatroomName;
    document.getElementById('current-chatroom').textContent = `Chatroom: ${chatroomName}`;
    clickedChatroom.classList.add('selected-chatroom');
    
    displayMessages();
}

// Send message
document.getElementById('send-message').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (message && currentChatroom) {
        messagesMap[currentChatroom].push(`${currentUser}: ${message}`);
        messageInput.value = '';
        displayMessages();
        saveChatrooms();
    }
});

function displayMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    if (currentChatroom && messagesMap[currentChatroom]) {
        messagesMap[currentChatroom].forEach(msg => {
            const newMessage = document.createElement('div');
            newMessage.textContent = msg;
            messages
