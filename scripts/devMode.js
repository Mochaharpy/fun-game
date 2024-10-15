export function initialize(devButton, player, enemy) {
    let isActive = false;

    devButton.addEventListener('click', () => {
        const code = prompt("Enter dev code:");
        if (code === "dev") {
            isActive = true;
        }
    });

    document.addEventListener('click', (event) => {
        if (isActive) {
            summonEnemy(event.clientX - 25, event.clientY - 25); // Adjust position to center the enemy
        }
    });

    function summonEnemy(x, y) {
        if (enemy.style.display === 'none') {
            enemy.style.left = `${x}px`;
            enemy.style.top = `${y}px`;
            enemy.style.display = 'block';
            monsterHealth = 50; // Reset health
            isMonsterAlive = true;
        }
    }
}
