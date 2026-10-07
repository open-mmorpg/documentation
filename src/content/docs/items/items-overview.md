---
title: Items Overview and Consumables
description: Understanding the item architecture in Open MMORPG, consumable types, utility items, and using the Item Creator.
sidebar:
  order: 1
---

Every inventory object in Open MMORPG is built on the `BaseItem` ScriptableObject hierarchy. Items range from standard vendor junk and crafting materials to consumable healing draughts, companion summon stones, teleportation scrolls, and loot crates.

Equipment items (weapons, armor, and shields) have specialized mechanics detailed separately in [Equipment and Weapons](./equipment-and-weapons.md).

---

## The Item Creator Tool

You can generate items quickly using the built-in Item Creator:

1. Open **Open MMORPG → Develop → Item Creator**.
2. Select your desired **Item Type**.
3. Fill in the title, description, icon sprite, and drop model prefab.
4. Click **Create** to automatically instantiate and register the asset.

Alternatively, right-click in the **Project** window and choose **Create → Create GameData → Item → [Item Type]**.

---

## Universal Item Settings

Every item asset shares these foundational properties:

* **Title & Description**: Localized names and lore tooltips.
* **Icon**: Sprite displayed in inventory bags, action bars, and vendor stores.
* **Drop Model**: The 3D mesh prefab instantiated in the game world when this item drops on the ground (see [Crafting and Drops](./crafting-and-drops.md)).
* **Sell Price**: Gold granted when selling this item to an NPC vendor.
* **Weight**: Inventory weight cost per unit. If total weight exceeds the character's `weightLimit`, encumbrance penalties apply.
* **Max Stack**: Maximum number of units that can stack in a single inventory bag slot (e.g., `1` for weapons, `99` for potions).
* **Item Refine**: An optional [Item Refine](./equipment-and-weapons.md) asset defining rarity, title display color, and tier properties.

---

## Consumable and Utility Item Catalog

| Item Type | Menu Path | Functionality |
| :--- | :--- | :--- |
| **Junk Item** | `Create GameData/Item/Junk Item` | Standard trade goods, vendor items, and raw crafting materials with no direct on-use effect. |
| **Potion Item** | `Create GameData/Item/Potion Item` | Consumable item that instantly restores HP, MP, or Stamina, or applies temporary status effects (buffs/debuffs). |
| **Exp Potion Item** | `Create GameData/Item/Exp Potion Item` | Instantly awards a designated amount of character experience points upon consumption. |
| **Ammo Item** | `Create GameData/Item/Ammo Item` | Projectiles (arrows, bullets, shells) consumed per shot by compatible ranged weapon types. |
| **Socket Enhancer** | `Create GameData/Item/Socket Enhancer Item` | Gems and runes inserted into equipment sockets to grant bonus stats or elemental affinities. |
| **Building Item** | `Create GameData/Item/Building Item` | Consumable item that enters building placement mode, allowing players to construct houses, walls, or crafting stations. |
| **Pet Item** | `Create GameData/Item/Pet Item` | Summons a persistent non-combat or assistance companion pet that follows the player. |
| **Mount Item** | `Create GameData/Item/Mount Item` | Summons and mounts the player onto a designated rideable vehicle entity. |
| **Skill Item** | `Create GameData/Item/Skill Item` | One-shot spell scroll that casts a specified skill directly upon use without requiring the player to learn it. |
| **Skill Learn Item** | `Create GameData/Item/Skill Learn Item` | Skill book or manual that permanently teaches a skill to the player upon consumption. |
| **Skill Reset Item** | `Create GameData/Item/Skill Reset Item` | Consumable respec token that refunds all allocated character skill points. |
| **Attribute Increase Item** | `Create GameData/Item/Attribute Increase Item` | Permanently or semi-permanently increases a specific character attribute (e.g. Elixir of Strength). |
| **Attribute Reset Item** | `Create GameData/Item/Attribute Reset Item` | Consumable respec token that resets all allocated attribute points back to unspent pool. |
| **Warp Items** | `Create GameData/Item/Warp To Map Item` | Teleport scrolls that warp the character to a designated map, saved respawn point, or safe zone. |
| **Rewarding Items** | `Create GameData/Item/Random Rewarding Item` | Mystery boxes or reward packs that draw from a weighted item lottery table when opened. |
| **Name Change Item** | `Create GameData/Item/Character Name Change Item` | Allows the player to prompt a dialog to rename their character in the database. |

---

## Registering Items

All items must be added to your **Game Database** asset (see [Game Database](../guide/game-database.md)) before they can drop from monsters, appear in NPC shops, or load from database saves.
