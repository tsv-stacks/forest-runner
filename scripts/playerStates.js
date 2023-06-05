const states = {
  IDLE: 0,
  RUNNING: 1,
  CROUCH: 2,
  JUMP: 3,
  FALL: 4,
  SLIDE: 5,
  SLIDETOSTAND: 6,
  ROLL: 10,
};

class State {
  constructor(state) {
    this.state = state;
  }
}

export class Idle extends State {
  constructor(player) {
    super("IDLE");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 12;
    this.player.maxFrame = 3;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING);
    } else if (input.includes("ArrowDown")) {
      this.player.setState(states.CROUCH);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP);
    }
  }
}

export class Crouch extends State {
  constructor(player) {
    super("CROUCH");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 7;
    this.player.maxFrame = 3;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP);
    }
  }
}

export class Running extends State {
  constructor(player) {
    super("RUNNING");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 16;
    this.player.maxFrame = 5;
  }
  handleInput(input) {
    if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP);
    } else if (input.includes("ArrowRight") && input.includes("ArrowDown")) {
      this.player.setState(states.SLIDE);
    } else if (!input.includes("ArrowLeft") && !input.includes("ArrowRight")) {
      this.player.setState(states.IDLE);
    }
  }
}

export class Jump extends State {
  constructor(player) {
    super("JUMP");
    this.player = player;
  }
  enter() {
    if (this.player.onGround()) {
      this.player.frameX = 0;
      this.player.vy -= 20;
      this.player.frameY = 14;
      this.player.maxFrame = 3;
    }
  }
  handleInput(input) {
    if (this.player.vy > this.player.weight) {
      this.player.setState(states.FALL);
    }
  }
}

export class Fall extends State {
  constructor(player) {
    super("FALL");
    this.player = player;
  }
  enter() {
    if (this.player.onGround()) {
      this.vy -= 25;
    }
    this.player.frameX = 0;
    this.player.frameY = 10;
    this.player.maxFrame = 1;
  }
  handleInput(input) {
    if (this.player.onGround()) {
      this.player.setState(states.IDLE);
    }
  }
}

export class Slide extends State {
  constructor(player) {
    super("SLIDE");
    this.player = player;
    this.slideToStandEntered = false;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 17;
    this.player.maxFrame = 1;
  }
  handleInput(input) {
    if (
      (input.includes("ArrowLeft") || input.includes("ArrowRight")) &&
      !input.includes("ArrowDown")
    ) {
      this.player.setState(states.SLIDETOSTAND);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP);
    } else if (!input.includes("ArrowDown") && !this.slideToStandEntered) {
      this.player.setState(states.SLIDETOSTAND);
      this.slideToStandEntered = true;
    } else if (this.player.speed === 0 && this.player.onGround()) {
      this.player.setState(states.IDLE);
    }
  }
}

export class SlideToStand extends State {
  constructor(player) {
    super("SLIDETOSTAND");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 16;
    this.player.maxFrame = 2;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING);
    } else if (input.includes("ArrowDown")) {
      this.player.setState(states.CROUCH);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP);
    } else {
      this.player.setState(states.IDLE);
    }
  }
}
