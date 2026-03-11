---
layout: ../layouts/SubLayout.astro
title: "llms.txt - ModernCSS.AI"
description: "Modern CSS rules for creating robust, responsive and accessible UIs."
---

# ModernCSS.AI

> Modern CSS rules for creating robust, responsive and accessible UIs.

The rules worked best when you apply them within a **[progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)** approach. Most rules use CSS features that are, thanks to [Interop 2024](https://wpt.fyi/interop-2026), [Baseline Widely Available](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility).

The rules, constraints, and examples are **not intended to be prescriptive**. Use your best judgment and consider the specific needs of the project when applying them. However, if you choose to use a rule, apply it consistently.

## Architecture

### Organizing styles (`@layer`)

- **Rule**: Use `@layer` to organize groups of styles.
- **Constraint**: Avoid global styles outside of layers.
- **Rationale**: Prevents style conflicts through managing specificity.
- **Example**:

```css
@layer elements, components;

@layer elements {
  a {
    text-decoration-skip-ink: auto;
  }
}
```

### Encapsulating styles (`@scope`)

- **Rule**: Use `@scope` to encapsulate styles.
- **Constraint**: Avoid custom element and components styles that are outside of a scope.
- **Rationale**: Prevents styles from bleeding into other components because type selectors (e.g., `h1`, `p`) are scoped to the component.
- **Example**:

```css
@scope (.card) {
  h2 {
    font-size: var(--large);
  }
}
```

### Nesting pseudo-classes and pseudo-elements (`&`)

- **Rule**: Use `&` for nesting pseudo-classes and pseudo-elements.
- **Constraint**: Avoid unnested pseudo selectors (e.g. `a {} a:hover {}`).
- **Rationale**: Clarifies the relationship between the nested selector and the parent selector.
- **Example**:

```css
a {
  color: var(--blue);

  &:hover {
    text-decoration: underline;
  }

  &::after {
    content: " ↗";
  }
}
```

### Relational styles (`:has()`)

- **Rule**: Use `:has()` for relational styles.
- **Constraint**: Avoid `.has-`-like class names (e.g. `.has-img {}`).
- **Rationale**: Creates "smart" components that adapt to relationships.
- **Example**:

```css
.card {
  &:has(img) {
    grid-template-rows: auto 1fr;
  }
}
```

### Additive properties (`:not()` and `20em < width <= 40em )`)

- **Rule**: Use `:not()` and range queries (e.g. `@media (20em < width <= 40em)`) to create additive styles.
- **Constraint**: Avoid overriding styles (e.g. `div { margin: 1rem; &:first-child { margin-block-start: 0; } }`)
- **Rationale**: Simplifies the mental model because you don't have to keep track of which styles are being overridden.
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

## Typography

### Fluid type sizes (`clamp()`)

- **Rule**: Use `clamp()` for font sizes to create harmonious rhythmic scales that are appropriate to the screen size, e.g. Major Second (1.125) on narrow viewports and Major Third (1.25) wide ones.
- **Constraint**: Avoid fixed font sizes (e.g., `px`, `rem`) and central values without an addition (e.g. `clamp(1.75rem, 5cqi, 2.25rem)`).
- **Rationale**: Ensures text is appropriately sized across different viewport sizes and can be zoomed for accessibility.
- **Example**:

```css
:root {
  --medium: clamp(1.3125rem, 1.1821rem + 0.6522cqi, 1.6875rem);
  --large: clamp(1.75rem, 1.5761rem + 0.8696cqi, 2.25rem);
}
```

### Widow and orphan words (`text-wrap`)

- **Rule**: Use `text-wrap` with `pretty` or `balance` to avoid widow and orphan words.
- **Constraint**: Avoid default wrapping outside of inputs and text areas.
- **Rationale**: Improves the readability and aesthetics of text blocks.
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

## Colors

### Perceptual uniform lightness (`oklch()`)

- **Rule**: Use `oklch()` for all colors.
- **Constraint**: Avoid `hex`, `rgb()`, `hsl()` and other color formats.
- **Rationale**: Easier to maintain perceptual uniform lightness to ensure text is accessible regardless of background color.
- **Example**:

```css
:root {
  --success: oklch(40% 0.15 150deg);
  --danger: oklch(40% 0.2 25deg);
}
```

### Respecting color preferences (`color-scheme`)

- **Rule**: Use `color-scheme` and `light-dark()` to support color schemes.
- **Constraint**: Avoid hardcoding colors that don't adapt to light and dark modes.
- **Rationale**: Improves accessibility by respecting a person's preference for light or dark mode.
- **Example**:

```css
body {
  color-scheme: light dark;
  background-color: light-dark(oklch(98% 0.03 250deg), oklch(14% 0 0deg));
}
```

### Relative color functions (`oklch(from /* .. */)` & `color-mix()` )

- **Rule**: Use relative color syntax (e.g. `oklch(from var(--primary) l + 10%)`) and functions (e.g. `color-mix()`) to create color relationships.
- **Constraint**: Avoid hardcoding colors that relate to other colors.
- **Rationale**: Creates a cohesive color palette that is easier to maintain and adjust.
- **Example**:

```css
button {
  background-color: var(--primary);

  &:hover {
    background-color: oklch(from var(--primary) l c calc(h - 10deg));
  }
}
```

## Layout

### Container queries and units (`container`)

- **Rule**: Use `container` queries and units (e.g. `cqi`, `cqb`) for responsive layouts.
- **Constraint**: Avoid fixed units for spacing (e.g. `padding-block: 16px`, `margin-inline: 1rem`) as they create hard edges and seams.
- **Rationale**: Improves modularity and reusability as components adapt to their container size, and work across all device sizes not just a few.
- **Example**:

```css
.card {
  container: card / inline-size;
  padding: 2cqi;
}
```

### Intrinsic sizing (`*-content`)

- **Rule**: Use intrinsic sizing (e.g. `max-inline-size: fit-content`, `block-size: max-content`).
- **Constraint**: Avoid fixed sizes (e.g. `width: 300px`, `height: 200px`) for content elements.
- **Rationale**: Improves flexibility and prevents overflow issues as content determines its own size.
- **Example**:

```css
nav {
  max-inline-size: fit-content;
}
```

## Motion

### Respecting motion preferences (`prefers-reduced-motion`)

- **Rule**: Use `prefers-reduced-motion: no-preference` when applying large animations and transitions.
- **Constraint**: Avoid `prefers-reduced-motion: reduce`.
- **Rationale**: Respects a person's preferences for motion to prevent motion sickness and improve accessibility.
- **Example**:

```css
@media (prefers-reduced-motion: no-preference) {
  .hero {
    animation: bounce-in 0.5s ease;
  }
}
```
