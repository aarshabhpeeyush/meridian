/* Meridian's own Settings: the choices that make Meridian Meridian. Everything else stays in
   Firefox's full settings page, which is one click away ("All settings"). */
"use strict";
/* global browser, MERIDIAN_THEMES, MERIDIAN_THEME_LIST, MERIDIAN_BACKDROPS, meridianShrinkImage */

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const api = browser.meridian;
let local = {};   // Meridian's own settings (browser.storage.local)
let fx = {};      // the Firefox settings shown here
let section = "appearance";
let query = "";

const FX = ["sidebar.verticalTabs", "browser.uidensity", "browser.urlbar.trimURLs", "browser.contentblocking.category", "browser.ml.chat.enabled", "browser.tabs.unloadOnLowMemory"];

/* ---------- Controls ---------- */
const seg = (key, value, options) => `<span class="seg" role="group">${options.map(([v, label]) => `<button data-seg="${key}" data-v="${v}" class="${String(v) === String(value) ? "on" : ""}" aria-pressed="${String(v) === String(value)}">${label}</button>`).join("")}</span>`;
const sw = (key, on, label) => `<button class="sw" role="switch" data-sw="${key}" aria-checked="${!!on}" aria-label="${esc(label)}"></button>`;
const btn = (act, label) => `<button class="b2" data-act="${act}">${label}</button>`;
function themeTiles() {
  const cur = local.theme || "system";
  return `<div class="tiles">${MERIDIAN_THEME_LIST.map(([id, name]) => {
    const p = id === "system" ? { frame: "linear-gradient(135deg,#fff 50%,#1f1f1f 50%)", field: "#9a9a9a", hair: "#9a9a9a" } : MERIDIAN_THEMES[id].preview;
    return `<button class="th${id === cur ? " on" : ""}" data-theme="${id}" aria-pressed="${id === cur}" style="--f:${p.frame};--fl:${p.field};--hl:${p.hair}"><span class="pv"><s></s><i></i><b></b></span>${name}</button>`;
  }).join("")}</div>`;
}
function backdropTiles() {
  const cur = local.backdrop || "none";
  const list = [...MERIDIAN_BACKDROPS, ...(local.bdimg ? [{ id: "custom", name: "Your image", swatch: `url("${local.bdimg}")` }] : [])];
  return `<div class="tiles">${list.map(b => `<button class="bdsw${b.id === cur ? " on" : ""}" data-bd="${b.id}" aria-pressed="${b.id === cur}"><i style='background:${b.swatch || b.css};background-size:cover;background-position:center'></i>${esc(b.name)}</button>`).join("")}</div>`;
}

