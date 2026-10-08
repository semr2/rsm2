// ui/backup-rule.js

export class BackupRuleUI {

  constructor(container) {
    this.container = container;
    this.selected = new Set();
  }


  render(options) {

    this.container.innerHTML = `

      <div class="backup-rule">

        <header>

          <span class="lesson-number">
            BACKUP PRINCIPLE
          </span>

          <h2>
            Build the 3-2-1 rule
          </h2>

          <p>
            Select the three practices that
            form the 3-2-1 backup strategy.
          </p>

        </header>


        <div class="rule-options">

          ${options.map(
            option => `

              <button
                class="rule-option"
                data-option="${this.escape(
                  option.id
                )}"
              >

                <span class="rule-checkbox">
                  □
                </span>

                <span>
                  ${this.escape(
                    option.label
                  )}
                </span>

              </button>
            `
          ).join("")}

        </div>


        <button
          id="check-rule"
          class="primary-action"
        >
          CHECK ANSWER
        </button>


        <div
          id="rule-feedback"
        ></div>

      </div>
    `;


    this.container
      .querySelectorAll(
        ".rule-option"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.option;

            if (
              this.selected.has(id)
            ) {

              this.selected.delete(id);

              button.classList.remove(
                "selected"
              );

            } else {

              this.selected.add(id);

              button.classList.add(
                "selected"
              );
            }
          }
        );
      });


    this.container
      .querySelector(
        "#check-rule"
      )
      ?.addEventListener(
        "click",
        () => this.check()
      );
  }


  check() {

    const selected =
      [...this.selected];

    this.onAnswer?.({
      selected
    });
  }


  showFeedback(correct, message) {

    const feedback =
      this.container.querySelector(
        "#rule-feedback"
      );

    feedback.className =
      correct
        ? "feedback-success"
        : "feedback-error";

    feedback.textContent =
      message;
  }


  onAnswer(callback) {
    this._callback = callback;
  }


  get onAnswer() {
    return this._callback;
  }


  set onAnswer(callback) {
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


export default BackupRuleUI;