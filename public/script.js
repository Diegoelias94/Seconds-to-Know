const API_URL = 'https://seconds-to-know.onrender.com/api';
let token = localStorage.getItem('token');
let currentGameMode = 10;

const questions = [
    { question: "Year of the moon landing", answer: "1969" },
    { question: "Number of planets in our solar system", answer: "8" },
    { question: "Capital of France", answer: "Paris" },
    { question: "Year World War II ended", answer: "1945" },
    { question: "Number of continents", answer: "7" }
];

let currentQuestion;
let timer;
let timeLeft;
let dailyQuestionIndex;

const timerElement = document.getElementById('timer');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const startButton = document.getElementById('start-button');
const submitButton = document.getElementById('submit-button');
const scoreboardElement = document.getElementById('scoreboard');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const usernameInput = document.getElementById('username-input');
const emailInput = document.getElementById('email-input'); // Add this line
const passwordInput = document.getElementById('password-input');
const authContainer = document.getElementById('auth-container');
const gameModeButtons = document.querySelectorAll('.game-mode-button');

startButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);
loginButton.addEventListener('click', login);
registerButton.addEventListener('click', register);
gameModeButtons.forEach(button => {
    button.addEventListener('click', () => setGameMode(parseInt(button.dataset.mode)));
});

function setGameMode(mode) {
    currentGameMode = mode;
    gameModeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
}

const authButton = document.getElementById('auth-button');
const authModal = document.getElementById('auth-modal');
const closeModal = document.getElementsByClassName('close')[0];

authButton.onclick = function() {
    authModal.style.display = "block";
}

closeModal.onclick = function() {
    authModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == authModal) {
        authModal.style.display = "none";
    }
}

async function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            authModal.style.display = 'none';
            authButton.style.display = 'none';
            startButton.disabled = false;
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function register() {
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful. Please login.');
            emailInput.value = ''; // Clear email field after successful registration
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}

async function startGame() {
    if (!token) {
        alert('Please login first');
        return;
    }
    const response = await fetch(`${API_URL}/check-played`, {
        headers: { 'Authorization': token }
    });
    const data = await response.json();
    if (data.played) {
        alert("You've already played today. Come back tomorrow for a new question!");
        return;
    }

    dailyQuestionIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[dailyQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answerInput.value = '';
    answerInput.disabled = false;
    submitButton.disabled = false;
    startButton.disabled = true;
    timeLeft = currentGameMode;
    timerElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            endRound(false);
        }
    }, 1000);

    answerInput.focus();
}

function checkAnswer() {
    clearInterval(timer);
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();
    endRound(userAnswer === correctAnswer);
}

async function endRound(isCorrect) {
    const score = isCorrect ? calculateScore(timeLeft, currentGameMode) : 0;
    if (isCorrect) {
        alert(`Correct! You scored ${score} points.`);
    } else {
        alert(`Time's up! The correct answer was: ${currentQuestion.answer}`);
    }
    answerInput.disabled = true;
    submitButton.disabled = true;
    startButton.disabled = false;
    startButton.textContent = 'Play Again Tomorrow';

    await updateScoreboard(score);
}

function calculateScore(timeLeft, gameMode) {
    // Base score is the time left
    let score = timeLeft;
    
    // Adjust score based on game mode
    switch (gameMode) {
        case 10:
            score *= 3; // Highest multiplier for the hardest mode
            break;
        case 20:
            score *= 2;
            break;
        case 30:
            score *= 1.5;
            break;
    }
    
    return Math.round(score);
}

async function updateScoreboard(score) {
    try {
        const response = await fetch(`${API_URL}/update-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ score: score, game_mode: `${currentGameMode}_seconds` }),
        });
        const data = await response.json();
        if (Array.isArray(data)) {
            displayScoreboard(data);
        } else {
            console.error('Unexpected response format:', data);
            displayScoreboard([]);
        }
    } catch (error) {
        console.error('Error updating scoreboard:', error);
        displayScoreboard([]);
    }
}

function displayScoreboard(scores) {
    if (!Array.isArray(scores)) {
        console.error('Invalid scores data:', scores);
        scores = [];
    }
    let scoreboardHTML = '<h2>Your Scoreboard</h2><ul>';
    scores.forEach((s, index) => {
        scoreboardHTML += `<li>Day ${index + 1}: ${s.score} points (${s.game_mode})</li>`;
    });
    scoreboardHTML += '</ul>';

    scoreboardElement.innerHTML = scoreboardHTML;
    scoreboardElement.style.display = 'block';
}

async function checkIfPlayedToday() {
    if (!token) {
        authContainer.style.display = 'block';
        startButton.disabled = true;
        return;
    }
    
    const response = await fetch(`${API_URL}/check-played`, {
        headers: { 'Authorization': token }
    });
    const data = await response.json();
    if (data.played) {
        startButton.textContent = 'Play Again Tomorrow';
        startButton.disabled = true;
        const scoresResponse = await fetch(`${API_URL}/scores`, {
            headers: { 'Authorization': token }
        });
        const scores = await scoresResponse.json();
        displayScoreboard(scores);
    } else {
        startButton.disabled = false;
    }
}

checkIfPlayedToday();