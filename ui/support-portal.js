// ui/support-portal.js

export class SupportPortalUI {

  constructor(container) {
    this.container = container;
  }


  render() {

    this.container.innerHTML = `

      <div class="support-portal">

        <header class="support-header">

          <div class="support-logo">
            NS
          </div>

          <div>
            <strong>
              Northstar IT Support
            </strong>

            <small>
              Employee Service Portal
            </small>
          </div>

          <span class="support-status">
            ● Systems operational
          </span>

        </header>


        <main class="support-content">

          <h1>
            How can we help?
          </h1>

          <p>
            Submit a request and an IT support
            specialist will contact you.
          </p>


          <label>
            Problem category

            <select id="support-category">

              <option value="">
                Select a category
              </option>

              <option>
                Hardware Problem
              </option>

              <option>
                Software Problem
              </option>

              <option>
                System Failure / Data Recovery
              </option>

              <option>
                Account Problem
              </option>

            </select>

          </label>


          <button
            id="continue-support"
          >
            Continue
          </button>

        </main>

      </div>
    `;


    this.container
      .querySelector(
        "#continue-support"
      )
      ?.addEventListener(
        "click",
        () => {

          const category =
            this.container.querySelector(
              "#support-category"
            ).value;

          this.onSubmit?.({
            category
          });
        }
      );
  }


  onSubmit(callback) {
    this._callback = callback;
  }


  get onSubmit() {
    return this._callback;
  }


  set onSubmit(callback) {
    this._callback = callback;
  }
}


export default SupportPortalUI;