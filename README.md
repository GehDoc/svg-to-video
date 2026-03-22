# SVG to Video (svg-to-video)

A high-fidelity tool to render CSS-animated SVGs into MP4 videos.

## 🌐 Web Studio (New!)

Prefer a GUI? Our **[Web Studio](https://gehdoc.github.io/svg-to-video/)** is a serverless, client-side rendering tool. It runs entirely in your browser using **WebCodecs**—your SVG files never leave your computer, ensuring absolute privacy.

---

## 🚀 CLI / Docker Tool

A high-fidelity command-line tool to render CSS-animated SVGs into MP4 videos using Puppeteer.

Unlike standard converters that often struggle with complex CSS keyframes or transitions, this tool uses **Puppeteer** to frame-accurately scrub through the **Web Animations API**, ensuring every frame is captured exactly as the browser renders it.

## 🚀 Features

- **Frame-Accurate Rendering**: Uses `requestAnimationFrame` and `animation.currentTime` to ensure no dropped frames.
- **CSS Animation Support**: Handles `--play-state`, keyframes, and transitions.
- **Customizable Output**: Control duration, FPS, and post-animation "hold" time.
- **Automated Cleanup**: Temporary frames are automatically removed, but can be kept with the `--keep-frames` flag.

## 🐳 Running with Docker (Recommended)

Using Docker is the most reliable way to run this tool. It ensures that **Google Chrome**, **FFmpeg**, and all Linux dependencies are perfectly configured, regardless of your host OS.

> **Note:** The initial build installs a full browser environment. It may take 2–5 minutes, but subsequent runs are near-instant.

```bash
# 1. Set your user IDs (Linux/Fedora) and build
export UID=$(id -u)
export GID=$(id -g)
docker compose build

# 2. Run a render
docker compose run --rm svg-to-video /app/data/examples/example.svg 13 60 /app/data/out-dir --hold 2
```

_Note: Local paths must be prefixed with `/app/data/` inside the container to match the volume mount._

---

## 🛠 Local Installation

If you prefer to run the script natively, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **FFmpeg**: Required for encoding the image sequence into an MP4.
  - _Ubuntu/Debian:_ `sudo apt install ffmpeg`
  - _macOS:_ `brew install ffmpeg`

```bash
git clone https://github.com/GehDoc/svg-to-video.git
cd svg-to-video
npm install
```

## 📖 Usage

Whether running via Docker or natively, the command structure remains the same:

```bash
node src/index.js <svgPath> <duration> <fps> <outDir> [options]
```

### Arguments

| Argument   | Description                                               |
| ---------- | --------------------------------------------------------- |
| `svgPath`  | Path to the input `.svg` file.                            |
| `duration` | Desired animation length in seconds (e.g., `5`).          |
| `fps`      | Frames per second (e.g., `30` or `60`).                   |
| `outDir`   | Directory where frames and the final video will be saved. |

**💡 Note for Docker users:**

> Because the project folder is mounted to `/app/data` inside the container, you must prefix your paths with `/app/data/`.  
> **Example:** Use `/app/data/example.svg` instead of `./example.svg`.

### Options

| Option                 | Description                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `-h, --hold <seconds>` | Number of seconds to freeze the last frame at the end of the video. (Default: `0`) |
| `-f, --force`          | Overwrite the output video if it already exists.                                   |
| `--keep-frames`        | Prevents the automatic deletion of temporary `.png` frames after video creation.   |

### Environment Variables

| Variable         | Scope     | Description                                                                                                                                       |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUPPETEER_ARGS` | Runtime   | Additional arguments passed directly to the Puppeteer `launch` method. Useful for custom browser flags (e.g., `--proxy-server`, `--disable-gpu`). |
| `DOCKER_TEST`    | E2E Tests | Set to `true` when running end-to-end tests inside a Docker container. Adjusts file paths to match the `/app/data` volume mount.                  |

### 🛠 Troubleshooting (Fedora / SELinux)

If you encounter `Permission Denied` errors on Fedora, ensure the `:Z` flag is present in your `docker-compose.yml` volumes to allow SELinux relabeling.

### Output Handling

The tool creates the video in the specified `<outDir>`. The filename will match your input file. By default, it will **fail** if the destination file already exists to prevent accidental overwrites. Use `-f` to bypass this.

- **Input:** `my-animation.svg`
- **Result:** `./out-dir/my-animation.mp4`

### Example

Render a 13-second animation at 60 FPS and hold the final frame for 2 seconds. By default, temporary frames are deleted.

```bash
node ./src/index.js ./examples/example.svg 13 60 out-dir/ --hold 2
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

## 🤝 Contributing

For instructions on contributing, build commands, and the technical roadmap, please see [DEVELOPER.md](./DEVELOPER.md).

## 🛠 Technical Details

The script performs the following steps:

1. **Injection**: Loads the SVG into a headless Chrome instance via Puppeteer.
2. **Scrubbing**: Pauses all animations and manually increments `animation.currentTime` for each frame based on the requested FPS.
3. **Capture**: Takes a screenshot of the SVG element for every calculated frame.
4. **Encoding**: Calls `ffmpeg` using a `tpad` filter (if `hold` is specified) to generate a high-quality H.264 MP4 file.

## 📜 License

This project is licensed under the **MIT License**.
