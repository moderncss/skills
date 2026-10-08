---
type: regex
target: { source: file, path: styles.css }
pattern: '(?<![-\w])(block-size|height)\s*:\s*\d*\.?\d+(px|rem|em)\s*;'
match: not_contains
---
