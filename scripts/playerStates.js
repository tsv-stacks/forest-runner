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
  SLAMAIR: 9,
  SLAMGROUND: 10,
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
    this.player.maxFrame = 5;
  }
  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING, this.moveSpeed);
    } else if (input.includes("ArrowDown")) {
      this.player.setState(states.CROUCH, this.crouchSpeed);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMP, this.moveSpeed);
    } else if (input.includes(" ")) {
      this.player.setState(states.ATTACK1, this.idleSpeed);
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
    } else if (input.includes(" ")) {
      this.player.setState(states.ATTACK1, this.idleSpeed);
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
    } else if (input.includes(" ") && input.includes("ArrowDown")) {
      this.player.setState(states.SLAMAIR, this.idleSpeed);
    } else if (input.includes(" ")) {
      this.player.setState(states.ATTACK2, this.idleSpeed);
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
    } else if (input.includes(" ") && input.includes("ArrowDown")) {
      this.player.setState(states.SLAMAIR, this.idleSpeed);
    } else if (input.includes(" ")) {
      this.player.setState(states.ATTACK1, this.idleSpeed);
    }
  }
}

export class SlamAir extends State {
  constructor(player) {
    super("SLAMAIR");
    this.player = player;
    this.attackFrame = 0;
    this.attackNum = 0;
    this.attacks = [
      {
        frameY: 3,
        maxFrame: 1,
        soundPath: "./assets/sounds/wind.mp3",
      },
    ];
  }
  enter() {
    if (!this.player.onGround()) {
      this.player.frameX = 0;
      this.player.frameY = 3;
      this.player.maxFrame = 1;
    }
  }
  handleInput(input) {
    if (this.player.onGround()) {
      this.player.isAttacking = false;
      this.player.setState(states.SLAMGROUND, this.idleSpeed);
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

export class SlamGround extends State {
  constructor(player) {
    super("SLAMGROUND");
    this.player = player;
    this.attackFrame = 0;
    this.attackNum = 0;
    this.attacks = [
      {
        frameY: 2,
        maxFrame: 3,
        soundPath: "./assets/sounds/sword-slam.mp3",
      },
    ];
  }

  enter() {
    this.player.frameX = 0;
    this.player.frameY = this.attacks[this.attackNum].frameY;
    this.player.maxFrame = this.attacks[this.attackNum].maxFrame;
  }

  handleInput(input) {
    if (!this.player.isAttacking) {
      if (input.includes("ArrowUp")) {
        this.player.setState(states.JUMP, this.moveSpeed);
      } else if (input.includes("ArrowRight") && input.includes("ArrowDown")) {
        this.player.setState(states.SLIDE, this.actionSpeed);
      } else if (
        !input.includes("ArrowLeft") &&
        !input.includes("ArrowRight")
      ) {
        this.player.setState(states.IDLE, this.idleSpeed);
      }
    }
  }
}

export class AttackingGround extends State {
  constructor(player) {
    super("ATTACK1");
    this.player = player;
    this.attackFrame = 0;
    this.attacks = [
      {
        frameY: 4,
        maxFrame: 4,
        soundPath: "./assets/sounds/sword-attack-3.mp3",
      },
      {
        frameY: 5,
        maxFrame: 4,
        soundPath: "./assets/sounds/sword-attack-1.mp3",
      },
      {
        frameY: 6,
        maxFrame: 5,
        soundPath: "./assets/sounds/sword-attack-2.mp3",
      },
    ];
    this.attackNum = 0;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = this.attacks[this.attackNum].frameY;
    this.player.maxFrame = this.attacks[this.attackNum].maxFrame;
  }
  handleInput(input) {
    if (!this.player.isAttacking) {
      if (input.includes("ArrowUp")) {
        this.player.setState(states.JUMP, this.moveSpeed);
      } else if (input.includes("ArrowRight") && input.includes("ArrowDown")) {
        this.player.setState(states.SLIDE, this.actionSpeed);
      } else if (
        !input.includes("ArrowLeft") &&
        !input.includes("ArrowRight")
      ) {
        this.player.setState(states.IDLE, this.idleSpeed);
      }
    }
  }
}

export class AttackingAir extends State {
  constructor(player) {
    super("ATTACK2");
    this.player = player;
    this.attackFrame = 0;
    this.attacks = [
      {
        frameY: 0,
        maxFrame: 3,
        soundPath: "./assets/sounds/sword-attack-1.mp3",
      },
      {
        frameY: 1,
        maxFrame: 2,
        soundPath: "./assets/sounds/sword-attack-2.mp3",
      },
      {
        frameY: 6,
        maxFrame: 5,
        soundPath: "./assets/sounds/sword-attack-2.mp3",
      },
    ];
    this.attackNum = 0;
  }
  enter() {
    this.player.frameX = 0;
    this.player.frameY = this.attacks[this.attackNum].frameY;
    this.player.maxFrame = this.attacks[this.attackNum].maxFrame;
  }
  handleInput(input) {
    if (!this.player.isAttacking) {
      if (input.includes("ArrowUp")) {
        this.player.setState(states.JUMP, this.moveSpeed);
      } else if (input.includes("ArrowRight") && input.includes("ArrowDown")) {
        this.player.setState(states.SLIDE, this.actionSpeed);
      } else if (
        !input.includes("ArrowLeft") &&
        !input.includes("ArrowRight")
      ) {
        this.player.setState(states.IDLE, this.idleSpeed);
      }
    }
  }
}
