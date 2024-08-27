document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://seconds-to-know.onrender.com/api';
    let token = localStorage.getItem('token');
    let currentGameMode = 10;

    // Function to safely get elements and log if they're missing
    function getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with id '${id}' not found in the DOM`);
        }
        return element;
    }

    // Get all required elements
    const authButton = getElement('auth-button');
    const authModal = getElement('auth-modal');
    const closeModal = document.querySelector('.close');
    const modeSelectionScreen = getElement('mode-selection');
    const countdownScreen = getElement('countdown');
    const gamePlayScreen = getElement('game-play');
    const gameResultScreen = getElement('game-result');
    const gameModeSelect = getElement('game-mode-select');
    const startGameButton = getElement('start-game-button');
    const countdownTimer = getElement('countdown-timer');
    const playAgainButton = getElement('play-again-button');
    const resultMessage = getElement('result-message');
    const pointsGained = getElement('points-gained');
    const leaderboard = getElement('leaderboard');
    const submitButton = getElement('submit-button');
    const authTitle = getElement('auth-title');
    const authForm = getElement('auth-form');
    const emailInput = getElement('email-input');
    const authSubmitButton = getElement('auth-submit-button');
    const authToggleLink = getElement('auth-toggle-link');

    let isLoginMode = true;

    function toggleAuthMode() {
        isLoginMode = !isLoginMode;
        authTitle.textContent = isLoginMode ? 'Login' : 'Register';
        authSubmitButton.textContent = isLoginMode ? 'Login' : 'Register';
        emailInput.style.display = isLoginMode ? 'none' : 'block';
        authToggleLink.textContent = isLoginMode ? 'Register' : 'Login';
        document.getElementById('auth-toggle').firstChild.textContent = isLoginMode 
            ? "Don't have an account? "
            : "Already have an account? ";
    }

    if (authToggleLink) authToggleLink.addEventListener('click', function(e) {
        e.preventDefault();
        toggleAuthMode();
    });

    if (authSubmitButton) authSubmitButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission
        if (isLoginMode) {
            login();
        } else {
            register();
        }
    });

    async function login() {
        console.log('Login function called');
        const username = usernameInput.value;
        const password = passwordInput.value;
        console.log('Attempting login with:', { username, password });
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            console.log('Login response:', data);
            if (response.ok) {
                token = data.token;
                localStorage.setItem('token', token);
                authModal.style.display = 'none';
                authButton.style.display = 'none';
                startButton.disabled = false;
                alert('Login successful!');
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    }

    async function register() {
        console.log('Register function called');
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        console.log('Attempting registration with:', { username, email, password });
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            console.log('Registration response:', data);
            if (response.ok) {
                alert('Registration successful. Please login.');
                toggleAuthMode(); // Switch back to login mode
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration');
        }
    }

    // Safely add event listeners
    if (authButton) authButton.onclick = function() { authModal.style.display = "block"; };
    if (closeModal) closeModal.onclick = function() { authModal.style.display = "none"; };
    if (startGameButton) startGameButton.addEventListener('click', startGameFlow);
    if (playAgainButton) playAgainButton.addEventListener('click', () => showScreen(modeSelectionScreen));
    if (submitButton) submitButton.addEventListener('click', checkAnswer);

    // ... (rest of your existing code)

    // Functions that should be defined
    function startGameFlow() {
        console.log("Game flow started");
        // Implement this function
    }

    function showScreen(screen) {
        console.log("Showing screen", screen.id);
        // Implement this function
    }

    function checkAnswer() {
        console.log("Checking answer");
        // Implement this function
    }

    function login() {
        console.log("Login attempted");
        // Implement this function
    }

    function register() {
        console.log("Registration attempted");
        // Implement this function
    }

    function checkLoggedIn() {
        console.log("Checking if user is logged in");
        // Implement this function
    }

    // Call initialization functions
    checkLoggedIn();
});