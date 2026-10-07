---
title: NPCs and Dialog Trees
description: Creating interactive NPCs, dialog graphs, conditional branching, quest triggers, and merchant actions in Open MMORPG.
sidebar:
  order: 1
---

Non-Player Characters (NPCs) populate towns and outposts, serving as quest givers, vendors, bankers, refiners, and story guides. Open MMORPG includes node-based dialog trees, conditional menu branches, and automated entity generation.

---

## 1. Creating NPC Entities

You can generate NPC prefabs using the **NPC Entity Creator**:

1. Open **Open MMORPG → Develop → Npc Entity Creator (3D)**.
2. Assign your 3D character mesh or prefab.
3. Configure the title, nameplate height, and interaction radius.
4. Click **Create Entity**.
5. Save the generated GameObject as a prefab in your project.

Alternatively, add the `NpcEntity` component to any GameObject with an interaction trigger collider.

---

## 2. Dialog Trees and Dialog Graphs

Open MMORPG provides two ways to author dialog:

### Linear Dialogs (`NpcDialog`)
* Right-click and choose **Create → Create GameData → NpcDialog → Npc Dialog**.
* Best for simple greeting text and basic merchant or teleport menus.

### Node-Based Dialog Graphs (`NpcDialogGraph`)
* Right-click and choose **Create → Create GameData → NpcDialog → Npc Dialog Graph**.
* Uses a visual node graph (powered by xNode) to connect branching conversation paths, choices, conditional checks, and action triggers.

---

## 3. Menu Conditions

You can restrict dialog options or quest offers using conditions:

* **Level Requirement**: Visible only when the player's level is $\ge$ minimum level.
* **Quest Condition**: Shown only if a quest is **Not Started**, **In Progress**, or **Completed**.
* **Item Condition**: Requires the player to hold specific items or quest tokens in their bags.
* **Faction / Class**: Restricts options to specific factions or player classes.

---

## 4. NPC Dialog Actions

Selecting a dialog choice can trigger actions:

| Action | Result |
| :--- | :--- |
| **Open Store** | Opens the merchant UI to buy and sell items using gold or custom currencies. |
| **Open Storage** | Accesses the player's personal bank vault. |
| **Open Crafting** | Launches the item crafting interface. |
| **Warp Character** | Transports the player to another map or coordinate. |
| **Increase / Decrease Gold** | Awards or deducts gold (via `IncreaseGoldDialogAction` or `DecreaseGoldDialogAction`). |
| **Increase / Decrease Item** | Awards quest reward items or takes turn-in items from inventory. |
