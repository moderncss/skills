---
type: regex
target: { source: file, path: styles.css }
pattern: '#[0-9a-f]{3,8}\b|\b(rgb|hsl)a?\('
flags: i
match: not_contains
---
