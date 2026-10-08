---
type: regex
target: { source: file, path: styles.css }
pattern: 'from\s+var\([^)]+\)\s+[\d.]+%\s+c\s+h\s*\)'
match: not_contains
---
