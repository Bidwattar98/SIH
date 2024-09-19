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
// Sample data for questions (Expanded with more questions)
const questions = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
        hints: [
            "Consider using a hash map to keep track of the numbers you've seen so far.",
            "Can you solve it in one pass through the array?"
        ]
    },
    {
        id: 2,
        title: "Merge Intervals",
        difficulty: "Medium",
        description: "Given a collection of intervals, merge all overlapping intervals.",
        hints: [
            "Sorting the intervals might help.",
            "Think about how to compare intervals and when to merge them."
        ]
    },
    {
        id: 3,
        title: "Word Ladder",
        difficulty: "Hard",
        description: "Given two words (beginWord and endWord), and a dictionary's word list, find the shortest transformation sequence.",
        hints: [
            "Consider using BFS (Breadth-First Search).",
            "Each word in the sequence can be considered a node in a graph."
        ]
    },
    {
        id: 4,
        title: "Binary Search",
        difficulty: "Easy",
        description: "Given a sorted array of integers, write a function to search for a target value using binary search.",
        hints: [
            "Binary search involves dividing the search interval in half.",
            "Check the middle element and decide which half to continue searching."
        ]
    },
    {
        id: 5,
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        description: "Given a string s, find the longest palindromic substring in s.",
        hints: [
            "Expand around potential centers of the palindrome.",
            "There are 2n - 1 centers (each character and between characters)."
        ]
    },
    {
        id: 6,
        title: "Coin Change",
        difficulty: "Hard",
        description: "Given an integer array of coins and an integer amount, return the fewest number of coins needed to make up the amount.",
        hints: [
            "Think about dynamic programming.",
            "Build up a solution from the smallest amounts to the target amount."
        ]
    }
];

// Global variable to keep track of the current selected question
let currentQuestion = null;

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
    users = users.map(u => (u.username === user.username ? user : u));
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
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

// Function to switch between tabs
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(tabId).style.display = 'block';
    event.target.classList.add('active');
}

// Populate the question list dynamically
const questionList = document.getElementById('questions');
const detailsSection = document.getElementById('details');
const codeArea = document.getElementById('code-area');
const testResults = document.getElementById('test-results');
const hintsContent = document.getElementById('hints-content');
const discussionMessages = document.getElementById('discussion-messages');
const discussionForm = document.getElementById('discussion-form');

function displayQuestions() {
    questionList.innerHTML = ''; // Clear previous questions
    questions.forEach(question => {
        const li = document.createElement('li');
        li.textContent = `${question.title} (${question.difficulty})`;
        li.dataset.id = question.id;
        li.addEventListener('click', () => selectQuestion(question.id));
        questionList.appendChild(li);
    });
    
}

