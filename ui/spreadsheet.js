// ui/spreadsheet.js

export class SpreadsheetUI {

  constructor(container) {
    this.container = container;
  }


  render(data) {

    const columns =
      data.columns || [];

    const rows =
      data.rows || [];


    this.container.innerHTML = `

      <div class="spreadsheet">

        <header class="spreadsheet-header">

          <div class="spreadsheet-logo">
            X
          </div>

          <div>
            <strong>
              ${this.escape(
                data.filename ||
                "Quarterly_Budget_Report.xlsx"
              )}
            </strong>

            <small>
              Saved to Documents
            </small>
          </div>

        </header>


        <div class="spreadsheet-toolbar">

          <button>File</button>
          <button>Home</button>
          <button>Insert</button>
          <button>Formulas</button>
          <button>Data</button>
          <button>Review</button>

        </div>


        <div class="formula-bar">

          <span>fx</span>

          <input
            value="Q4 Budget Forecast"
            readonly
          />

        </div>


        <div class="spreadsheet-grid">

          <div class="spreadsheet-corner"></div>

          ${columns.map(
            column => `
              <div class="column-header">
                ${this.escape(column)}
              </div>
            `
          ).join("")}


          ${rows.map(
            (row, rowIndex) => `

              <div class="row-header">
                ${rowIndex + 1}
              </div>

              ${row.map(
                cell => `
                  <div class="spreadsheet-cell">
                    ${this.escape(cell)}
                  </div>
                `
              ).join("")}

            `
          ).join("")}

        </div>

      </div>
    `;
  }


  simulateCrash() {

    this.container.classList.add(
      "spreadsheet-freezing"
    );

    setTimeout(() => {

      this.container.classList.add(
        "spreadsheet-unresponsive"
      );

    }, 500);
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


export default SpreadsheetUI;