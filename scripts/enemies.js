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
    this.attackBoxX = 0;
    this.attackBoxY = 0;
    this.attackBoxWidth = 0;
    this.attackBoxHeight = 0;
    this.isDead = false;
    this.vy = 5;
    this.weight = 1;
  }

  death() {
    if (!this.isDead) {
      this.fps = 2;
      this.isDead = true;
      this.hasCollided = true;
      this.frameX = 0;
      this.frameY = 2;
      this.maxFrame = 3;
      this.speedX = 0.2;
      this.hitboxX = 0;
      this.hitboxY = 0;
      this.hitboxWidth = 0;
      this.hitboxHeight = 0;
    } else if (this.isDead && this.frameX === 3 && this.frameY === 2) {
      this.frameX = 3;
    }
  }

  update(deltaTime) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        if (!this.isDead) this.frameX = 0;
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

    if (
      this.y <=
        this.game.height - this.hitboxHeight - this.game.groundMargin - 205 &&
      this.isDead
    ) {
      this.vy += this.weight;
      this.y += this.vy;
    }
    if (
      Math.abs(
        this.y -
          (this.game.height - this.hitboxHeight - this.game.groundMargin - 205)
      ) < 5 &&
      this.isDead
    ) {
      this.y =
        this.game.height - this.hitboxHeight - this.game.groundMargin - 205;
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

  resetAttackBox() {
    this.attackBoxX = 0;
    this.attackBoxY = 0;
    this.attackBoxWidth = 0;
    this.attackBoxHeight = 0;
  }

  onGround() {
    return (
      this.y <=
      this.game.height - this.hitboxHeight - this.game.groundMargin - 53
    );
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
    this.attackFrame = [5, 6];
    this.attackY = [0, 1];
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    if (!this.isDead) this.y += Math.sin(this.angle);
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

    if (this.frameY === 0 && this.attackFrame.includes(this.frameX)) {
      this.attackBoxX = this.hitboxX - 10;
      this.attackBoxY = this.hitboxY + 5;
      this.attackBoxWidth = this.hitboxWidth - 10;
      this.attackBoxHeight = this.hitboxHeight;
    } else if (this.frameY === 1 && this.attackFrame.includes(this.frameX)) {
      this.attackBoxX = this.hitboxX - 15;
      this.attackBoxY = this.hitboxY - 15;
      this.attackBoxWidth = this.hitboxWidth;
      this.attackBoxHeight = this.hitboxHeight + 30;
    } else {
      this.resetAttackBox();
    }

    if (this.game.debug) {
      context.strokeStyle = "blue";
      context.strokeRect(
        this.hitboxX,
        this.hitboxY,
        this.hitboxWidth,
        this.hitboxHeight
      );
      if (
        this.attackY.includes(this.frameY) &&
        this.attackFrame.includes(this.frameX)
      ) {
        context.strokeStyle = "white";
        context.strokeRect(
          this.attackBoxX,
          this.attackBoxY,
          this.attackBoxWidth,
          this.attackBoxHeight
        );
      }
    }
  }

  onGround() {
    return (
      this.y >= this.game.height - this.hitboxHeight - this.game.groundMargin
    );
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
    this.frameY = 3;
    this.maxFrame = 3;
    this.hitboxX = this.x + 125;
    this.hitboxY = this.y + 132;
    this.hitboxWidth = 37;
    this.hitboxHeight = 72;
    this.attackFrame = [6, 7];
    this.attackY = [0, 1];
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.hitboxX = this.x + 125;
    this.hitboxY = this.y + 132;

    if (this.attackAnimationCount <= 0) {
      if (this.isAttacking && this.frameY === 3) {
        this.frameY = Math.random() < 0.5 ? 0 : 1;
        this.maxFrame = 7;
      }
    } else if (this.attackAnimationCount === 1 && !this.isDead) {
      this.speedX = 0.5;
      this.frameY = 4;
      this.maxFrame = 7;
    }
  }

  draw(context) {
    super.draw(context);

    if (this.frameY === 0 && this.attackFrame.includes(this.frameX)) {
      this.attackBoxX = this.hitboxX - 55;
      this.attackBoxY = this.hitboxY + 20;
      this.attackBoxWidth = this.hitboxWidth + 50;
      this.attackBoxHeight = this.hitboxHeight - 20;
    } else if (this.frameY === 1 && this.attackFrame.includes(this.frameX)) {
      this.attackBoxX = this.hitboxX - 95;
      this.attackBoxY = this.hitboxY + 18;
      this.attackBoxWidth = this.hitboxWidth + 55;
      this.attackBoxHeight = this.hitboxHeight - 20;
    } else {
      this.resetAttackBox();
    }

    if (this.game.debug) {
      context.strokeStyle = "blue";
      context.strokeRect(
        this.hitboxX,
        this.hitboxY,
        this.hitboxWidth,
        this.hitboxHeight
      );
      if (
        this.attackY.includes(this.frameY) &&
        this.attackFrame.includes(this.frameX)
      ) {
        context.strokeStyle = "white";
        context.strokeRect(
          this.attackBoxX,
          this.attackBoxY,
          this.attackBoxWidth,
          this.attackBoxHeight
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
    this.speedX = 0.5;
    this.speedY = 0;
    this.frameY = 4;
    this.maxFrame = 7;
    this.hitboxX = this.x + 125;
    this.hitboxY = this.y + 106;
    this.hitboxWidth = 39;
    this.hitboxHeight = 85;
    this.attackFrame = [6, 7];
    this.attackY = [0, 1];
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.hitboxX = this.x + 125;
    this.hitboxY = this.y + 116;

    if (this.attackAnimationCount <= 0) {
      if (this.isAttacking && this.frameY === 4) {
        this.frameY = Math.random() < 0.5 ? 0 : 1;
      }
    } else if (this.attackAnimationCount === 1 && !this.isDead) {
      this.speedX = Math.random() * 0.2 + 0.3;
      this.frameY = 4;
      this.maxFrame = 7;
    }
  }

  draw(context) {
    super.draw(context);

    if (
      this.attackY.includes(this.frameY) &&
      this.attackFrame.includes(this.frameX)
    ) {
      if (this.frameY === 0) {
        this.attackBoxX = this.hitboxX - 50;
      } else {
        this.attackBoxX = this.hitboxX - 60;
      }
      this.attackBoxY = this.hitboxY + 20;
      this.attackBoxWidth = this.hitboxWidth + 30;
      this.attackBoxHeight = this.hitboxHeight - 20;
    } else {
      this.resetAttackBox();
    }

    if (this.game.debug) {
      context.strokeStyle = "blue";
      context.strokeRect(
        this.hitboxX,
        this.hitboxY,
        this.hitboxWidth,
        this.hitboxHeight
      );

      if (
        this.attackY.includes(this.frameY) &&
        this.attackFrame.includes(this.frameX)
      ) {
        context.strokeStyle = "white";
        context.strokeRect(
          this.attackBoxX,
          this.attackBoxY,
          this.attackBoxWidth,
          this.attackBoxHeight
        );
      }
    }
  }
}
