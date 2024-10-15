const player = document.getElementById('player');
const expBar = document.getElementById('exp-bar');
const devButton = document.getElementById('dev-button');

let playerPosition = { x: 375, y: 275 };
let exp = 0;
let expToLevelUp = 100;
let canAttack = true;
let monsters = [];

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

// Dev Mode Logic
devButton.addEventListener('click', () => {
    const code = prompt("Enter dev code:");
    if (code === "dev") {
        alert("Dev mode activated! Click to summon enemies.");
        document.addEventListener('click', (event) => {
            summonEnemy(event.clientX - 25, event.clientY - 25);
        });
    } else {
        alert("Incorrect code! Please try again.");
    }
});

function summonEnemy(x, y) {
    const newMonster = document.createElement('div');
    newMonster.style.position = 'absolute';
    newMonster.style.width = '50px';
    newMonster.style.height = '50px';
    newMonster.style.backgroundColor = 'red';
    newMonster.style.left = `${x}px`;
    newMonster.style.top = `${y}px`;
    document.getElementById('game').appendChild(newMonster);

    // Example of enemy properties
    monsters.push({
        element: newMonster,
        health: 50,
        expAmount: Math.floor(Math.random() * 20) + 100,
    });
}

// Game loop (simplified)
function gameLoop() {
    // Game logic here
    updatePlayerPosition();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
