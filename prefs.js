
// ================= Meridian =================
// Meridian's default settings, added to the branding prefs at build time (see prepare.sh).
// Every one of these can still be changed in Settings or about:config.

// ---- Quiet start: no Firefox welcome, "what's new" or default-browser nagging ----
pref("browser.startup.homepage_override.mstone", "ignore");
pref("browser.aboutwelcome.enabled", false);
pref("startup.homepage_welcome_url", "");
pref("startup.homepage_welcome_url.additional", "");
pref("startup.homepage_override_url", "");
pref("browser.messaging-system.whatsNewPanel.enabled", false);
pref("browser.shell.checkDefaultBrowser", false);
pref("browser.startup.page", 3); // open where you left off

// ---- Tabs: on the side by default, with Firefox's own groups, split view and unloading ----
pref("sidebar.revamp", true);
pref("sidebar.verticalTabs", true);
pref("browser.tabs.groups.enabled", true);
pref("browser.tabs.splitView.enabled", true);
pref("browser.tabs.unloadOnLowMemory", true);
pref("browser.tabs.hoverPreview.enabled", true);

// ---- Address bar: show the whole address ----
pref("browser.urlbar.trimURLs", false);
pref("browser.urlbar.trimHttps", false);
pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
pref("browser.urlbar.suggest.trending", false);

// ---- Privacy: the "Professional" preset is Strict tracking protection ----
pref("browser.contentblocking.category", "strict");

// ---- AI features are off until you turn them on ----
pref("browser.ml.chat.enabled", false);
pref("browser.ml.chat.sidebar", false);
pref("browser.ml.chat.shortcuts", false);
pref("browser.ml.linkPreview.enabled", false);
pref("browser.tabs.groups.smart.enabled", false);

// ---- No sponsored content, stories or Pocket ----
pref("browser.newtabpage.activity-stream.showSponsored", false);
pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
pref("extensions.pocket.enabled", false);

// ---- No usage data, studies or remote experiments ----
pref("datareporting.policy.dataSubmissionEnabled", false);
pref("datareporting.healthreport.uploadEnabled", false);
pref("toolkit.telemetry.enabled", false);
pref("toolkit.telemetry.unified", false);
pref("toolkit.telemetry.archive.enabled", false);
pref("app.shield.optoutstudies.enabled", false);
pref("app.normandy.enabled", false);
pref("browser.discovery.enabled", false);

// ---- Firefox extras: Meridian is its own browser, not a front door to Mozilla's other products ----
// Mozilla VPN (its built-in add-on is also removed from the build by tools/trim.py)
pref("browser.vpn_promo.enabled", false);
pref("browser.contentblocking.report.hide_vpn_banner", true);
pref("browser.ipProtection.enabled", false);
// Firefox Relay email masks and "More from Mozilla" in Settings
pref("signon.firefoxRelay.feature", "disabled");
pref("browser.preferences.moreFromMozilla", false);
// Firefox Labs and remote experiments/rollouts
pref("browser.preferences.experimental.hidden", true);
pref("nimbus.rollouts.enabled", false);
pref("messaging-system.rsexperimentloader.enabled", false);
// Sidebar: only History and Bookmarks (no AI chat, Synced tabs or Open tabs icons)
pref("sidebar.main.tools", "history,bookmarks");
// Firefox's own New Tab page is never shown (Meridian has its own), so it is never loaded early either
pref("browser.newtab.preload", false);
// Other Mozilla product cards and promos
pref("browser.promo.focus.enabled", false);
pref("browser.promo.pin.enabled", false);
pref("browser.contentblocking.report.monitor.enabled", false);
pref("browser.contentblocking.report.lockwise.enabled", false);
pref("browser.contentblocking.report.show_mobile_app", false);
pref("identity.fxaccounts.toolbar.pxiToolbarEnabled", false);

// Note: add-on signature checks stay ON (xpinstall.signatures.required is left at Firefox's default).
