import { Player } from "./scripts/player.js";
import InputHandler from "./scripts/input.js";
import { Background } from "./scripts/background.js";
import { FlyingEye, Goblin, Mushroom } from "./scripts/enemies.js";
import { UI } from "./scripts/hud.js";

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
      this.UI = new UI(this);
      this.enemies = [];
      this.collisions = [];
      this.enemyTimer = 0;
      this.enemyInterval = 2000;
      this.debug = false;
      this.paused = false;
      this.muted = false;
      this.gameStarted = false;

      this.score = 0;
      this.fontColor = "#61953f";
      this.gameover = false;
      this.showingGuide = false;
    }

    update(deltaTime) {
      if (!this.player.isDead) {
        this.background.update();
      } else {
        this.over();
      }
      this.player.update(this.input.keys, deltaTime);
      // enemies
      if (this.enemyTimer > this.enemyInterval) {
        if (this.gameStarted) {
          this.addEnemy();
          if (!this.player.isDead) this.score += 5;
        }
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
      this.UI.draw(context);
    }

    addEnemy() {
      if (!this.player.isDead) {
        let mushroomProbability = 0.4;
        let goblinProbability = 0.2;
        let flyingEyeProbability = 0.8;

        if (game.score > 500) {
          mushroomProbability = 0.5;
          goblinProbability = 0.3;
          flyingEyeProbability = 0.9;
        } else if (game.score > 1000) {
          mushroomProbability = 0.6;
          goblinProbability = 0.4;
          flyingEyeProbability = 1;
        } else if (game.score > 1500) {
          mushroomProbability = 0.7;
          goblinProbability = 0.5;
          flyingEyeProbability = 1;
        } else if (game.score > 2000) {
          mushroomProbability = 0.8;
          goblinProbability = 0.6;
          flyingEyeProbability = 1;
        }

        const randomValue = Math.random();

        if (this.speed > 0 && randomValue < mushroomProbability) {
          this.enemies.push(new Mushroom(this));
        }

        if (randomValue < goblinProbability) {
          const hasGoblin = this.enemies.find(
            (enemy) => enemy instanceof Goblin
          );
          if (!hasGoblin) {
            this.enemies.push(new Goblin(this));
          }
        }

        if (randomValue < flyingEyeProbability) {
          this.enemies.push(new FlyingEye(this));
        }
      }
    }

    over() {
      this.gameover = true;
      document.getElementById("game-container__game-over").style.display =
        "block";
      document.getElementById("game-container__try-again").style.display =
        "block";
      document.getElementById("btn-container").style.top = "53%";
      playBackgroundMusic();
    }

    restart() {
      if (!game.muted) gameStartSound.play();
      this.player.reset();
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.score = 0;
      document.getElementById("game-container__game-over").style.display =
        "none";
      document.getElementById("game-container__try-again").style.display =
        "none";
      document.getElementById("btn-container").style.top = "93%";
      this.enemies = [];
      this.gameover = false;
      playBackgroundMusic();
    }
  }

  const bgMusic = document.getElementById("bgMusic");

  function playBackgroundMusic() {
    if (!game.muted && game.gameover) {
      bgMusic.volume = 0.1;
      bgMusic.loop = false;
      bgMusic.play();
    } else if (!game.muted && !game.gameover) {
      bgMusic.volume = 0.2;
      bgMusic.loop = true;
      bgMusic.play();
    } else if (game.muted) {
      bgMusic.pause();
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  const clickOpen = new Audio("./assets/sounds/click-open.mp3");
  clickOpen.volume = 0.8;
  const clickClose = new Audio("./assets/sounds/click-close.mp3");
  clickClose.volume = 0.8;
  const gameStartSound = new Audio("./assets/sounds/game-start.mp3");
  gameStartSound.volume = 0.8;

  // Button Logic
  document.getElementById("pause-btn").addEventListener("click", pauseBtn);
  document.getElementById("mute-btn").addEventListener("click", muteBtn);
  document.getElementById("restart-btn").addEventListener("click", restartBtn);
  document
    .getElementById("game-container__start-game")
    .addEventListener("click", startGameBtn);
  document.getElementById("info-btn").addEventListener("click", showGuide);

  function showGuide() {
    if (!this.showingGuide) {
      this.showingGuide = true;
      game.paused = true;
      if (!game.muted) clickOpen.play();
      document.getElementById("game-guide").style.display = "grid";
      document.getElementById("info-btn-svg").style.backgroundColor = "white";
      document.getElementById("info-btn-svg-path").style.fill = "black";
    } else {
      this.showingGuide = false;
      game.paused = false;
      if (!game.muted) clickClose.play();
      document.getElementById("game-guide").style.display = "none";
      document.getElementById("info-btn-svg").style.backgroundColor = "black";
      document.getElementById("info-btn-svg-path").style.fill = "white";
      animate(lastTime);
    }
    document.getElementById("info-btn").blur();
  }

  function startGameBtn() {
    if (!game.muted) gameStartSound.play();
    document.getElementById("game-container__start-game").style.display =
      "none";
    document.getElementById("game-container__logo-text").style.display = "none";
    document.getElementById("btn-container").style.top = "93%";
    game.gameStarted = true;
    playBackgroundMusic();
  }

  function restartBtn() {
    if (game.gameStarted) {
      if (!game.muted) clickOpen.play();
      let restartConfirmation = window.confirm(
        "This will restart the game and reset your score back to 0. \nYour current score will not be submitted.\n\nDo you still wish to restart your game?"
      );
      if (restartConfirmation) {
        if (!game.muted) clickOpen.play();
        game.restart();
        if (game.paused) {
          game.paused = false;
          if (!game.muted) clickOpen.play();
          document.getElementById("pause-btn__icon").innerHTML =
            '<path fill="white" d="M13 19V5h6v14h-6Zm-8 0V5h6v14H5Zm10-2h2V7h-2v10Zm-8 0h2V7H7v10ZM7 7v10V7Zm8 0v10V7Z"></path>';
          animate(lastTime);
        }
      } else {
        if (!game.muted) clickClose.play();
        return;
      }
      document.getElementById("restart-btn").blur();
    }
    document.getElementById("restart-btn").blur();
  }

  function pauseBtn() {
    if (!game.paused) {
      if (!game.muted) clickClose.play();
      document.getElementById("pause-btn__icon").innerHTML =
        '<path fill="white" d="M8.5 8.64L13.77 12L8.5 15.36V8.64M6.5 5v14l11-7"/>';
      game.paused = true;
    } else if (game.paused) {
      game.paused = false;
      if (!game.muted) clickOpen.play();
      document.getElementById("pause-btn__icon").innerHTML =
        '<path fill="white" d="M13 19V5h6v14h-6Zm-8 0V5h6v14H5Zm10-2h2V7h-2v10Zm-8 0h2V7H7v10ZM7 7v10V7Zm8 0v10V7Z"></path>';
      animate(lastTime);
    }

    document.getElementById("pause-btn").blur();
  }

  function muteBtn() {
    if (!game.muted) {
      document.getElementById("mute-btn__icon").innerHTML = `<path
      fill="white"
      d="M4.34 2.93L2.93 4.34L7.29 8.7L7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06a8.94 8.94 0 0 0 3.61-1.75l2.05 2.05l1.41-1.41L4.34 2.93zM10 15.17L7.83 13H5v-2h2.83l.88-.88L10 11.41v3.76zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76zm4.5 8A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"
    />`;
      game.muted = true;
      playBackgroundMusic();
    } else if (game.muted) {
      clickOpen.play();
      document.getElementById(
        "mute-btn__icon"
      ).innerHTML = `<path fill="white" d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77c0-4.28-2.99-7.86-7-8.77z"/>`;
      game.muted = false;
      playBackgroundMusic();
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
