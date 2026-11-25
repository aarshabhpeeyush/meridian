/* Meridian Core's privileged part. It is part of the browser (a built-in add-on), not a normal
   extension, so it can do the few things the extension APIs can't:
   - put Meridian's frame styles (chrome/frame.css) into every browser window
   - make Meridian's New Tab the real new tab page, with no "an extension changed this" warning
   - read and change a short, fixed list of Firefox settings for Meridian's Settings page
   Everything else lives in background.js and the pages, using the normal extension APIs. */
"use strict";
/* global ExtensionAPI, ChromeUtils, Services, Ci */

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  AboutNewTab: "resource:///modules/AboutNewTab.sys.mjs",
  CustomizableUI: "moz-src:///browser/components/customizableui/CustomizableUI.sys.mjs",
});

// Firefox toolbar buttons Meridian takes off on first start. Done once (remembered in a pref),
// so if someone adds one back in Customize Toolbar, it stays.
const REMOVE_BUTTONS = ["firefox-view-button"];
function removeFirefoxButtons() {
  const done = "meridian.firstRun.removedButtons";
  if (Services.prefs.getBoolPref(done, false)) return;
  for (const id of REMOVE_BUTTONS) {
    try {
      if (lazy.CustomizableUI.getPlacementOfWidget(id)) lazy.CustomizableUI.removeWidgetFromArea(id);
    } catch (e) {
      console.error(`Meridian: could not remove ${id}`, e);
    }
  }
  Services.prefs.setBoolPref(done, true);
}

// The only Firefox settings Meridian's Settings page may read or change, and their type.
const PREFS = {
  "sidebar.revamp": "bool",
  "sidebar.verticalTabs": "bool",
  "browser.urlbar.trimURLs": "bool",
  "browser.urlbar.trimHttps": "bool",
  "browser.contentblocking.category": "string",
  "browser.ml.chat.enabled": "bool",
  "browser.tabs.unloadOnLowMemory": "bool",
  "browser.tabs.splitView.enabled": "bool",
  "browser.uidensity": "int",
};
const GET = { bool: "getBoolPref", string: "getStringPref", int: "getIntPref" };
const SET = { bool: "setBoolPref", string: "setStringPref", int: "setIntPref" };

let frameSheet = null;
const isBrowserWindow = win => win.document.documentElement.getAttribute("windowtype") === "navigator:browser";
const browserWindow = () => Services.wm.getMostRecentWindow("navigator:browser");

function dress(win) {
  if (!frameSheet || !isBrowserWindow(win)) return;
  try {
    win.windowUtils.loadSheet(frameSheet, win.windowUtils.AUTHOR_SHEET);
  } catch (e) {
    console.error("Meridian: could not style a window", e);
  }
}
function undress(win) {
  try {
    win.windowUtils.removeSheet(frameSheet, win.windowUtils.AUTHOR_SHEET);
  } catch {}
}
const windowWatcher = {
  observe(win, topic) {
    if (topic === "domwindowopened") win.addEventListener("load", () => dress(win), { once: true });
  },
};

this.meridian = class extends ExtensionAPI {
  onStartup() {
    const { extension } = this;
    // resource:// URL of the built-in add-on's files, which browser windows are allowed to load
    frameSheet = Services.io.newURI(extension.rootURI.resolve("chrome/frame.css"));
    for (const win of Services.wm.getEnumerator("navigator:browser")) {
      if (win.document.readyState === "complete") dress(win);
      else win.addEventListener("load", () => dress(win), { once: true });
    }
    Services.ww.registerNotification(windowWatcher);
    removeFirefoxButtons();

    const newTab = extension.baseURI.resolve("newtab/index.html");
    try {
      lazy.AboutNewTab.newTabURL = newTab;
    } catch (e) {
      console.error("Meridian: could not set the New Tab page", e);
    }
    // The Home button and new windows show the same page (set as a default, so a person's own
    // choice in Settings still wins).
    Services.prefs.getDefaultBranch("").setStringPref("browser.startup.homepage", newTab);
  }

  onShutdown(isAppShutdown) {
    if (isAppShutdown) return;
    Services.ww.unregisterNotification(windowWatcher);
    for (const win of Services.wm.getEnumerator("navigator:browser")) undress(win);
    try {
      lazy.AboutNewTab.resetNewTabURL();
    } catch {}
  }

  getAPI(context) {
    const check = name => {
      const type = PREFS[name];
      if (!type) throw new context.cloneScope.Error(`Meridian can't change ${name}`);
      return type;
    };
    return {
      meridian: {
        async getPref(name) {
          const type = check(name);
          return Services.prefs[GET[type]](name);
        },
        async setPref(name, value) {
          const type = check(name);
          if (type === "bool" && typeof value !== "boolean") throw new context.cloneScope.Error("Expected true or false");
          if (type === "int" && !Number.isInteger(value)) throw new context.cloneScope.Error("Expected a whole number");
          if (type === "string" && typeof value !== "string") throw new context.cloneScope.Error("Expected text");
          Services.prefs[SET[type]](name, value);
        },
        async openFirefoxSettings(pane) {
          const win = browserWindow();
          if (win) win.openPreferences(pane || undefined);
        },
        async openImport() {
          const win = browserWindow();
          if (!win) return;
          const MU = win.MigrationUtils;
          if (MU?.showMigrationWizard) MU.showMigrationWizard(win, { entrypoint: MU.MIGRATION_ENTRYPOINTS?.PREFERENCES });
          else win.openPreferences("paneGeneral");
        },
      },
    };
  }
};
