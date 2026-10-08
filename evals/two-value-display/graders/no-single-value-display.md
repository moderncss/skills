---
type: regex
target: { source: file, path: styles.css }
pattern: 'display\s*:\s*(flex|grid|block|inline|inline-block|inline-flex|inline-grid)\s*;'
match: not_contains
---
