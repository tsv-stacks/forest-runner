import {
  Crouch,
  Fall,
  Idle,
  Jump,
  Running,
  Slide,
  SlideToStand,
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
    ];
    this.currentState = this.states[0];
    this.currentState.enter();
  }
  update(input, deltaTime) {
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

  checkCollision() {}
}

export { Player };
