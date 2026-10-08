# Contributing

Thank you for wanting to contribute!

Use [npm](https://docs.npmjs.com):

```sh
npm install
```

## Commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run check`   | Linting and formatting   |
| `npm run test`    | Playwright tests         |
| `npm run preview` | Preview production build |
| `npm run build`   | Production build         |

## Evals

The [`evals/`](evals/) directory holds a [`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals) case per rule.

To run every case once per arm, from the repo root:

```sh
claude plugin eval . --allow-tools Write --runs 1 --no-publish --model opus
```

To run one case or one section, add `--case <name>` or `--tag <section>`. To skip the no-skill baseline while tuning a grader, add `--ablation none`.
