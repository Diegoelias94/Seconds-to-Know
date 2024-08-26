const API_URL = 'https://seconds-to-know.onrender.com/api';
const USERNAME = 'testuser'; // Replace with actual user authentication

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

startButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);

async function startGame() {
    const response = await fetch(`${API_URL}/check-played/${USERNAME}`);
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
    timeLeft = 10;
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
    const score = isCorrect ? timeLeft : 0;
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

async function updateScoreboard(score) {
    const response = await fetch(`${API_URL}/update-score/${USERNAME}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: score }),
    });
    const scores = await response.json();
    displayScoreboard(scores);
}

function displayScoreboard(scores) {
    let scoreboardHTML = '<h2>Your Scoreboard</h2><ul>';
    scores.forEach((s, index) => {
        scoreboardHTML += `<li>Day ${index + 1}: ${s.score} points</li>`;
    });
    scoreboardHTML += '</ul>';

    scoreboardElement.innerHTML = scoreboardHTML;
    scoreboardElement.style.display = 'block';
}

// Check if the user has already played today when the page loads
async function checkIfPlayedToday() {
    const response = await fetch(`${API_URL}/check-played/${USERNAME}`);
    const data = await response.json();
    if (data.played) {
        startButton.textContent = 'Play Again Tomorrow';
        startButton.disabled = true;
        const scoresResponse = await fetch(`${API_URL}/scores/${USERNAME}`);
        const scores = await scoresResponse.json();
        displayScoreboard(scores);
    }
}

checkIfPlayedToday();