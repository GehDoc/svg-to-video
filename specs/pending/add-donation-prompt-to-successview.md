# Spec: add-donation-prompt-to-successview

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Improve project sustainability and UI cleanliness by:

1. Adding a subtle donation prompt to the `SuccessView` component.
2. Redesigning the `Header` to include a prominent "Sponsor" button and a burger menu for secondary information (version, license, links).

## 🛠 Technical Strategy

- Update `SuccessView.tsx` and `SuccessView.scss`.
- Redesign `Header.tsx` and `Header.scss`.
- Implement a `HeaderMenu` component (or integrated logic) for the burger menu dropdown.
- Use `shared/funding.ts` for all donation links.

## ✅ Task List

- [x] **Component Update: SuccessView**
  - [x] Add donation prompt markup to `SuccessView.tsx`.
- [x] **Styling: SuccessView**
  - [x] Style `.success-support` in `SuccessView.scss`.
- [ ] **Component Update: Header**
  - [ ] Add "Sponsor" button to `Header.tsx`.
  - [ ] Add Burger menu trigger and dropdown menu to `Header.tsx`.
  - [ ] Move Version and License info into the dropdown.
  - [ ] Add "Report an Issue" and "View Source Code" links to the dropdown.
- [ ] **Styling: Header**
  - [ ] Update `Header.scss` to handle the new layout.
  - [ ] Style the dropdown menu to match project aesthetics.
- [ ] **Testing**
  - [ ] Create `HeaderMenu.test.tsx` and verify menu toggle and links.
- [ ] **Verification**
  - [ ] Verify Header functionality and responsiveness.
  - [ ] Verify SuccessView integration.

## 🧪 Verification Plan

- [ ] Manual test: Perform a render, navigate to the `SuccessView`, and ensure the donation prompt is displayed and link is functional.

## 📝 Change Log

- 2026-05-17: Initial spec created.

## Sample header and burger design

// HTML

<div class="studio-menu-container">
  
  <a href="https://www.paypal.me/gehdoc" target="_blank" rel="noopener noreferrer" class="studio-sponsor-btn">
    <span>💖</span> Sponsor
  </a>

  <button type="button" class="studio-burger-trigger" aria-label="Open menu">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
  </button>

  <div class="studio-dropdown-card">
    
    <div class="studio-menu-section">
      <span class="studio-menu-label">Help & Feedback</span>
      <a href="https://github.com/GehDoc/svg-to-video/issues" target="_blank" rel="noopener noreferrer" class="studio-menu-link">
        <span>🐛</span> Report an Issue
      </a>
    </div>

    <div class="studio-menu-section">
      <span class="studio-menu-label">Back the Project</span>
      <a href="https://github.com/GehDoc/svg-to-video" target="_blank" rel="noopener noreferrer" class="studio-menu-link">
        <span>📦</span> View Source Code
      </a>
      <a href="https://www.paypal.me/gehdoc" target="_blank" rel="noopener noreferrer" class="studio-menu-link">
        <span>☕</span> Buy me a Coffee
      </a>
    </div>

    <div class="studio-menu-section">
      <span class="studio-menu-label">About</span>

      <a href="https://github.com/GehDoc/svg-to-video/releases" target="_blank" rel="noopener noreferrer" class="studio-meta-link">
        <div class="meta-left"><span>🏷️</span> Version</div>
        <span class="studio-version-tag">v0.11.1 ↗</span>
      </a>

      <a href="https://github.com/GehDoc/svg-to-video/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="studio-meta-link">
        <div class="meta-left"><span>⚖️</span> License</div>
        <span class="studio-link-arrow">MIT ↗</span>
      </a>
    </div>

  </div>
</div>

// CSS
/_ --- Header & Dropdown Layout Container --- _/
.studio-menu-container {
position: relative;
display: flex;
align-items: center;
gap: 16px;
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/_ --- Persistent Sponsor Button --- _/
.studio-sponsor-btn {
display: inline-flex;
align-items: center;
gap: 6px;
padding: 6px 12px;
border-radius: 6px;
font-size: 14px;
font-weight: 500;
text-decoration: none;
background-color: #fff0f3; /_ Light soft pink _/
color: #da3751; /_ Premium brand red/pink _/
transition: background-color 0.2s ease, transform 0.1s ease;
}

.studio-sponsor-btn:hover {
background-color: #ffe0e6;
}

.studio-sponsor-btn:active {
transform: scale(0.98);
}

/_ --- Burger Menu Trigger Icon --- _/
.studio-burger-trigger {
background: none;
border: none;
padding: 8px;
cursor: pointer;
border-radius: 6px;
color: #4a5568; /_ Slate gray _/
display: flex;
align-items: center;
justify-content: center;
transition: background-color 0.2s ease;
}

.studio-burger-trigger:hover {
background-color: #edf2f7;
}

.studio-burger-trigger svg {
width: 24px;
height: 24px;
}

/_ --- The Absolute Positioned Card Box --- _/
.studio-dropdown-card {
position: absolute;
right: 0;
top: 48px;
width: 224px; /_ 56rem equivalent _/
background-color: #ffffff;
border: 1px solid #e2e8f0;
border-radius: 8px;
box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
padding: 8px 0;
z-index: 50;
display: flex;
flex-direction: column;
}

/_ --- Menu Sections & Separation lines --- _/
.studio-menu-section {
padding: 0 8px 8px 8px;
}

.studio-menu-section:not(:last-child) {
border-bottom: 1px solid #f1f5f9;
margin-bottom: 8px;
}

.studio-menu-section:not(:first-child) {
padding-top: 8px;
}

/_ --- Section Labels (Non-clickable Headers) --- _/
.studio-menu-label {
display: block;
padding: 4px 12px;
text-transform: uppercase;
font-size: 11px;
font-weight: 600;
color: #94a3b8; /_ Soft gray capital letters _/
letter-spacing: 0.05em;
}

/_ --- Interactive Action Links --- _/
.studio-menu-link {
display: flex;
align-items: center;
gap: 8px;
padding: 8px 12px;
font-size: 14px;
color: #334155;
text-decoration: none;
border-radius: 6px;
transition: background-color 0.2s ease, color 0.2s ease;
}

.studio-menu-link:hover {
background-color: #f8fafc;
color: #0f172a;
}

/_ --- About & Metadata Links (Two-Column rows) --- _/
.studio-meta-link {
display: flex;
justify-content: space-between;
align-items: center;
padding: 6px 12px;
font-size: 12px;
color: #64748b;
text-decoration: none;
border-radius: 6px;
transition: background-color 0.2s ease, color 0.2s ease;
}

.studio-meta-link:hover {
background-color: #f8fafc;
color: #1e293b;
}

.studio-meta-link .meta-left {
display: flex;
align-items: center;
gap: 6px;
}

/_ --- Badge & External Arrow accents --- _/
.studio-version-tag {
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
background-color: #f1f5f9;
color: #475569;
padding: 2px 6px;
border-radius: 4px;
font-size: 11px;
}

.studio-meta-link:hover .studio-version-tag {
background-color: #e2e8f0;
}

.studio-link-arrow {
color: #94a3b8;
font-size: 10px;
}
