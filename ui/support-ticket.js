// ui/support-ticket.js

export class SupportTicketUI {

  constructor(container) {
    this.container = container;
  }


  render() {

    this.container.innerHTML = `

      <div class="support-ticket">

        <header>
          <h2>
            Create Support Request
          </h2>

          <span>
            IT Service Desk
          </span>
        </header>


        <div class="ticket-form">

          ${this.field(
            "Incident type",
            "incident",
            "System crashed"
          )}


          <label>
            Description

            <textarea
              id="description"
              rows="5"
            >Budget spreadsheet became corrupted after the computer crashed.</textarea>

          </label>


          ${this.field(
            "Recovery attempt",
            "recovery",
            "Automatic recovery failed"
          )}


          <label>
            Is a backup available?

            <select id="backup">
              <option value="">
                Select...
              </option>

              <option value="yes">
                Yes
              </option>

              <option value="no">
                No
              </option>

            </select>

          </label>


          ${this.field(
            "Business impact",
            "impact",
            "Quarterly report deadline is Friday"
          )}


          <button
            id="submit-ticket"
          >
            Submit Request
          </button>


          <div id="ticket-result"></div>

        </div>

      </div>
    `;


    this.container
      .querySelector(
        "#submit-ticket"
      )
      ?.addEventListener(
        "click",
        () => this.submit()
      );
  }


  field(label, id, value) {

    return `

      <label>

        ${label}

        <input
          id="${id}"
          value="${this.escape(value)}"
        />

      </label>
    `;
  }


  submit() {

    const result = {

      incidentType:
        this.value("incident"),

      description:
        this.value("description"),

      recovery:
        this.value("recovery"),

      backup:
        this.value("backup"),

      businessImpact:
        this.value("impact")
    };


    this.onSubmit?.(result);
  }


  value(id) {

    return (
      this.container.querySelector(
        `#${id}`
      )?.value || ""
    );
  }


  showSuccess(ticketId) {

    const result =
      this.container.querySelector(
        "#ticket-result"
      );

    if (!result) return;

    result.innerHTML = `

      <div class="ticket-success">

        <strong>
          Request submitted
        </strong>

        <p>
          Ticket:
          ${this.escape(ticketId)}
        </p>

        <p>
          An IT support specialist
          will contact you shortly.
        </p>

      </div>
    `;
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


  escape(value = "") {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}


export default SupportTicketUI;