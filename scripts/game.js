const player = document.getElementById('player');
const expBar = document.getElementById('exp-bar');
const devButton = document.getElementById('dev-button');

let playerPosition = { x: 375, y: 275 }; // Initial player position
let exp = 0;
let expToLevelUp = 100;
let monsters = [];
let attacking = false; // Toggle for attack mode
let direction = 'right'; // Default facing direction
let playerHealth = 100; // Player's initial health
const monsterSpeed = 1; // Monster movement speed

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
        const attackArea = {
            x: playerPosition.x + (direction === 'right' ? 50 : -50),
            y: playerPosition.y,
            width: 50,
            height: 50,
        };

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
                // Damage the monster
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

// Function to move monsters toward the player
function moveMonsters() {
    monsters.forEach((monster) => {
        const monsterRect = monster.element.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // Calculate the distance to the player
        const dx = playerRect.x - monsterRect.x;
        const dy = playerRect.y - monsterRect.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move monster toward the player
        if (distance > 50) { // Don't move if close enough
            const moveX = (dx / distance) * monsterSpeed;
            const moveY = (dy / distance) * monsterSpeed;

            monster.element.style.left = `${monsterRect.x + moveX}px`;
            monster.element.style.top = `${monsterRect.y + moveY}px`;
        }

        // Check for collision with the player
        if (monsterRect.left < playerRect.right &&
            monsterRect.right > playerRect.left &&
            monsterRect.top < playerRect.bottom &&
            monsterRect.bottom > playerRect.top) {
            // Damage the player
            playerHealth -= 5; // Reduce player health
            alert(`Player health: ${playerHealth}`);
            // Push the player away
            playerPosition.x -= moveX * 2;
            playerPosition.y -= moveY * 2;
        }
    });
}

// Game loop
function gameLoop() {
    updatePlayerPosition();
    attack(); // Call the attack function in the game loop
    moveMonsters(); // Move monsters toward the player
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
