/* Meridian Core's background: applies the chosen look and handles the settings shortcut. */
"use strict";
/* global browser, MERIDIAN_THEMES */

const systemDark = matchMedia("(prefers-color-scheme: dark)");

async function applyTheme() {
  const { theme = "system" } = await browser.storage.local.get("theme");
  let id = theme;
  let content;
  if (theme === "system" || !MERIDIAN_THEMES[theme]) {
    // "Device" follows Windows. Web pages follow Windows too, which also keeps this page's
    // prefers-color-scheme tracking Windows rather than the theme we apply.
    id = systemDark.matches ? "dark" : "light";
    content = "system";
  }
  const t = MERIDIAN_THEMES[id];
  await browser.theme.update({
    colors: t.colors,
    properties: { color_scheme: t.scheme, content_color_scheme: content || t.scheme },
  });
}

systemDark.addEventListener("change", applyTheme);
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.theme) applyTheme();
});
browser.commands.onCommand.addListener(name => {
  if (name === "open-settings") browser.runtime.openOptionsPage();
});
applyTheme();
