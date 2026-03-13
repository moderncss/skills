const css = String.raw;
const sheet = new CSSStyleSheet();
sheet.replaceSync(css`
  @scope (code-comparison) {
    :scope {
      display: block grid;
      position: relative;
    }

    [slot="before"],
    [slot="after"] {
      display: block grid;
      grid-area: 1 / 1;
    }

    [slot="after"] {
      clip-path: inset(0 0 0 var(--code-comparison-position, 50%));
    }

    div:nth-of-type(2) {
      grid-area: 1 / 1;
      inline-size: 0;
      inset-inline-start: var(--code-comparison-position, 50%);
      position: relative;
      z-index: 2;
    }

    button {
      align-items: center;
      cursor: col-resize;
      display: block flex;
      inset-block-start: 50%;
      justify-content: center;
      position: absolute;
      touch-action: none;
      translate: -50% -50%;
      z-index: 3;
    }
  }
`);
document.adoptedStyleSheets.push(sheet);

class CodeComparison extends HTMLElement {
  #handle;
  #controller;
  #position = 50;
  #dragging = false;

  connectedCallback() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.#init(), {
        once: true,
      });
    } else {
      this.#init();
    }
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }

  handleEvent(event) {
    switch (event.type) {
      case "pointerdown":
        this.#onPointerDown(event);
        break;
      case "pointermove":
        this.#onPointerMove(event);
        break;
      case "pointerup":
      case "pointercancel":
        this.#onPointerUp();
        break;
      case "keydown":
        this.#onKeyDown(event);
        break;
    }
  }

  #init() {
    const before = this.querySelector('[slot="before"]');
    const after = this.querySelector('[slot="after"]');
    if (!before || !after) return;

    this.#controller = new AbortController();
    const { signal } = this.#controller;

    const divider = document.createElement("div");

    this.#handle = document.createElement("button");
    this.#handle.type = "button";
    this.#handle.setAttribute("role", "separator");
    this.#handle.setAttribute("aria-valuenow", "50");
    this.#handle.setAttribute("aria-valuemin", "0");
    this.#handle.setAttribute("aria-valuemax", "100");
    this.#handle.setAttribute("aria-label", "Comparison slider");
    this.#handle.innerHTML =
      '<svg viewBox="0 0 10 14" fill="currentColor" aria-hidden="true"><circle  cx="3" cy="3" r="1.25"/><circle cx="7" cy="3" r="1.25"/><circle cx="3" cy="7" r="1.25"/><circle cx="7" cy="7" r="1.25"/><circle cx="3" cy="11" r="1.25"/><circle cx="7" cy="11" r="1.25"/></svg>';

    divider.append(this.#handle);
    after.before(divider);

    this.#handle.addEventListener("pointerdown", this, { signal });
    this.#handle.addEventListener("keydown", this, { signal });
  }

  #onPointerDown(event) {
    event.preventDefault();
    this.#dragging = true;
    this.#handle.setPointerCapture(event.pointerId);
    const { signal } = this.#controller;
    this.#handle.addEventListener("pointermove", this, { signal });
    this.#handle.addEventListener("pointerup", this, { signal });
    this.#handle.addEventListener("pointercancel", this, { signal });
  }

  #onPointerMove(event) {
    if (!this.#dragging) return;
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    this.#setPosition(percent);
  }

  #onPointerUp() {
    this.#dragging = false;
    this.#handle.removeEventListener("pointermove", this);
    this.#handle.removeEventListener("pointerup", this);
    this.#handle.removeEventListener("pointercancel", this);
  }

  #onKeyDown(event) {
    const step = event.shiftKey ? 10 : 1;
    let newPosition = this.#position;

    switch (event.key) {
      case "ArrowLeft":
        newPosition -= step;
        break;
      case "ArrowRight":
        newPosition += step;
        break;
      case "Home":
        newPosition = 0;
        break;
      case "End":
        newPosition = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.#setPosition(newPosition);
  }

  #setPosition(percent) {
    this.#position = Math.max(0, Math.min(100, percent));
    this.style.setProperty("--code-comparison-position", `${this.#position}%`);
    this.#handle.setAttribute("aria-valuenow", String(this.#position));
  }
}

customElements.define("code-comparison", CodeComparison);
