---
type: regex
target: { source: file, path: styles.css }
pattern: '&\s+[^{\s]'
match: not_contains
---
