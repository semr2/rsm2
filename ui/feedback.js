// ui/feedback.js
import { a11y } from "../js/accessibility.js";

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));

let toastTimer;

export function clearOverlays() {
  document.getElementById("overlay-root")?.replaceChildren();
  document.getElementById("interaction-root")?.replaceChildren();
}

export function panel({ title = "", body = "", choices = [], note = "", ariaLabel = title, collapsible = false } = {}) {
  const root = document.getElementById("overlay-root");
  if (!root) return null;
  root.replaceChildren();

  const backdrop = document.createElement("div");
  backdrop.className = "overlay-backdrop";
  if (collapsible) backdrop.classList.add("instruction-backdrop");
  const dialog = document.createElement("section");
  dialog.className = `ui-panel${collapsible ? " instruction-panel" : ""}`;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", String(!collapsible));
  dialog.setAttribute("aria-label", ariaLabel || title || "Course information");
  const heading = document.createElement("h2");
  heading.textContent = title;
  dialog.appendChild(heading);

  const content = document.createElement("div");
  content.className = "panel-content";
  content.innerHTML = body;
  dialog.appendChild(content);

  if (choices.length) {
    const stack = document.createElement("div");
    stack.className = "choice-stack";
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `btn ${choice.kind || "btn-secondary"}`;
      button.textContent = choice.label || "Continue";
      button.disabled = Boolean(choice.disabled);
      button.addEventListener("click", () => choice.onClick?.());
      stack.appendChild(button);
    });
    dialog.appendChild(stack);
  }
  if (note) {
    const noteEl = document.createElement("p");
    noteEl.className = "small-note";
    noteEl.textContent = note;
    dialog.appendChild(noteEl);
  }
  backdrop.appendChild(dialog);
  root.appendChild(backdrop);
  if (!collapsible) a11y.trapFocus(dialog);
  dialog.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
  return dialog;
}

export function feedback({ verdict = "good", title = "", why = "", onContinue, continueLabel = "CONTINUE" } = {}) {
  return panel({
    title,
    body: `<div class="feedback-verdict ${escapeHTML(verdict)}">${escapeHTML(verdict.toUpperCase())}</div><p>${escapeHTML(why)}</p>`,
    choices: [{ label: continueLabel, kind: "btn-primary", onClick: onContinue }],
    ariaLabel: `${title}. ${why}`,
  });
}

export function toast(message) {
  const node = document.getElementById("toast");
  if (!node) return;
  node.textContent = String(message || "");
  node.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => node.classList.remove("visible"), 4000);
}

export class FeedbackUI {

  constructor(container) {
    this.container = container;
  }


  show({
    type = "info",
    title = "Information",
    message = "",
    button = "Continue"
  }) {

    this.container.innerHTML = `

      <div class="feedback-overlay">

        <div class="
          feedback-dialog
          feedback-${this.escape(type)}
        ">

          <div class="feedback-symbol">

            ${
              type === "success"
                ? "✓"
                : type === "error"
                ? "!"
                : "i"
            }

          </div>


          <div>

            <h2>
              ${this.escape(title)}
            </h2>

            <p>
              ${this.escape(message)}
            </p>

          </div>


          <button
            id="feedback-continue"
          >
            ${this.escape(button)}
          </button>

        </div>

      </div>
    `;


    this.container
      .querySelector(
        "#feedback-continue"
      )
      ?.addEventListener(
        "click",
        () => this.onContinue?.()
      );
  }


  success(title, message) {

    this.show({
      type: "success",
      title,
      message
    });
  }


  error(title, message) {

    this.show({
      type: "error",
      title,
      message
    });
  }


  info(title, message) {

    this.show({
      type: "info",
      title,
      message
    });
  }


  onContinue(callback) {
    this._callback = callback;
  }


  get onContinue() {
    return this._callback;
  }


  set onContinue(callback) {
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


export default FeedbackUI;
