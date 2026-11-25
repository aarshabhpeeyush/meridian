/* Makes Meridian's own pages (New Tab, Settings) use the same colours as the window frame,
   by reading the current theme from Firefox and turning it into CSS variables. */
"use strict";
/* global browser */

async function meridianLook() {
  let colors = {};
  let scheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  try {
    const t = await browser.theme.getCurrent();
    colors = t?.colors || {};
    scheme = t?.properties?.color_scheme || scheme;
  } catch {}
  const r = document.documentElement.style;
  const set = (name, value) => value && r.setProperty(name, value);
  set("--frame", colors.frame);
  set("--hair", colors.toolbar_bottom_separator);
  set("--field", colors.toolbar_field);
  set("--hover", colors.button_background_hover);
  set("--active", colors.tab_selected);
  set("--press", colors.button_background_active);
  set("--text", colors.toolbar_text);
  set("--icon", colors.icons);
  set("--menu", colors.popup);
  set("--focus", colors.toolbar_field_border_focus);
  document.documentElement.dataset.scheme = scheme;
}
meridianLook();
browser.theme.onUpdated.addListener(meridianLook);
