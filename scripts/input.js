class InputHandler {
  constructor() {
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Enter") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Enter"
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}

// class InputHandler {
//   constructor() {
//     this.keys = [];
//     window.addEventListener("keydown", this.handleKeyDown.bind(this));
//     window.addEventListener("keyup", this.handleKeyUp.bind(this));
//   }

//   handleKeyDown(e) {
//     if (e.code.startsWith("Arrow") && !this.keys.includes(e.code)) {
//       this.keys.push(e.code);
//     }
//   }

//   handleKeyUp(e) {
//     if (this.keys.includes(e.code)) {
//       this.keys.splice(this.keys.indexOf(e.code), 1);
//     }
//   }
// }

export default InputHandler;
