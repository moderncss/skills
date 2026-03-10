const css = String.raw;

const sheet = new CSSStyleSheet();
sheet.replaceSync(css`
  @scope (copy-clipboard) {
    :scope {
      position: relative;
    }

    textarea {
      anchor-name: --textarea;
    }

    button {
      align-items: center;
      bottom: calc(anchor(bottom) + var(--length-xs));
      display: flex;
      min-inline-size: 7em;
      opacity: 0;
      place-content: center;
      position: absolute;
      position-anchor: --textarea;
      right: calc(anchor(right) + var(--length-xs));
      transition: opacity var(--duration) var(--timing-function);

      :scope:is(:hover, :focus-within) & {
        opacity: 1;
      }
    }

    span:nth-of-type(1),
    span:nth-of-type(2) {
      align-items: center;
      display: flex;
      gap: 0.25em;
      transition: opacity var(--duration) var(--timing-function);
    }

    span:nth-of-type(1) {
      &[aria-hidden="true"] {
        opacity: 0;
      }

      &[aria-hidden="false"] {
        opacity: 1;
      }
    }

    span:nth-of-type(2) {
      position: absolute;

      &[aria-hidden="true"] {
        opacity: 0;
      }

      &[aria-hidden="false"] {
        opacity: 1;
      }
    }

    svg {
      block-size: 1lh;
      inline-size: 1lh;
    }
  }
`);
document.adoptedStyleSheets.push(sheet);

class CopyClipboard extends HTMLElement {
  #btn;
  #textarea;
  #controller;
  #feedbackTimeout;

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
    clearTimeout(this.#feedbackTimeout);
  }

  handleEvent(event) {
    if (event.type === "click" && event.currentTarget === this.#btn) {
      this.#copy();
    }
  }

  #init() {
    if (!navigator.clipboard?.writeText) return;

    this.#textarea = this.querySelector("textarea");
    if (!this.#textarea) return;

    this.#controller = new AbortController();

    this.#btn = document.createElement("button");
    this.#btn.type = "button";
    this.#btn.innerHTML = `<span aria-hidden="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3L15 3C15.6 3 16 3.4 16 4L16 7L8 7C7.4 7 7 7.4 7 8L7 17L5 17C4.4 17 4 16.6 4 16L4 4C4 3.4 4.4 3 5 3Z"/><path d="M9 7L19 7C19.6 7 20 7.4 20 8L20 20C20 20.6 19.6 21 19 21L9 21C8.4 21 8 20.6 8 20L8 8C8 7.4 8.4 7 9 7Z"/></svg>Copy</span><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Copied</span>`;

    this.#textarea.after(this.#btn);
    this.#btn.addEventListener("click", this, {
      signal: this.#controller.signal,
    });
  }

  async #copy() {
    try {
      await navigator.clipboard.writeText(this.#textarea.value);
    } catch {
      return;
    }

    const [copySpan, copiedSpan] = this.#btn.querySelectorAll("span");

    clearTimeout(this.#feedbackTimeout);
    copySpan.setAttribute("aria-hidden", "false");
    copiedSpan.setAttribute("aria-hidden", "true");
    void this.#btn.offsetWidth;
    copySpan.setAttribute("aria-hidden", "true");
    copiedSpan.setAttribute("aria-hidden", "false");

    this.#feedbackTimeout = setTimeout(() => {
      copySpan.setAttribute("aria-hidden", "false");
      copiedSpan.setAttribute("aria-hidden", "true");
    }, 2000);
  }
}

customElements.define("copy-clipboard", CopyClipboard);
