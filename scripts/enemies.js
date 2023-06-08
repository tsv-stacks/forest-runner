class Enemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 10;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }

  update() {}

  draw() {}
}

class FlyingEye extends Enemy {}

class Goblin extends Enemy {}

class Skeleton extends Enemy {}

class Mushroom extends Enemy {}
