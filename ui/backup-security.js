// ui/backup-security.js

export class BackupSecurityUI {

  constructor(container) {
    this.container = container;
  }


  render(configurations) {

    this.container.innerHTML = `

      <div class="backup-security">

        <header>

          <span>
            BACKUP SECURITY
          </span>

          <h2>
            Which configuration is risky?
          </h2>

          <p>
            Review each backup configuration
            and identify the vulnerable setup.
          </p>

        </header>


        <div class="security-configurations">

          ${configurations.map(
            item => `

              <button
                class="security-card"
                data-id="${this.escape(
                  item.id
                )}"
              >

                <div class="security-icon">
                  💾
                </div>

                <div>

                  <strong>
                    ${this.escape(
                      item.title
                    )}
                  </strong>

                  <p>
                    ${this.escape(
                      item.description
                    )}
                  </p>

                </div>

                <span>
                  →
                </span>

              </button>

            `
          ).join("")}

        </div>


        <div id="security-feedback"></div>

      </div>
    `;


    this.container
      .querySelectorAll(
        ".security-card"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            this.onSelect?.(
              card.dataset.id
            );
          }
        );
      });
  }


  showResult(correct, message) {

    const feedback =
      this.container.querySelector(
        "#security-feedback"
      );

    feedback.className =
      correct
        ? "feedback-success"
        : "feedback-error";

    feedback.textContent =
      message;
  }


  onSelect(callback) {
    this._callback = callback;
  }


  get onSelect() {
    return this._callback;
  }


  set onSelect(callback) {
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


export default BackupSecurityUI;