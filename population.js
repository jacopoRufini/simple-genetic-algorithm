class Element {

  constructor() {
    this.moves = [];
    this.nmoves = 0;
    this.fitness = 0;
  }

  getMoves() {
    let x = 0, y = 0;
    for (let i = 0; i < MAX_MOVES; i++) {
      if (x == MAX_MOVES/2) this.moves[i] = 0;
      else if (y == MAX_MOVES/2) this.moves[i] = 1;
      else {
        const move = floor(random(0,2));
        if (move == 0) y++
        else x++;
        this.moves[i] = move;
      }
    }
  }

  crossover(p1,p2) {
    for (let i = 0; i < MAX_MOVES; i++) {
      if (i < MAX_MOVES/2) {
        this.moves[i] = p1.moves[i];
      } else this.moves[i] = p2.moves[i];
    }
    return this;
  }

  nextMove() { return this.moves[this.nmoves++]; }
  hasDone() { return this.nmoves > this.fitness; }
}

class Population {
  constructor() {
    this.elements = [];
  }

  default() {
    for (let i = 0; i < populationSize; i++) {
      this.elements[i] = new Element();
      this.elements[i].getMoves();
    }
  }

  calcFitness(obstacles) {
    let max = this.elements[0];
    max.fitness = this.simulate(max);
    for (let i = 1; i < this.elements.length; i++) {
      const element = this.elements[i];
      element.fitness = this.simulate(element);
      if (element.fitness > max.fitness) {
        max = element;
      }
    }
    return max;
  }

  simulate(element) {
    let x = 0, y = 0, score = 0, endx = false, endy = false;
    for (let i = 0; i < element.moves.length; i++) {
      const move = element.moves[i];

      if (endx) {
        y += BLOCK;
      } else if (endy) {
        x += BLOCK;
      } else {
        if (move == 0) {
          y += BLOCK;
        } else {
          x += BLOCK;
        }
      }
      for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (obstacle.x == x && obstacle.y == y) {
          return score;
        }
      }
      score++;
    }

    endx = x == ENDX;
    endy = y == ENDY;

    if (endx && endy) {
      return MAX_MOVES;
    }
  }

  crossover() {
    const matingPool = [];
    for (let i = 0; i < this.elements.length; i++) {
      const elem = this.elements[i];
      const n = elem.fitness * elem.fitness;
      for (let j = 0; j < n; j++) {
        matingPool.push(elem);
      }
    }
    this.elements = [];
    for (let i = 0; i < populationSize; i++) {
      const p1 = matingPool[floor(random(matingPool.length))];
      const p2 = matingPool[floor(random(matingPool.length))];
      const elem = new Element();
      this.elements[i] = elem.crossover(p1,p2);
      this.mutation(elem);
    }

  }

  mutation(elem) {
    const i = random(1);
    if (i < mutationRate) {
      const k = floor(random(MAX_MOVES));
      if (elem.moves[k] == 0) {
        elem.moves[k] = 1
      } else elem.moves[k] = 0;
    }
  }
}
