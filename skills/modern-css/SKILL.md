---
name: modern-css
description: Helps with authoring and reviewing modern CSS for robust, responsive, and accessible UIs — cascade layers, @scope, :has(), nesting, container queries, fluid typography with clamp(), oklch() colors, light-dark() and color-scheme, logical properties, subgrid, and prefers-reduced-motion. Use this skill when the user asks things like "style this component", "make this responsive", "add dark mode", "scope these styles", "fluid type scale", or any CSS authoring, refactoring, or review task — even when they don't explicitly say "CSS".
metadata:
  tags: css, modern-css, baseline, progressive-enhancement, accessibility, responsive-design, container-queries, cascade-layers, oklch, logical-properties, subgrid
---

# Modern CSS

> Modern CSS rules for creating robust, responsive and accessible UIs.

The rules work best when you apply a **[progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)** approach. The CSS features are within [Baseline](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) Newly Available. Thanks to [Interop](https://wpt.fyi/interop-2026), most are within Widely Available.

When editing existing files, match the surrounding code's style. For new code, follow the rules below. Where two rules could both apply, apply both consistently rather than picking one.

## Rules

### Architecture

#### Organizing styles (`@layer`)

- **Rule**: Use `@layer` to organize groups of styles.
- **Constraint**: Avoid global styles outside of layers.
- **Rationale**: Prevents style conflicts through managing specificity.
- **References**: [`@layer` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer).
- **Example**:

```css
/* avoid */
a {
  text-decoration-skip-ink: auto;
}

/* prefer */
@layer elements, components;

@layer elements {
  a {
    text-decoration-skip-ink: auto;
  }
}
```

#### Encapsulating styles (`@scope`)

- **Rule**: Use `@scope` to encapsulate styles.
- **Constraint**: Avoid custom element and components styles that are outside of a scope.
- **Rationale**: Prevents styles from bleeding into other components because selectors are scoped to the component.
- **References**: [`@scope` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope).
- **Example**:

```css
@scope (.card) {
  h2 {
    font-size: var(--large);
  }
}
```

#### Limiting scope (`@scope ... to`)

- **Rule**: Use a scope limit (`@scope (outer) to (inner)`) when a scoped component hosts content it doesn't own — embedded components, slot content, or user content.
- **Constraint**: Avoid base `@scope` over a component that holds slot content, embedded components, or user-generated HTML.
- **Rationale**: Stops the outer scope's styles bleeding into nested components or projected content; descendants past the limit keep their own scope's styles. Sometimes called donut scoping.
- **References**: [`@scope` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope).
- **Example**:

```css
/* avoid */
@scope (.card) {
  a {
    color: var(--blue);
  }
}

/* prefer */
@scope (.card) to (.content) {
  a {
    color: var(--blue);
  }
}
```

#### Nesting rules and at-rules (`&`)

- **Rule**: Use `&` for nesting rules and at-rules.
- **Constraint**: Avoid unnested selectors (e.g. `a {} a:hover {}`).
- **Rationale**: Clarifies the relationship between the nested selector and the parent selector.
- **References**: [`&` nesting selector on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector).
- **Example**:

```css
a {
  color: var(--blue);

  &:hover {
    text-decoration: underline;
  }

  @container (width > 20em ) {
    place-self: center;
  }
}
```

#### Relational styles (`:has()`)

- **Rule**: Use `:has()` for relational styles.
- **Constraint**: Avoid `.has-`-like class names (e.g. `.has-img {}`).
- **Rationale**: The relationship lives in CSS, with no JS or build-time class toggling needed when the DOM changes.
- **References**: [`:has()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:has).
- **Example**:

```css
.card {
  &:has(img) {
    grid-template-rows: auto 1fr;
  }
}
```

#### Additive properties (`:not()` and `20em < width <= 40em`)

- **Rule**: Use `:not()` and ranged queries (e.g. `@media (20em < width <= 40em)`) to create additive styles.
- **Constraint**: Avoid overriding styles (e.g. `div { margin: 1rem; &:first-child { margin-block-start: 0; } }`)
- **Rationale**: Simplifies the mental model because you don't have to keep track of which styles are being overridden.
- **References**: [`:not()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:not), [media query range syntax on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries#syntax_improvements_in_level_4).
- **Example**:

```css
.card {
  /* Apply to all conditions */
  color: red;

  /* Apply based on the selector */
  &:not(:first-child) {
    margin-block-start: var(--medium);
  }

  /* Apply based on non-overlapping container conditions */
  @container example (width <= 20em) {
    background-color: var(--primary);
  }

  @container example (20em < width <= 40em ) {
    background-color: var(--secondary);
  }

  @container example (width > 40em ) {
    background-color: var(--tertiary);
  }
}
```

### Typography

#### Fluid type sizes (`clamp()`)

- **Rule**: Use `clamp()` for font sizes to create harmonious rhythmic scales that are appropriate to the screen size, e.g. Major Second (1.125) on narrow viewports and Major Third (1.25) wide ones.
- **Constraint**: Avoid fixed font sizes (e.g., `px`, `rem`) and central values without a `rem` addition (e.g. `clamp(1.75rem, 5cqi, 2.25rem)`).
- **Rationale**: Ensures text is appropriately sized across different viewport sizes and can be zoomed for accessibility.
- **References**: [`clamp()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp), [Responsive design: seams & edges.](https://ethanmarcotte.com/wrote/responsive-design-seams-edges/) and [Designing with fluid type scales
  ](https://utopia.fyi/blog/designing-with-fluid-type-scales).
- **Example**:

```css
:root {
  --medium: clamp(1.3125rem, 1.1821rem + 0.6522cqi, 1.6875rem);
  --large: clamp(1.75rem, 1.5761rem + 0.8696cqi, 2.25rem);
}
```

#### Widow and orphan words (`text-wrap`)

- **Rule**: Use `text-wrap` with `pretty` or `balance` to avoid widow and orphan words.
- **Constraint**: Avoid default wrapping outside of inputs and text areas.
- **Rationale**: Improves the readability and aesthetics of text blocks.
- **References**: [`text-wrap` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap).
- **Example**:

```css
h1,
h2,
h3 {
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}
```

### Colors

#### Perceptual uniform lightness (`oklch()`)

- **Rule**: Use `oklch()` for all colors.
- **Constraint**: Avoid `hex`, `rgb()`, `hsl()` and other color formats.
- **Rationale**: Easier to maintain perceptual uniform lightness to ensure text is accessible regardless of background color.
- **References**: [`oklch()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch).
- **Example**:

```css
/* avoid */
:root {
  --success: #2d7a3e;
  --danger: hsl(0deg 70% 40%);
}

/* prefer */
:root {
  --success: oklch(40% 0.15 150deg);
  --danger: oklch(40% 0.2 25deg);
}
```

#### Respecting color preferences (`color-scheme`)

- **Rule**: Use `color-scheme` and `light-dark()` to support color schemes.
- **Constraint**: Avoid hardcoding colors that don't adapt to light and dark modes.
- **Rationale**: Improves accessibility by respecting a person's preference for light or dark mode.
- **References**: [`color-scheme` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme), [`light-dark()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark).
- **Example**:

```css
body {
  color-scheme: light dark;
  background-color: light-dark(oklch(98% 0.03 250deg), oklch(14% 0 0deg));
}
```

#### Relative color functions (`oklch(from /* .. */)` & `color-mix()` )

- **Rule**: Use relative color syntax (e.g. `oklch(from var(--primary) l + 10%)`) and functions (e.g. `color-mix()`) to create color relationships.
- **Constraint**: Avoid hardcoding colors that relate to other colors.
- **Rationale**: Creates a cohesive color palette that is easier to maintain and adjust.
- **References**: [relative colors on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors), [`color-mix()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix).
- **Example**:

```css
button {
  background-color: var(--primary);

  &:hover {
    background-color: oklch(from var(--primary) l c calc(h - 10deg));
  }
}
```

### Layout

#### Flow-relative layout (`*-inline-*`, `*-block-*`, `cqi`/`vi`, `start`/`end`)

- **Rule**: Use flow-relative properties (e.g. `padding-block-start`, `inset-inline`, `inline-size`), units (e.g. `cqi`, `cqb`, `vi`), and keywords (e.g. `text-align: start`) for layout.
- **Constraint**: Avoid physical equivalents (e.g. `padding-top`, `width`, `cqw`, `vw`, `text-align: left`).
- **Rationale**: Flexbox and grid already use inline/block axes; flow-relative layout keeps the rest of the box model consistent with them, and adapts automatically when writing mode or text direction changes.
- **References**: [Logical properties and values on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values).
- **Example**:

```css
/* avoid */
.card {
  padding-top: 1rem;
  font-size: 20vw;
  text-align: left;
}

/* prefer */
.card {
  padding-block-start: 1rem;
  font-size: 20vi;
  text-align: start;
}
```

#### Container queries and units (`@container`, `cqi` etc.)

- **Rule**: Use container queries and units (e.g. `cqi`, `cqb`) for responsive layouts.
- **Constraint**: Avoid fixed units for spacing (e.g. `padding-block: 16px`, `margin-inline: 1rem`) as they create hard edges and seams.
- **Rationale**: Improves modularity and reusability as components adapt to their container size, and work across all device sizes not just a few.
- **References**: [`container` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/container), [container query length units on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units), [Responsive design: seams & edges.](https://ethanmarcotte.com/wrote/responsive-design-seams-edges/) and [Designing with fluid type scales
  ](https://utopia.fyi/blog/designing-with-fluid-type-scales).
- **Example**:

```css
.card {
  container: card / inline-size;
  padding: 2cqi;

  p {
    @container card (width > 30cqi) {
      place-self: center;
    }
  }
}
```

#### Intrinsic sizing (`*-content`)

- **Rule**: Use intrinsic sizing (e.g. `max-inline-size: fit-content`, `block-size: max-content`).
- **Constraint**: Avoid fixed sizes (e.g. `width: 300px`, `height: 200px`) for content elements.
- **Rationale**: Improves flexibility and prevents overflow issues as content determines its own size.
- **References**: [`fit-content` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/fit-content), [`max-content` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/max-content).
- **Example**:

```css
nav {
  max-inline-size: fit-content;
}
```

#### Aligning nested grids (`subgrid`)

- **Rule**: Use `subgrid` on `grid-template-rows` or `grid-template-columns` to align nested grid items with an ancestor grid.
- **Constraint**: Avoid fixed heights, JS measurement, or flattening the DOM to make sibling grids align.
- **Rationale**: Sibling components keep their internal markup while still aligning at parent grid boundaries; without `subgrid`, alignment falls back to fixed heights, JS measurement, or flattened DOM.
- **References**: [`subgrid` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid).
- **Example**:

```css
.card {
  display: grid;
  grid-template-rows: auto auto auto 1fr;

  > .content {
    display: grid;
    grid-row: span 4;
    grid-template-rows: subgrid;
  }
}
```

### Motion

#### Respecting motion preferences (`prefers-reduced-motion`)

- **Rule**: Use `prefers-reduced-motion: no-preference` when applying large animations and transitions.
- **Constraint**: Avoid `prefers-reduced-motion: reduce`.
- **Rationale**: Treats motion as opt-in: the absence of animation is the default, so no fallback is needed for users who haven't expressed a preference. Inverting this (`@media (prefers-reduced-motion: reduce)`) requires every animation to also ship a reduce-motion override, and it's easy to miss one.
- **References**: [`prefers-reduced-motion` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- **Example**:

```css
/* avoid */
.hero {
  animation: bounce-in 0.5s ease;
}

@media (prefers-reduced-motion: reduce) {
  .hero {
    animation: none;
  }
}

/* prefer */
@media (prefers-reduced-motion: no-preference) {
  .hero {
    animation: bounce-in 0.5s ease;
  }
}
```

## Applying these rules

When asked to author, refactor, or review CSS:

1. Identify which rules apply to the task.
2. Read surrounding files to see which rules are already in use; match their patterns.
3. Apply the rules consistently across the change set, not just at the touch points.

## Gotchas

Non-obvious traps that the rules above don't surface on their own:

- **`clamp()` central values need a `rem` term:** `clamp(1.75rem, 1.5761rem + 0.8696cqi, 2.25rem)`, not `clamp(1.75rem, 5cqi, 2.25rem)`.
- **Ranged queries must not overlap:** `width <= 20em` / `20em < width <= 40em` / `width > 40em`, not `width < 20em` / `width >= 20em`.
- **`prefers-reduced-motion: no-preference` opts motion in, `reduce` opts motion out.** Reach for `no-preference`.
- **`oklch()` not `hsl()` for theme colors.** HSL's lightness channel isn't perceptually uniform.
- **`:has()` makes `.has-img`-style classes obsolete.** Don't add a class to track a relationship the DOM already expresses.
- **`grid-template-rows: subgrid` only inherits tracks the child claims.** Pair it with `grid-row: span N` so the child occupies the parent rows; without `span`, the subgrid child gets one row and aligns with nothing.

## Examples

This site follows the rules:

- [`src/styles.css`](https://github.com/moderncss/skills/blob/main/src/styles.css) — `@layer`
- [`src/variables.css`](https://github.com/moderncss/skills/blob/main/src/variables.css) — `oklch()`, `light-dark()`, `clamp()`
- [`src/elements.css`](https://github.com/moderncss/skills/blob/main/src/elements.css) — `&`, `text-wrap`, `prefers-reduced-motion`, `cqi`
- [`src/components/signpost/signpost.css`](https://github.com/moderncss/skills/blob/main/src/components/signpost/signpost.css) — `@scope`

When the skill is active, prefer matching patterns from the user's own files over fetching these examples.
