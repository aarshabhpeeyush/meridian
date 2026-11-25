"""Takes Firefox extras that Meridian doesn't want out of the source before it is built.
Only parts that nothing else in Firefox depends on are deleted here. Extras that are wired into
Firefox's core are switched off in prefs.js instead (see "Firefox extras" there).
Usage: trim.py <firefox source folder>"""
import pathlib, shutil, sys

src = pathlib.Path(sys.argv[1])

# Built-in add-ons to leave out of the build entirely
REMOVE_ADDONS = [
    "ipp-activator",  # Mozilla VPN / IP Protection activation
]

mb = src / "browser/extensions/moz.build"
text = mb.read_text()
for name in REMOVE_ADDONS:
    line = f'    "{name}",\n'
    if line in text:
        text = text.replace(line, "")
        shutil.rmtree(src / "browser/extensions" / name, ignore_errors=True)
        print("Removed built-in add-on:", name)
    else:
        print("Not in this Firefox version (nothing to remove):", name)
mb.write_text(text)
