---
title: Player Controllers and Input
description: Configuring third-person, click-to-move, shooter/FPS, and mobile touch controllers, along with the Input Setting Manager in Open MMORPG.
sidebar:
  order: 3
---

Open MMORPG includes interchangeable player controller components to support multiple game styles (traditional MMORPGs, action RPGs, third-person shooters, and mobile titles) without modifying core gameplay logic.

---

## 1. Supported Controller Styles

Set your active controller prefab in the **Player Controller Prefab** field on [Game Instance](../guide/game-instance.md):

| Controller Type | Playstyle | Characteristics |
| :--- | :--- | :--- |
| **Default Gameplay Controller** | Standard Third-Person MMO (WASD) | WASD movement relative to camera, right-click camera orbiting, left-click targeting, and number-row action bar skills. Used by the demo project. |
| **Click-to-Move Controller** | Classic Isometric / ARPG (Diablo-style) | Click to move characters across NavMesh surfaces, click on enemies to approach and attack. |
| **Shooter Controller** | Third-Person / First-Person Shooter | Locked reticle crosshair aiming, weapon recoil pitch/yaw recovery, bullet spread, and aim-down-sights zoom. |
| **Mobile Virtual Controller** | Mobile Touch (iOS / Android) | Left virtual analog thumbstick for locomotion, right screen drag for camera panning, and touch buttons for combat actions. |

---

## 2. Input Setting Manager

Key bindings in Open MMORPG are managed by the **Input Setting Manager** component attached to the `GameInstance` GameObject in your initialization scene (`00Init`).

### Key Bindings Reference

The default configuration provides standard controls:

| Action | Default PC Binding |
| :--- | :--- |
| **Movement** | `W` `A` `S` `D` |
| **Camera Orbit** | Mouse Left / Right Drag |
| **Attack Target** | `T` or Right-Click enemy |
| **Target Cycle** | `Tab` |
| **Interact / Talk** | `E` |
| **Pickup Loot** | `F` |
| **Jump / Sprint** | `Space` / `Left Shift` |
| **Dismount** | `V` |
| **Action Bar Slots** | `1` through `0` |
| **UI Windows** | `C` (Character), `B` (Inventory), `P` (Skills), `L` (Quests), `O` (Friends), `J` (Guild) |

### Runtime Rebinding

The Input Setting Manager saves player key customizations to local PlayerPrefs, allowing players to remap key combinations from your in-game Settings menu at runtime.
