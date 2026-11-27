# CLI Usage

The tool is built to run in a headless environment, making it perfect for CI/CD pipelines or server-side automation.

- 📦 **npm Package**: [`@gehdoc/svg-to-video`](https://www.npmjs.com/package/@gehdoc/svg-to-video)
- 🐳 **Docker Hub Image**: [`gehdoc/svg-to-video`](https://hub.docker.com/r/gehdoc/svg-to-video)

### 🌐 Remote / Published Usage (Users)

```bash
# Run on-demand via npx from npmjs registry
npx -y -p @gehdoc/svg-to-video svg-to-video <svgPath> <fps> <outDir> [options]

# Custom video resolution (e.g., vertical video 1080x1920 or square video 1080x1080)
npx -y -p @gehdoc/svg-to-video svg-to-video input.svg 60 ./out --resolution 1080x1920

# Run official Docker image from Docker Hub
docker run --rm --user $(id -u):$(id -g) --shm-size=2gb -v $(pwd):/data:Z gehdoc/svg-to-video /data/<svgPath> <fps> /data/<outDir> [options]
```

### 🛠 Local Development & Building (Contributors)

```bash
# Build TypeScript CLI source and run compiled ES module locally
npm run build && node dist/src/index.js <svgPath> <fps> <outDir> [options]

# Fast development execution directly from TypeScript source
npx tsx src/index.ts <svgPath> <fps> <outDir> [options]
```

> **Contributor Note**: For detailed local building, testing, Docker image creation, and tarball verification instructions, please see **[CONTRIBUTING.md](../CONTRIBUTING.md#commands--testing-strategy)**.

## Arguments

| Argument  | Description                         |
| --------- | ----------------------------------- |
| `svgPath` | Path to the input `.svg` file.      |
| `fps`     | Frames per second (e.g., 60).       |
| `outDir`  | Directory to save frames and video. |

## Options

| Option                  | Default                           | Description                                                                                                                                                                             |
| ----------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-d, --duration <secs>` | _auto-detected_                   | Desired animation duration in seconds. If omitted, duration is auto-detected from SVG styles/attributes.                                                                                |
| `--format <format>`     | `mp4` (`webm` if `--transparent`) | Output format: `mp4`, `webm`, `mkv`, `mov`, `gif`, `apng`, or `png`.                                                                                                                    |
| `-h, --hold <seconds>`  | `0`                               | Number of seconds to freeze the last frame at the end of the video.                                                                                                                     |
| `-f, --force`           | `false`                           | Overwrite the output video if it already exists.                                                                                                                                        |
| `--resolution <preset>` | `original`                        | Resolution preset (`720p`, `1080p`, `original`) or custom dimension string (`WIDTHxHEIGHT`, e.g., `1080x1920`, `1080x1080`).                                                            |
| `--scale <number>`      | `1`                               | Scale factor for original resolution (1-4). Only used with `--resolution original`.                                                                                                     |
| `--transparent`         | `false`                           | Render with a transparent background (supported for `webm`, `gif`, `apng`, `mov`). Can be used with `--bg-color` for formats requiring color keying (e.g., `gif`).                      |
| `--bg-color <hex>`      | _none_                            | Background color for the video (e.g., `#ffffff`, `#000000`). If omitted, no background fill is applied. Can be combined with `--transparent` for GIF color keying to remove edge halos. |
| `--metadata <items...>` | _none_                            | Metadata tags to inject (e.g., `--metadata title=MyVideo`). Mandatory attribution is automatically appended to the 'comment' tag for video and image exports.                           |
| `--bitrate <rate>`      | _none_                            | Target video bitrate (e.g. `5M`, `2000k`) for video formats (`mp4`, `webm`, `mkv`, `mov`). When omitted, video encoders default to CRF constant quality mode.                           |
| `--crf <value>`         | `20` (mp4/mkv/mov)                | Constant Rate Factor (`0`-`63`) for video formats (e.g. `18`-`28`). Ignored if `--bitrate` is explicitly set without `--crf`.                                                           |
| `--quality <level>`     | `100` (gif)                       | Quality/compression level (`1`-`100`) for animated exports (`gif` palette max colors from 16 to 256, `apng` zlib compression from 1 to 9).                                              |
| `--keep-frames`         | `false`                           | Prevents the automatic deletion of temporary `.png` frames after video creation.                                                                                                        |
| `--ffmpeg-path <path>`  | _auto_                            | Explicit path to custom FFmpeg binary executable (overrides system `PATH` and `FFMPEG_PATH`).                                                                                           |
| `-q, --quiet`           | `false`                           | Suppress interactive progress output.                                                                                                                                                   |
| `--silent`              | `false`                           | Alias for `--quiet`.                                                                                                                                                                    |
| `--json`                | `false`                           | Output final conversion result as JSON (implies quiet mode).                                                                                                                            |

> **Note on Video Quality & Rate-Control Parameters**: `--bitrate`, `--crf`, and `--quality` do not have universal default values because their relevance depends on the selected output format. Omitting them allows each format generator to select its native default rate-control mode (e.g., pure CRF 20 for MP4/MKV, native VP9 quality for WebM, 256-color palette for GIF) without triggering conflicting encoder flags.

## Environment Variables

| Variable                    | Scope   | Description                                                                                                                                       |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DO_NOT_TRACK`              | Runtime | Set to `1` or `true` to opt out of anonymous Umami telemetry event tracking.                                                                      |
| `FFMPEG_PATH`               | Runtime | Explicit path to host FFmpeg binary executable (overrides system `PATH`).                                                                         |
| `PUPPETEER_EXECUTABLE_PATH` | Runtime | Explicit path to host Chrome or Chromium binary executable for rendering fallback.                                                                |
| `PUPPETEER_ARGS`            | Runtime | Additional arguments passed directly to the Puppeteer `launch` method. Useful for custom browser flags (e.g., `--proxy-server`, `--disable-gpu`). |

## Output Handling & Process Signals

The tool creates the output file in the specified `<outDir>`. The filename will match your input file with the chosen extension (`.mp4`, `.webm`, `.gif`, `.apng`, etc.). By default, it will **fail** if the destination file already exists to prevent accidental overwrites. Use `-f` to bypass this.

- **Input:** `my-animation.svg` (default)
- **Result:** `./out-dir/my-animation.mp4`

- **Input:** `my-animation.svg` (`--format gif`)
- **Result:** `./out-dir/my-animation.gif`

### Process Cancellation (SIGINT / SIGTERM)

If execution is interrupted (e.g. via `Ctrl+C` / `SIGINT` or `SIGTERM`), the CLI cleanly cancels rendering, emits a `conversion-cancel` telemetry event, cleans up temporary frames (unless `--keep-frames` was passed), flushes analytics, and exits with status code 130.
