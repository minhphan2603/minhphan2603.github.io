# Minh Phan — Portfolio

[![Quality](https://github.com/minhphan2603/minhphan2603.github.io/actions/workflows/quality.yml/badge.svg)](https://github.com/minhphan2603/minhphan2603.github.io/actions/workflows/quality.yml)

Recruiter-focused portfolio for [Minh Phan](https://www.linkedin.com/in/minhphan2603/), a full-stack engineer working across AI products, visual design tooling, and production SaaS systems.

## Engineering principles

- **One source of truth:** everything served in production lives under `site/`.
- **Deterministic output:** each build replaces `public/`; stale artifacts cannot survive.
- **Dependency-light:** development, validation, and serving use Node.js built-ins.
- **Automated invariants:** repository checks cover syntax, required assets, local links, HTML IDs, JSON-LD, and external-link safety.

## Requirements

- Node.js 18.17 or newer

No dependency installation is required for local development.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Build and serve the portfolio at `http://127.0.0.1:8080` |
| `npm run build` | Create a clean production build in `public/` |
| `npm run check` | Validate source structure, assets, metadata, and JavaScript syntax |
| `npm test` | Run the repository quality gate |
| `npm run clean` | Remove generated output |
| `npm run deploy` | Validate, build, and publish `public/` with `gh-pages` |

Set `PORT` to use a different local preview port.

## Project structure

```text
.
├── .github/workflows/quality.yml  # Continuous quality checks
├── scripts/
│   ├── build.mjs                  # Clean, deterministic production build
│   ├── check.mjs                  # Dependency-free repository validation
│   ├── clean.mjs                  # Generated-output cleanup
│   └── serve.mjs                  # Path-safe local HTTP server
└── site/
    ├── assets/                    # Profile image and recruiter-ready CV
    ├── index.html                 # Semantic content and structured metadata
    ├── script.js                  # Progressive interactions
    └── styles.css                 # Responsive visual system
```

`public/` is generated and intentionally excluded from version control.

## Deployment

The deployment command publishes the generated `public/` directory to GitHub Pages:

```bash
npm run deploy
```

Repository checks also run on every push and pull request through GitHub Actions.
