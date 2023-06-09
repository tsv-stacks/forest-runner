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

    this.markedForDeletion = false;
  }

  update(deltaTime) {
    this.x -= this.speedX;
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

    if (this.x + this.width < 0) {
      this.markedForDeletion = true;
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
    context.strokeStyle = "red";
    context.strokeRect(this.x, this.y, this.viewWidth, this.viewHeight);
  }
}

export class FlyingEye extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.speedX = 2;
    this.speedY = 0;
    this.frameY = 3;
    this.maxFrame = 7;
    this.image = document.getElementById("flyingEye");

    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
  }
  update(deltaTime) {
    super.update(deltaTime);
  }
}

export class Goblin extends Enemy {}

export class Skeleton extends Enemy {}

export class Mushroom extends Enemy {}
