# CLI Usage

The tool is built to run in a headless environment, making it perfect for CI/CD pipelines or server-side automation.

```bash
npx tsx src/index.ts <svgPath> <fps> <outDir> [options]
```

## Arguments

| Argument  | Description                         |
| --------- | ----------------------------------- |
| `svgPath` | Path to the input `.svg` file.      |
| `fps`     | Frames per second (e.g., 60).       |
| `outDir`  | Directory to save frames and video. |

## Options

| Option                  | Description                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-d, --duration <secs>` | Desired animation duration in seconds. If omitted, duration is auto-detected.                                                                                 |
| `--format <format>`     | Output format: `mp4`, `webm`, `mkv`, `mov`, `gif`, `apng`, or `png`. (Default: `webm` if `--transparent`, otherwise `mp4`)                                    |
| `-h, --hold <seconds>`  | Number of seconds to freeze the last frame at the end of the video. (Default: `0`)                                                                            |
| `-f, --force`           | Overwrite the output video if it already exists.                                                                                                              |
| `--resolution <preset>` | Resolution preset: `720p`, `1080p`, or `original`. (Default: `original`)                                                                                      |
| `--scale <number>`      | Scale factor for original resolution (1-4). (Default: `1`) - Only used with `--resolution original`.                                                          |
| `--transparent`         | Render with a transparent background (supported for `webm`, `gif`, `apng`, `mov`). (Cannot be used with `--bg-color`)                                         |
| `--bg-color <hex>`      | Background color for the video. (Default: `#ffffff`) - (Cannot be used with `--transparent`)                                                                  |
| `--metadata <items...>` | Metadata tags to inject (e.g., `--metadata title=MyVideo`). Mandatory attribution is automatically appended to the 'comment' tag for video and image exports. |
| `--keep-frames`         | Prevents the automatic deletion of temporary `.png` frames after video creation.                                                                              |

## Environment Variables

| Variable         | Scope   | Description                                                                                                                                       |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUPPETEER_ARGS` | Runtime | Additional arguments passed directly to the Puppeteer `launch` method. Useful for custom browser flags (e.g., `--proxy-server`, `--disable-gpu`). |

## Output Handling

The tool creates the output file in the specified `<outDir>`. The filename will match your input file with the chosen extension (`.mp4`, `.webm`, `.gif`, `.apng`, etc.). By default, it will **fail** if the destination file already exists to prevent accidental overwrites. Use `-f` to bypass this.

- **Input:** `my-animation.svg` (default)
- **Result:** `./out-dir/my-animation.mp4`

- **Input:** `my-animation.svg` (`--format gif`)
- **Result:** `./out-dir/my-animation.gif`
