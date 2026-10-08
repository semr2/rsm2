// ui/document-viewer.js

export class DocumentViewerUI {

  constructor(container) {
    this.container = container;
  }


  render(document) {

    this.container.innerHTML = `

      <article class="document-viewer">

        <header class="document-header">

          <div>
            <strong>
              ${this.escape(document.name)}
            </strong>

            <small>
              Microsoft Excel-compatible document
            </small>
          </div>

          <span>
            ${this.escape(
              document.status || "Saved"
            )}
          </span>

        </header>


        <div class="document-toolbar">

          <button>File</button>
          <button>Home</button>
          <button>Insert</button>
          <button>View</button>

        </div>


        <div class="document-content">

          <h1>
            ${this.escape(
              document.title ||
              "Quarterly Budget Report"
            )}
          </h1>

          <p>
            Prepared by:
            Alice Morgan
          </p>

          <hr />

          <div class="document-table">

            ${(
              document.rows || []
            ).map(row => `

              <div class="document-row">

                ${row.map(cell => `
                  <span>
                    ${this.escape(cell)}
                  </span>
                `).join("")}

              </div>

            `).join("")}

          </div>

        </div>

      </article>
    `;
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


export default DocumentViewerUI;