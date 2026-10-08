// ui/window-manager.js

export class WindowManager {

  constructor(container) {
    this.container = container;
    this.zIndex = 100;
    this.windows = new Map();
  }


  create({
    id,
    title,
    icon = "▣",
    width = 720,
    height = 480,
    content = ""
  }) {

    this.close(id);

    const windowElement =
      document.createElement("section");

    windowElement.className =
      "app-window";

    windowElement.dataset.windowId = id;

    windowElement.style.width =
      `${width}px`;

    windowElement.style.height =
      `${height}px`;

    windowElement.style.zIndex =
      ++this.zIndex;


    windowElement.innerHTML = `

      <header class="window-titlebar">

        <div class="window-title">

          <span class="window-icon">
            ${icon}
          </span>

          <span>
            ${this.escape(title)}
          </span>

        </div>


        <div class="window-controls">

          <button data-window-action="minimize">
            −
          </button>

          <button data-window-action="maximize">
            □
          </button>

          <button data-window-action="close">
            ×
          </button>

        </div>

      </header>


      <div class="window-body">
        ${content}
      </div>

    `;


    this.container.appendChild(
      windowElement
    );

    this.windows.set(
      id,
      windowElement
    );

    this.makeDraggable(
      windowElement
    );

    this.bindControls(
      windowElement,
      id
    );

    this.center(
      windowElement
    );

    this.focus(id);

    return windowElement;
  }


  center(element) {

    const parent =
      this.container.getBoundingClientRect();

    const width =
      element.offsetWidth;

    const height =
      element.offsetHeight;

    element.style.left =
      `${Math.max(
        20,
        (parent.width - width) / 2
      )}px`;

    element.style.top =
      `${Math.max(
        20,
        (parent.height - height) / 2
      )}px`;
  }


  focus(id) {

    const element =
      this.windows.get(id);

    if (!element) return;

    element.style.zIndex =
      ++this.zIndex;

    this.windows.forEach(
      window => {
        window.classList.remove(
          "window-focused"
        );
      }
    );

    element.classList.add(
      "window-focused"
    );
  }


  bindControls(element, id) {

    element.addEventListener(
      "mousedown",
      () => this.focus(id)
    );


    element
      .querySelectorAll(
        "[data-window-action]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            const action =
              button.dataset.windowAction;

            if (action === "close") {
              this.close(id);
            }

            if (action === "minimize") {
              element.classList.toggle(
                "window-minimized"
              );
            }

            if (action === "maximize") {
              element.classList.toggle(
                "window-maximized"
              );
            }
          }
        );
      });
  }


  makeDraggable(element) {

    const titlebar =
      element.querySelector(
        ".window-titlebar"
      );

    if (!titlebar) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;


    titlebar.addEventListener(
      "mousedown",
      event => {

        if (
          event.target.closest(
            ".window-controls"
          )
        ) return;

        dragging = true;

        const rect =
          element.getBoundingClientRect();

        offsetX =
          event.clientX - rect.left;

        offsetY =
          event.clientY - rect.top;

        document.body.style.userSelect =
          "none";
      }
    );


    document.addEventListener(
      "mousemove",
      event => {

        if (!dragging) return;

        const parent =
          this.container.getBoundingClientRect();

        let left =
          event.clientX -
          parent.left -
          offsetX;

        let top =
          event.clientY -
          parent.top -
          offsetY;

        left =
          Math.max(
            0,
            Math.min(
              left,
              parent.width -
              element.offsetWidth
            )
          );

        top =
          Math.max(
            0,
            Math.min(
              top,
              parent.height -
              40
            )
          );

        element.style.left =
          `${left}px`;

        element.style.top =
          `${top}px`;
      }
    );


    document.addEventListener(
      "mouseup",
      () => {

        dragging = false;

        document.body.style.userSelect =
          "";
      }
    );
  }


  close(id) {

    const element =
      this.windows.get(id);

    if (element) {
      element.remove();
    }

    this.windows.delete(id);
  }


  closeAll() {

    this.windows.forEach(
      element => element.remove()
    );

    this.windows.clear();
  }


  get(id) {
    return this.windows.get(id);
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


export default WindowManager;