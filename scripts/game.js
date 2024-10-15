const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const expBar = document.getElementById('exp-bar');
const levelDisplay = document.getElementById('level');
const expDisplay = document.getElementById('exp');
const devButton = document.getElementById('dev-button');

let playerPosition = { x: 375, y: 275 };
let level = 1;
let exp = 0;
let expToLevelUp = 100;
let canAttack = true; // Track if the player can attack

// Monster properties
let monsterHealth = 50;
let monsterSpeed = 1; // Speed of the monster
let monsterExp = 100; // Starting EXP for the monster
let isMonsterAlive = true;

// Movement flags
let keys = { w: false, a: false, s: false, d: false };

// Function to update player position
function updatePlayerPosition() {
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
}

// Function to gain EXP
function gainExp(amount) {
    exp += amount;
    expDisplay.innerText = exp;
    updateExpBar();

    if (exp >= expToLevelUp) {
        levelUp();
    }
}

// Function to handle leveling up
function levelUp() {
    level++;
    levelDisplay.innerText = level;
    exp -= expToLevelUp; // Reset EXP after leveling up
    expToLevelUp = Math.floor(expToLevelUp * 1.2); // Increase required EXP for next level
    updateExpBar();
}

// Function to attack the monster
function attackMonster() {
    if (isMonsterAlive && checkCollision() && canAttack) {
        canAttack = false; // Prevent further attacks until cooldown
        monsterHealth -= 10; // Player does 10 damage
        setTimeout(() => {
            canAttack = true; // Reset attack ability after cooldown
        }, 1000); // 1 second cooldown

        if (monsterHealth <= 0) {
            isMonsterAlive = false;
            dropExpItem(); // Drop an EXP item when monster dies
            enemy.style.display = 'none'; // Hide the enemy
        }
    }
}

// Function to drop the EXP item
function dropExpItem() {
    const expDropped = Math.floor(monsterExp * (1 + (Math.random() * 0.2 - 0.1))); // 10% variation
    gainExp(expDropped);
}

// Update the EXP bar
function updateExpBar() {
    const percent = (exp / expToLevelUp) * 100;
    expBar.style.width = `${percent}%`;
}

// Check collision with monster
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    return !(
        playerRect.right < enemyRect.left ||
        playerRect.left > enemyRect.right ||
        playerRect.bottom < enemyRect.top ||
        playerRect.top > enemyRect.bottom
    );
}

// Move enemy towards player
function moveEnemy() {
    if (isMonsterAlive) {
        const enemyRect = enemy.getBoundingClientRect();
        const dx = playerPosition.x - enemyRect.left;
        const dy = playerPosition.y - enemyRect.top;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const moveX = (dx / distance) * monsterSpeed;
            const moveY = (dy / distance) * monsterSpeed;

            enemy.style.left = `${enemyRect.left + moveX}px`;
            enemy.style.top = `${enemyRect.top + moveY}px`;
        }

        if (distance < 50) {
            attackMonster();
        }
    }
}

// Keydown event listener
document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

// Game loop for continuous movement and enemy behavior
function gameLoop() {
    if (keys.w) playerPosition.y = Math.max(0, playerPosition.y - 3);
    if (keys.s) playerPosition.y = Math.min(550, playerPosition.y + 3);
    if (keys.a) playerPosition.x = Math.max(0, playerPosition.x - 3);
    if (keys.d) playerPosition.x = Math.min(750, playerPosition.x + 3);

    updatePlayerPosition();
    moveEnemy();

    requestAnimationFrame(gameLoop); // Keep the game loop running
}

// Start the game loop
gameLoop();

// Load dev mode functionality
import('./devMode.js')
    .then(module => {
        module.initialize(devButton, player, enemy);
    })
    .catch(err => console.error("Failed to load dev mode:", err));
