const player = document.getElementById('player');
const expBar = document.getElementById('exp-bar');
const levelDisplay = document.getElementById('level');
const devButton = document.getElementById('dev-button');
const settingsMenu = document.getElementById('settings');
const settingsButton = document.getElementById('settings-button');

let playerPosition = { x: 375, y: 275 };
let level = 1;
let exp = 0;
let expToLevelUp = 100;
let canAttack = true;
let monsters = [];
let gamePaused = false;

// Player properties
const playerSpeed = 3;

// Function to update player position
function updatePlayerPosition() {
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
}

// Function to gain EXP
function gainExp(amount) {
    exp += amount;
    updateExpBar();

    if (exp >= expToLevelUp) {
        levelUp();
    }
}

// Function to handle leveling up
function levelUp() {
    level++;
    exp -= expToLevelUp;
    expToLevelUp = Math.floor(expToLevelUp * 1.2);
    updateExpBar();
}

// Function to update the EXP bar
function updateExpBar() {
    const percent = (exp / expToLevelUp) * 100;
    expBar.style.width = `${percent}%`;
    levelDisplay.innerText = level; // Show level above the bar
}

// Pause and resume game
function togglePause() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        cancelAnimationFrame(gameLoopId);
    } else {
        gameLoop();
    }
}

// Toggle settings menu
function toggleSettings() {
    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    togglePause();
}

// Event listeners
settingsButton.addEventListener('click', toggleSettings);
devButton.addEventListener('click', () => {
    // Your dev mode logic here
});

// Game loop
let gameLoopId;
function gameLoop() {
    if (!gamePaused) {
        // Update game logic here
        requestAnimationFrame(gameLoop);
    }
}

// Start the game loop
gameLoop();
