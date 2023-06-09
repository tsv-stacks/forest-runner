const states = {
  IDLE: 0,
  RUNNING: 1,
  CROUCH: 2,
  JUMP: 3,
  FALL: 4,
  SLIDE: 5,
  SLIDETOSTAND: 6,
  ATTACK1: 7,
  ATTACK2: 8,
  HIT: 9,
  AIRATTACK1: 10,
  AIRATTACK2: 11,
};

class State {
  constructor(state) {
    this.state = state;
    this.moveSpeed = 1;
    this.actionSpeed = 1.5;
    this.idleSpeed = 0.5;
    this.crouchSpeed = 0;
  }
}

export class Idle extends State {
  constructor(player) {
    super("IDLE");
    this.player = player;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 19;
    // this.player.frameY = 6;
    this.player.maxFrame = 5;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING, this.moveSpeed);
    } else if (input.includes("ArrowDown")) {
      this.player.setState(states.CROUCH, this.crouchSpeed);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP, this.moveSpeed);
    } else if (input.includes("Enter")) {
      this.player.setState(states.ATTACK1, this.moveSpeed);
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
      this.player.setState(states.RUNNING, this.moveSpeed);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP, this.moveSpeed);
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
      this.player.setState(states.JUMP, this.moveSpeed);
    } else if (input.includes("ArrowRight") && input.includes("ArrowDown")) {
      this.player.setState(states.SLIDE, this.actionSpeed);
    } else if (!input.includes("ArrowLeft") && !input.includes("ArrowRight")) {
      this.player.setState(states.IDLE, this.idleSpeed);
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
      this.player.setState(states.FALL, this.moveSpeed);
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
      this.player.setState(states.IDLE, this.idleSpeed);
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
      this.player.setState(states.SLIDETOSTAND, this.moveSpeed);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP, 1);
    } else if (!input.includes("ArrowDown") && !this.slideToStandEntered) {
      this.player.setState(states.SLIDETOSTAND, this.moveSpeed);
      this.slideToStandEntered = true;
    } else if (this.player.speed === 0 && this.player.onGround()) {
      this.player.setState(states.IDLE, this.idleSpeed);
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
      this.player.setState(states.RUNNING, 2);
    } else if (input.includes("ArrowDown")) {
      this.player.setState(states.CROUCH, 0);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP, 1);
    } else {
      this.player.setState(states.IDLE, 0.5);
    }
  }
}

export class AttackingGround extends State {
  constructor(player) {
    super("ATTACK1");
    this.player = player;
    this.attackFrame = 0;
    this.attackDuration = 4;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = 4;
    this.player.maxFrame = 4;
  }
  handleInput(input) {
    if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP, this.moveSpeed);
    } else if (input.includes("ArrowRight") && input.includes("ArrowDown")) {
      this.player.setState(states.SLIDE, this.actionSpeed);
    } else if (!input.includes("ArrowLeft") && !input.includes("ArrowRight")) {
      this.player.setState(states.IDLE, this.idleSpeed);
    }
  }
}
