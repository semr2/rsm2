// ui/file-manager.js

export class FileManagerUI {

  constructor(container = null) {
    this.container = container;
    this._onFileOpen = null;
  }


  build(desktop) {
    if (!this.container) {
      this.container = document.createElement("section");
      this.container.className = "app-window file-manager-window";
      this.container.setAttribute("aria-label", "File manager");
    }
    desktop.registerWindow("files", this.container);
    this.render([
      { name: "Quarterly_Budget_Report.xlsx", type: "XLSX spreadsheet", modified: "Today, 9:12 AM", size: "248 KB" },
      { name: "Meeting_Notes.docx", type: "Word document", modified: "Yesterday", size: "36 KB" },
    ]);
    this.container.addEventListener("click", (event) => {
      const row = event.target.closest("[data-file]");
      if (row) this._onFileOpen?.(row.dataset.file);
    });
    return this.container;
  }


  render(files = []) {

    this.container.innerHTML = `

      <div class="file-manager-app">

        <div class="file-toolbar">

          <button>←</button>
          <button>→</button>
          <button>↑</button>

          <div class="address-bar">
            📁 This PC /
            Documents
          </div>

          <input
            class="file-search"
            placeholder="Search Documents"
          />

        </div>


        <div class="file-layout">

          <aside class="file-sidebar">

            <strong>Quick access</strong>

            <button>⭐ Desktop</button>
            <button>📄 Documents</button>
            <button>⬇ Downloads</button>
            <button>☁ Company Drive</button>

            <hr />

            <strong>This PC</strong>

            <button>💻 Local Disk (C:)</button>
            <button>💾 External SSD (E:)</button>

          </aside>


          <main class="file-content">

            <div class="file-heading">

              <strong>Name</strong>
              <span>Date modified</span>
              <span>Type</span>
              <span>Size</span>

            </div>

            ${files.map(
              file => this.fileRow(file)
            ).join("")}

          </main>

        </div>


        <footer class="file-statusbar">
          ${files.length} items
        </footer>

      </div>
    `;
  }


  fileRow(file) {

    return `

      <button
        type="button"
        class="file-row"
        data-file="${this.escape(file.name)}"
      >

        <span>
          ${file.icon || "📄"}
          ${this.escape(file.name)}
        </span>

        <span>
          ${this.escape(
            file.modified || "Today"
          )}
        </span>

        <span>
          ${this.escape(
            file.type || "File"
          )}
        </span>

        <span>
          ${this.escape(
            file.size || "-"
          )}
        </span>

      </button>
    `;
  }


  onFileOpen(callback) {
    this._onFileOpen = callback;
  }


  showCorruptedFile(filename) {
    const row = [...this.container.querySelectorAll("[data-file]")]
      .find((element) => element.dataset.file === filename);

    if (!row) return;

    row.classList.add("file-corrupted");
    if (row.querySelector(".file-warning")) return;

    row.insertAdjacentHTML(
      "beforeend",
      `
        <span class="file-warning">
          ⚠
        </span>
      `
    );
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


export const fileManager = new FileManagerUI();
export default FileManagerUI;
