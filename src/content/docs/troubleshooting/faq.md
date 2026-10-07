---
title: Frequently Asked Questions (FAQ)
description: Quick answers to common setup questions, zoom scrolling speeds, mobile shaders, and best development practices.
sidebar:
  order: 2
---

Answers to common questions and quick fixes for everyday development tasks.

---

### Why is mouse zoom scrolling slow in third-person view?
Camera zoom sensitivity is controlled on the **Gameplay Camera** component. Select your camera prefab (or the active camera in the demo) and increase the **Zoom Speed** or mouse wheel sensitivity multiplier.

---

### Why do materials render magenta / pink on mobile or Android?
Open MMORPG is built natively for the **Universal Render Pipeline (URP)**.
1. Open **Project Settings → Graphics**.
2. Ensure **Default Render Pipeline** is set to a valid URP Asset (e.g. `DemoURP` or your custom URP asset).
3. Open **Project Settings → Quality** and ensure every quality tier references your URP Pipeline asset.

---

### Can I build an offline or singleplayer game with Open MMORPG?
**Yes.** Open MMORPG includes an **Offline-LAN** mode where host and client execute within a single runtime instance. Run **Open MMORPG → Build → Target → Setup For Offline-Lan Build** to configure your project symbols for standalone play.

---

### Where should I keep my own project assets?
**Always keep your own work outside `Assets/OpenMMORPG`.**
Create your own folder, such as `Assets/MyGame`. Store your custom scenes, prefabs, game databases, and scripts there. This guarantees that importing package updates will never overwrite your project files.

---

### How do I safely add custom gameplay logic?
Use the **Dev Extension** system (see [Dev Extensions and Custom Code](../advanced/dev-extensions-and-custom-code.md)). Decorate your extension methods with `[DevExtMethods]` inside C# `partial` classes to hook into core engine events without modifying kit files.
