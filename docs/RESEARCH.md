# Source review — readme-surgeon

## Revision and method

Inspected public commit: [`8f645ec4416f48616fa287127fc726aeb10a866d`](https://github.com/NickCirv/readme-surgeon/commit/8f645ec4416f48616fa287127fc726aeb10a866d). Source tree: `deebc14e1e8fd0b3d7a1677457a4a0b0e9879f67`. Capture scope: all eligible text files; 11 of 11 eligible files.

This review read captured implementation and documentation. It did not install dependencies, execute project commands, call project APIs, check package publication or establish live CI status. Examples are source-derived, not captured execution transcripts.

## Claim ledger

| Claim | Evidence | Status |
| --- | --- | --- |
| API scoring, rewrite modes and overwrite path | [src/index.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/index.js) | Verified in inspected source; execution unverified |
| Local/URL fetching and branch fallback | [src/fetcher.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/fetcher.js) | Verified in inspected source; execution unverified |
| Score parsing | [src/scorer.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/scorer.js) | Verified in inspected source; execution unverified |

## Findings and verification gaps

The model receives README text, not a verified source-code evidence pack. It can introduce unsupported capabilities, installation instructions or claims. `--fix` does not create a documented backup, so review a draft before replacing a file. GitHub fetching tries known README/branch conventions and is not a complete documentation crawler.

The captured smoke test only asks Node to syntax-check the entrypoint. It does not exercise behavior, integrations or failure paths. Neither that test nor installation was run in this review.

| Dimension | Result |
| --- | --- |
| Purpose and documented commands | Partially verified: static source inspection |
| Clean installation and examples | Unverified |
| Test suite and live CI | Unverified |
| Performance and security guarantees | Unverified |
| Publication | Local documentation only |

## Documentation inventory

- [README.md](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/README.md) — Rewritten; historic section anchors retained where practical.
- [LICENSE](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/LICENSE) — protected document preserved unchanged.

## Captured source inventory

- [LICENSE](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/LICENSE) — Git blob `3811be2c8a38d48e758a1c42231da5af9d1a4bb2`.
- [README.md](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/README.md) — Git blob `9627dee201d3236509b24d5c01c0389018aa278c`.
- [package.json](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/package.json) — Git blob `c87f5e78103485e68a7c2dab1776ae3b3872954a`.
- [.github/workflows/ci.yml](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/.github/workflows/ci.yml) — Git blob `44515034a394670de44454a7a1bd2c7ef0c9836e`.
- [bin/surgeon.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/bin/surgeon.js) — Git blob `ee885e29552254834205bb51b18b6637afc53960`.
- [src/fetcher.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/fetcher.js) — Git blob `ed1933767ce7641e65a5cbff3737a895896225e4`.
- [src/formatter.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/formatter.js) — Git blob `a42ee4ddae4733dab8a78bd27118434de428e39b`.
- [src/index.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/index.js) — Git blob `d0a5a9d7182d56d36e721a5ea458ecb70b893353`.
- [src/prompts.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/prompts.js) — Git blob `cfb1a3ada32d279a9289dae42e5cec5d729d28b4`.
- [src/scorer.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/scorer.js) — Git blob `2b70bf7b122b22c0ee5d7336b469c5894f98a683`.
- [test/smoke.test.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/test/smoke.test.js) — Git blob `5661c82d37a661f7307c0bfb430d01c2fc5720bd`.

## Scope boundary

Capture excludes lockfiles, binary artwork, generated output, vendored dependencies and files above the acquisition size limit. The tree records their existence; no verification claim is made for omitted content. Protected documents and historical records are not replaced.

## Reference coverage

Added [command reference](REFERENCE.md) from the argument parser, command handlers and source-defined help at the pinned revision. README examples remain unexecuted.
