# How real browsers draw their UI (checked 2026-11-23)

Sources: Helium's official interface screenshots (helium.computer/landing/interface/*.avif), Floorp's hero screenshot, Zen's hero video, and Firefox's tabs.css values from the earlier research. Chrome values come from Chrome's 2023 "Refresh" design.

## Helium (the cleanest)
- **Colour:** the frame is the **same white as the page**. The page is set apart only by a 1px light-grey hairline, with a rounded top-left corner in vertical mode. There is no tinted frame, no accent colour and no shadows.
- **Address bar:** a flat light-grey filled field (about #efefef) with no border and about 8px radius. It shows the domain only, centred. The tracking/site-info icon sits at its left.
- **Vertical tabs:**
  - Rows are about 34px tall, with a real favicon and 13–14px regular text.
  - The active tab is a flat light-grey pill (about 10px radius) with a ×. Inactive tabs have no background at all.
  - "+ New Tab" is faint grey text at the end of the list.
- **Toolbar:** in vertical mode the window controls, sidebar toggle, back, forward and reload sit in one row above the sidebar. The address bar sits over the page column.
- **Horizontal "compact":** one row holds the address bar on the left and the tabs on the right. The active tab is a grey pill and inactive tabs are separated by a thin vertical divider.
- **Icons:** plain monochrome outlines (Chromium's vector icons). Extension icons are in colour.

## Chrome (Refresh 2023)
- The tab strip is a tinted band. The active tab is the same colour as the toolbar and flows into it, with curved feet at the bottom.
- The address bar is a fully rounded pill filled light grey. The neutral "tune" icon replaced the padlock.
- Menus are white with about 8px radius and 32px rows. There are no coloured highlights; hover is grey.

## Firefox (Proton / Nova)
- Tabs are 32px (28px compact) and 76–225px wide. The active tab is a raised white "card" on the grey strip.
- The address bar is a filled field that turns into a dropdown panel when focused. The dropdown is part of the address bar, not a separate dialog.

## Floorp / Zen (the "enthusiast" end)
- **Floorp** is Firefox plus extras: tab-stack row, workspace button and a right-hand panel bar. It is functional but crowded.
- **Zen** has a glassy translucent frame, the address field inside the sidebar, the page as a floating rounded card, and "essentials" tiles. It looks lovely, but it is the aesthetic end, not the professional end.

## What made Meridian v2 look "AI-made"
- Letter-in-a-coloured-square favicons. Real browsers show real favicons.
- Accent colour on the frame, coloured context tags and highlighted search matches. Professional browsers keep the frame neutral.
- A command palette floating in the middle of the screen as its own dialog. Real browsers grow it out of the address bar.
- Bordered address field, lots of small borders and boxes. Real browsers use filled fields and hairlines.
- Invented websites with generic "Overview/Activity" content.

## Rules for Meridian v3
1. **Frame colour:** the frame is the page's colour (white, or #1f1f1f in dark). Only hairlines (#e3e3e3, or #333 in dark) separate parts.
2. **Address bar:** a flat filled field (#f1f1f1, or #2a2a2a in dark), 8px radius, 32px high, no border. It shows the host in full colour and the path in grey, and opens as a dropdown in place.
3. **Tabs:** 32px rows (28px compact), real favicons, 13px regular text. The active tab is a flat grey pill; inactive tabs have no background. The × appears on hover and on the active tab.
4. **Icons:** monochrome 20px outline icons in a single grey.
5. **No accent colour in the frame.** The Context colour appears only as a 2px dot or bar.
6. **Menus:** white, 8px radius, 32px rows, grey hover, shortcuts in grey on the right.

## v3.1: ideas taken from a 30-browser UI review (2026-11-25)

**Added, and where each idea came from**
- **First-run setup.** Four steps: theme with a live preview, tab position and density, import, then tips. *Vivaldi / DuckDuckGo onboarding; Zen gives no theme preview.* Making Meridian the default browser is an opt-in switch, and it never asks again. *Opera sets itself as default and pins itself without asking; DuckDuckGo nags you and won't stop.*
- **Customizable toolbar.** Every button can be hidden in Settings › Toolbar and side panel; right-click the toolbar to get there. No button appears twice. *Chrome / Firefox / Safari; Floorp has two back buttons and two reload buttons.*
- **Rebindable keyboard shortcuts.** One table drives every shortcut. Conflicts are handled for you (the old binding is cleared and a message says so). *Floorp, Vivaldi.*
- **Settings with real categories and a search box.** *Vivaldi and Chrome; Opera puts everything on one long page.*
- **Tab search button.** In the strip, the sidebar foot and optionally the toolbar. It opens the address bar in `@` mode. *Chrome.*
- **Address bar prefixes.** `@` for tabs, `>` for commands, `!` for site search (`!w`, `!gh`, `!mdn`, `!yt`, `!bz`). *Min's `!` commands.*
- **Tab right-click menu.** Add to group or new group (name and colour), open in split view with any tab, pin, snooze, move to another context, duplicate, unload. *Chrome groups; SigmaOS snooze and any-two-tab split.*
- **Group right-click menu.** Rename, colour, new tab in group, ungroup, close, and **Save and close group**. Saved groups and snoozed tabs live under "Saved for later". *Edge Collections, Opera Pinboards.*
- **Group tabs by site.** Plain rules, no AI. *Arc's "Tidy tabs", minus the AI.*
- **Side panel.** Notes, reading list, history, downloads and web panels that open *inside* the panel. Each item is removable. *Vivaldi web panels; Brave's panels just open a full tab; Edge lets you remove everything.*
- **Notes with clipping.** Select text on a page and an "Add to notes" chip appears. Notes keep the source link, and there is a New note button. *Beam, Arc Easel, Floorp notes; Surf's notes page has no "new note" button.*
- **Focus mode.** Hides all the UI; point at the top or left edge to bring it back. It has a visible toolbar button and a shortcut. *Orion focus mode; Zen compact mode, which has no button.*
- **Forget.** Deletes this site, or the last 15 minutes or 2 hours, and closes the matching tabs. "Stay signed in" in the site info menu protects a site. *DuckDuckGo's Fire button and Fireproof, toned down.*
- **Customize this site.** Zoom, font, a forced dark page and hiding cookie banners, all per site. *Orion Tweaks, Arc Boosts.*
- **Screenshot.** Drag an area, or take the visible area or the full page. *Edge, Vivaldi.*
- **Keyboard link hints.** Ctrl+Shift+Space shows letters on links; Shift opens the link in a new tab. *Vieb, qutebrowser.*
- **Task manager.** Memory per tab, unload buttons, Shift+Esc. *Opera's resource view, Chrome's task manager.*
- **Multi-row tabs.** An option for tabs on top. *Floorp.*

**Considered and left out on purpose**
- Colour-coded toolbar icons (DuckDuckGo): they break rule 4 (monochrome icons).
- A theme colour that changes with every tab (Min), and the "magic" colour outline (SigmaOS): too busy for a professional browser.
- A brand colour painted into the frame (Brave): it breaks rule 5.
- AI chat in the sidebar or agent features (Dia, Comet, Opera Neon): AI stays off by default.
- Tab trails or a tab tree (Horse): the user stopped that work, so it waits for them to ask again.
