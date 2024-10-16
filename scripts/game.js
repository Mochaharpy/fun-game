const player = document.getElementById('player');
const expBar = document.getElementById('exp-bar');
const devButton = document.getElementById('dev-button');

let playerPosition = { x: 375, y: 275 }; // Initial player position
let exp = 0;
let expToLevelUp = 100;
let monsters = [];
let attacking = false; // Toggle for attack mode
let direction = 'right'; // Default facing direction

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
    exp -= expToLevelUp;
    expToLevelUp = Math.floor(expToLevelUp * 1.2);
    updateExpBar();
}

// Function to update the EXP bar
function updateExpBar() {
    const percent = (exp / expToLevelUp) * 100;
    expBar.style.width = `${percent}%`;
}

// Toggle Attack
document.addEventListener('keypress', (event) => {
    if (event.key === 't') { // Press 't' to toggle attack mode
        attacking = !attacking;
        alert(`Attack mode is now ${attacking ? 'ON' : 'OFF'}`);
    }
});

// Function to attack in the current direction
function attack() {
    if (attacking) {
        // Define attack area (for simplicity, we attack a square area in front of the player)
        const attackArea = {
            x: playerPosition.x + (direction === 'right' ? 50 : -50),
            y: playerPosition.y,
            width: 50,
            height: 50,
        };

        // Check for monsters in the attack area
        monsters.forEach((monster, index) => {
            const monsterRect = monster.element.getBoundingClientRect();
            const attackRect = {
                left: attackArea.x,
                top: attackArea.y,
                right: attackArea.x + attackArea.width,
                bottom: attackArea.y + attackArea.height,
            };

            // Check for collision
            if (
                monsterRect.left < attackRect.right &&
                monsterRect.right > attackRect.left &&
                monsterRect.top < attackRect.bottom &&
                monsterRect.bottom > attackRect.top
            ) {
                // Damage the monster or handle it
                monster.health -= 10; // Reduce health by 10
                if (monster.health <= 0) {
                    monster.element.remove();
                    monsters.splice(index, 1); // Remove the monster from the array
                    gainExp(monster.expAmount); // Gain EXP from defeating the monster
                }
            }
        });
    }
}

// Game loop
function gameLoop() {
    updatePlayerPosition();
    attack(); // Call the attack function in the game loop
    requestAnimationFrame(gameLoop);
}

// Start the game loop after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    gameLoop();
});

// Add player movement
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            playerPosition.y -= playerSpeed;
            direction = 'up';
            break;
        case 'ArrowDown':
            playerPosition.y += playerSpeed;
            direction = 'down';
            break;
        case 'ArrowLeft':
            playerPosition.x -= playerSpeed;
            direction = 'left';
            break;
        case 'ArrowRight':
            playerPosition.x += playerSpeed;
            direction = 'right';
            break;
    }
    updatePlayerPosition();
});
