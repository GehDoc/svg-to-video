# SVG to Video (svg-to-video)

A high-fidelity tool to render CSS-animated SVGs into MP4 videos.

Unlike standard converters that struggle with complex CSS keyframes or transitions, this project provides a unified engine to scrub through the Web Animations API, ensuring every frame is captured exactly as the browser renders it.

## 🌐 Web Studio (New!)

Prefer a GUI? Our **[Web Studio](https://gehdoc.github.io/svg-to-video/)** is a serverless, client-side rendering tool. It runs entirely in your browser using **WebCodecs**—your SVG files never leave your computer, ensuring absolute privacy.

### Quick Start

1. Open the [Web Studio](https://gehdoc.github.io/svg-to-video/).
2. Drag and drop your `.svg` file.
3. Adjust resolution, duration, and FPS.
4. Click **Export MP4**.

## 🚀 CLI / Docker Tool

For automated or batch processing, use the CLI tool. It is built to run in a headless environment, making it perfect for CI/CD pipelines or server-side automation.

### Quick Start

Ensure [Node.js](https://nodejs.org/) and [FFmpeg](https://ffmpeg.org/) are installed.

```bash
npm install
node src/index.js example.svg 5 60 output.mp4
```

### Docker Usage

If you prefer an isolated environment:

```bash
docker compose build
docker compose run --rm svg-to-video example.svg 5 60 output.mp4
```

## 🛠 Features

- **Frame-Accurate Rendering**: Uses Puppeteer (CLI) or WebCodecs (Web) to scrub through the Web Animations API.
- **High-Fidelity Capture**: Handles external fonts and images with robust pre-flight asset checks.
- **Production-Ready**: A hardened Docker environment and automated CI/CD pipeline.

## 📖 CLI Usage

```bash
node src/index.js <svgPath> <duration> <fps> <outDir> [options]
```

### Arguments

| Argument   | Description                         |
| ---------- | ----------------------------------- |
| `svgPath`  | Path to the input `.svg` file.      |
| `duration` | Animation length in seconds.        |
| `fps`      | Frames per second (e.g., 60).       |
| `outDir`   | Directory to save frames and video. |

### Options

| Option                 | Description                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `-h, --hold <seconds>` | Number of seconds to freeze the last frame at the end of the video. (Default: `0`) |
| `-f, --force`          | Overwrite the output video if it already exists.                                   |
| `--keep-frames`        | Prevents the automatic deletion of temporary `.png` frames after video creation.   |

### Environment Variables

| Variable         | Scope   | Description                                                                                                                                       |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUPPETEER_ARGS` | Runtime | Additional arguments passed directly to the Puppeteer `launch` method. Useful for custom browser flags (e.g., `--proxy-server`, `--disable-gpu`). |

### Output Handling

The tool creates the video in the specified `<outDir>`. The filename will match your input file. By default, it will **fail** if the destination file already exists to prevent accidental overwrites. Use `-f` to bypass this.

- **Input:** `my-animation.svg`
- **Result:** `./out-dir/my-animation.mp4`

## 🤝 Contributing

For instructions on contributing, build commands, and the technical roadmap, please see [DEVELOPER.md](./DEVELOPER.md).

## 🛠 Technical Details

The tool works by:

1. **Isolation**: Loading the SVG into a headless browser or isolated iframe.
2. **Scrubbing**: Pausing the animation and manually incrementing `currentTime`.
3. **Capture**: Taking a high-resolution snapshot for every frame.
4. **Encoding**: Using FFmpeg to compile the frames into a high-quality H.264 MP4.

## 📜 License

This project is licensed under the **MIT License**.
