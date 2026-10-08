---
name: modern-css
description: Apply these opinionated rules whenever CSS is written, refactored, or reviewed, so agents and people write it consistently. They sit on top of the Modern Web Guidance skill and settle the choices it leaves open across architecture, layout, typography, colors, and motion. Use this skill when the user asks things like "set up the base styles for this project", "style this component", "make this responsive", "add dark mode", "scope these styles", "fluid type scale", or "refactor my styles to modern CSS", when they ask to build a page or component, and for any other CSS task — even when they don't say "CSS".
license: MIT
compatibility: Requires the modern-web-guidance skill (npx skills add GoogleChrome/modern-web-guidance).
metadata:
  tags: css, modern-css, baseline, progressive-enhancement, accessibility, responsive-design, container-queries, cascade-layers, scope, oklch, logical-properties
---

# Modern CSS

> Opinionated rules for modern CSS, so agents and people write it consistently.

These rules sit on top of the [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) skill, which must be installed. It explains what each feature does, when it applies, and how to fall back. It leaves choices open: which color space, whether to scope, when to nest, how to size type. These rules settle them; retrieve its guides for everything else. Where the two disagree, the rule wins.

The [stylelint-config-modern](https://www.npmjs.com/package/stylelint-config-modern) package enforces every rule a linter can. This skill gets agents writing those from the start, and carries the rest.

Browser support policy: features within [Baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) Newly Available are used natively, without `@supports` fallbacks, as [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

## Rules

### Architecture

#### Organizing styles (`@layer`)

- **Rule**: Put every style rule in a `@layer`.
- **Constraint**: Avoid unlayered element defaults and resets.
- **Rationale**: An unlayered rule outranks every layer; with everything layered, layer order alone decides conflicts.
- **References**: [`@layer` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer).
- **Example**:

```css
@layer elements, components;

@layer elements {
  a {
    text-decoration-skip-ink: auto;
  }
}
```

#### Encapsulating styles (`@scope`)

- **Rule**: Use `@scope` for every component's styles, with a limit (`@scope (outer) to (inner)`) where the component hosts content it doesn't own — embedded components, slot content, or user content.
- **Constraint**: Avoid component styles outside a scope, and an unlimited scope over content the component doesn't own.
- **Rationale**: Scoped selectors can't bleed into other components, and the limit stops the outer scope's styles reaching projected content. Sometimes called donut scoping.
- **References**: [`@scope` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope).
- **Example**:

```css
@scope (.card) to (.content) {
  h2 {
    font-size: var(--large);
  }
}
```

#### Nesting rules and at-rules (`&`)

- **Rule**: Nest rules and at-rules inside their parent rule; write `&` where the nested selector attaches to the parent (`&:hover`) and omit it for combinators (`b`, not `& b`).
- **Constraint**: Avoid unnested selectors (e.g. `a {} a:hover {}`).
- **Rationale**: Keeps a rule's states and queries beside it in one block, and stylelint-config-modern enforces the implicit `&` form.
- **References**: [`&` nesting selector on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector).
- **Example**:

```css
a {
  color: var(--blue);

  &:hover {
    text-decoration: underline;
  }

  code {
    font-variant-numeric: tabular-nums;
  }
}
```

#### Ranged queries (`20em < width <= 40em`)

- **Rule**: Use range syntax for size queries (e.g. `@container (20em < width <= 40em)`), with ranges that don't overlap.
- **Constraint**: Avoid `min-width`/`max-width` and overlapping ranges (e.g. `width <= 20em` alongside `width >= 20em`, which both match at `20em`).
- **Rationale**: Each size lands in exactly one condition, so no condition has to override another.
- **References**: [Media query range syntax on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries#syntax_improvements_in_level_4).
- **Example**:

```css
.card {
  @container (width <= 20em) {
    grid-template-columns: 1fr;
  }

  @container (20em < width <= 40em) {
    grid-template-columns: 1fr 1fr;
  }

  @container (width > 40em) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Layout

#### Flow-relative layout (`*-inline-*`, `*-block-*`, `cqi`/`vi`, `start`/`end`)

- **Rule**: Use flow-relative properties (e.g. `padding-block-start`, `inset-inline`, `inline-size`), units (e.g. `cqi`, `cqb`, `vi`), and keywords (e.g. `text-align: start`) for layout.
- **Constraint**: Avoid physical equivalents (e.g. `padding-top`, `width`, `cqw`, `vw`, `text-align: left`), even where the layout would never flip.
- **Rationale**: Keeps the box model on the axes flexbox and grid already use, and stylelint-config-modern enforces it.
- **References**: [Logical properties and values on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values).
- **Example**:

```css
.card {
  max-inline-size: 60ch;
  padding-block-start: 2cqi;
  text-align: start;
}
```

#### Two-value display (`display: block flex`)

- **Rule**: Use the two-value `display` syntax (e.g. `display: block flex`, `display: inline grid`).
- **Constraint**: Avoid the single-value keywords (e.g. `display: block`, `display: flex`, `display: inline-block`).
- **Rationale**: Separates how the box sits in its parent from how its children lay out, so `inline flex` and `inline flow-root` replace the special-case keywords `inline-flex` and `inline-block`.
- **References**: [Multi-keyword `display` syntax on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Multi-keyword_syntax).
- **Example**:

```css
nav {
  display: block flex;
}

.card {
  display: block grid;
}
```

#### Fluid spacing (`cqi`)

- **Rule**: Size spacing with container units (e.g. `padding: 2cqi`), clamped where it needs a floor or ceiling.
- **Constraint**: Avoid fixed spacing (e.g. `padding-block: 16px`, `margin-inline: 1rem`).
- **Rationale**: Spacing scales with the container, so components adapt wherever they're placed instead of at breakpoints, which leave seams.
- **References**: [Container query length units on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units), [Responsive design: seams & edges.](https://ethanmarcotte.com/wrote/responsive-design-seams-edges/).
- **Example**:

```css
.card {
  container: card / inline-size;
  gap: 2cqi;
  padding: clamp(1rem, 0.5rem + 2cqi, 2rem);
}
```

#### Auto-growing text areas (`field-sizing: content`)

- **Rule**: Use `field-sizing: content` on text areas, with an explicit `inline-size` and `min-block-size`/`max-block-size` in `lh`.
- **Constraint**: Avoid fixed block sizes (e.g. `block-size: 8rem`) and `field-sizing: content` on inputs, which shrink to their value's width.
- **Rationale**: Typed text stays in view instead of scrolling inside a fixed box, and `lh` bounds follow the line height as the type scales.
- **References**: [`field-sizing` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing).
- **Example**:

```css
textarea {
  field-sizing: content;
  inline-size: 100%;
  max-block-size: 12lh;
  min-block-size: 3lh;
}
```

### Typography

#### Fluid type sizes (`clamp()`)

- **Rule**: Use `clamp()` with container units for font sizes, on a type scale whose ratio grows with the container, e.g. Major Second (1.125) on narrow containers and Major Third (1.25) on wide ones.
- **Constraint**: Avoid fixed font sizes (e.g. `px`, `rem`) and central values without a `rem` term (e.g. `clamp(1.75rem, 5cqi, 2.25rem)`).
- **Rationale**: Sizes text to its container rather than at breakpoints, and the `rem` term keeps zoom working.
- **References**: [`clamp()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp), [Designing with fluid type scales](https://utopia.fyi/blog/designing-with-fluid-type-scales).
- **Example**:

```css
:root {
  --medium: clamp(1.3125rem, 1.1821rem + 0.6522cqi, 1.6875rem);
  --large: clamp(1.75rem, 1.5761rem + 0.8696cqi, 2.25rem);
}
```

#### Widow and orphan words (`text-wrap`)

- **Rule**: Use `text-wrap: balance` on headings and `text-wrap: pretty` on all other text.
- **Constraint**: Avoid default wrapping outside of inputs and text areas.
- **Rationale**: Removes widows and orphans by default rather than where someone remembered to opt in.
- **References**: [`text-wrap` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap).
- **Example**:

```css
h1,
h2,
h3 {
  text-wrap: balance;
}

body {
  text-wrap: pretty;
}
```

### Colors

#### Perceptual uniform lightness (`oklch()`)

- **Rule**: Use `oklch()` for all colors.
- **Constraint**: Avoid `hex`, `rgb()`, `hsl()` and other color formats.
- **Rationale**: Lightness is perceptually uniform, so text contrast holds across hues.
- **References**: [`oklch()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch).
- **Example**:

```css
:root {
  --success: oklch(40% 0.15 150deg);
  --danger: oklch(40% 0.2 25deg);
}
```

#### Respecting color preferences (`light-dark()`)

- **Rule**: Use `light-dark()` for every color that differs between light and dark schemes.
- **Constraint**: Avoid `prefers-color-scheme` blocks that redeclare colors, and colors that don't adapt.
- **Rationale**: Each token carries both values in one place, so no scheme can be missed when a color changes.
- **References**: [`light-dark()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark).
- **Example**:

```css
:root {
  --surface: light-dark(oklch(98% 0 0deg), oklch(16% 0 0deg));
  --text: light-dark(oklch(35% 0 0deg), oklch(75% 0 0deg));
}
```

#### Relative color functions (`oklch(from /* .. */)` & `color-mix()` )

- **Rule**: Derive related colors with relative color syntax (e.g. `oklch(from var(--primary) l c calc(h - 10deg))`) or `color-mix()` in `oklab`.
- **Constraint**: Avoid hardcoding colors that relate to other colors, and lightness-only moves on saturated colors (e.g. `oklch(from var(--primary) 90% c h)`).
- **Rationale**: Related colors follow their source when it changes.
- **References**: [relative colors on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors), [`color-mix()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix).
- **Example**:

```css
:root {
  --primary: oklch(55% 0.25 350deg);
  --primary-hover: oklch(from var(--primary) l c calc(h - 10deg));
  --primary-tint: color-mix(in oklab, var(--primary), oklch(100% 0 0deg) 80%);
}
```

### Motion

#### Respecting motion preferences (`prefers-reduced-motion`)

- **Rule**: Use `prefers-reduced-motion: no-preference` when applying large animations and transitions.
- **Constraint**: Avoid `prefers-reduced-motion: reduce`.
- **Rationale**: Motion becomes opt-in, so no animation needs a reduced-motion override. With `reduce`, every animation needs one, and it's easy to miss one.
- **References**: [`prefers-reduced-motion` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- **Example**:

```css
@media (prefers-reduced-motion: no-preference) {
  .hero {
    animation: bounce-in 0.5s ease;
  }
}
```

## Applying these rules

When asked to author, refactor, or review CSS:

1. Identify which rules apply to the task; where several do, apply them all.
2. Read surrounding files to see which rules are already in use; match their patterns.
3. Apply the rules consistently across the change set, not just at the touch points.
4. Retrieve the Modern Web Guidance guides for the task and apply them within these rules, skipping their fallbacks under the browser support policy above.
5. If the project runs Stylelint with stylelint-config-modern, run it on the changed files and fix what it reports before finishing.

## Gotchas

Traps neither the rules above nor Modern Web Guidance surface:

- **`clamp()` central values need a `rem` term:** `clamp(1.75rem, 1.5761rem + 0.8696cqi, 2.25rem)`, not the `clamp(1rem, 5cqi, 2.5rem)` form Modern Web Guidance's `fluid-scaling` guide shows.
- **`grid-template-rows: subgrid` only inherits tracks the child claims.** Pair it with `grid-row: span N`; without the span the child gets one row and aligns with nothing. Modern Web Guidance's `css-layout` guide shows the span without saying why.
- **`container-type` already applies containment:** a component with `container-type: inline-size` has layout, style and inline-size containment, so it needs no `contain`. The `contain: layout style paint` that Modern Web Guidance's `performance` guide puts on widgets adds paint containment, which clips overflowing descendants like `overflow: clip`.

## Examples

This site follows the rules:

- [`src/styles.css`](https://github.com/moderncss/skills/blob/main/src/styles.css) — `@layer`
- [`src/variables.css`](https://github.com/moderncss/skills/blob/main/src/variables.css) — `oklch()`, `light-dark()`, `clamp()`
- [`src/elements.css`](https://github.com/moderncss/skills/blob/main/src/elements.css) — `&`, `text-wrap`, `prefers-reduced-motion`, `cqi`, two-value `display`, `field-sizing`
- [`src/components/signpost/signpost.css`](https://github.com/moderncss/skills/blob/main/src/components/signpost/signpost.css) — `@scope`

Fetch one only when the project has no CSS of its own to match.
