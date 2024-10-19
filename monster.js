let monsters = [
  { name: "Goblin", color: "green", speed: 1.3, damage: 5, health: 20, size: 40 },
  {name: "Troll", color: "grey", speed: 1.15, damage: 10, health: 50, size: 60,},
  {name: "Dragon", color: "red", speed: 1.5, damage: 15, health: 100, size: 80,},
  {name: "Zombie",color: "darkgreen",speed: 1.2,damage: 7,health: 30,size: 50,},
  {name: "Skeleton",color: "grey",speed: 1.1,damage: 8,health: 25,size: 45,},
  {name: "slow control monster",color: "black",speed: 0.1,damage: 1,health: 1,size: 10,},
];

let currentIndex = 0;

function cycleMonsters() {
  currentIndex = (currentIndex + 1) % monsters.length;
  return monsters[currentIndex];
}

export { monsters, cycleMonsters };
