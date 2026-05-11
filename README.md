# moderncss.ai

Rules for modern CSS.

## Motivation

Many new CSS features landed in browsers over the past few years, including:

- `@layer` and `@scope` for organising and encapsulating styles
- `@container` queries and units, such as `cqi`, for size-aware components
- `:has()` for relational selectors
- `oklch()` for colour palettes with perceptually uniform lightness
- `light-dark()` for colour-scheme support
- `clamp()` for fluid type and spacing

These features help us create robust interfaces that adapt to users' devices and preferences. They replace older patterns like fixed breakpoints, which produce interfaces with seams and brittle code.

LLMs are capable of writing modern CSS. They just need a nudge to use it, or they'll default to older patterns. The agent skill does that, flagging them and pointing LLMs (and people) towards the newer alternatives.

Other modern CSS agent skills have appeared since. I created this GitHub org to pool our efforts, as Stylelint did for CSS linting.

## Contributing

The rules are a living document. If you've spotted a rule that's missing:

- [Open an issue](https://github.com/moderncss/skills/issues)
- [Contribute it](CONTRIBUTING.md)

## [License](LICENSE)
