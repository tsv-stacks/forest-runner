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
    if (this.x < -this.width) {
      this.x = 0;
    } else {
      this.x -= this.game.speed * this.speed;
    }
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

export class Background {
  constructor(game) {
    this.game = game;
    this.width = 928;
    this.height = 500;
    this.layer10image = document.getElementById("layer10");
    this.layer10 = new Layer(
      this.game,
      this.width,
      this.height,
      1,
      this.layer10image
    );
    this.layer10.x = 0;
    console.log(this.layer10);
    this.backgroundLayers = [this.layer10];
  }

  update() {
    this.backgroundLayers.forEach((layer) => {
      layer.update();
    });
  }

  draw(context) {
    this.backgroundLayers.forEach((layer) => {
      layer.draw(context);
    });
  }
}
