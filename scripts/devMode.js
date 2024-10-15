export function initialize(devButton, player, monsters) {
    let isActive = false;

    devButton.addEventListener('click', () => {
        if (!isActive) {
            const code = prompt("Enter dev code:");
            if (code === "dev") {
                isActive = true;
                alert("Dev mode activated! Click to summon enemies.");
            } else {
                alert("Incorrect code! Please try again.");
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (isActive) {
            summonEnemy(event.clientX - 25, event.clientY - 25);
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

        monsters.push({
            element: newMonster,
            health: 50,
            speed: 1,
            expAmount: Math.floor(Math.random() * 20) + 100,
            isAlive: true,
        });
    }
}
