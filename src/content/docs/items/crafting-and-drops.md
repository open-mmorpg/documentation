---
title: Crafting and Loot Drops
description: Managing monster loot drop tables, world item drop entities, loot permissions, and item crafting formulas in Open MMORPG.
sidebar:
  order: 3
---

Open MMORPG features a complete loot distribution and crafting pipeline. Defeated monsters spawn physical item drop entities in the game world with configurable ownership timers, and players can combine raw materials into finished equipment via crafting stations or field skills.

---

## 1. Monster Drop Tables

Loot dropped by enemies is managed using two types of drop tables:

### Item Drop Table (`Create GameData/Item Drop Table`)
Used for standard monster drops where multiple items can drop independently:
* **Item**: The asset to drop.
* **Drop Rate**: Probability from `0.0` (0%) to `1.0` (100%).
* **Amount**: Min and Max stack count dropped on success.

### Item Random By Weight Table (`Create GameData/Item Random By Weight Table`)
Used for lottery-style drops (such as boss reward chests or gacha reward bags), where one or more items are chosen based on relative weight:
* Each entry is given a weight (e.g. Common = 100, Rare = 10, Epic = 1).
* The engine picks randomly from the total weight sum.

Assign your drop table assets directly to the **Random Items** field of any [Monster Character](../characters/player-and-monster-entities.md#monster-characters).

---

## 2. World Item Drop Entities (`ItemDropEntity`)

When an item drops from an enemy or is dropped from a player's inventory, the server instantiates an **Item Drop Entity** prefab in the scene.

### Prefab Architecture
* **Collider**: A small trigger collider that detects player proximity.
* **Network Identity**: Synchronizes the dropped item's position, stack count, and ownership across clients.
* **Mesh Container**: Automatically swaps its 3D model to match the `dropModel` prefab defined on the dropped item asset.

### Loot Protection Rules

Loot ownership rules are configured in [Game Instance](../guide/game-instance.md):

* **Loot Lock Duration**: The number of seconds only the player who defeated the monster (or their party) can pick up the item.
* **Free-For-All Transition**: Once the protection timer expires, any nearby player can loot the item.
* **Despawn Timer**: Total duration (e.g., 180 seconds) before unlooted items automatically despawn to prevent map clutter and server memory leaks.

Players loot nearby items by walking within range and pressing the pickup key (**F** by default).

---

## 3. Item Crafting Formulas

Crafting recipes transform gathered resources and monster drops into weapons, potions, and armor.

### Creating a Craft Formula

1. Right-click in the **Project** window and choose **Create → Create GameData → Item Craft Formula**.
2. Configure:

| Field | Description |
| :--- | :--- |
| **Result Item** | The item produced upon successful crafting. |
| **Result Amount** | Quantity produced per craft. |
| **Ingredients** | List of required input items and their required stack quantities. |
| **Require Gold** | Gold cost deducted when initiating the craft. |
| **Require Currencies** | Non-gold currency costs (e.g., Crafting Tokens or Honor Points). |
| **Success Rate** | Probability of success (between `0.0` and `1.0`). If the roll fails, ingredients can be lost based on your gameplay rules. |

---

## 4. Crafting Execution

Players can craft recipes through three methods:

1. **NPC Crafters**: Talk to a blacksmith, armorer, or alchemist NPC whose dialog options trigger the crafting window.
2. **Crafting Stations**: Interact with crafting station game objects placed in maps (such as an anvil, spinning wheel, or campfire).
3. **Field Crafting**: Use an active skill of type **Craft Skill** (`Create GameData/Skill/Skill`), allowing characters to craft recipes anywhere in the world.
