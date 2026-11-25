# Meridian (working name)

A professional browser built on Firefox's Gecko engine. It is the serious sibling of the hobby browser Aeris.

- Research: `../reports/Professional Gecko browser research.md`.
- UI prototype: `prototype/index.html`. Run it with the `meridian-ui` launch config (port 8577).
- UI rules and where each idea came from: `UI-REFERENCE.md`.

## What's in this folder

| Path | What it is |
|---|---|
| `firefox-version.txt` | The Firefox ESR release Meridian is built on (`153.8.0esr`). |
| `version.txt` | Meridian's own version. |
| `prepare.sh` | Turns a plain Firefox source folder into Meridian (branding, settings, Meridian Core). |
| `mozconfig` | Build options: Windows x64, Meridian branding, no telemetry, no crash reporter. |
| `prefs.js` | Meridian's default settings (Strict tracking protection, AI off, full URLs, side tabs…). |
| `tools/brand.py` | Renames Firefox's unofficial branding to Meridian and redraws every icon. |
| `tools/core.py` | Packs `core/` into the browser as a built-in add-on. |
| `tools/trim.py` | Leaves Firefox extras (the Mozilla VPN add-on) out of the build. |
| `icon/Meridian Icon.png` | The app icon as designed. `icon/icon.png` is the copy the build uses (1024 × 1024). |
| `core/` | **Meridian Core**: the theme, frame shapes, New Tab and Settings. |
| `.github/workflows/build.yml` | Builds Meridian on GitHub's computers. |

## How Meridian is put together

Meridian is Firefox ESR with as few changes to Firefox's own code as possible (none so far). Everything that
makes it Meridian lives in **Meridian Core**, a built-in add-on at `resource://builtin-addons/meridian/`:

- **Look**: `background.js` applies one of five themes (Device, Light, Semi-dark, Dark, Eye comfort)
  through Firefox's theme API. `chrome/frame.css` changes only shapes (filled address bar, pill tabs).
- **New Tab**: `newtab/`. The sun's path, a greeting, search, six shortcuts and a changeable backdrop.
- **Settings**: `settings/` (Ctrl+,). Meridian's own choices, plus "All settings" for Firefox's full page.
- **Privileged part**: `api/parent.js` styles each window, sets the New Tab page, and can change
  only a fixed list of Firefox settings.

Firefox ESR 153 already has vertical tabs, tab groups, split view, tab unloading, hover previews and
profiles. Meridian turns these on instead of rebuilding them.

## Building

Builds run on GitHub (Actions → **Build Meridian** → Run workflow). This is the same method Aeris uses:
the Firefox source is downloaded, `prepare.sh` runs, and Windows x64 is cross-compiled on Linux.
The first build takes several hours. The result is a zip (and an installer) under the run's artifacts.

## Stages

1. **Done (not yet built):** build pipeline, branding, default settings, themes, frame shapes, New Tab, Settings.
2. Setup on first run (theme, side or top tabs, import, default browser as an opt-in).
3. The address bar as command palette (`@` tabs, `>` commands, `!` site search) and Ctrl+K.
4. Contexts (workspace + container), side panel with notes and web panels, focus mode.
5. Before any public release: **signed updates** (signed MAR files), code signing (SignPath or
   Azure Artifact Signing, held by a parent), a final name, and a license choice for Meridian's own files.

## Design decisions from the research
- **Familiar first.** On first run you choose vertical or horizontal tabs.
- **Contexts.** One idea combines workspaces, containers and an accent colour.
- **No surprises.** Close buttons keep their place, sleeping tabs are dimmed, nothing nags.
- **AI and privacy.** AI is off by default. The default privacy setting is Strict tracking protection.
- **Updates.** Always signed; security releases within 24–48 h of Mozilla's.
