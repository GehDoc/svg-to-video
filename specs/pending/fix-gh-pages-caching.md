# Spec: Fix GH Pages Caching Issue

**GitHub Issue**: N/A
**Status**: 🟡 In Progress

## 🎯 Objective

Fix the issue where users see an old version of the Web Studio on GitHub Pages unless they force a reload. This is caused by aggressive caching and incorrect integration of `coi-serviceworker.js`.

## 🛠 Technical Strategy

1.  **Relocate `coi-serviceworker.js`**: Move it from `src/` to `public/`. This ensures it's served from the root, giving it the correct Service Worker scope (`/`) and preventing Vite from bundling it as a module.
2.  **Correct Registration**: Update `index.html` to load `coi-serviceworker.js` as a regular script (not `type="module"`). This allows `document.currentScript` to work, which is required for its self-registration logic.
3.  **Bypass Cache for SW**: Add a version query parameter to the script URL in `index.html`.
4.  **Automate Versioning**: Implement a Vite plugin to inject the `package.json` version into `index.html` automatically.
5.  **SW Update Logic**: Ensure the Service Worker lifecycle (skipWaiting/claim) is correctly handled so that updates take effect immediately upon reload.
6.  **Headers**: Use `%BASE_URL%` in `index.html` to ensure the path is correctly resolved on GitHub Pages subpaths.

## ✅ Task List

- [x] **Infrastructure**
  - [x] Move `web/src/coi-serviceworker.js` to `web/public/coi-serviceworker.js`.
  - [x] Update `web/index.html` to reference `/coi-serviceworker.js` as a regular script.
  - [x] Implement Vite plugin for automated version injection (`%APP_VERSION%`).
- [x] **Release**
  - [x] Sync `web/package.json` and root `package.json` to `0.11.2`.
- [x] **Verification**
  - [x] Run a production build and verify `coi-serviceworker.js` is present in `dist/`.
  - [x] Verify `index.html` contains the correct script tag with subpath and automated version.
  - [x] (Manual) Verify that `crossOriginIsolated` is true in a local production preview.

## 🧪 Verification Plan

- [x] **Build Check**: `npm run build -w web` produces `dist/coi-serviceworker.js`.
- [x] **Runtime Check**: Injected path includes the correct version (0.11.2) from `package.json`.
- [x] **Update Check**: Changing the version triggers a fresh fetch.
