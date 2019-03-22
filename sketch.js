const WIDTH = 620;
const HEIGHT = 620;
const MAX_MOVES = Math.floor(WIDTH / 30) + Math.floor(HEIGHT / 30);
const ENDX = WIDTH - 20;
const ENDY = HEIGHT - 20;
const BLOCK = 30;

let x,y;
let obstacles;
let population;
let best;
let generations;

let populationSize, mutationRate, difficultyFactor;

function setup() {
  createCanvas(WIDTH, HEIGHT);

  x = 0;
  y = 0;
  generations = 0;

  populationSize = document.getElementById('populationSize').value;
  mutationRate = document.getElementById('mutationRate').value;
  difficultyFactor = document.getElementById('difficultyFactor').value;

  population = new Population();
  population.default();
  generateObstacles();
  document.getElementById('start').onclick = () => {setup(); loop()};
  document.getElementById('stop').onclick = () => {noLoop()};
  noLoop();
}

function draw() {
  background(0);
  best = population.calcFitness(obstacles);

  //spawning obstacles
  for (let i = 0; i < obstacles.length; i++) {
    fill(color(255,0,0));
    const obstacle = obstacles[i];
    rect(obstacle.x, obstacle.y, 20, 20);
  }

  //win
  fill(color(0,255,0));
  rect(ENDX,ENDY,20,20);

  //player
  fill(color(0,70,255));
  rect(x,y,20,20);

  const move = best.nextMove();
  if (move == 0) y += BLOCK;
  else x += BLOCK;
  if (best.hasDone()) {
    if (best.fitness == MAX_MOVES) {
      noLoop();
    } else {
      x = 0; y = 0;
      population.crossover();
    }
    document.getElementById('generations').innerHTML = "Generations: " + generations++;
    document.getElementById('fitness').innerHTML = "Best fitness: " + best.fitness;
  }
}

function generateObstacles() {
  obstacles = [];
  for (let i = 0; i < floor(MAX_MOVES * difficultyFactor); i++) {
    obstacles.push({x: floor(random(1,MAX_MOVES/2)) * BLOCK, y: floor(random(0,MAX_MOVES/2)) * BLOCK});
  }
}
