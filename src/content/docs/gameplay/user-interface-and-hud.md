---
title: User Interface and HUD Customization
description: Comprehensive guide to customizing CanvasGameplay, UI wrappers, health frames, action bars, and TextMeshPro in Open MMORPG.
sidebar:
  order: 4
---

The entire in-game player interface in Open MMORPG is packaged as a single canvas prefab, **CanvasGameplay**, referenced directly by [Game Instance](../guide/game-instance.md).

---

## 1. Customizing the Gameplay Canvas

To create your own interface:

1. Duplicate the demo's canvas prefab: `Assets/OpenMMORPG/Demo/Prefabs/UI/CanvasGameplay.prefab`.
2. Move the duplicated prefab into your own project folder (e.g. `Assets/MyGame/UI/CanvasGameplay.prefab`).
3. Assign your copy to the **UI Scene Gameplay Prefab** field in your [Game Instance](../guide/game-instance.md).

> **Mobile & Survival Layouts:** The demo also provides `CanvasGameplayMobile` (optimized for touch screens) and `CanvasGameplay_Survival` (adds Food and Water hunger gauges).

---

## 2. Core UI Architecture (`UIBase`)

Nearly all user interface windows in Open MMORPG inherit from `UIBase`:

* **Hide On Awake**: When enabled, the panel is hidden automatically when scenes load.
* **Move To Last Sibling On Show**: Brings the window to the front of the UI hierarchy when opened.
* **On Show / On Hide Events**: UnityEvents triggered when windows toggle, ideal for playing opening audio or driving tween animations.

---

## 3. UI Component Wrappers (TextMeshPro Support)

To remain agnostic of text rendering engines, Open MMORPG uses component wrappers:

* **Text Wrapper (`TextWrapper`)**: Bridges standard Unity `Text` and `TextMeshProUGUI`. You can switch your entire UI to TextMeshPro without editing game scripts.
* **Input Field Wrapper (`InputFieldWrapper`)**: Bridges standard `InputField` and `TMP_InputField`.
* **Dropdown Wrapper (`DropdownWrapper`)**: Bridges standard `Dropdown` and `TMP_Dropdown`.

To generate wrappers for UI objects, right-click any UI object in the hierarchy and choose **GameObject → UI → Wrappers → Text Wrapper - Text Mesh Pro**.

---

## 4. Key HUD Modules

Inside `CanvasGameplay`, distinct UI controllers manage each interface subsystem:

| Module | Component | Description |
| :--- | :--- | :--- |
| **Character Frame** | `UICharacter` | Displays the player's portrait, current level, HP bar, MP bar, and active buff tray. |
| **Target Frame** | `UITarget` | Shows the selected target's nameplate, health percentage, level, and distance. |
| **Action Bar** | `UIActionBar` | Hotkey slots (`1`–`0`) holding draggable skills and consumable items, complete with cooldown swipe overlays. |
| **Minimap** | `UIMinimap` | Realtime circular radar map displaying terrain, party member blips, and quest markers. |
| **Chat Window** | `UIChatHandler` | Tabbed chat interface for Global, Local, Party, Guild, and Whisper messages. |
| **Quest Tracker** | `UIQuestTracker` | On-screen checklist of active quest tasks and current completion counts. |
