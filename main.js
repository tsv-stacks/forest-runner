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

      this.paused = false;
      this.muted = false;
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

  // Button Logic
  document.getElementById("pause-btn").addEventListener("click", pauseBtn);
  document.getElementById("mute-btn").addEventListener("click", muteBtn);

  function pauseBtn() {
    console.log(document.getElementById("pause-btn__icon").innerHTML);
    if (!game.paused) {
      console.log("paused");
      document.getElementById("pause-btn__icon").innerHTML =
        '<path fill="white" d="M8.5 8.64L13.77 12L8.5 15.36V8.64M6.5 5v14l11-7"/>';
      game.paused = true;
    } else if (game.paused) {
      console.log("unpaused");
      game.paused = false;
      document.getElementById("pause-btn__icon").innerHTML =
        '<path fill="white" d="M13 19V5h6v14h-6Zm-8 0V5h6v14H5Zm10-2h2V7h-2v10Zm-8 0h2V7H7v10ZM7 7v10V7Zm8 0v10V7Z"></path>';
      animate(lastTime);
    }
    document.getElementById("pause-btn").blur();
  }

  function muteBtn(e) {
    console.log(e.target);
    if (!game.muted) {
      console.log("muted");
      game.muted = true;
    } else if (game.muted) {
      console.log("unmuted");
      game.muted = false;
    }
    document.getElementById("mute-btn").blur();
  }

  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    if (!game.paused) requestAnimationFrame(animate);
  }

  animate(0);
});
