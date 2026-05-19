# Analytics Implementation (Umami)

This document outlines the event tracking strategy for the Web Studio using [Umami Analytics](https://umami.is/).

## Event Schema

| Event Name           | Trigger                      | Properties                         |
| :------------------- | :--------------------------- | :--------------------------------- |
| `Open Converter`     | User clicks the upload area  | N/A                                |
| `conversion-start`   | Render process begins        | `format`, `isTransparent`          |
| `conversion-success` | Render process completes     | `format`, `isTransparent`          |
| `conversion-failed`  | Render process errors out    | `error`, `format`, `isTransparent` |
| `conversion-cancel`  | User cancels the render      | `format`, `isTransparent`          |
| `copy-to-clipboard`  | User clicks "Copy"           | `type`, `success`                  |
| `download-result`    | User clicks "Download"       | `format`, `isTransparent`          |
| `back-to-studio`     | User clicks "Back to Studio" | `format`, `isTransparent`          |

## Implementation Guidelines

- **Safety Checks**: Always use `typeof umami !== 'undefined'` before calling `umami.track`.
- **Environment**: Tracking is disabled in local development environments (localhost) and CI/CD pipelines to prevent data pollution.
- **Privacy**: Tracking is cookie-less and respects Do Not Track settings.
