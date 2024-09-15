// Sample data for questions
const questions = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target."
    },
    {
        id: 2,
        title: "Merge Intervals",
        difficulty: "Medium",
        description: "Given a collection of intervals, merge all overlapping intervals."
    },
    {
        id: 3,
        title: "Word Ladder",
        difficulty: "Hard",
        description: "Given two words (beginWord and endWord), and a dictionary's word list, find the shortest transformation sequence."
    },
    {
        id: 4,
        title: "Binary Search",
        difficulty: "Easy",
        description: "Given a sorted array of integers, write a function to search for a target value using binary search."
    },
    {
        id: 5,
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        description: "Given a string s, find the longest palindromic substring in s."
    },
    {
        id: 6,
        title: "Coin Change",
        difficulty: "Hard",
        description: "Given an integer array of coins and an integer amount, return the fewest number of coins needed to make up the amount."
    }
];

// Variable to track the selected question
let selectedQuestion = null;

// Check if a user is logged in
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // If no user is logged in, show the login section
        showSection('login');
    } else {
        // If a user is logged in, show the home section
        showSection('home');
    }
}

// Local Storage Functions for user management
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUser(user) {
    let users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

function getUser(username) {
    return getUsers().find(user => user.username === username);
}

function updateUser(user) {
    let users = getUsers();
    users = users.map(u => u.username === user.username ? user : u);
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to log in the user
function loginUser(username, password) {
    const user = getUser(username);
    const authMessage = document.getElementById('auth-message');

    if (!user) {
        authMessage.textContent = 'User does not exist. Please sign up.';
    } else if (user.password !== password) {
        authMessage.textContent = 'Incorrect password. Please try again.';
    } else {
        // Log the user in
        localStorage.setItem('loggedInUser', username);
        authMessage.textContent = '';
        showSection('home');
    }
}

// Function to sign up the user
function signupUser(username, password) {
    const user = getUser(username);
    const authMessage = document.getElementById('auth-message');

    if (user) {
        authMessage.textContent = 'User already exists. Please log in.';
    } else {
        // Create a new user and save
        const newUser = { username, password, solvedChallenges: 0, solvedQuestions: [] };
        saveUser(newUser);
        localStorage.setItem('loggedInUser', username);
        authMessage.textContent = '';
        showSection('home');
    }
}

// Function to log out the user
function logout() {
    localStorage.removeItem('loggedInUser');
    showSection('login');
}

// Function to switch between sections
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    if (sectionId === 'challenges') {
        displayQuestions();
    }
    if (sectionId === 'leaderboard') {
        displayLeaderboard();
    }
    if (sectionId === 'profile') {
        displayProfile();
    }
}

// Populate the question list dynamically
const questionList = document.getElementById('questions');
const detailsSection = document.getElementById('details');
const codeArea = document.getElementById('code-area');
const testResults = document.getElementById('test-results');

function displayQuestions() {
    questionList.innerHTML = ''; // Clear previous questions
    questions.forEach(question => {
        const li = document.createElement('li');
        li.textContent = `${question.title} (${question.difficulty})`; // Use template literal
        li.dataset.id = question.id;
        li.addEventListener('click', () => selectQuestion(question.id));
        questionList.appendChild(li);
    });
}

// Function to display details of a selected question
function selectQuestion(id) {
    selectedQuestion = questions.find(q => q.id === id); // Set selected question globally
    if (selectedQuestion) {
        detailsSection.innerHTML = `
            <h3>${selectedQuestion.title}</h3>
            <p><strong>Difficulty:</strong> ${selectedQuestion.difficulty}</p>
            <p>${selectedQuestion.description}</p>
        `;
        codeArea.style.display = 'block'; // Show the code area when a question is selected
        testResults.innerHTML = ''; // Clear previous results
    }
}

// Simulate code execution (with a loading effect)
async function runCode() {
    const codeInput = document.getElementById('code-input').value;
    const language = document.getElementById('language').value;
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!codeInput.trim()) {
        alert('Please enter your code before running!');
        return;
    }

    // Simulate running the code
    testResults.innerHTML = '<p>Running code, please wait...</p>';
    await new Promise(resolve => setTimeout(resolve, 2000));

    let result = 'Test Passed: Code ran successfully!';
    testResults.innerHTML = `<p>${result}</p>`; // Properly wrap result HTML

    // Update the user's solved challenge count
    const user = getUser(loggedInUser);
    if (selectedQuestion && user) {
        user.solvedChallenges += 1;
        if (!user.solvedQuestions.includes(selectedQuestion.title)) {
            user.solvedQuestions.push(selectedQuestion.title); // Track the solved question
        }
        updateUser(user);
        displayLeaderboard();
    }
}

// Populate leaderboard dynamically
const leaderboardList = document.getElementById('leaderboard-list');
function displayLeaderboard() {
    leaderboardList.innerHTML = ''; // Clear previous leaderboard entries

    const users = getUsers();
    const sortedUsers = users.sort((a, b) => b.solvedChallenges - a.solvedChallenges);

    sortedUsers.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = `Rank ${index + 1}: ${user.username} - ${user.solvedChallenges} Challenges Solved`; // Use template literal
        leaderboardList.appendChild(li);
    });
    
}

// Display profile with solved questions
function displayProfile() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const user = getUser(loggedInUser);
    const profileInfo = document.getElementById('profile-info');
    const solvedChallengesList = document.getElementById('solved-challenges-list');

    if (user) {
        profileInfo.innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Solved Challenges:</strong> ${user.solvedChallenges}</p>
        `;

        solvedChallengesList.innerHTML = ''; // Clear previous list
        user.solvedQuestions.forEach(question => {
            const li = document.createElement('li');
            li.textContent = question;
            solvedChallengesList.appendChild(li);
        });
    }
}

// Initialize event listeners for login and signup
document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    loginUser(username, password);
});

document.getElementById('signup-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    signupUser(username, password);
});

// Initialize event listeners for running code
document.getElementById('run-code').addEventListener('click', runCode);

// Check login status
