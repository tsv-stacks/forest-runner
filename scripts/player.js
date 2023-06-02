class Player {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 37;
    this.x = 0;
    this.y = this.game.height - this.height;
    this.image = document.getElementById("player");
  }
  update() {}
  draw(context) {
    context.fillRect(this.x, this.y, this.width, this.height);
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
