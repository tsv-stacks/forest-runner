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
    this.hasCollided = false;
    this.isAttacking = false;

    this.attackAnimationCount = 0;
  }

  update(deltaTime) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
        if (this.frameY === 0 || this.frameY === 1) {
          this.attackAnimationCount++;
        }
      }
    } else {
      this.frameTimer += deltaTime;
    }

    if (this.x + this.width + 50 < 0) {
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
    if (this.game.debug) {
      context.strokeStyle = "red";
      context.strokeRect(this.x, this.y, this.viewWidth, this.viewHeight - 80);
    }
  }
}

export class FlyingEye extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.frameY = 3;
    this.maxFrame = 7;
    this.image = document.getElementById("flyingEye");

    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5 - 80;

    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;

    this.hitboxX = this.x + 115;
    this.hitboxY = this.y + 132;
    this.hitboxWidth = 60;
    this.hitboxHeight = 37;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
    this.hitboxX = this.x + 115;
    this.hitboxY = this.y + 132;
    if (this.isAttacking && this.frameY === 3) {
      this.frameY = Math.random() < 0.5 ? 0 : 1;
    } else if (!this.isAttacking) {
      this.frameY = 3;
    }
  }

  draw(context) {
    super.draw(context);
    if (this.game.debug) {
      context.strokeStyle = "blue";
      context.strokeRect(
        this.hitboxX,
        this.hitboxY,
        this.hitboxWidth,
        this.hitboxHeight
      );
    }
  }
}

export class Goblin extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.image = document.getElementById("goblin");
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin - 53;
    this.speedX = 0;
    this.speedY = 0;
    // this.frameY = 3;
    // this.maxFrame = 3;

    // delete
    this.frameY = 0;
    this.maxFrame = 7;

    this.hitboxX = this.x + 125;
    this.hitboxY = this.y + 132;
    this.hitboxWidth = 37;
    this.hitboxHeight = 72;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.hitboxX = this.x + 125;
    this.hitboxY = this.y + 132;

    // if (this.attackAnimationCount <= 0) {
    //   if (this.isAttacking && this.frameY === 3) {
    //     this.frameY = Math.random() < 0.5 ? 0 : 1;
    //     this.maxFrame = 7;
    //   }
    // } else if (this.attackAnimationCount === 1) {
    //   console.log("attacked once");
    //   this.speedX = 0.5;
    //   this.frameY = 4;
    //   this.maxFrame = 7;
    // }
  }

  draw(context) {
    super.draw(context);
    if (this.game.debug) {
      context.strokeStyle = "blue";
      context.strokeRect(
        this.hitboxX,
        this.hitboxY,
        this.hitboxWidth,
        this.hitboxHeight
      );
      if (this.frameY === 0 && (this.frameX === 6 || this.frameX === 7)) {
        context.strokeStyle = "white";
        context.strokeRect(
          this.hitboxX - 55,
          this.hitboxY + 20,
          this.hitboxWidth + 50,
          this.hitboxHeight - 20
        );
      }
      if (this.frameY === 1 && (this.frameX === 6 || this.frameX === 7)) {
        context.strokeStyle = "white";
        context.strokeRect(
          this.hitboxX - 95,
          this.hitboxY + 18,
          this.hitboxWidth + 55,
          this.hitboxHeight - 20
        );
      }
    }
  }
}

export class Mushroom extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.image = document.getElementById("mushroom");
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin - 53;
    this.speedX = 1;
    this.speedY = 0;
    this.frameY = 4;
    this.maxFrame = 7;

    this.hitboxX = this.x + 125;
    this.hitboxY = this.y + 126;
    this.hitboxWidth = 39;
    this.hitboxHeight = 75;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.hitboxX = this.x + 125;
    this.hitboxY = this.y + 126;
    if (this.isAttacking && this.frameY === 4) {
      this.frameY = Math.random() < 0.5 ? 0 : 1;
    } else if (!this.isAttacking) {
      this.frameY = 4;
    }
  }

  draw(context) {
    super.draw(context);
    if (this.game.debug) {
      context.strokeStyle = "blue";
      context.strokeRect(
        this.hitboxX,
        this.hitboxY,
        this.hitboxWidth,
        this.hitboxHeight
      );
    }
  }
}

export class Skeleton extends Enemy {}
