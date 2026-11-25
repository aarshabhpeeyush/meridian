/* Meridian's New Tab: the sun's path, a greeting, search, six shortcuts, and a backdrop. */
"use strict";
/* global browser, MERIDIAN_BACKDROPS, meridianBackdrop, meridianShrinkImage */

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
let prefs = { greet: true, backdrop: "none", bdimg: "" };

/* ---------- The sun's path ---------- */
function sunArc(now) {
  const h = now.getHours() + now.getMinutes() / 60, f = (h - 6) / 12, day = f >= 0 && f <= 1;
  const a = Math.PI * (1 - Math.min(1, Math.max(0, f)));
  const x = (100 + 90 * Math.cos(a)).toFixed(1), y = (56 - 48 * Math.sin(a)).toFixed(1);
  const mins = Math.round((12 - h) * 60);
  const tip = !day ? "The sun is down" : mins > 0 ? `Midday in ${Math.floor(mins / 60)} h ${mins % 60} min` : "Past midday";
  return `<svg class="sun" viewBox="0 0 200 64" role="img" aria-label="${tip}"><title>${tip}. A meridian is the line the sun crosses at midday.</title>
    <path class="hz" d="M0 56.5h200"/><path class="trk" d="M10 56A90 48 0 0 1 190 56"/>${day ? `<path class="done" d="M10 56A90 48 0 0 1 ${x} ${y}"/>` : ""}
    <path class="hz" d="M100 4v3"/><text x="100" y="-2" text-anchor="middle">NOON</text>
    ${day ? `<circle class="orb" cx="${x}" cy="${y}" r="6"/>` : `<path class="moon" d="M104 14a8 8 0 1 1-8-10a6 6 0 0 0 8 10z"/>`}</svg>`;
}
function drawGreeting() {
  const now = new Date(), h = now.getHours();
  $("#greet").hidden = !prefs.greet;
  $("#sun").innerHTML = sunArc(now);
  $("#hello").textContent = h < 5 ? "Up late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  $("#date").textContent = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

/* ---------- Backdrop ---------- */
function globe() {
  let g = '<circle cx="700" cy="860" r="680"/><path d="M700 180v1360"/>';
  for (const k of [15, 30, 45, 60, 75]) g += `<ellipse cx="700" cy="860" rx="${(680 * Math.cos(k * Math.PI / 180)).toFixed(0)}" ry="680"/>`;
  for (const k of [20, 40, 60]) g += `<ellipse cx="700" cy="${(860 - 680 * Math.sin(k * Math.PI / 180)).toFixed(0)}" rx="${(680 * Math.cos(k * Math.PI / 180)).toFixed(0)}" ry="${(80 * Math.cos(k * Math.PI / 180)).toFixed(0)}"/>`;
  return `<svg class="globe" viewBox="0 0 1400 860" aria-hidden="true">${g}</svg>`;
}
function drawBackdrop() {
  const ntp = $("#ntp"), bd = meridianBackdrop(prefs.backdrop, prefs.bdimg);
  ntp.classList.remove("bd-light", "bd-dark");
  if (bd.tone) ntp.classList.add("bd-" + bd.tone);
  ntp.style.background = bd.css || "";
  ntp.querySelector(".globe")?.remove();
  if (bd.id === "lines") ntp.insertAdjacentHTML("afterbegin", globe());
  const list = [...MERIDIAN_BACKDROPS, ...(prefs.bdimg ? [{ id: "custom", name: "Your image", swatch: `url("${prefs.bdimg}")` }] : [])];
  $("#grid").innerHTML = list.map(b => `<button class="bdsw${b.id === prefs.backdrop ? " on" : ""}" data-bd="${b.id}" aria-label="${esc(b.name)} backdrop" aria-pressed="${b.id === prefs.backdrop}"><i style='background:${b.swatch || b.css};background-size:cover;background-position:center'></i>${esc(b.name)}</button>`).join("");
  $("#clear").hidden = !prefs.bdimg;
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 3500);
}
function openPop(open) {
  $("#pop").hidden = !open;
  $("#bdbtn").setAttribute("aria-expanded", open);
}

/* ---------- Shortcuts: the sites you visit most ---------- */
async function drawTiles() {
  let sites = [];
  try {
    sites = await browser.topSites.get({ limit: 12, includeFavicon: true, onePerDomain: true });
  } catch {}
  sites = sites.filter(s => /^https?:/.test(s.url)).slice(0, 6);
  $("#tiles").hidden = !sites.length;
  $("#tiles").innerHTML = sites.map(s => {
    const host = new URL(s.url).hostname.replace(/^www\./, "");
    const name = (s.title && s.title.length < 18 ? s.title : host.split(".")[0]).replace(/^./, c => c.toUpperCase());
    const icon = s.favicon ? `<img src="${esc(s.favicon)}" alt="">` : `<svg class="ic sm" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6.5"/><path d="M3.5 10h13M10 3.5c2 2 2.8 4.2 2.8 6.5S12 14.5 10 16.5C8 14.5 7.2 12.3 7.2 10S8 5.5 10 3.5z"/></svg>`;
    return `<a class="tile" href="${esc(s.url)}" title="${esc(s.title || host)}"><span class="c">${icon}</span><span>${esc(name)}</span></a>`;
  }).join("");
}

/* ---------- Search or go ---------- */
$("#form").addEventListener("submit", async e => {
  e.preventDefault();
  const q = $("#q").value.trim();
  if (!q) return;
  const tab = await browser.tabs.getCurrent();
  const looksLikeUrl = /^[a-z]+:\/\//i.test(q) || (/^[^\s]+\.[a-z]{2,}(\/\S*)?$/i.test(q) && !q.includes(" "));
  if (looksLikeUrl) browser.tabs.update(tab.id, { url: /^[a-z]+:\/\//i.test(q) ? q : "https://" + q });
  else browser.search.search({ query: q, tabId: tab.id });
});

/* ---------- Events ---------- */
$("#bdbtn").addEventListener("click", e => { e.stopPropagation(); openPop($("#pop").hidden); });
document.addEventListener("click", e => { if (!e.target.closest("#pop")) openPop(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") openPop(false); });
$("#grid").addEventListener("click", e => {
  const b = e.target.closest("[data-bd]");
  if (b) browser.storage.local.set({ backdrop: b.dataset.bd });
});
$("#upload").addEventListener("click", () => $("#file").click());
$("#file").addEventListener("change", async e => {
  const file = e.target.files[0];
  e.target.value = "";
  try {
    const bdimg = await meridianShrinkImage(file);
    await browser.storage.local.set({ bdimg, backdrop: "custom" });
    toast("Backdrop updated. It stays on this device.");
    openPop(false);
  } catch (err) {
    toast(err.message);
  }
});
$("#clear").addEventListener("click", () => {
  browser.storage.local.set({ bdimg: "", backdrop: prefs.backdrop === "custom" ? "none" : prefs.backdrop });
});
$("#settings").addEventListener("click", () => browser.runtime.openOptionsPage());

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  for (const k of ["greet", "backdrop", "bdimg"]) if (changes[k]) prefs[k] = changes[k].newValue ?? prefs[k];
  drawGreeting();
  drawBackdrop();
});

(async () => {
  prefs = { ...prefs, ...(await browser.storage.local.get(["greet", "backdrop", "bdimg"])) };
  drawGreeting();
  drawBackdrop();
  drawTiles();
  setInterval(drawGreeting, 60_000);
})();
