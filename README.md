# SVG to Video

[![CI](https://github.com/GehDoc/svg-to-video/actions/workflows/ci.yml/badge.svg)](https://github.com/GehDoc/svg-to-video/actions/workflows/ci.yml)
[![GitHub Release](https://img.shields.io/github/v/release/GehDoc/svg-to-video?color=blue)](https://github.com/GehDoc/svg-to-video/releases)
[![Last Commit](https://img.shields.io/github/last-commit/GehDoc/svg-to-video)](https://github.com/GehDoc/svg-to-video/commits/main)

[![Social Preview](./docs/assets/social-preview.svg)](https://gehdoc.github.io/svg-to-video/)

A high-fidelity tool to render CSS-animated SVGs into high-quality videos (MP4, WebM, MKV, MOV).

## 🚀 Getting Started

Choose the entry point that matches your needs:

- **[Web Studio](https://gehdoc.github.io/svg-to-video/)**: The easiest way to convert SVGs in your browser without any installation.
- **[CLI / Docker Tool](#-cli--docker-tool)**: For batch processing, server-side automation, and CI/CD integration.

---

## 🌟 Why SVG to Video?

- **Privacy-First**: The Web Studio runs entirely in your browser using **WebCodecs**—your SVG files never leave your computer.
- **Frame-Accurate**: Our engine scrubs the **Web Animations API**, ensuring every frame is captured exactly as rendered.
- **Transparent Backgrounds**: Export your animations with a full alpha channel using WebM, perfect for overlays in video editing tools like Premiere or DaVinci Resolve.
- **Metadata Injection**: Support for custom video titles and comments. Mandatory attribution is automatically appended to the end of the video's comment metadata. Note: We use the `comment` tag for attribution because FFmpeg/MP4 container support for custom tags like `encoded_by` is inconsistent across platforms.
- **Versatile**: Whether you need an accessible [Web Studio](#web-studio) for quick conversions or a powerful [CLI tool](#cli--docker-tool) for batch automation and CI/CD pipelines, this project has you covered.

## 🌐 Web Studio

**[🚀 Try the Web Studio](https://gehdoc.github.io/svg-to-video/)**

Our **Web Studio** is a serverless, client-side rendering tool. It runs entirely in your browser using **WebCodecs**—your SVG files never leave your computer, ensuring absolute privacy.

> **Privacy Note**: We use [Umami Analytics](https://umami.is/) to collect anonymous usage data (e.g., number of conversions) to help us improve the tool. This tracking is cookie-less, respects "Do Not Track" settings, and never collects personal information.

Explore our **[Visual Gallery (Storybook)](https://gehdoc.github.io/svg-to-video/storybook/)** to see how the engine handles complex CSS and fonts.

### Quick Start

1. Open the [Web Studio](https://gehdoc.github.io/svg-to-video/).
2. Drag and drop your `.svg` file.
3. Adjust resolution, duration, and FPS.
4. Select your format, toggle **Transparent Background** if needed, and ensure **High-Fidelity Capture** is enabled for best results.
5. Click **Export**.

---

## 🚀 CLI / Docker Tool

For automated or batch processing, use the CLI tool. It is built to run in a headless environment, making it perfect for CI/CD pipelines or server-side automation.

### Quick Start

Ensure [Node.js](https://nodejs.org/) and [FFmpeg](https://ffmpeg.org/) are installed.

```bash
# Node.js (auto-detected duration)
npm install
npx tsx src/index.ts examples/example.svg 60 ./out-dir

# Node.js (explicit duration)
npx tsx src/index.ts examples/example.svg 60 ./out-dir -d 5

# Docker
docker compose build
docker compose run --rm svg-to-video examples/example.svg 60 ./out-dir -d 5
```

See [docs/CLI.md](./docs/CLI.md) for full usage, arguments, and options.

## 🤝 Contributing

Contributions are welcome! This project follows a **Spec-Driven Development (SDD)** workflow to ensure clear requirements and high quality. Please open an issue or pull request.

Check out our [Active Roadmap](./specs/pending/) to see what we're working on next.

For instructions on contributing, build commands, and the technical roadmap, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 🛠 Technical Details

For a deep dive into the rendering engine, algorithms, and infrastructure, see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

The tool works by isolating the SVG, scrubbing the Web Animations API, and capturing frames via WebCodecs or FFmpeg.

## 📜 License

This project is licensed under the **MIT License**.
