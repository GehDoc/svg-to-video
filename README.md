# SVG to Video (svg-to-video)

A high-fidelity command-line tool to render CSS-animated SVGs into MP4 videos.

Unlike standard converters that often struggle with complex CSS keyframes or transitions, this tool uses **Puppeteer** to frame-accurately scrub through the **Web Animations API**, ensuring every frame is captured exactly as the browser renders it.

## 🚀 Features

- **Frame-Accurate Rendering**: Uses `requestAnimationFrame` and `animation.currentTime` to ensure no dropped frames.
- **CSS Animation Support**: Handles `--play-state`, keyframes, and transitions.
- **Customizable Output**: Control duration, FPS, and post-animation "hold" time.
- **Automated Cleanup**: Temporary frames are automatically removed, but can be kept with the `--keep-frames` flag.

## 📋 Prerequisites

Before running the script, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **FFmpeg**: Required for encoding the image sequence into an MP4.
  - _Ubuntu/Debian:_ `sudo apt install ffmpeg`
  - _macOS:_ `brew install ffmpeg`

## ⚙️ Installation

```bash
git clone https://github.com/GehDoc/svg-to-video.git
cd svg-to-video
npm install
```

## 📖 Usage

```bash
node index.js <svgPath> <duration> <fps> <outDir> [options]
```

### Arguments

| Argument   | Description                                               |
| ---------- | --------------------------------------------------------- |
| `svgPath`  | Path to the input `.svg` file.                            |
| `duration` | Desired animation length in seconds (e.g., `5`).          |
| `fps`      | Frames per second (e.g., `30` or `60`).                   |
| `outDir`   | Directory where frames and the final video will be saved. |

### Options

| Option                 | Description                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `-h, --hold <seconds>` | Number of seconds to freeze the last frame at the end of the video. (Default: `0`) |
| `-f, --force`          | Overwrite the output video if it already exists.                                   |
| `--keep-frames`        | Prevents the automatic deletion of temporary `.png` frames after video creation.   |

### Output Handling

The tool creates the video in the specified `<outDir>`. The filename will match your input file. By default, it will **fail** if the destination file already exists to prevent accidental overwrites. Use `-f` to bypass this.

- **Input:** `my-animation.svg`
- **Result:** `./out-dir/my-animation.mp4`

### Example

Render a 13-second animation at 60 FPS and hold the final frame for 2 seconds. By default, temporary frames are deleted.

```bash
node ./index.js ./example.svg 13 60 out-dir/ --hold 2
```

#### Example output

```text
🚀 Starting conversion:
  Source:     example.svg
  Target:     out-dir/example.mp4
  Settings:   13s @ 60fps (Hold: 2s)
  Frames:     780 total
---
🎨 Creating frames...
  [Rendering] Frame 60 / 780
  [Rendering] Frame 120 / 780
  ...
📦 Encoding video with FFmpeg...

🧹 Cleaning up temporary frames...

✅ Done! Video saved to out-dir/example.mp4
```

## 🧑‍💻 Development

This project uses ESLint for linting, Prettier for formatting, and TypeScript for type-checking.

There are two main scripts to help with development:

- `npm run check`: Runs all checks (linting, formatting, and type-checking) to ensure the code is correct. This is the same command that is run in the CI pipeline.
- `npm run fix`: Automatically fixes all linting and formatting issues.

### All Scripts

| Script               | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm run check`      | Runs all checks (lint, format, type-check). |
| `npm run fix`        | Fixes all linting and formatting issues.    |
| `npm run lint`       | Checks for linting issues.                  |
| `npm run lint:fix`   | Fixes linting issues.                       |
| `npm run format`     | Checks for formatting issues.               |
| `npm run format:fix` | Fixes formatting issues.                    |
| `npm run type-check` | Checks for TypeScript type errors.          |

## 🛠 Technical Details

The script performs the following steps:

1. **Injection**: Loads the SVG into a headless Chrome instance via Puppeteer.
2. **Scrubbing**: Pauses all animations and manually increments `animation.currentTime` for each frame based on the requested FPS.
3. **Capture**: Takes a screenshot of the SVG element for every calculated frame.
4. **Encoding**: Calls `ffmpeg` using a `tpad` filter (if `hold` is specified) to generate a high-quality H.264 MP4 file.

## 📜 License

This project is licensed under the **MIT License**.
