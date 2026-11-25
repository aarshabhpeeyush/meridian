/* New Tab backdrops, shared by the New Tab page and Settings. Each one says whether it is light
   or dark, so the page can switch its text colours and stay readable. */
"use strict";

const MERIDIAN_BACKDROPS = [
  { id: "none", name: "None", css: "", swatch: "var(--frame)" },
  { id: "lines", name: "Meridians", css: "", swatch: "radial-gradient(circle at 50% 150%,transparent 44%,var(--text-3) 45%,transparent 46%,transparent 62%,var(--text-3) 63%,transparent 64%),var(--frame)" },
  { id: "sun", name: "Follow the sun", css: "", swatch: "linear-gradient(90deg,#f6c9b8,#cfe6fb 35%,#7a4a7e 70%,#0d1022)" },
  { id: "dawn", name: "Dawn", tone: "light", css: "linear-gradient(165deg,#fbe6d6 0%,#f5cbbb 45%,#cdb9e6 100%)" },
  { id: "noon", name: "Noon", tone: "light", css: "linear-gradient(180deg,#cde5fb 0%,#eaf4fd 60%,#f7fafc 100%)" },
  { id: "dusk", name: "Dusk", tone: "dark", css: "linear-gradient(175deg,#272c58 0%,#6d467a 55%,#d9826a 100%)" },
  { id: "night", name: "Night", tone: "dark", css: "radial-gradient(ellipse at 50% 125%,#2a3768 0%,#121633 55%,#0a0c1c 100%)" },
  { id: "sand", name: "Sand", tone: "light", css: "#ebe4d6" },
  { id: "slate", name: "Slate", tone: "dark", css: "#2e3338" },
];

/* Which backdrop to draw right now ("Follow the sun" changes through the day). */
function meridianBackdrop(id, image) {
  if (id === "sun") {
    const h = new Date().getHours();
    id = h >= 5 && h < 10 ? "dawn" : h >= 10 && h < 17 ? "noon" : h >= 17 && h < 20 ? "dusk" : "night";
  }
  if (id === "custom") {
    return image
      ? { id, tone: "dark", css: `linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url("${image}") center/cover no-repeat` }
      : MERIDIAN_BACKDROPS[0];
  }
  return MERIDIAN_BACKDROPS.find(b => b.id === id) || MERIDIAN_BACKDROPS[0];
}

/* Shrinks a picked image so it is quick to draw and small to keep (at most 1920 px wide). */
function meridianShrinkImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) return reject(new Error("Choose an image file"));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1920 / img.width);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That image could not be opened")); };
    img.src = url;
  });
}
