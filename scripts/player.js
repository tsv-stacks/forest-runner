class Player {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 37;

    this.scale = 2;
    this.viewWidth = this.width * this.scale;
    this.viewHeight = this.height * this.scale;

    this.x = 0;
    this.y = this.game.height - this.viewHeight;
    this.vy = 0;
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
    if (this.x > this.game.width - this.viewWidth) {
      this.x = this.game.width - this.viewWidth;
    }
    // vertical movement
    this.y += this.vy;
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
      this.viewWidth,
      this.viewHeight
    );
  }
  onGround() {
    return this.y >= this.game.height - this.height;
  }
}

export { Player };
