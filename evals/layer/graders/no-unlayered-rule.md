---
type: regex
target: { source: file, path: styles.css }
pattern: '^[a-zA-Z.#:\[*][^{\n]*\{'
flags: m
match: not_contains
---
