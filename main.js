import { Player } from "./scripts/player.js";
import InputHandler from "./scripts/input.js";
import { Background } from "./scripts/background.js";
import { FlyingEye, Goblin, Mushroom } from "./scripts/enemies.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  canvas.width = 750;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 51;
      this.speed = 0.5;
      this.maxSpeed = 2;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.enemies = [];
      this.collisions = [];
      this.enemyTimer = 0;
      this.enemyInterval = 2000;
      this.debug = true;
    }
    update(deltaTime) {
      if (!this.player.isDead) {
        this.background.update();
      }
      this.player.update(this.input.keys, deltaTime);
      // enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion) {
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });
    }
    draw(context) {
      this.background.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      if (this.collisions.length > 0) {
        this.collisions.forEach((collision, index) => {
          collision.draw(context);
        });
      }
      this.player.draw(context);
    }
    addEnemy() {
      // if (this.speed > 0 && Math.random() < 0.5) {
      //   this.enemies.push(new Mushroom(this));
      //   const hasGoblin = this.enemies.find((enemy) => enemy instanceof Goblin);
      //   if (!hasGoblin) {
      //     this.enemies.push(new Goblin(this));
      //   }
      // }
      // this.enemies.push(new Mushroom(this));
      if (!this.player.isDead) {
        this.enemies.push(new FlyingEye(this));
      }
      // this.enemies.push(new Goblin(this));
      console.log(this.enemies);
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    requestAnimationFrame(animate);
  }

  animate(0);
});
