#!/usr/bin/env bash
# Turns a plain Firefox ESR source folder into Meridian: branding, default settings and Meridian Core.
# Usage: ./prepare.sh <firefox source folder>
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
src="$(cd "$1" && pwd)"

# Branding: start from Firefox's "unofficial" branding (no Mozilla trademarks), then rename and re-icon it
rm -rf "$src/browser/branding/meridian"
cp -r "$src/browser/branding/unofficial" "$src/browser/branding/meridian"
python3 "$here/tools/brand.py" "$src/browser/branding/meridian" "$here/icon/icon.png"
cp "$here/mozconfig" "$src/mozconfig"

# Take out Firefox extras Meridian doesn't ship (Mozilla VPN add-on)
python3 "$here/tools/trim.py" "$src"

# Meridian Core, the built-in part that gives Meridian its look, New Tab and settings
python3 "$here/tools/core.py" "$src"

# Default settings
cat "$here/prefs.js" >> "$src/browser/branding/meridian/pref/firefox-branding.js"
# Websites see the Firefox version Meridian is built on (as LibreWolf, Floorp and Zen do),
# so sites such as addons.mozilla.org work normally.
major="$(cut -d. -f1 "$here/firefox-version.txt")"
echo "pref(\"general.useragent.override\", \"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${major}.0) Gecko/20100101 Firefox/${major}.0\");" \
  >> "$src/browser/branding/meridian/pref/firefox-branding.js"

# Source patches (kept as few as possible; none yet)
for p in "$here"/patches/*.patch; do
  [ -e "$p" ] || continue
  echo "Applying $(basename "$p")"
  patch -d "$src" -p1 --forward < "$p"
done
