---
title: Equipment, Weapons, and Armor
description: Complete guide to weapons, armor types, shields, durability wear, socketing, equipment refinement, and bone binding managers in Open MMORPG.
sidebar:
  order: 2
---

Equipment items define how characters look and fight. Open MMORPG includes complete systems for weapon categories, single and two-handed grips, shield blocking, modular armor piece binding, equipment durability, socketing gems, set bonuses, and progressive item refinement.

---

## Equipment Categories

1. **Weapon Item (`Create GameData/Item/Weapon Item`)**: Weapons held in the right or left hand that deal base damage, determine attack animations, and trigger projectile firings.
2. **Armor Item (`Create GameData/Item/Armor Item`)**: Protective gear equipped in specific body slots (head, chest, legs, boots, accessories) granting defensive stats and resistances.
3. **Shield Item (`Create GameData/Item/Shield Item`)**: Defensive offhand equipment providing block chance and block damage reduction percentages.

---

## 1. Weapon Configuration

Weapons rely on a parent **Weapon Type** asset (`Create GameData/Weapon Type`) that dictates shared behaviors across the weapon family (such as Swords, Daggers, or Bows).

### Weapon Fields
* **Weapon Type**: The parent category governing animations and rules.
* **Damage Amounts**: The min/max base damage dealt per swing or shot.
* **Damage Element**: Elemental type of the attack (Physical, Fire, Lightning, etc.).
* **Effectiveness Attributes**: Attribute scalings (e.g., Strength grants +0.1 flat damage per point).
* **Equip Sockets**: Sockets on the weapon where socket enhancers (gems/runes) can be inserted.
* **Equip Model Prefabs**: The 3D weapon mesh instantiated in the character's hand transform when drawn, and on their hip or back when sheathed.

### Single-Handed vs Two-Handed Weapons
* **Two-Handed**: Occupies both the right and left hand slots simultaneously. Players cannot equip an offhand shield or secondary weapon while holding a two-handed weapon.
* **Single-Handed**: Can be paired with a shield in the offhand slot, or another one-handed weapon if dual-wielding is enabled in your gameplay settings.

---

## 2. Armor and Equip Slots

Armor pieces are categorized by **Armor Type** (`Create GameData/Armor Type`), which assigns the equipment slot:

* **Head**: Helmets, hoods, circlets.
* **Body / Chest**: Cuirasses, robes, tunics.
* **Hands / Gloves**: Gauntlets, bracers.
* **Legs**: Greaves, pants.
* **Feet**: Boots, sandals.
* **Accessories**: Rings, necklaces, cloaks, relics.

When equipped, armor modifies the character's `CharacterStats` (e.g. +Armor, +Health, +Resistance) and swaps the corresponding visual skinned mesh on the character model.

---

## 3. Durability and Repairs

Every equipment item can track durability:

* **Max Durability**: Total hit points before the item breaks (e.g. `100`).
* **Durability Loss**: Durability decreases incrementally when the character takes hits or attacks enemies.
* **Broken Penalty**: When durability reaches `0`, all stat bonuses and armor ratings provided by the piece are disabled until repaired.
* **Repairs**: Players can visit Blacksmith NPCs to restore durability in exchange for gold.

---

## 4. Item Refinement (+1 to +10 Upgrades)

The **Item Refine** system allows players to upgrade gear through tiers (e.g. Iron Sword +1 through +10).

1. Right-click in the **Project** window and choose **Create → Create GameData → Item Refine**.
2. Configure upgrade levels:
   * **Required Materials & Gold**: Cost per upgrade attempt.
   * **Success Rate**: Probability of success (e.g., 100% for +1–+3, scaling down to 30% for +9–+10).
   * **Failure Consequence**: Decide whether a failed upgrade maintains level, downgrades by 1 level, or shatters the item.
   * **Stat Multiplier**: Multiplier applied to the item's base stats per refine level.
   * **Title Color**: Display hex color for the item name in tooltips and world drops (e.g., Gold for Legendary items).

---

## 5. Equipment Sets

Create an **Equipment Set** asset (**Create → Create GameData → Equipment Set**) to reward players who equip matching gear pieces:

* Assign the matching armor and weapon assets to the set list.
* Define tiered bonuses:
  * **2-Piece Bonus**: +5% Movement Speed, +10 HP Recovery.
  * **4-Piece Bonus**: +15% Critical Damage, +50 Attack Power.

---

## 6. Equipment Bone Binding Managers

When characters equip armor meshes (e.g. a breastplate or boots), the armor mesh's bones must bind seamlessly to the character's humanoid skeleton so they deform naturally during animations.

Open MMORPG provides dedicated bone setup managers:

* **Human Body Bones Manager (`Create GameData/Equipment Model Bones Setup Manager/Equipment Model Bones Setup By Human Body Bones Manager`)**: Maps bones by Unity's standard `HumanBodyBones` enum (Hips, Spine, Chest, LeftUpperArm, etc.).
* **Bone Names Manager (`Create GameData/Equipment Model Bones Setup Manager/Equipment Model Bones Setup By Bone Names Manager`)**: Maps bones by matching hierarchical transform string names.

Assign your chosen setup manager to the **Equipment Bone Setup** field in [Game Instance](../guide/game-instance.md).
