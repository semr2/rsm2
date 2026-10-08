// ui/phone.js

export class PhoneUI {

  constructor(container) {
    this.container = container;
    this.index = 0;
  }


  render(call) {

    this.call = call;
    this.index = 0;

    this.container.innerHTML = `

      <div class="phone-call">

        <div class="call-header">

          <div class="caller-avatar">
            ${this.initials(call.caller)}
          </div>

          <div>

            <strong>
              ${this.escape(call.caller)}
            </strong>

            <small>
              ${this.escape(call.role)}
            </small>

          </div>

          <span class="call-status">
            Connected
          </span>

        </div>


        <div
          id="call-dialogue"
          class="call-dialogue"
        ></div>


        <div class="call-controls">

          <button
            id="next-line"
          >
            Next
          </button>

          <button
            id="end-call"
          >
            End call
          </button>

        </div>

      </div>
    `;


    this.showLine();


    this.container
      .querySelector("#next-line")
      ?.addEventListener(
        "click",
        () => this.next()
      );


    this.container
      .querySelector("#end-call")
      ?.addEventListener(
        "click",
        () => this.complete()
      );
  }


  showLine() {

    const line =
      this.call.dialogue[
        this.index
      ];

    const dialogue =
      this.container.querySelector(
        "#call-dialogue"
      );

    if (!line || !dialogue) return;


    dialogue.innerHTML = `

      <div class="
        dialogue-message
        ${line.speaker === "Alice"
          ? "employee"
          : "support"}
      >

        <strong>
          ${this.escape(line.speaker)}
        </strong>

        <p>
          ${this.escape(line.text)}
        </p>

      </div>
    `;
  }


  next() {

    if (
      this.index >=
      this.call.dialogue.length - 1
    ) {

      this.complete();

      return;
    }

    this.index++;

    this.showLine();
  }


  complete() {

    this.onComplete?.();
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


  initials(name = "") {

    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }


  escape(value = "") {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}


export default PhoneUI;