import { FlyingEye, Goblin, Mushroom } from "./enemies.js";

export class CollisionAnimation {
  constructor(
    game,
    x,
    y,
    spHeight,
    spWidth,
    image,
    maxFrame,
    fps,
    sizeModifier
  ) {
    this.game = game;
    this.image = image;
    this.spriteHeight = spHeight;
    this.spriteWidth = spWidth;
    this.sizeModifier = (Math.random() + 0.5) * sizeModifier;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x - this.width * 0.5;
    this.y = y - this.width * 0.5;
    this.frameX = 0;
    this.maxFrame = maxFrame;
    this.markedForDeletion = false;
    this.fps = fps;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width * 2,
      this.height * 2
    );

    if (this.game.debug) {
      context.strokeStyle = "orange";
      context.strokeRect(this.x, this.y, this.width * 2, this.height * 2);
    }
  }

  update(deltaTime) {
    this.x -= this.game.speed;

    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    if (this.frameX > this.maxFrame) this.markedForDeletion = true;
  }
}

export const enemyParticles = [
  {
    spriteHeight: 48,
    spriteWidth: 48,
    image: document.getElementById("enemy-eye-particle"),
    maxFrame: 4,
    fps: 15,
    sizeModifier: 1,
  },
  {
    spriteHeight: 50,
    spriteWidth: 50,
    image: document.getElementById("mushroom-particle"),
    maxFrame: 3,
    fps: 12,
    sizeModifier: 1,
  },
  {
    spriteHeight: 100,
    spriteWidth: 100,
    image: document.getElementById("goblin-particle"),
    maxFrame: 5,
    fps: 15,
    sizeModifier: 0.5,
  },
];

export function enemyCheck(enemy) {
  if (enemy instanceof FlyingEye) {
    return 0;
  } else if (enemy instanceof Mushroom) {
    return 1;
  } else if (enemy instanceof Goblin) {
    return 2;
  }
}
