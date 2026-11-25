"""Puts Meridian Core (the core/ folder) inside the Firefox source as a built-in add-on.
Built-in add-ons live at resource://builtin-addons/<name>/ and ship inside Meridian itself,
so they need no add-on store signature and can't be removed by websites or other add-ons.
Usage: core.py <firefox source folder>"""
import json, pathlib, shutil, sys
from PIL import Image

repo = pathlib.Path(__file__).resolve().parents[1]
src = pathlib.Path(sys.argv[1])
home = src / "browser/extensions/meridian"
ext = home / "extension"
version = (repo / "version.txt").read_text().strip()

shutil.rmtree(home, ignore_errors=True)
shutil.copytree(repo / "core", ext)

(home / "moz.build").write_text('JAR_MANIFESTS += ["jar.mn"]\n')
(home / "jar.mn").write_text("browser.jar:\n    builtin-addons/meridian/ (extension/**)\n")
mb = src / "browser/extensions/moz.build"
text = mb.read_text()
if '"meridian"' not in text:
    assert "DIRS += [\n" in text, "browser/extensions/moz.build changed shape; update core.py"
    text = text.replace("DIRS += [\n", 'DIRS += [\n    "meridian",\n', 1)
    mb.write_text(text)

manifest = json.loads((ext / "manifest.json").read_text())
manifest["version"] = version.split("-")[0]  # Firefox wants plain numbers here
(ext / "manifest.json").write_text(json.dumps(manifest, indent=2))

icon = Image.open(repo / "icon/icon.png").convert("RGBA")
(ext / "icons").mkdir(exist_ok=True)
for size in (16, 32, 48, 128):
    icon.resize((size, size), Image.LANCZOS).save(ext / f"icons/meridian-{size}.png")
print("Meridian Core", version, "added to", home)