// Function to display details of a selected question
function selectQuestion(id) {
    currentQuestion = questions.find(q => q.id === id);
    if (currentQuestion) {
        // Reset tabs to default
        openTab('details-tab');
        document.querySelectorAll('.tab-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('.tab-link').classList.add('active');

        // Details Tab
        detailsSection.innerHTML = `
            <h3>${currentQuestion.title}</h3>
            <p><strong>Difficulty:</strong> ${currentQuestion.difficulty}</p>
            <p>${currentQuestion.description}</p>
        `;
        codeArea.style.display = 'block'; // Show the code area when a question is selected
        testResults.innerHTML = ''; // Clear previous results
        document.getElementById('chatbot-area').style.display = 'none'; // Hide chatbot area

        // Hints Tab
        hintsContent.innerHTML = '';
        if (currentQuestion.hints && currentQuestion.hints.length > 0) {
            currentQuestion.hints.forEach((hint, index) => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>Hint ${index + 1}:</strong> ${hint}`;
                hintsContent.appendChild(p);
            });
        } else {
            hintsContent.innerHTML = '<p>No hints available for this question.</p>';
        }

        // Discussion Tab
        loadDiscussion();
        discussionForm.style.display = 'block';
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

    if (!currentQuestion) {
        alert('Please select a question before running the code!');
        return;
    }

    // Simulate running the code
    testResults.innerHTML = '<p>Running code, please wait...</p>';
    await new Promise(resolve => setTimeout(resolve, 2000));

    let result = 'Test Passed: Code ran successfully!';
    testResults.innerHTML = <p>${result}</p>;

    // Update the user's solved challenge count
    const user = getUser(loggedInUser);
    if (!user.solvedQuestions.includes(currentQuestion.title)) {
        user.solvedChallenges += 1;
        user.solvedQuestions.push(currentQuestion.title); // Track the solved question
        updateUser(user);
    }
}

// Simulate the chatbot's response
function askChatbot() {
    const codeInput = document.getElementById('code-input').value;
    const chatbotArea = document.getElementById('chatbot-area');
    const chatbotResponses = document.getElementById('chatbot-responses');

    if (!codeInput.trim()) {
        alert('Please enter your code before asking Koding King!');
        return;
    }

    if (!currentQuestion) {
        alert('Please select a question before asking Koding King!');
        return;
    }

    // Simulate analyzing the code and providing suggestions
    chatbotResponses.innerHTML = '<p>Analyzing your code, please wait...</p>';
    chatbotArea.style.display = 'block';

    // Simulate a delay
    setTimeout(() => {
        // Example suggestion based on the selected question
        let suggestion = '';

        if (currentQuestion.title === "Two Sum") {
            suggestion = `
                <p>Hi, I'm Koding King! It seems your solution might have a time complexity of O(n<sup>2</sup>). 
                You can optimize it to O(n) by using a hash map to store the numbers and their indices. Here's an example:</p>
                <pre>
function twoSum(nums, target) {
    const map = {};
    for(let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if(map[complement] !== undefined) {
            return [map[complement], i];
        }
        map[nums[i]] = i;
    }
}
                </pre>
            `;
        } else if (currentQuestion.title === "Merge Intervals") {
            suggestion = `
                <p>Hi, I'm Koding King! To optimize your solution, make sure you're sorting the intervals first and then merging them in a single pass. This approach has a time complexity of O(n log n) due to sorting.</p>
            `;
        } else if (currentQuestion.title === "Binary Search") {
            suggestion = `
                <p>Hi, I'm Koding King! Ensure you're implementing the binary search algorithm correctly with a time complexity of O(log n). Here's a sample implementation:</p>
                <pre>
function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;
    while(left <= right) {
        let mid = Math.floor((left + right) / 2);
        if(nums[mid] === target) {
            return mid;
        } else if(nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}
                </pre>
            `;
        } else {
            suggestion = `
                <p>Hi, I'm Koding King! Consider reviewing your solution for potential optimizations in time and space complexity. 
                For example, can you use a more efficient data structure or algorithm specific to this problem?</p>
            `;
        }

        chatbotResponses.innerHTML = suggestion;
    }, 2000);
}

// Populate leaderboard dynamically
const leaderboardList = document.getElementById('leaderboard-list');
function displayLeaderboard() {
    leaderboardList.innerHTML = ''; // Clear previous leaderboard entries

    const users = getUsers();
    const sortedUsers = users.slice().sort((a, b) => b.solvedChallenges - a.solvedChallenges);

    sortedUsers.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = `Rank ${index + 1}: ${user.username} - ${user.solvedChallenges} Challenges Solved`;
        leaderboardList.appendChild(li);
    });
    
}

// Display profile with solved questions
function displayProfile() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const user = getUser(loggedInUser);
    const profileInfo = document.getElementById('profile-info');
    const solvedChallengesList = document.getElementById('solved-challenges-list');

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

// Load discussion messages for the current question
function loadDiscussion() {
    discussionMessages.innerHTML = '';
    if (!currentQuestion) return;

    const discussions = JSON.parse(localStorage.getItem('discussions')) || {};
    const questionDiscussions = discussions[currentQuestion.id] || [];

    if (questionDiscussions.length === 0) {
        discussionMessages.innerHTML = '<p>No comments yet. Be the first to share your thoughts!</p>';
    } else {
        questionDiscussions.forEach(comment => {
            const div = document.createElement('div');
            div.classList.add('comment');
            div.innerHTML = `
                <p><strong>${comment.username}</strong>:</p>
                <p>${comment.message}</p>
                <hr>
            `;
            discussionMessages.appendChild(div);
        });
    }
}

// Add a new discussion comment
function addDiscussion() {
    const discussionInput = document.getElementById('discussion-input');
    const message = discussionInput.value.trim();
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!message) {
        alert('Please enter a comment before posting!');
        return;
    }

    const discussions = JSON.parse(localStorage.getItem('discussions')) || {};
    const questionDiscussions = discussions[currentQuestion.id] || [];

    questionDiscussions.push({
        username: loggedInUser,
        message
    });

    discussions[currentQuestion.id] = questionDiscussions;
    localStorage.setItem('discussions', JSON.stringify(discussions));

    discussionInput.value = '';
    loadDiscussion();
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

// Initialize event listeners for running code and asking chatbot
document.getElementById('run-code').addEventListener('click', runCode);
document.getElementById('ask-chatbot').addEventListener('click', askChatbot);

// Check login status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});