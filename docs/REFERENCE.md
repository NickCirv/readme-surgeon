# Command reference

Use `node bin/surgeon.js` from the pinned source checkout described in the [README](../README.md). The entries below describe the inspected implementation.

| Command or argument | Behavior |
| --- | --- |
| `TARGET` | Accept a local file path or a GitHub repository URL. |
| `--score` | Print the scoring presentation without the improved README. |
| `--json` | Emit score data as JSON. |
| `--fix` | Overwrite the local README with generated copy; remote targets are rejected and no backup is created. |

For prerequisites, file writes, external services and known limitations, see [Behavior and limits](../README.md#behavior-and-limits).

Implementation: [src/index.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/index.js), [src/fetcher.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/fetcher.js), [src/scorer.js](https://github.com/NickCirv/readme-surgeon/blob/8f645ec4416f48616fa287127fc726aeb10a866d/src/scorer.js); [review evidence](RESEARCH.md).
