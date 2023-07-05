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
      this.muted = true;
      this.gameStarted = false;
    }
    update(deltaTime) {
      if (!this.player.isDead) {
        this.background.update();
      }
      this.player.update(this.input.keys, deltaTime);
      // enemies
      if (this.enemyTimer > this.enemyInterval) {
        if (this.gameStarted) this.addEnemy();
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
  document.getElementById("restart-btn").addEventListener("click", restartBtn);
  document
    .getElementById("game-container__start-game")
    .addEventListener("click", startGameBtn);

  function startGameBtn() {
    document.getElementById("game-container__start-game").style.display =
      "none";
    document.getElementById("game-container__logo-text").style.display = "none";
    document.getElementById("btn-container").style.top = "93%";
    game.gameStarted = true;
  }

  function restartBtn() {
    window.confirm(
      "This will restart the game and reset your score back to 0. \nYour current score will not be submitted.\n\nDo you still wish to restart your game?"
    );
    // use t/f logic on confirm()
  }

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
    if (!game.muted) {
      console.log("muted");
      document.getElementById(
        "mute-btn__icon"
      ).innerHTML = `<path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77c0-4.28-2.99-7.86-7-8.77z"/>`;
      game.muted = true;
    } else if (game.muted) {
      console.log("unmuted");
      document.getElementById("mute-btn__icon").innerHTML = `<path
      fill="white"
      d="M4.34 2.93L2.93 4.34L7.29 8.7L7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06a8.94 8.94 0 0 0 3.61-1.75l2.05 2.05l1.41-1.41L4.34 2.93zM10 15.17L7.83 13H5v-2h2.83l.88-.88L10 11.41v3.76zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76zm4.5 8A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"
    />`;
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
