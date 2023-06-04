const states = {
  IDLE: 0,
  RUNNING: 1,
  CROUCH: 2,
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
    this.player.frameY = 12;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING);
    } else if (input.includes("ArrowDown")) {
      this.player.setState(states.CROUCH);
    }
  }
}

export class Crouch extends State {
  constructor(player) {
    super("CROUCH");
    this.player = player;
  }
  enter() {
    this.player.frameY = 7;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING);
    }
  }
}

export class Running extends State {
  constructor(player) {
    super("RUNNING");
    this.player = player;
  }
  enter() {
    this.player.frameY = 11;
  }
  handleInput(input) {
    if (input.includes("ArrowDown")) {
      this.player.setState(states.ROLL);
    }
  }
}
