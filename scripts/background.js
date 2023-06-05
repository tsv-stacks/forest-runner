class Layer {
  constructor(game, width, height, speed, image) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }
  update() {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speed;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

export class Background {
  constructor(game) {
    this.game = game;
    this.width = 928;
    this.height = 500;
  }
}
