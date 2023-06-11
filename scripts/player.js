import { liveHearts } from "./hud.js";
import {
  Crouch,
  Fall,
  Idle,
  Jump,
  Running,
  Slide,
  SlideToStand,
  AttackingGround,
} from "./playerStates.js";

class Player {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 37;

    this.scale = 2;
    this.viewWidth = this.width * this.scale;
    this.viewHeight = this.height * this.scale;

    this.x = 0;
    this.y = this.game.height - this.viewHeight - this.game.groundMargin;
    this.vy = 0;
    this.weight = 1;
    this.image = document.getElementById("player");
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 3;
    this.speed = 0;
    this.maxSpeed = 2;
    this.fps = 10;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    this.states = [
      new Idle(this),
      new Running(this),
      new Crouch(this),
      new Jump(this),
      new Fall(this),
      new Slide(this),
      new SlideToStand(this),
      new AttackingGround(this),
    ];
    this.currentState = this.states[0];
    this.currentState.enter();

    this.hitboxX = this.x + 40;
    this.hitboxY = this.y + 15;
    this.hitboxWidth = 35;
    this.hitboxHeight = 57;

    this.lives = 3;

    this.isAttacking = false;
    this.attackYFrames = [0, 1, 2, 3, 4, 5, 6];

    this.attackBoxX = 0;
    this.attackBoxY = 0;
    this.attackBoxWidth = 0;
    this.attackBoxHeight = 0;
  }

  update(input, deltaTime) {
    this.hitboxX = this.x + 40;
    this.hitboxY = this.y + 15;
    this.checkCollision();
    this.attackRange();
    this.currentState.handleInput(input);

    this.x += this.speed;
    // horizontal movement
    if (input.includes("ArrowRight")) {
      this.speed = this.maxSpeed;
    } else if (input.includes("ArrowLeft")) {
      this.speed = -this.maxSpeed;
    } else {
      this.speed = 0;
    }

    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > this.game.width - this.viewWidth) {
      this.x = this.game.width - this.viewWidth;
    }
    // vertical movement
    this.y += this.vy;

    if (!this.onGround()) {
      this.vy += this.weight;
    } else {
      this.vy = 0;
    }

    // sprite animation
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

    // attack
    if (this.attackYFrames.includes(this.frameY) && !this.isAttacking) {
      this.isAttacking = true;
      let audio = new Audio(
        this.currentState.groundAttacks[this.currentState.attackNum].soundPath
      );
      audio.volume = 0.5;
      audio.play();
    }

    if (
      this.attackYFrames.includes(this.frameY) &&
      this.frameX ===
        this.currentState.groundAttacks[this.currentState.attackNum].maxFrame
    ) {
      this.currentState.attackNum === 2
        ? (this.currentState.attackNum = 0)
        : this.currentState.attackNum++;
      this.isAttacking = false;
      this.currentState = this.states[0];
      this.currentState.enter();
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
      context.strokeStyle = "white";
      context.strokeRect(this.x + 40, this.y + 15, 35, 57);
    }
    liveHearts(context, this.lives, this.game.width, this.game.height);
  }

  onGround() {
    return (
      this.y >= this.game.height - this.viewHeight - this.game.groundMargin
    );
  }

  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = speed * this.game.maxSpeed;
    this.currentState.enter();
  }

  resetAttackBox() {
    this.attackBoxX = 0;
    this.attackBoxY = 0;
    this.attackBoxWidth = 0;
    this.attackBoxHeight = 0;
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (!enemy.hasCollided) {
        if (
          enemy.hitboxX < this.hitboxX + this.hitboxWidth &&
          enemy.hitboxX + enemy.hitboxWidth > this.hitboxX &&
          enemy.hitboxY < this.hitboxY + this.hitboxHeight &&
          enemy.hitboxY + enemy.hitboxHeight > this.hitboxY
        ) {
          console.log("collision");
          enemy.hasCollided = true;
          this.lives--;
        }

        if (
          enemy.attackBoxX < this.hitboxX + this.hitboxWidth &&
          enemy.attackBoxX + enemy.attackBoxWidth > this.hitboxX &&
          enemy.attackBoxY < this.hitboxY + this.hitboxHeight &&
          enemy.attackBoxY + enemy.attackBoxHeight > this.hitboxY &&
          (enemy.frameY === 0 || enemy.frameY === 1)
        ) {
          console.log("attacked");
          enemy.hasCollided = true;
          this.lives--;
        }
      }
    });
  }

  attackRange() {
    this.game.enemies.forEach((enemy) => {
      if (!enemy.isAttacking) {
        if (
          enemy.x < this.hitboxX + this.hitboxWidth &&
          enemy.x + enemy.viewWidth > this.hitboxX &&
          enemy.y < this.hitboxY + this.hitboxHeight &&
          enemy.y + enemy.viewHeight - 80 > this.hitboxY
        ) {
          enemy.isAttacking = true;
        }
      }
    });
  }
}

export { Player };
