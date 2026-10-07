---
title: Troubleshooting and Diagnostics
description: Common issues, map server synchronization traps, logging locations, and build failure diagnostics in Open MMORPG.
sidebar:
  order: 1
---

When encountering unexpected behavior during development or in built game clients, consult this diagnostic checklist.

---

## 1. "Invalid Character Entity" or Cannot Enter Map

### Symptom:
You can log in, select your character, and click **Start Game**, but the game gets stuck on the loading screen or returns an "Invalid character entity" error.

### Cause:
**The map server executable is out of sync with your project.**
In MMO mode, maps run as separate server processes launched from `builds/OpenMMORPG.exe`. When you modify character classes, items, skills, or scenes, the map server does not know about the changes until it is rebuilt.

### Solution:
1. Rebuild the map server executable as described in [Getting Started](../guide/getting-started.md#6-build-the-map-server).
2. If playing in the editor, ensure the **Override Exe Path** on the `MapSpawnNetworkManager` in `00Init` points to your newly compiled executable.

---

## 2. Feature Works in Editor but Fails in Built Game

### Symptom:
A gameplay system or server functionality works when pressing Play in the Unity editor, but is completely missing or broken in a standalone build.

### Cause:
**Incorrect Scripting Define Symbols.**
The Unity editor compiles all code by default. Standalone builds switch features on or off based on define symbols (such as `EXCLUDE_SERVER_CODES`).

### Solution:
* Check your build target switches under **Open MMORPG → Build → Target** (see [Before you build](../guide/before-you-build.md)).
* Run **Validate Game Data And Prefabs** under **Open MMORPG → Build → Asset Tools**.

---

## 3. Map Does Not Load (Blank Screen or Error)

### Symptom:
Transitioning through a warp portal or starting the game fails to load the level scene.

### Cause:
**Scene is missing from the Build Scene List.**
Every scene loaded by the game must be explicitly added to Unity's Scene List.

### Solution:
1. Open **File → Build Profiles**.
2. Select **Scene List**.
3. Drag the missing map scene into the list.

---

## 4. Where to Find Server and Client Logs

When diagnosing unexplained crashes or errors, inspect Unity's native `Player.log`:

* **Windows Client / Server**:
  `%USERPROFILE%\AppData\LocalLow\<CompanyName>\<ProductName>\Player.log`
* **Linux Dedicated Server**:
  Beside the executable, or accessed via systemd:
  ```bash
  journalctl -u openmmorpg-spawner -f
  ```
* **macOS**:
  `~/Library/Logs/<CompanyName>/<ProductName>/Player.log`
