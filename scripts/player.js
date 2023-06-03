class Player {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 37;
    this.x = 0;
    this.y = this.game.height - this.height;
    this.image = document.getElementById("player");
    this.speed = 0;
    this.maxSpeed = 3;
  }
  update(input) {
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
    if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }
  }
  draw(context) {
    context.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

export { Player };
