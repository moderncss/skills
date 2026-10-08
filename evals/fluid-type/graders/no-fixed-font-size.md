---
type: regex
target: { source: file, path: styles.css }
pattern: 'font-size\s*:\s*\d*\.?\d+(px|rem)\s*;'
match: not_contains
---
