const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const expItem = document.getElementById('exp-drop');
const levelDisplay = document.getElementById('level');
const expDisplay = document.getElementById('exp');

let playerPosition = { x: 375, y: 275 };
let level = 1;
let exp = 0;
const expToLevelUp = 100;

// Monster properties
let monsterHealth = 50;
let monsterSpeed = 1; // Example speed property
let monsterExp = 20; // Average EXP
let isMonsterAlive = true;
let expOrbCount = 0; // Keep track of the number of EXP orbs dropped

// Function to update player position
function updatePlayerPosition() {
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
}

// Function to gain EXP
function gainExp(amount) {
    exp += amount;
    expDisplay.innerText = exp;

    if (exp >= expToLevelUp) {
        levelUp();
    }
}

// Function to handle leveling up
function levelUp() {
    level++;
    levelDisplay.innerText = level;
    exp -= expToLevelUp; // Reset EXP after leveling up
}

// Function to attack the monster
function attackMonster() {
    if (isMonsterAlive) {
        monsterHealth -= 10; // Player does 10 damage
        if (monsterHealth <= 0) {
            isMonsterAlive = false;
            dropExpItem(); // Drop an EXP item when monster dies
            enemy.style.display = 'none'; // Hide the enemy
            alert('You defeated the monster!');
        }
    }
}

// Function to drop the EXP item
function dropExpItem() {
    // Calculate EXP drop with a little variation
    const expDropped = Math.floor(monsterExp * (1 + (Math.random() * 0.2 - 0.1))); // 10% variation
    expOrbCount++; // Increment the orb count

    // Calculate size based on the number of orbs dropped
    const size = Math.max(20, 20 + (expOrbCount * 2)); // Size grows but caps at a certain point

    expItem.innerText = expDropped; // Show the EXP amount
    expItem.style.display = 'block'; // Show the EXP item
    expItem.style.left = `${enemy.style.left}`;
    expItem.style.top = `${enemy.style.top}`;
    expItem.dataset.amount = expDropped; // Store the amount in a data attribute
    expItem.style.width = `${size}px`;
    expItem.style.height = `${size}px`;
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

// Check collision with EXP item
function checkExpCollision() {
    const playerRect = player.getBoundingClientRect();
    const expRect = expItem.getBoundingClientRect();

    return !(
        playerRect.right < expRect.left ||
        playerRect.left > expRect.right ||
        playerRect.bottom < expRect.top ||
        playerRect.top > expRect.bottom
    );
}

// Keydown event listener
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            playerPosition.y = Math.max(0, playerPosition.y - 5);
            break;
        case 'ArrowDown':
        case 's':
            playerPosition.y = Math.min(550, playerPosition.y + 5);
            break;
        case 'ArrowLeft':
        case 'a':
            playerPosition.x = Math.max(0, playerPosition.x - 5);
            break;
        case 'ArrowRight':
        case 'd':
            playerPosition.x = Math.min(750, playerPosition.x + 5);
            break;
        case ' ':
            attackMonster(); // Attack the monster on spacebar press
            break;
    }
    updatePlayerPosition();

    // Check for collision with the monster
    if (checkCollision()) {
        alert('You are close to the monster! Press space to attack.');
    }

    // Check for collision with the EXP item
    if (checkExpCollision() && expItem.style.display === 'block') {
        const expAmount = parseInt(expItem.dataset.amount);
        gainExp(expAmount);
        expItem.style.display = 'none'; // Hide the EXP item after pickup
        alert(`You picked up ${expAmount} EXP!`);
    }
});
