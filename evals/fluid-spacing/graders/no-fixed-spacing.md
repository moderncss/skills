---
type: regex
target: { source: file, path: styles.css }
pattern: '\b(padding|margin|gap)(-[a-z-]+)?\s*:\s*\d*\.?\d+(px|rem)\s*;'
match: not_contains
---
