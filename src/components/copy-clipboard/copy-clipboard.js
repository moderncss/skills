const css = String.raw;
const sheet = new CSSStyleSheet();

sheet.replaceSync(css`
  @layer components {
    @scope (copy-clipboard) {
      :scope {
        position: relative;
      }

      textarea,
      input[type="text"] {
        anchor-name: --textarea;
      }

      button {
        align-items: center;
        display: block flex;
        inset-block-end: calc(anchor(bottom) + var(--length-xs));
        inset-inline-end: calc(anchor(right) + var(--length-xs));
        min-inline-size: 7em;
        opacity: 0;
        place-content: center;
        position: absolute;
        position-anchor: --textarea;
        transition: opacity var(--duration) var(--timing-function);

        :scope:is(:hover, :focus-within) & {
          opacity: 1;
        }
      }

      span {
        align-items: center;
        display: block flex;
        gap: 0.25em;
        transition: opacity var(--duration) var(--timing-function);

        &[aria-hidden="true"] {
          opacity: 0;
        }

        &[aria-hidden="false"] {
          opacity: 1;
        }

        &:nth-of-type(2) {
          position: absolute;
        }
      }

      svg {
        block-size: 1lh;
        inline-size: 1lh;
      }
    }
  }
`);

document.adoptedStyleSheets.push(sheet);

class CopyClipboard extends HTMLElement {
  #button;
  #textarea;
  #copySpan;
  #copiedSpan;
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
    clearTimeout(this.#feedbackTimeout);
  }

  #init() {
    if (!navigator.clipboard?.writeText) return;

    this.#textarea = this.querySelector("textarea, input[type='text']");
    if (!this.#textarea) return;

    this.#button = document.createElement("button");
    this.#button.type = "button";
    this.#button.innerHTML = `<span aria-hidden="false"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.16667 12.5H3.33333C2.89131 12.5 2.46738 12.3244 2.15482 12.0118C1.84226 11.6993 1.66667 11.2754 1.66667 10.8333V3.33332C1.66667 2.8913 1.84226 2.46737 2.15482 2.15481C2.46738 1.84225 2.89131 1.66666 3.33333 1.66666H10.8333C11.2754 1.66666 11.6993 1.84225 12.0118 2.15481C12.3244 2.46737 12.5 2.8913 12.5 3.33332V4.16666M9.16667 7.49999H16.6667C17.5871 7.49999 18.3333 8.24618 18.3333 9.16666V16.6667C18.3333 17.5871 17.5871 18.3333 16.6667 18.3333H9.16667C8.24619 18.3333 7.5 17.5871 7.5 16.6667V9.16666C7.5 8.24618 8.24619 7.49999 9.16667 7.49999Z"/></svg>Copy</span><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Copied</span>`;

    [this.#copySpan, this.#copiedSpan] = this.#button.querySelectorAll("span");

    this.#textarea.after(this.#button);
    this.#button.addEventListener("click", () => this.#copy());
  }

  async #copy() {
    try {
      await navigator.clipboard.writeText(this.#textarea.value);
    } catch {
      return;
    }

    clearTimeout(this.#feedbackTimeout);
    this.#setCopied(false);
    // Force reflow so the opacity transition restarts on repeat clicks.
    void this.#button.offsetWidth;
    this.#setCopied(true);
    this.#feedbackTimeout = setTimeout(() => this.#setCopied(false));
  }

  #setCopied(copied) {
    this.#copySpan.ariaHidden = String(!copied);
    this.#copiedSpan.ariaHidden = String(copied);
  }
}

customElements.define("copy-clipboard", CopyClipboard);
