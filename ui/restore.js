// ui/restore.js

export class RestoreUI {

  constructor(container) {
    this.container = container;
  }


  render(config = {}) {

    this.container.innerHTML = `

      <div class="restore-app">

        <header>

          <div class="restore-icon">
            ↻
          </div>

          <div>
            <strong>
              Restore Files
            </strong>

            <small>
              Backup Manager
            </small>
          </div>

        </header>


        <main>

          <h2>
            Select a backup
          </h2>


          <label>

            Backup source

            <select id="restore-source">

              <option>
                Daily Backup
              </option>

              <option>
                Weekly Backup
              </option>

            </select>

          </label>


          <label>

            Restore location

            <select id="restore-target">

              <option>
                Documents
              </option>

              <option>
                Desktop
              </option>

            </select>

          </label>


          <div class="restore-file">

            <span>📊</span>

            <div>

              <strong>
                ${this.escape(
                  config.filename ||
                  "Quarterly_Budget_Report.xlsx"
                )}
              </strong>

              <small>
                Backup created today at 08:00 AM
              </small>

            </div>

          </div>


          <button
            id="restore-button"
          >
            RESTORE FILE
          </button>


          <div
            id="restore-progress"
          ></div>

        </main>

      </div>
    `;


    this.container
      .querySelector(
        "#restore-button"
      )
      ?.addEventListener(
        "click",
        () => this.restore()
      );
  }


  restore() {

    const progress =
      this.container.querySelector(
        "#restore-progress"
      );

    progress.innerHTML = `

      <div class="restore-progress">

        <span>
          Restoring file...
        </span>

        <div>
          <i></i>
        </div>

      </div>
    `;


    setTimeout(() => {

      progress.innerHTML = `

        <div class="restore-success">

          <strong>
            File restored successfully
          </strong>

          <p>
            The quarterly budget report
            has been restored to Documents.
          </p>

        </div>
      `;


      this.onComplete?.({
        restored: true
      });

    }, 1600);
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


export default RestoreUI;