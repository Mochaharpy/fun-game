let keys = {}; // Object to keep track of pressed keys
let gamePaused = false; // Track whether the game is paused
const step = 3; // Number of pixels to move
let devModeActive = false; // Track developer mode state

// Start the game
document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('play-screen').style.display = 'block';
    resetGame(); // Reset the game state
});

// Reset button (hidden initially)
document.getElementById('reset-button').addEventListener('click', resetGame);

// Track key presses
document.addEventListener('keydown', function(event) {
    if (!gamePaused) {
        keys[event.key] = true; // Mark the key as pressed
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false; // Mark the key as released
});

// Movement function
function movePlayer() {
    if (gamePaused) {
        requestAnimationFrame(movePlayer); // Continue the loop but don't move
        return; // Exit the function if the game is paused
    }

    const player = document.getElementById('player');
    const arena = document.querySelector('.arena');

    // Get current position of the player
    let left = parseInt(player.style.left) || 0;
    let top = parseInt(player.style.top) || 0;

    // Get arena dimensions
    const arenaRect = arena.getBoundingClientRect();

    // Move the player based on pressed keys
    if (keys['w'] && top > arenaRect.top + 4) { // Move up
        player.style.top = `${top - step}px`;
    }
    if (keys['a'] && left > arenaRect.left + 4) { // Move left
        player.style.left = `${left - step}px`;
    }
    if (keys['s'] && top < (arenaRect.bottom - 53)) { // Move down
        player.style.top = `${top + step}px`;
    }
    if (keys['d'] && left < (arenaRect.right - 52)) { // Move right
        player.style.left = `${left + step}px`;
    }

    // Continue the animation loop
    requestAnimationFrame(movePlayer);
}

// Reset the game state
function resetGame() {
    const player = document.getElementById('player');
    const arena = document.querySelector('.arena');

    // Get arena position and dimensions
    const arenaRect = arena.getBoundingClientRect();

    // Reset player position to the center of the arena
    player.style.left = `${arenaRect.left + (arenaRect.width - 50) / 2}px`; // Center horizontally
    player.style.top = `${arenaRect.top + (arenaRect.height - 50) / 2}px`; // Center vertically

    // Hide the settings menu if it's visible
    document.getElementById('settings-menu').style.display = 'none';
    gamePaused = false; // Unpause the game
}

// Settings Menu Functionality
document.getElementById('abort-button').addEventListener('click', function() {
    resetGame(); // Reset the game when aborting
    document.getElementById('play-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
});

// Escape key to open settings
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        gamePaused = !gamePaused; // Toggle pause state
        const settingsMenu = document.getElementById('settings-menu');
        settingsMenu.style.display = gamePaused ? 'flex' : 'none'; // Show/hide settings menu
    }
});

// Developer Mode Functionality
document.getElementById('dev-button').addEventListener('click', function() {
    document.getElementById('developer-modal').style.display = 'block'; // Show developer modal
});

document.getElementById('dev-password').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const password = document.getElementById('dev-password').value;
        if (password === 'dev') {
            devModeActive = true;
            document.getElementById('dev-button').style.display = 'none'; // Hide developer button
            document.getElementById('settings-title').innerText = "Settings AND Developer Settings"; // Change the title
            document.getElementById('developer-modal').style.display = 'none'; // Hide modal
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.innerText = "Incorrect password. Please try again.";
            document.getElementById('developer-modal').appendChild(errorMessage);
        }
    }
});

document.getElementById('close-dev-modal').addEventListener('click', function() {
    document.getElementById('developer-modal').style.display = 'none'; // Hide modal
});

// Close settings menu
document.getElementById('close-settings').addEventListener('click', function() {
    gamePaused = false; // Unpause the game
    document.getElementById('settings-menu').style.display = 'none'; // Hide settings menu
});

// Start the movement loop
requestAnimationFrame(movePlayer);
