const css = String.raw;
const sheet = new CSSStyleSheet();

sheet.replaceSync(css`
  @layer components {
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
  }
`);

document.adoptedStyleSheets.push(sheet);

const DRAG_EVENTS = ["pointermove", "pointerup", "pointercancel"];

class CodeComparison extends HTMLElement {
  #handle;
  #position = 50;

  connectedCallback() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.#init(), {
        once: true,
      });
    } else {
      this.#init();
    }
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

    const divider = document.createElement("div");

    this.#handle = document.createElement("button");
    this.#handle.type = "button";
    this.#handle.role = "separator";
    this.#handle.ariaLabel = "Comparison slider";
    this.#handle.ariaOrientation = "vertical";
    this.#handle.ariaValueMin = "0";
    this.#handle.ariaValueMax = "100";
    this.#handle.ariaValueNow = "50";
    this.#handle.innerHTML =
      '<svg viewBox="0 0 10 14" fill="currentColor" aria-hidden="true"><circle cx="3" cy="3" r="1.25"/><circle cx="7" cy="3" r="1.25"/><circle cx="3" cy="7" r="1.25"/><circle cx="7" cy="7" r="1.25"/><circle cx="3" cy="11" r="1.25"/><circle cx="7" cy="11" r="1.25"/></svg>';

    divider.append(this.#handle);
    after.before(divider);

    this.#handle.addEventListener("pointerdown", this);
    this.#handle.addEventListener("keydown", this);
  }

  #onPointerDown(event) {
    event.preventDefault();
    this.#handle.setPointerCapture(event.pointerId);
    for (const type of DRAG_EVENTS) this.#handle.addEventListener(type, this);
  }

  #onPointerMove(event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;
    this.#setPosition(Math.round((x / rect.width) * 100));
  }

  #onPointerUp() {
    for (const type of DRAG_EVENTS) this.#handle.removeEventListener(type, this);
  }

  #onKeyDown(event) {
    const step = event.shiftKey ? 10 : 1;
    let target = this.#position;

    switch (event.key) {
      case "ArrowLeft":
        target -= step;
        break;
      case "ArrowRight":
        target += step;
        break;
      case "Home":
        target = 0;
        break;
      case "End":
        target = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.#setPosition(target);
  }

  #setPosition(percent) {
    this.#position = Math.max(0, Math.min(100, percent));
    this.style.setProperty("--code-comparison-position", `${this.#position}%`);
    this.#handle.ariaValueNow = String(this.#position);
  }
}

customElements.define("code-comparison", CodeComparison);
