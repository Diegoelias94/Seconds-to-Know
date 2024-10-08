document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://seconds-to-know.onrender.com/api';
    console.log('API_URL:', API_URL);
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
    const usernameInput = getElement('username-input');
    const emailInput = getElement('email-input');
    const passwordInput = getElement('password-input');
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

    const authSubmitButton = document.getElementById('auth-submit-button');
    if (authSubmitButton) {
        console.log('Auth submit button found');
        authSubmitButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Auth submit button clicked');
            if (isLoginMode) {
                login();
            } else {
                register();
            }
        });
    } else {
        console.error('Auth submit button not found');
    }

    async function login() {
        console.log('Login function called');
        const username = usernameInput.value;
        const password = passwordInput.value;
        console.log('Attempting login with:', { username, password: '****' });
        try {
            console.log('About to fetch:', `${API_URL}/login`);
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            console.log('Fetch completed, response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);
            if (response.ok) {
                token = data.token;
                localStorage.setItem('token', token);
                if (authModal) authModal.style.display = 'none';
                if (authButton) authButton.style.display = 'none';
                if (startGameButton) startGameButton.disabled = false;
                alert('Login successful!');
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login: ' + error.message);
        }
    }

    async function register() {
        console.log('Register function called');
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        console.log('Attempting registration with:', { username, email, password: '****' });
        try {
            console.log('About to fetch:', `${API_URL}/register`);
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            console.log('Fetch completed, response status:', response.status);
            const data = await response.json();
            console.log('Registration response data:', data);
            if (response.ok) {
                alert('Registration successful. Please login.');
                toggleAuthMode(); // Switch back to login mode
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration: ' + error.message);
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

    function checkLoggedIn() {
        console.log("Checking if user is logged in");
        // Implement this function
    }

    // Call initialization functions
    checkLoggedIn();

    function testAPIConnection() {
        console.log('Testing API connection');
        fetch(`${API_URL}/test`)
            .then(response => {
                console.log('API test response status:', response.status);
                return response.text();
            })
            .then(data => console.log('API test response:', data))
            .catch(error => console.error('API test error:', error));
    }

    // Call this function when the page loads
    testAPIConnection();
});