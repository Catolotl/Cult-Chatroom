const users = {}; // Temporary storage for user accounts
let currentUser = null;
let currentChatroom = null;
const messagesMap = {};

// Load saved data from local storage on page load
window.onload = function() {
    const savedUsername = localStorage.getItem('currentUser');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername; // Autofill the username
    }
    loadUsers();
    loadChatrooms(); // Load saved chatrooms
};

// Load saved users from local storage
function loadUsers() {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || {};
    Object.assign(users, savedUsers); // Populate the users object with saved usernames
}

// Load saved chatrooms from local storage
function loadChatrooms() {
    const savedChatrooms = JSON.parse(localStorage.getItem('chatrooms')) || {};
    for (const chatroomName in savedChatrooms) {
        addChatroom(chatroomName); // Add each chatroom to the list
        messagesMap[chatroomName] = savedChatrooms[chatroomName]; // Load messages for each chatroom
    }
}

// Save the users object to local storage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Save chatrooms and their messages to local storage
function saveChatrooms() {
    localStorage.setItem('chatrooms', JSON.stringify(messagesMap));
}

document.getElementById('register-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username) {
        if (users[username]) {
            displayAuthMessage("Username already exists. Please choose another.");
        } else {
            users[username] = true; // Register the user
            saveUsers(); // Save updated users to local storage
            displayAuthMessage("Registration successful! You can now log in.");
        }
    } else {
        displayAuthMessage("Please enter a username.");
    }
});

document.getElementById('login-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (users[username]) {
        currentUser = username; // Set the current user
        localStorage.setItem('currentUser', currentUser); // Save username to local storage
        document.getElementById('auth-section').style.display = 'none'; // Hide auth section
        document.getElementById('app').style.display = 'block'; // Show chat app
        displayAuthMessage(""); // Clear any messages
    } else {
        displayAuthMessage("Username not found. Please register.");
    }
});

function displayAuthMessage(message) {
    document.getElementById('auth-message').textContent = message;
}

// Chatroom creation and management
document.getElementById('create-chatroom').addEventListener('click', function() {
    const chatroomName = document.getElementById('new-chatroom').value;
    if (chatroomName) {
        addChatroom(chatroomName);
        document.getElementById('new-chatroom').value = '';
        messagesMap[chatroomName] = []; // Initialize message storage for the new chatroom
        saveChatrooms(); // Save chatrooms to local storage
    }
});

function addChatroom(chatroomName) {
    const chatroomList = document.getElementById('chatroom-list');
    const chatroomItem = document.createElement('li');
    
    // Create the chatroom name span
    const roomNameSpan = document.createElement('span');
    roomNameSpan.textContent = chatroomName;
    
    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button'; // Add a class for styling
    deleteButton.style.display = 'none'; // Initially hidden
    
    // Show delete button on hover
    chatroomItem.addEventListener('mouseenter', function() {
        deleteButton.style.display = 'inline'; // Show delete button
    });
    
    chatroomItem.addEventListener('mouseleave', function() {
        deleteButton.style.display = 'none'; // Hide delete button
    });
    
    // Add click event to delete button
    deleteButton.addEventListener('click', function() {
        chatroomList.removeChild(chatroomItem); // Remove the chatroom from the list
        delete messagesMap[chatroomName]; // Remove messages for the chatroom
        saveChatrooms(); // Update local storage
    });

    chatroomItem.appendChild(roomNameSpan);
    chatroomItem.appendChild(deleteButton);
    chatroomList.appendChild(chatroomItem);

    // Add click event to switch to the new chatroom
    chatroomItem.addEventListener('click', function() {
        switchChatroom(chatroomName, chatroomItem);
    });
}

function switchChatroom(chatroomName, clickedChatroom) {
    const chatrooms = document.querySelectorAll('#chatroom-list li');
    chatrooms.forEach(room => room.classList.remove('selected-chatroom'));
    
    currentChatroom = chatroomName;
    document.getElementById('current-chatroom').textContent = `Chatroom: ${chatroomName}`;
    clickedChatroom.classList.add('selected-chatroom');
    
    displayMessages();
}

document.getElementById('send-message').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (message && currentChatroom) {
        messagesMap[currentChatroom].push(`${currentUser}: ${message}`);
        messageInput.value = '';
        displayMessages();
        saveChatrooms(); // Save messages after sending
    }
});

function displayMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    if (currentChatroom && messagesMap[currentChatroom]) {
        messagesMap[currentChatroom].forEach(msg => {
            const newMessage = document.createElement('div');
            newMessage.textContent = msg;
            messagesDiv.appendChild(newMessage);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the bottom
    }
}
