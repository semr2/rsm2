// ui/restart-screen.js

export class RestartScreenUI {

  constructor(container) {
    this.container = container;
  }


  start() {

    this.container.innerHTML = `

      <div class="restart-screen">

        <div class="restart-logo">
          ND
        </div>

        <div
          class="restart-spinner"
          aria-hidden="true"
        ></div>

        <h2>
          Restarting
        </h2>

        <p id="restart-message">
          Shutting down...
        </p>

      </div>
    `;

    this.run();
  }


  run() {

    const messages = [
      "Shutting down...",
      "Checking system integrity...",
      "Loading NOVA Desktop...",
      "Starting corporate services...",
      "Restoring workspace..."
    ];

    let index = 0;

    const message =
      this.container.querySelector(
        "#restart-message"
      );


    const timer =
      setInterval(() => {

        if (message) {
          message.textContent =
            messages[index];
        }

        index++;

        if (index >= messages.length) {

          clearInterval(timer);

          setTimeout(() => {
            this.onComplete?.();
          }, 700);
        }

      }, 700);
  }


  onComplete(callback) {
    this._callback = callback;
  }


  get onComplete() {
    return this._callback;
  }


  set onComplete(callback) {
    this._callback = callback;
  }
}


export default RestartScreenUI;