const player = document.getElementById('player');
const expBar = document.getElementById('exp-bar');
const devButton = document.getElementById('dev-button');
const devModal = document.getElementById('dev-modal');
const closeButton = document.querySelector('.close-button');
const confirmDevButton = document.getElementById('confirm-dev-button');
const devCodeInput = document.getElementById('dev-code');

let playerPosition = { x: 575, y: 275 }; // Centered player position
let exp = 0;
let expToLevelUp = 100;
let monsters = [];
let isDevModeActive = false; // Track if dev mode is active
let isGamePaused = false; // Track if the game is paused
let playerHealth = 100;

// Define enemy types
const enemyTypes = [
    { name: 'Basic Enemy', health: 50, damage: 10, speed: 1, color: 'red', size: 50 },
];

// Player properties
const playerSpeed = 3;

// Rock properties
const rockDamage = 10; // Damage dealt by rocks
let canShoot = true; // Track shooting cooldown

// Function to update player position
function updatePlayerPosition() {
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
}

// Initial call to set player position
updatePlayerPosition();

// WASD movement handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Function to handle player movement
function handleMovement() {
    if (!isGamePaused) { // Only allow movement if the game is not paused
        if (keys['w'] && playerPosition.y > 0) playerPosition.y -= playerSpeed;
        if (keys['s'] && playerPosition.y < 600 - 50) playerPosition.y += playerSpeed; // Player height is 50
        if (keys['a'] && playerPosition.x > 0) playerPosition.x -= playerSpeed;
        if (keys['d'] && playerPosition.x < 1200 - 50) playerPosition.x += playerSpeed; // Player width is 50
    }
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
    exp -= expToLevelUp;
    expToLevelUp = Math.floor(expToLevelUp * 1.15);
    updateExpBar();
}

// Function to update the EXP bar
function updateExpBar() {
    const percent = (exp / expToLevelUp) * 100;
    expBar.style.width = `${percent}%`;
}

// Show the developer confirmation modal
devButton.addEventListener('click', () => {
    toggleGamePause(); // Pause the game
    devModal.style.display = 'block'; // Show the modal
});

// Close the modal
closeButton.addEventListener('click', () => {
    toggleGamePause(); // Resume the game
    devModal.style.display = 'none'; // Hide the modal
});

// Handle confirmation of dev mode
confirmDevButton.addEventListener('click', () => {
    const code = devCodeInput.value;
    if (code === "dev") {
        isDevModeActive = true; // Set dev mode active
        devModal.style.display = 'none'; // Hide modal
    }
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === devModal) {
        toggleGamePause(); // Resume the game
        devModal.style.display = 'none';
    }
});

// Toggle game pause state
function toggleGamePause() {
    isGamePaused = !isGamePaused;
}

// Function to spawn enemies
function spawnEnemy(mouseX, mouseY) {
    if (isDevModeActive) {
        const enemyType = enemyTypes[0]; // Example: always spawn the basic enemy
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.backgroundColor = enemyType.color;
        enemy.style.width = `${enemyType.size}px`;
        enemy.style.height = `${enemyType.size}px`;
        enemy.style.left = `${mouseX - enemyType.size / 2}px`; // Center on mouse click
        enemy.style.top = `${mouseY - enemyType.size / 2}px`; // Center on mouse click

        // Add enemy to the game area
        document.getElementById('game').appendChild(enemy);
        monsters.push({ element: enemy, health: enemyType.health }); // Track enemies with their health
    }
}

// Event listener for mouse click to spawn enemies
document.getElementById('game').addEventListener('click', (event) => {
    if (!isGamePaused) { // Only spawn enemies if game is not paused
        const mouseX = event.clientX - event.target.getBoundingClientRect().left; // Correct mouse position
        const mouseY = event.clientY - event.target.getBoundingClientRect().top; // Correct mouse position
        spawnEnemy(mouseX, mouseY);
    }
});

// Function to shoot rocks at the nearest enemy
function shootRocks() {
    if (canShoot && monsters.length > 0) {
        const nearestEnemy = monsters[0].element; // Get the first enemy element
        const rock = document.createElement('div');
        rock.classList.add('rock');
        rock.style.left = `${playerPosition.x + 25}px`; // Starting position at player edge
        rock.style.top = `${playerPosition.y + 25}px`;

        const targetX = parseInt(nearestEnemy.style.left) + 25; // Center of the enemy
        const targetY = parseInt(nearestEnemy.style.top) + 25; // Center of the enemy

        const deltaX = targetX - (playerPosition.x + 25);
        const deltaY = targetY - (playerPosition.y + 25);
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const normalizedX = (deltaX / distance);
        const normalizedY = (deltaY / distance);
        const speed = 5; // Adjust the speed of the rock

        // Move the rock toward the enemy
        const moveRock = setInterval(() => {
            rock.style.left = `${parseInt(rock.style.left) + normalizedX * speed}px`;
            rock.style.top = `${parseInt(rock.style.top) + normalizedY * speed}px`;

            // Check for collision with enemy
            if (
                parseInt(rock.style.left) < parseInt(nearestEnemy.style.left) + 50 &&
                parseInt(rock.style.left) + 10 > parseInt(nearestEnemy.style.left) &&
                parseInt(rock.style.top) < parseInt(nearestEnemy.style.top) + 50 &&
                parseInt(rock.style.top) + 10 > parseInt(nearestEnemy.style.top)
            ) {
                const enemyData = monsters.find(m => m.element === nearestEnemy);
                if (enemyData) {
                    enemyData.health -= rockDamage; // Deal damage
                    document.getElementById('game').removeChild(rock); // Remove rock on hit
                    clearInterval(moveRock); // Stop moving the rock
                    if (enemyData.health <= 0) {
                        document.getElementById('game').removeChild(nearestEnemy); // Remove enemy on death
                        monsters = monsters.filter(m => m.element !== nearestEnemy); // Remove from monsters array
                    }
                }
            }

            // Remove rock if it hits the arena border
            if (
                parseInt(rock.style.left) < 0 ||
                parseInt(rock.style.left) > 1200 || // Assuming the game width is 1200
                parseInt(rock.style.top) < 0 ||
                parseInt(rock.style.top) > 600 // Assuming the game height is 600
            ) {
                document.getElementById('game').removeChild(rock); // Remove rock
                clearInterval(moveRock); // Stop moving the rock
            }
        }, 50); // Rock movement interval

        document.getElementById('game').appendChild(rock); // Add rock to game
        canShoot = false; // Set cooldown
        setTimeout(() => {
            canShoot = true; // Reset cooldown after 2 seconds
        }, 2000);
    }
}

// Game loop
function gameLoop() {
    handleMovement(); // Handle player movement
    if (!isGamePaused) {
        shootRocks(); // Shoot rocks at enemies continuously
    }
    requestAnimationFrame(gameLoop);
}

// Start the game loop after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    gameLoop();
});
