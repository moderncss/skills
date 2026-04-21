const css = String.raw;
const sheet = new CSSStyleSheet();

sheet.replaceSync(css`
  @scope (prompt-cycler) {
    nav {
      align-items: center;
      display: block flex;
      justify-content: center;
    }

    span {
      > span {
        appearance: none;
        padding: 0;
      }
    }

    p {
      block-size: 1px;
      clip-path: inset(50%);
      inline-size: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
    }
  }
`);

document.adoptedStyleSheets.push(sheet);

const createIconButton = (label, pathD) => {
  const button = document.createElement("button");
  button.type = "button";
  button.ariaLabel = label;
  button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${pathD}"/></svg>`;
  return button;
};

class PromptCycler extends HTMLElement {
  #animationId;
  #dots;
  #index = 0;
  #liveRegion;
  #nextBtn;
  #prevBtn;
  #prompts;
  #textarea;

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
    this.#cancelAnimation();
  }

  handleEvent(event) {
    const { length } = this.#prompts;
    const delta = event.currentTarget === this.#prevBtn ? -1 : 1;
    this.#go((this.#index + delta + length) % length);
    this.#liveRegion.textContent = this.#prompts[this.#index];
  }

  #init() {
    this.#textarea = this.querySelector("textarea");
    if (!this.#textarea) return;

    this.#prompts = this.#textarea.value
      .split("\n\n")
      .map((prompt) => prompt.trim().replace(/\s+/g, " "))
      .filter(Boolean);
    if (this.#prompts.length === 0) return;

    const nav = document.createElement("nav");
    nav.ariaLabel = "Prompt navigation";

    this.#prevBtn = createIconButton("Previous prompt", "M15 18l-6-6 6-6");
    this.#nextBtn = createIconButton("Next prompt", "M9 18l6-6-6-6");

    const indicator = document.createElement("span");
    this.#dots = this.#prompts.map(() => document.createElement("span"));
    indicator.append(...this.#dots);

    nav.append(this.#prevBtn, indicator, this.#nextBtn);

    this.#liveRegion = document.createElement("p");
    this.#liveRegion.role = "status";

    this.querySelector("copy-clipboard").after(nav);
    nav.after(this.#liveRegion);

    this.#prevBtn.addEventListener("click", this);
    this.#nextBtn.addEventListener("click", this);

    this.#go(0);
  }

  #go(to) {
    this.#cancelAnimation();
    this.#index = to;
    this.#updateDots();

    const text = this.#prompts[this.#index];

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.#textarea.value = text;
      return;
    }

    this.#textarea.value = "";
    this.#typewrite(text, 0);
  }

  #typewrite(text, pos) {
    if (pos >= text.length) {
      this.#animationId = null;
      return;
    }

    this.#textarea.value = text.slice(0, pos + 1);
    this.#animationId = setTimeout(() => this.#typewrite(text, pos + 1), 15);
  }

  #cancelAnimation() {
    if (this.#animationId != null) {
      clearTimeout(this.#animationId);
      this.#animationId = null;
    }
  }

  #updateDots() {
    this.#dots.forEach((dot, i) => {
      dot.ariaCurrent = i === this.#index ? "step" : null;
    });
  }
}

customElements.define("prompt-cycler", PromptCycler);
