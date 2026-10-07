# Screenshot tools

How the screenshots in these docs are made, so they can be retaken when the editor or the
demo changes. They are taken in a Unity project with Open MMORPG and its demo imported.

## Editor windows

[`CaptureEditorWindow.cs.txt`](CaptureEditorWindow.cs.txt) saves an open editor window to a
PNG straight from the window's own pixels, so it doesn't matter what else is on the screen.
It is written to run through the Unity MCP bridge's `execute_code`. The comments in the file
cover the traps: locking an Inspector to an object without changing the selection, waiting a
tick for the Inspector to rebuild, scrolling, and the folded-Transform drawing glitch.

Captures use a 560-point-wide Inspector at 150% UI scale, which gives 840-pixel images.

Leave the project as you found it: close the windows you opened, restore anything you
changed for the shot (fold-outs, Game view size, the build scene list), and don't save scenes.

## Gameplay

Set the Game view to **Full HD (1920x1080)**, press Play on `00Init`, and drive the menus by
invoking the on-screen buttons' `onClick`. Hiding a panel directly can drop the connection
to the server. Then call `ScreenCapture.CaptureScreenshot(path)`; it writes at the end of the
frame, so read the file in a later call. Set the Game view back to its previous size
afterwards.

Make a throwaway account for screenshots, and tell the project owner it is there.

## Annotating

[`annotate.py`](annotate.py) crops a raw capture, draws highlight boxes and saves it into the
right place under `src/content/docs`. It needs Python 3 and Pillow (`pip install pillow`).

```sh
python tools/screenshots/annotate.py raw/gi_database.png guide/images/game-database/game-instance-field.png --crop 0 318 840 656 --box 16 93 826 122
```
