# Spec: Fix GH Pages Caching Issue

**GitHub Issue**: N/A
**Status**: 🟡 In Progress

## 🎯 Objective

Fix the issue where users see an old version of the Web Studio on GitHub Pages unless they force a reload. This is caused by aggressive caching and incorrect integration of `coi-serviceworker.js`.

## 🛠 Technical Strategy

1.  **Relocate `coi-serviceworker.js`**: Move it from `src/` to `public/`. This ensures it's served from the root, giving it the correct Service Worker scope (`/`) and preventing Vite from bundling it as a module.
2.  **Correct Registration**: Update `index.html` to load `coi-serviceworker.js` as a regular script (not `type="module"`). This allows `document.currentScript` to work, which is required for its self-registration logic.
3.  **Bypass Cache for SW**: Add a version query parameter to the script URL in `index.html` (e.g., `coi-serviceworker.js?v=0.11.0`) to force the browser to check for a new Service Worker when the app version changes.
4.  **SW Update Logic**: Ensure the Service Worker lifecycle (skipWaiting/claim) is correctly handled so that updates take effect immediately upon reload.
5.  **Headers**: Ensure `vite.config.ts` base path is correctly handled.

## ✅ Task List

- [x] **Infrastructure**
  - [x] Move `web/src/coi-serviceworker.js` to `web/public/coi-serviceworker.js`.
  - [x] Update `web/index.html` to reference `/coi-serviceworker.js` as a regular script.
  - [x] Add versioning to the script tag in `web/index.html`.
- [x] **Verification**
  - [x] Run a production build and verify `coi-serviceworker.js` is present in `dist/`.
  - [x] Verify `index.html` contains the correct script tag.
  - [ ] (Manual) Verify that `crossOriginIsolated` is true in a local production preview.

## 🧪 Verification Plan

- [ ] **Build Check**: `npm run build -w web` should produce `dist/coi-serviceworker.js`.
- [ ] **Runtime Check**: Open the build in a local server and check `window.crossOriginIsolated` in the console.
- [ ] **Update Check**: Change the version and verify the Service Worker triggers a reload (if possible to test locally).
