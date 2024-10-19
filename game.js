import { monsters } from "./monster.js";

let keys = {}; // Object to keep track of pressed keys
let gamePaused = false; // Track whether the game is paused
let step = 3; // Number of pixels to move
let currentIndex = 0; // Track the current index
let spawnedMonsters = []; // Array to keep track of spawned monsters
let devModeActive = false; // Track developer mode state

// Start the game
document.getElementById("start-button").addEventListener("click", function () {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("play-screen").style.display = "block";
    resetGame(); // Reset the game state
});

// Reset button
document.getElementById("reset-button").addEventListener("click", resetGame);

// Track key presses
document.addEventListener("keydown", function (event) {
    if (!gamePaused) {
        keys[event.key] = true; // Mark the key as pressed
    }
});

document.addEventListener("keyup", function (event) {
    keys[event.key] = false; // Mark the key as released
});

function moveMonsters(playerX, playerY) {
    spawnedMonsters.forEach(monster => {
        const monsterElement = document.getElementById(monster.id);
        if (monsterElement) {
            let monsterX = parseInt(monsterElement.style.left) || 0;
            let monsterY = parseInt(monsterElement.style.top) || 0;

            const directionX = playerX - (monsterX + monsterElement.clientWidth / 2);
            const directionY = playerY - (monsterY + monsterElement.clientHeight / 2);
            const distance = Math.sqrt(directionX * directionX + directionY * directionY);

            // Normalize only if distance is greater than zero
            if (distance > 0) {
                const normalizedX = (directionX / distance) * monster.speed;
                const normalizedY = (directionY / distance) * monster.speed;

                monsterX += normalizedX;
                monsterY += normalizedY;

                const arena = document.querySelector(".arena");
                const arenaRect = arena.getBoundingClientRect();

                monsterX = Math.max(0, Math.min(monsterX, arenaRect.width - monsterElement.clientWidth));
                monsterY = Math.max(0, Math.min(monsterY, arenaRect.height - monsterElement.clientHeight));

                monsterElement.style.left = `${monsterX}px`;
                monsterElement.style.top = `${monsterY}px`;
            }
        }
    });
}

// Move player function
function movePlayer() {
    if (gamePaused) {
        requestAnimationFrame(movePlayer);
        return;
    }

    const player = document.getElementById("player");
    const arena = document.querySelector(".arena");

    let left = parseInt(player.style.left) || 0;
    let top = parseInt(player.style.top) || 0;

    const arenaRect = arena.getBoundingClientRect();
    const arenaWidth = arenaRect.width;
    const arenaHeight = arenaRect.height;

    // Move the player based on pressed keys
    if (keys["w"] && top > 0) {
        top -= step;
    }
    if (keys["a"] && left > 0) {
        left -= step;
    }
    if (keys["s"] && top < arenaHeight - player.clientHeight) {
        top += step;
    }
    if (keys["d"] && left < arenaWidth - player.clientWidth) {
        left += step;
    }

    // Update player position
    player.style.left = `${left}px`;
    player.style.top = `${top}px`;

    // Move spawned monsters towards the player's center
    moveMonsters(left + player.clientWidth / 2, top + player.clientHeight / 2);

    requestAnimationFrame(movePlayer);
}

// Reset the game state
function resetGame() {
    const player = document.getElementById("player");
    const arena = document.querySelector(".arena");

    // Reset player position to the center of the arena
    player.style.left = `${(arena.clientWidth - player.clientWidth) / 2}px`;
    player.style.top = `${(arena.clientHeight - player.clientHeight) / 2}px`;

    // Clear spawned monsters
    spawnedMonsters.forEach((monster) => {
        const monsterElement = document.getElementById(monster.id);
        if (monsterElement) {
            monsterElement.remove();
        }
    });
    spawnedMonsters = [];

    // Hide the settings menu if it's visible
    document.getElementById("settings-menu").style.display = "none";
    gamePaused = false; // Unpause the game
}

// Settings Menu Functionality
document.getElementById("abort-button").addEventListener("click", function () {
    resetGame();
    document.getElementById("play-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
});

// Escape key to open settings
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        gamePaused = !gamePaused; // Toggle pause state
        const settingsMenu = document.getElementById("settings-menu");
        settingsMenu.style.display = gamePaused ? "flex" : "none"; // Show/hide settings menu
    }
});

// Cycle through monsters
function cycleMonsters() {
    currentIndex = (currentIndex + 1) % monsters.length; // Increment index and wrap around
    document.getElementById("current-monster").innerText = `Current Monster: ${monsters[currentIndex].name}`;
}

// Add event listener to the monster-cycle button
document.getElementById("monster-cycle").addEventListener("click", cycleMonsters);

// Spawn the selected monster
function spawnMonster(arena) {
    const monster = monsters[currentIndex];
    const monsterDiv = document.createElement("div");
    monsterDiv.id = `monster-${spawnedMonsters.length}`; // Unique ID for each monster
    monsterDiv.style.width = `${monster.size}px`;
    monsterDiv.style.height = `${monster.size}px`;
    monsterDiv.style.backgroundColor = monster.color;
    monsterDiv.style.position = "absolute";
    monsterDiv.style.left = `${Math.random() * (arena.clientWidth - monster.size)}px`;
    monsterDiv.style.top = `${Math.random() * (arena.clientHeight - monster.size)}px`;

    arena.appendChild(monsterDiv); // Add the monster to the arena
    spawnedMonsters.push({ id: monsterDiv.id, speed: monster.speed }); // Add to spawned monsters array
}

// Add event listener for spawning the selected monster
document.getElementById("spawn-monster-button").addEventListener("click", function () {
    const arena = document.querySelector(".arena");
    spawnMonster(arena); // Spawn the currently selected monster
});

// Developer Mode Functionality
document.getElementById("dev-button").addEventListener("click", function () {
    document.getElementById("developer-modal").style.display = "block"; // Show developer modal
});

document.getElementById("dev-password").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const password = document.getElementById("dev-password").value;
        if (password === "dev") {
            devModeActive = true;
            document.getElementById("dev-button").style.display = "none"; // Hide developer button
            document.getElementById("settings-title").innerText = "Settings AND Developer Settings"; // Change the title
            document.getElementById("developer-modal").style.display = "none"; // Hide modal
            document.getElementById("developer-settings").style.display = "block"; // Show developer settings
        } else {
            const errorMessage = document.createElement("p");
            errorMessage.innerText = "Incorrect password. Please try again.";
            document.getElementById("dev-error-message").appendChild(errorMessage);
        }
    }
});

document.getElementById("close-dev-modal").addEventListener("click", function () {
    document.getElementById("developer-modal").style.display = "none"; // Hide modal
});

// Close settings menu
document.getElementById("close-settings").addEventListener("click", function () {
    gamePaused = false; // Unpause the game
    document.getElementById("settings-menu").style.display = "none"; // Hide settings menu
});

// Functionality to remove error messages
function clearErrorMessages() {
    const errorMessages = document.getElementById("dev-error-message");
    while (errorMessages.firstChild) {
        errorMessages.removeChild(errorMessages.firstChild);
    }
}

// Add clear error messages functionality on modal close
document.getElementById("close-dev-modal").addEventListener("click", clearErrorMessages);

// Start the movement loop
requestAnimationFrame(movePlayer);
