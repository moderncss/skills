---
type: regex
target: { source: file, path: styles.css }
pattern: '\(\s*(min|max)-(width|height|inline-size|block-size)\s*:'
match: not_contains
---
