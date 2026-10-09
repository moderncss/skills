# moderncss.ai

Opinionated rules for modern CSS, so agents and people write it consistently.

## Motivation

Many new CSS features landed in browsers over the past few years, including:

- `@layer` and `@scope` for organising and encapsulating styles
- `@container` queries and units, such as `cqi`, for size-aware components
- `oklch()` for colour palettes with perceptually uniform lightness
- `light-dark()` for colour-scheme support
- `clamp()` for fluid type and spacing

These features help us create interfaces that adapt to users' devices and preferences. They replace older patterns like fixed breakpoints, which produce interfaces with seams and brittle code.

Left alone, agents default to the outdated CSS they were trained on. The [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) skill fixes that at scale.

It still leaves choices open: which colour space, whether to scope, when to nest, how to size type. The rules in this skill make them once, so agents and people write the same CSS.

## Contributing

Spotted a choice Modern Web Guidance leaves open, or a gap that needs plugging? Propose a rule that settles or plugs it:

- [Open an issue](https://github.com/moderncss/skills/issues)
- [Contribute it](CONTRIBUTING.md)

## [License](LICENSE)
