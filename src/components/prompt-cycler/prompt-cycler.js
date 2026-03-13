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

class PromptCycler extends HTMLElement {
  #textarea;
  #prompts;
  #index = 0;
  #controller;
  #animationId;
  #nav;
  #dots;
  #liveRegion;
  #reducedMotion;

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
    this.#controller?.abort();
  }

  handleEvent(event) {
    if (event.type === "click") {
      const btn = event.currentTarget;

      if (btn === this.#nav.querySelector(":scope > button:first-of-type")) {
        this.#go(this.#index === 0 ? this.#prompts.length - 1 : this.#index - 1);
      } else if (btn === this.#nav.querySelector(":scope > button:last-of-type")) {
        this.#go(this.#index === this.#prompts.length - 1 ? 0 : this.#index + 1);
      }
    }
  }

  #init() {
    this.#textarea = this.querySelector("textarea");
    if (!this.#textarea) return;

    this.#prompts = this.#textarea.value
      .split("\n\n")
      .map((p) => p.trim().replace(/\s+/g, " "))
      .filter(Boolean);
    if (this.#prompts.length === 0) return;

    this.#controller = new AbortController();

    // Set up reduced motion query
    const mql = matchMedia("(prefers-reduced-motion: reduce)");
    this.#reducedMotion = mql.matches;
    mql.addEventListener(
      "change",
      (e) => {
        this.#reducedMotion = e.matches;
      },
      { signal: this.#controller.signal },
    );

    // Build nav: ‹ ● ○ ○ ›
    this.#nav = document.createElement("nav");
    this.#nav.setAttribute("aria-label", "Prompt navigation");

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Previous prompt");
    prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>`;

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Next prompt");
    nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>`;

    const dotsWrap = document.createElement("span");

    this.#dots = this.#prompts.map((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.setAttribute("aria-current", "step");
      dotsWrap.append(dot);
      return dot;
    });

    this.#nav.append(prevBtn, dotsWrap, nextBtn);

    // aria-live region
    this.#liveRegion = document.createElement("p");
    this.#liveRegion.setAttribute("aria-live", "polite");
    this.#liveRegion.setAttribute("role", "status");

    // Insert nav after copy-clipboard, and live region after nav
    const copyEl = this.querySelector("copy-clipboard");
    if (copyEl) {
      copyEl.after(this.#nav);
    } else {
      this.append(this.#nav);
    }
    this.#nav.after(this.#liveRegion);

    // Event listeners using handleEvent
    prevBtn.addEventListener("click", this);
    nextBtn.addEventListener("click", this);

    // Auto-type the first prompt on load (skip live region announcement)
    this.#go(0, { announce: false });
  }

  #go(newIndex, { announce = true } = {}) {
    this.#cancelAnimation();
    this.#index = newIndex;
    this.#updateDots();

    if (announce) {
      this.#liveRegion.textContent = this.#prompts[this.#index];
    }

    const text = this.#prompts[this.#index];

    if (this.#reducedMotion) {
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
      if (i === this.#index) {
        dot.setAttribute("aria-current", "step");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }
}

customElements.define("prompt-cycler", PromptCycler);