/* ---------- Sections: [title, description, control, extra content below, search words] ---------- */
function sections() {
  return [
    { id: "appearance", name: "Appearance", rows: [
      ["Theme", "Device follows Windows light or dark.", "", themeTiles(), "dark light semi eye comfort colour color mode"],
      ["Tabs", "Side shows full titles. Top saves width.", seg("sidebar.verticalTabs", fx["sidebar.verticalTabs"], [[true, "Side"], [false, "Top"]]), "", "vertical horizontal layout"],
      ["Density", "Compact fits more on screen.", seg("browser.uidensity", fx["browser.uidensity"] === 1 ? 1 : 0, [[0, "Normal"], [1, "Compact"]]), "", "size small"],
      ["Show full URLs", "Show the whole address, not just the site.", sw("fullurl", !fx["browser.urlbar.trimURLs"], "Show full URLs"), "", "address bar"],
    ] },
    { id: "newtab", name: "New tab", rows: [
      ["Greeting", "Time of day and the sun's path.", sw("greet", local.greet !== false, "Greeting"), "", "sun"],
      ["Backdrop", "A colour, a gradient, or your own picture.", btn("upload", "Upload image"), backdropTiles(), "background wallpaper image picture"],
    ] },
    { id: "privacy", name: "Privacy and AI", rows: [
      ["Tracking protection", "Strict also blocks fingerprinting. A few sites may break.", seg("browser.contentblocking.category", fx["browser.contentblocking.category"] === "strict" ? "strict" : "standard", [["standard", "Standard"], ["strict", "Strict"]]), "", "trackers ads"],
      ["AI features", "Off. Nothing is sent to an AI service unless you turn this on.", sw("browser.ml.chat.enabled", fx["browser.ml.chat.enabled"], "AI features"), "", "chatbot assistant"],
    ] },
    { id: "performance", name: "Performance", rows: [
      ["Unload inactive tabs", "Frees memory when Windows runs low. Tabs keep their place.", sw("browser.tabs.unloadOnLowMemory", fx["browser.tabs.unloadOnLowMemory"], "Unload inactive tabs"), "", "sleep memory"],
    ] },
    { id: "data", name: "Your data", rows: [
      ["Import from another browser", "Bookmarks, passwords and history from Chrome, Edge or another browser.", btn("import", "Import"), "", "chrome edge arc migrate"],
      ["All settings", "Passwords, downloads, languages, search and everything else.", btn("firefox", "Open"), "", "more preferences"],
    ] },
    { id: "about", name: "About Meridian", rows: [
      [`Meridian ${esc(browser.runtime.getManifest().version)}`, "Based on Firefox ESR 153, made by Mozilla and its contributors.", "", "", "version"],
    ] },
  ];
}
function draw() {
  const secs = sections();
  $("#nav").innerHTML = secs.map(s => `<button data-sec="${s.id}" class="${!query && s.id === section ? "on" : ""}">${s.name}</button>`).join("");
  const row = r => `<div class="srow"><div class="g">${r[0]}${r[1] ? `<small>${r[1]}</small>` : ""}</div>${r[2] || ""}</div>${r[3] || ""}`;
  const q = query.trim().toLowerCase();
  let html;
  if (!q) {
    const s = secs.find(x => x.id === section) || secs[0];
    html = `<h3>${s.name}</h3><div class="card">${s.rows.map(row).join("")}</div>`;
  } else {
    const hits = secs.map(s => ({ s, rows: s.rows.filter(r => `${s.name} ${r[0]} ${r[1]} ${r[4] || ""}`.toLowerCase().includes(q)) })).filter(x => x.rows.length);
    html = hits.length ? hits.map(({ s, rows }) => `<h3>${s.name}</h3><div class="card">${rows.map(row).join("")}</div>`).join("") : `<p class="empty">No settings match “${esc(query)}”.</p>`;
  }
  $("#out").innerHTML = html;
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 3500);
}

/* ---------- Changes ---------- */
async function setFx(name, value) {
  try {
    await api.setPref(name, value);
    fx[name] = value;
  } catch (e) {
    toast(e.message);
  }
  draw();
}
document.addEventListener("click", async e => {
  const t = e.target.closest("[data-sec],[data-theme],[data-bd],[data-seg],[data-sw],[data-act]");
  if (!t) return;
  if (t.dataset.sec) { section = t.dataset.sec; query = ""; $("#q").value = ""; draw(); return; }
  if (t.dataset.theme) { await browser.storage.local.set({ theme: t.dataset.theme }); return; }
  if (t.dataset.bd) { await browser.storage.local.set({ backdrop: t.dataset.bd }); return; }
  if (t.dataset.seg) {
    const name = t.dataset.seg, raw = t.dataset.v;
    const value = raw === "true" ? true : raw === "false" ? false : /^\d+$/.test(raw) ? Number(raw) : raw;
    if (name === "sidebar.verticalTabs" && value) await api.setPref("sidebar.revamp", true);
    return setFx(name, value);
  }
  if (t.dataset.sw) {
    const on = t.getAttribute("aria-checked") !== "true";
    if (t.dataset.sw === "greet") return browser.storage.local.set({ greet: on });
    if (t.dataset.sw === "fullurl") return setFx("browser.urlbar.trimURLs", !on);
    return setFx(t.dataset.sw, on);
  }
  const act = t.dataset.act;
  if (act === "upload") $("#file").click();
  if (act === "import") api.openImport();
  if (act === "firefox") api.openFirefoxSettings();
});
$("#q").addEventListener("input", e => { query = e.target.value; draw(); });
$("#file").addEventListener("change", async e => {
  const file = e.target.files[0];
  e.target.value = "";
  try {
    await browser.storage.local.set({ bdimg: await meridianShrinkImage(file), backdrop: "custom" });
    toast("Backdrop updated");
  } catch (err) {
    toast(err.message);
  }
});
browser.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "local") return;
  local = await browser.storage.local.get();
  draw();
});

(async () => {
  local = await browser.storage.local.get();
  for (const name of FX) {
    try { fx[name] = await api.getPref(name); } catch {}
  }
  const hash = location.hash.slice(1);
  if (sections().some(s => s.id === hash)) section = hash;
  draw();
})();
