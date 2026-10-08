// ui/debrief.js

export class DebriefUI {

  constructor(container) {
    this.container = container;
  }


  render({
    title = "Backup Best Practices",
    points = [],
    reflection = ""
  }) {

    this.container.innerHTML = `

      <div class="debrief-screen">

        <div class="debrief-header">

          <span>
            SCENARIO COMPLETE
          </span>

          <h1>
            ${this.escape(title)}
          </h1>

          <p>
            What should you remember
            from Alice's experience?
          </p>

        </div>


        <div class="debrief-grid">

          ${points.map(
            (point, index) => `

              <article class="debrief-card">

                <span>
                  ${String(
                    index + 1
                  ).padStart(2, "0")}
                </span>

                <p>
                  ${this.escape(point)}
                </p>

              </article>

            `
          ).join("")}

        </div>


        <section class="reflection-section">

          <h2>
            Reflection
          </h2>

          <p>
            ${this.escape(reflection)}
          </p>

          <textarea
            id="reflection"
            rows="5"
            placeholder="Write your reflection..."
          ></textarea>

        </section>


        <button
          id="continue-quiz"
        >
          CONTINUE TO ASSESSMENT
        </button>

      </div>
    `;


    this.container
      .querySelector(
        "#continue-quiz"
      )
      ?.addEventListener(
        "click",
        () => {

          this.onComplete?.({
            reflection:
              this.container.querySelector(
                "#reflection"
              ).value
          });
        }
      );
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


  escape(value = "") {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}


export default DebriefUI;