const users = {}; // Temporary storage for user accounts
let currentUser = null;
let currentChatroom = null;
const messagesMap = {}; // Message storage

// Load saved data from local storage on page load
window.onload = function() {
    const savedUsername = localStorage.getItem('currentUser');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername; // Autofill the username
    }
    loadUsers();
    loadChatrooms(); // Load saved chatrooms

    // Start the polling mechanism for live updates
    setInterval(checkForUpdates, 1000); // Check for updates every second
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

// Registration button event
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

// Login button event
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

// Display authentication message
function displayAuthMessage(message) {
    document.getElementById('auth-message').textContent = message;
}

// Create chatroom event
document.getElementById('create-chatroom').addEventListener('click', function() {
    const chatroomName = document.getElementById('new-chatroom').value;
    if (chatroomName) {
        addChatroom(chatroomName);
        document.getElementById('new-chatroom').value = '';
        messagesMap[chatroomName] = []; // Initialize message storage for the new chatroom
        saveChatrooms(); // Save chatrooms to local storage
    }
});

// Add chatroom to the list
function addChatroom(chatroomName) {
    const chatroomList = document.getElementById('chatroom-list');
    const chatroomItem = document.createElement('li');
    const roomNameSpan = document.createElement('span');
    roomNameSpan.textContent = chatroomName;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button';
    deleteButton.style.display = 'none'; // Initially hidden

    chatroomItem.addEventListener('mouseenter', function() {
        deleteButton.style.display = 'inline'; // Show delete button
    });
    chatroomItem.addEventListener('mouseleave', function() {
        deleteButton.style.display = 'none'; // Hide delete button
    });

    deleteButton.addEventListener('click', function() {
        chatroomList.removeChild(chatroomItem); // Remove the chatroom from the list
        delete messagesMap[chatroomName]; // Remove messages for the chatroom
        saveChatrooms(); // Update local storage
    });

    chatroomItem.appendChild(roomNameSpan);
    chatroomItem.appendChild(deleteButton);
    chatroomList.appendChild(chatroomItem); // Add click event to switch to the new chatroom
    chatroomItem.addEventListener('click', function() {
        switchChatroom(chatroomName, chatroomItem);
    });
}

// Switch chatroom function
function switchChatroom(chatroomName, clickedChatroom) {
    const chatrooms = document.querySelectorAll('#chatroom-list li');
    chatrooms.forEach(room => room.classList.remove('selected-chatroom'));
    currentChatroom = chatroomName;
    document.getElementById('current-chatroom').textContent = `Chatroom: ${chatroomName}`;
    clickedChatroom.classList.add('selected-chatroom');
    displayMessages();
}

// Send message event
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

// Display messages in the chatroom
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

// Check for updates in chatrooms and messages
function checkForUpdates() {
    const savedChatrooms = JSON.parse(localStorage.getItem('chatrooms')) || {};
    if (JSON.stringify(messagesMap) !== JSON.stringify(savedChatrooms)) {
        Object.assign(messagesMap, savedChatrooms); // Update messagesMap if there are changes
        displayMessages(); // Refresh the displayed messages
    }
}
