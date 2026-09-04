# Analytics Implementation (Umami)

This document outlines the event tracking strategy for the Web Studio using [Umami Analytics](https://umami.is/).

## Event Schema

| Event Name           | Trigger                                               | Properties                                                                                                                                                                  |
| :------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file-load`          | User ingests an SVG via file browser or drag-and-drop | `method` (`file-picker` \| `drag-and-drop`), `aspectRatio` (`square` \| `landscape` \| `portrait` \| `unknown`), `hasAnimation`, `detectedDuration`, `isDimensionsDetected` |
| `click-sponsor`      | User clicks any sponsor/funding link                  | `location` (`header` \| `dropdown` \| `success-view`)                                                                                                                       |
| `conversion-start`   | Render process begins                                 | `format`, `isTransparent`, `captureMethod`, `fps`, `videoDurationSec`                                                                                                       |
| `conversion-success` | Render process completes                              | `format`, `isTransparent`, `captureMethod`, `fps`, `videoDurationSec`, `totalFrames`, `processDurationSec`                                                                  |
| `conversion-failed`  | Render process errors out                             | `error`, `format`, `isTransparent`, `captureMethod`, `processDurationSec`                                                                                                   |
| `conversion-cancel`  | User cancels the render                               | `format`, `isTransparent`, `captureMethod`, `processDurationSec`                                                                                                            |
| `copy-data-url`      | User clicks "Copy Data URL"                           | `success`, `format`, `isTransparent`                                                                                                                                        |
| `download-result`    | User clicks "Download"                                | `format`, `isTransparent`                                                                                                                                                   |
| `back-to-studio`     | User clicks "Back to Studio"                          | `format`, `isTransparent`                                                                                                                                                   |
| `click-issue-report` | User clicks "Report an Issue" in menu                 | N/A                                                                                                                                                                         |
| `click-source-code`  | User clicks "View Source Code" in menu                | N/A                                                                                                                                                                         |

## Implementation Guidelines

- **Safety Checks**: Always use `typeof umami !== 'undefined'` before calling `umami.track`.
- **Environment**: Tracking is disabled in local development environments (localhost) and CI/CD pipelines to prevent data pollution.
- **Privacy**: Tracking is cookie-less, respects Do Not Track settings, and never collects file contents, file names, or personal identifiable information (PII).
