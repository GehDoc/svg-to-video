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

| Option                  | Description                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `-d, --duration <secs>` | Desired animation duration in seconds. If omitted, duration is auto-detected.                                                           |
| `-h, --hold <seconds>`  | Number of seconds to freeze the last frame at the end of the video. (Default: `0`)                                                      |
| `-f, --force`           | Overwrite the output video if it already exists.                                                                                        |
| `--resolution <preset>` | Resolution preset: `720p`, `1080p`, or `original`. (Default: `original`)                                                                |
| `--scale <number>`      | Scale factor for original resolution (1-4). (Default: `1`) - Only used with `--resolution original`.                                    |
| `--transparent`         | Render with a transparent background. (Cannot be used with `--bg-color`)                                                                |
| `--bg-color <hex>`      | Background color for the video. (Default: `#ffffff`) - (Cannot be used with `--transparent`)                                            |
| `--metadata <items...>` | Metadata tags to inject (e.g., `--metadata title=MyVideo`). Note: mandatory attribution is automatically appended to the 'comment' tag. |
| `--keep-frames`         | Prevents the automatic deletion of temporary `.png` frames after video creation.                                                        |

## Environment Variables

| Variable         | Scope   | Description                                                                                                                                       |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUPPETEER_ARGS` | Runtime | Additional arguments passed directly to the Puppeteer `launch` method. Useful for custom browser flags (e.g., `--proxy-server`, `--disable-gpu`). |

## Output Handling

The tool creates the video in the specified `<outDir>`. The filename will match your input file. By default, it will **fail** if the destination file already exists to prevent accidental overwrites. Use `-f` to bypass this.

- **Input:** `my-animation.svg`
- **Result:** `./out-dir/my-animation.mp4`
