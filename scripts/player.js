import { liveHearts } from "./hud.js";
import {
  CollisionAnimation,
  enemyCheck,
  enemyParticles,
} from "./collisionAnimation.js";
import {
  Crouch,
  Fall,
  Idle,
  Jump,
  Running,
  Slide,
  SlideToStand,
  AttackingGround,
  AttackingAir,
  SlamAir,
  SlamGround,
  Hit,
} from "./playerStates.js";
import { FlyingEye, Goblin, Mushroom } from "./enemies.js";

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
    this.weight = 0.5;
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
      new AttackingAir(this),
      new SlamAir(this),
      new SlamGround(this),
      new Hit(this),
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

    this.attackBoxX = this.hitboxX;
    this.attackBoxY = this.hitboxY;
    this.attackBoxWidth = this.hitboxWidth;
    this.attackBoxHeight = this.hitboxHeight;

    this.attackHitbox = [
      {
        frameY: 0,
        attackXFrames: [1, 2, 3],
        attackBoxX: 0,
        attackBoxY: -25,
        attackBoxWidth: 35,
        attackBoxHeight: 25,
      },
      {
        frameY: 1,
        attackXFrames: [0, 1, 2],
        attackBoxX: 0,
        attackBoxY: -25,
        attackBoxWidth: 35,
        attackBoxHeight: 25,
      },
      {
        frameY: 2,
        attackXFrames: [0, 1, 2, 3],
        attackBoxX: -35,
        attackBoxY: 5,
        attackBoxWidth: 65,
        attackBoxHeight: 5,
      },
      {
        frameY: 3,
        attackXFrames: [0, 1],
        attackBoxX: -20,
        attackBoxY: -5,
        attackBoxWidth: 25,
        attackBoxHeight: 33,
      },
      {
        frameY: 4,
        attackXFrames: [2, 3, 4],
        attackBoxX: 0,
        attackBoxY: -25,
        attackBoxWidth: 35,
        attackBoxHeight: 25,
      },
      {
        frameY: 5,
        attackXFrames: [2, 3, 4],
        attackBoxX: -10,
        attackBoxY: -5,
        attackBoxWidth: 40,
        attackBoxHeight: 15,
      },
      {
        frameY: 6,
        attackXFrames: [2, 3, 4],
        attackBoxX: -30,
        attackBoxY: 5,
        attackBoxWidth: 60,
        attackBoxHeight: 5,
      },
    ];
  }

  update(input, deltaTime) {
    this.hitboxX = this.x + 40;
    this.hitboxY = this.y + 15;

    this.setAttackBox();
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
      let currentAttack = this.attackHitbox.find(
        (e) => e.frameY === this.frameY
      );
      console.log(
        this.currentState.attacks[this.currentState.attackNum].soundPath
      );
      console.log(this.currentState);
      console.log(this.isAttacking);
      let audio = new Audio(
        this.currentState.attacks[this.currentState.attackNum].soundPath
      );
      audio.volume = 0.5;
      audio.play();
    }

    if (
      this.attackYFrames.includes(this.frameY) &&
      this.frameX ===
        this.currentState.attacks[this.currentState.attackNum].maxFrame
    ) {
      this.currentState.attackNum === this.currentState.attacks.length - 1
        ? (this.currentState.attackNum = 0)
        : this.currentState.attackNum++;
      if (this.frameY == 3) {
        return;
      }
      this.isAttacking = false;
      this.currentState = this.states[0];
      this.currentState.enter();
      this.resetAttackBox();
    }
    //  collision sprites
    if (this.game.collisions.length > 0) {
      this.game.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
        if (collision.markedForDeletion) this.game.collisions.splice(index, 1);
      });
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
      let currentAttack = this.attackHitbox.find(
        (e) => e.frameY === this.frameY
      );
      if (
        this.attackYFrames.includes(this.frameY) &&
        currentAttack.attackXFrames.includes(this.frameX)
      ) {
        context.strokeStyle = "red";
        context.strokeRect(
          this.attackBoxX,
          this.attackBoxY,
          this.attackBoxWidth,
          this.attackBoxHeight
        );
      }
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

  setAttackBox() {
    let currentAttack = this.attackHitbox.find((e) => e.frameY === this.frameY);
    if (currentAttack) {
      this.attackBoxX = this.hitboxX + currentAttack.attackBoxX;
      this.attackBoxY = this.hitboxY + currentAttack.attackBoxY;
      this.attackBoxHeight = this.hitboxHeight + currentAttack.attackBoxHeight;
      this.attackBoxWidth = this.hitboxWidth + currentAttack.attackBoxWidth;
    }
  }

  resetAttackBox() {
    this.attackBoxX = 0;
    this.attackBoxY = 0;
    this.attackBoxWidth = 0;
    this.attackBoxHeight = 0;
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      let currentAttack = this.attackHitbox.find(
        (e) => e.frameY === this.frameY
      );
      // player attacking enemy
      if (
        !enemy.isDead &&
        this.attackYFrames.includes(this.frameY) &&
        currentAttack.attackXFrames.includes(this.frameX)
      ) {
        if (
          enemy.hitboxX < this.attackBoxX + this.attackBoxWidth &&
          enemy.hitboxX + enemy.hitboxWidth > this.attackBoxX &&
          enemy.hitboxY < this.attackBoxY + this.attackBoxHeight &&
          enemy.hitboxY + enemy.hitboxHeight > this.attackBoxY
        ) {
          let enemyNum = enemyCheck(enemy);

          console.log("enemy hit");

          this.game.collisions.push(
            new CollisionAnimation(
              this.game,
              enemy.hitboxX + enemy.hitboxWidth * 0.5 - 20,
              enemy.hitboxY + enemy.hitboxHeight * 0.5 - 10,
              enemyParticles[enemyNum].spriteHeight,
              enemyParticles[enemyNum].spriteWidth,
              enemyParticles[enemyNum].image,
              enemyParticles[enemyNum].maxFrame,
              enemyParticles[enemyNum].fps,
              enemyParticles[enemyNum].sizeModifier
            )
          );
          console.log(this.game.collisions);
          enemy.death();
        }
      }

      if (!enemy.hasCollided && !this.isAttacking) {
        // enemy attacking player
        if (
          enemy.attackBoxX < this.hitboxX + this.hitboxWidth &&
          enemy.attackBoxX + enemy.attackBoxWidth > this.hitboxX &&
          enemy.attackBoxY < this.hitboxY + this.hitboxHeight &&
          enemy.attackBoxY + enemy.attackBoxHeight > this.hitboxY &&
          (enemy.frameY === 0 || enemy.frameY === 1)
        ) {
          console.log("attacked");
          this.setState(11, 0);
          enemy.hasCollided = true;
          this.lives--;
        }
        // enemy colliding with player
        if (
          enemy.hitboxX < this.hitboxX + this.hitboxWidth &&
          enemy.hitboxX + enemy.hitboxWidth > this.hitboxX &&
          enemy.hitboxY < this.hitboxY + this.hitboxHeight &&
          enemy.hitboxY + enemy.hitboxHeight > this.hitboxY
        ) {
          console.log("collision");
          this.setState(11, 0);
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
