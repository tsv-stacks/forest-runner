class Enemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 10;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    this.width = 150;
    this.height = 150;

    this.scale = 2;
    this.viewWidth = this.width * this.scale;
    this.viewHeight = this.height * this.scale;
  }

  update(deltaTime) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;

      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.viewWidth,
      this.viewHeight
    );
  }
}

export class FlyingEye extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.speedX = 2;
    this.maxFrame = 8;

    this.x = 200;
    this.y = 200;
  }
  update(deltaTime) {
    super.update(deltaTime);
  }
}

export class Goblin extends Enemy {}

export class Skeleton extends Enemy {}

export class Mushroom extends Enemy {}
