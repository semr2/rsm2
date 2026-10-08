// ui/system-crash.js

export class SystemCrashUI {

  constructor(container) {
    this.container = container;
  }


  show() {

    this.container.innerHTML = `

      <div class="system-crash">

        <div class="crash-symbol">
          :( 
        </div>

        <h1>
          NOVA encountered a problem
        </h1>

        <p>
          Your computer ran into a problem
          and needs to restart.
        </p>

        <div class="crash-progress">

          <div
            id="crash-progress-bar"
          ></div>

        </div>

        <p class="crash-status">
          Collecting diagnostic information...
        </p>

      </div>
    `;

    this.runSequence();
  }


  runSequence() {

    const bar =
      this.container.querySelector(
        "#crash-progress-bar"
      );

    let progress = 0;

    const timer =
      setInterval(() => {

        progress += 10;

        if (bar) {
          bar.style.width =
            `${progress}%`;
        }

        if (progress >= 100) {

          clearInterval(timer);

          this.onComplete?.();
        }

      }, 150);
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


export default SystemCrashUI;