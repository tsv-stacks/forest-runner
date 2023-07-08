export function liveHearts(context, heart, gameWidth, gameHeight) {
  let heartImg = new Image();
  if (heart === 3) {
    heartImg.src = "./assets/hearts/heart-3.png";
  } else if (heart === 2) {
    heartImg.src = "./assets/hearts/heart-2.png";
  } else if (heart === 1) {
    heartImg.src = "./assets/hearts/heart-1.png";
  } else if (heart === 0) {
    heartImg.src = "./assets/hearts/heart-0-2.png";
    return context.drawImage(heartImg, 0, 0, 236, 76, 20, 60, 150, 50);
  }
  context.drawImage(
    heartImg,
    0,
    0,
    192,
    76,
    gameWidth - 180,
    gameHeight - 480,
    150,
    50
  );
}

export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 25;
    this.fontFamily = "'Press Start 2P', cursive";
  }

  draw(context) {
    if (this.game.gameStarted) {
      context.font = `${this.fontSize}px ${this.fontFamily}, sans-serif`;
      context.textAlign = "left";
      context.fillStyle = this.game.fontColor;
      context.fillText(`SCORE: ${this.game.score}`, 30, 60);
    }
  }
}
