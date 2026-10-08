// ui/backup-manager.js

export class BackupManagerUI {

  constructor(container) {
    this.container = container;
  }


  render(config = {}) {

    this.container.innerHTML = `

      <div class="backup-manager">

        <header class="backup-header">

          <div class="backup-app-icon">
            💾
          </div>

          <div>

            <strong>
              Backup Manager
            </strong>

            <small>
              Northstar Data Protection
            </small>

          </div>

          <span class="protection-status">
            ● Protection Active
          </span>

        </header>


        <section class="backup-summary">

          <div>
            <span>Last backup</span>
            <strong>Today, 08:00 AM</strong>
          </div>

          <div>
            <span>Next backup</span>
            <strong>Tomorrow, 08:00 AM</strong>
          </div>

          <div>
            <span>Destination</span>
            <strong>External SSD (E:)</strong>
          </div>

        </section>


        <section class="backup-settings">

          <h2>
            Automatic Backup
          </h2>


          <label>

            Backup schedule

            <select id="backup-schedule">

              <option value="manual">
                Manual
              </option>

              <option value="daily">
                Daily
              </option>

              <option value="weekly">
                Weekly
              </option>

            </select>

          </label>


          <h3>
            What should be protected?
          </h3>


          <label class="checkbox-row">

            <input
              type="checkbox"
              id="documents"
            />

            <span>
              Documents
            </span>

          </label>


          <label class="checkbox-row">

            <input
              type="checkbox"
              id="desktop"
            />

            <span>
              Desktop
            </span>

          </label>


          <label class="checkbox-row">

            <input
              type="checkbox"
              id="downloads"
            />

            <span>
              Downloads
            </span>

          </label>


          <div class="backup-actions">

            <button
              id="save-backup"
            >
              Save settings
            </button>

            <button
              id="backup-now"
              class="secondary"
            >
              Run backup now
            </button>

          </div>


          <div
            id="backup-result"
          ></div>

        </section>

      </div>
    `;


    this.container
      .querySelector(
        "#save-backup"
      )
      ?.addEventListener(
        "click",
        () => this.save()
      );


    this.container
      .querySelector(
        "#backup-now"
      )
      ?.addEventListener(
        "click",
        () => this.runBackup()
      );
  }


  save() {

    const result = {

      schedule:
        this.container.querySelector(
          "#backup-schedule"
        ).value,

      documents:
        this.checked("documents"),

      desktop:
        this.checked("desktop"),

      downloads:
        this.checked("downloads")
    };


    this.onSave?.(result);
  }


  runBackup() {

    const result =
      this.container.querySelector(
        "#backup-result"
      );

    result.innerHTML = `
      <div class="backup-progress">

        <span>
          Creating backup...
        </span>

        <div>
          <i></i>
        </div>

      </div>
    `;


    setTimeout(() => {

      result.innerHTML = `
        <div class="backup-success">
          Backup completed successfully.
        </div>
      `;

    }, 1500);
  }


  checked(id) {

    return this.container
      .querySelector(`#${id}`)
      ?.checked || false;
  }


  onSave(callback) {
    this._callback = callback;
  }


  get onSave() {
    return this._callback;
  }


  set onSave(callback) {
    this._callback = callback;
  }
}


export default BackupManagerUI;