---
type: regex
target: { source: file, path: styles.css }
pattern: '\b(margin|padding|border)-(top|right|bottom|left)\b|(?<![\w-])(min-|max-)?(width|height)\s*:|text-align\s*:\s*(left|right)\b'
match: not_contains
---
