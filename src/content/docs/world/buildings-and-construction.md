---
title: Buildings and Player Construction
description: Complete guide to player-placed structures, building entities, lockable doors, storage chests, crafting workbenches, and snapping grids in Open MMORPG.
sidebar:
  order: 4
---

Open MMORPG features a modular player construction system. Players can place foundations, walls, lockable security doors, storage chests, and crafting workbenches in the world, with support for grid snapping and structural health decay.

---

## 1. Architecture of Player Construction

The building pipeline involves three interrelated components:

```
[ Building Item ] (Inventory consumable triggering placement mode)
        │
        ▼
[ Building Entity ] (Networked structure: HP, ownership, decay)
   ├── Building Material (Handles placement preview: Valid vs Invalid materials)
   └── Building Area (Snaps child building parts: Walls snap to foundations)
```

---

## 2. Building Entities (`BuildingEntity`)

A `BuildingEntity` is the root GameObject representing a placed structure in the world.

### Standard Properties:
* **Title**: Display name shown when inspecting the structure.
* **Building Type**: Matching tag used by `BuildingArea` components to govern where this structure can be placed.
* **Character Forward Distance**: Distance ahead of the character where the placement preview model appears.
* **Max Hp**: Hit points of the structure. If reduced to 0 by player attacks or siege weapons, the structure shatters.
* **Life Time**: Automatic decay timer (in seconds). Structures without upkeep decay over time; set to `<= 0` for permanent buildings.

---

## 3. Specialized Building Subtypes

### 1. Door Entity (`DoorEntity`)
Doors allow players to open and close entryways and secure homes:
* **Lockable**: When enabled, the owner can set a 0–6 digit numeric passcode. Other players must enter the correct PIN to pass through.
* **Open / Close Events**: UnityEvents triggered when opening or closing to drive door swing animations and toggle colliders.

### 2. Storage Entity (`StorageEntity`)
Player-placed storage chests and vaults:
* **Lockable**: Securable with a PIN code to prevent unauthorized looting.
* **Slot / Weight Limits**: Configurable storage capacities for the container.

### 3. Workbench Entity (`WorkbenchEntity`)
Player-built crafting stations (anvils, alchemy tables, cooking pots):
* **Item Crafts**: List of item craft formulas unlocked when interacting with this workbench in the field.

---

## 4. Placement Preview and Snapping

### Building Materials (`BuildingMaterial`)
Attach `BuildingMaterial` to the visual renderers of your building preview prefab:
* **Can Build Materials**: Transparent green material rendered when the placement location is valid.
* **Cannot Build Materials**: Transparent red material rendered when blocked by obstacles or terrain collisions.
* **Default Materials**: Restored automatically once the structure is successfully placed.

### Building Areas (`BuildingArea`)
Attach `BuildingArea` components to anchor points where subsequent building pieces should snap:
* For example, a **Foundation** prefab can have four child `BuildingArea` objects placed along its four edges.
* Set **Snap Building Object** to `true` to force incoming walls to snap flush to the foundation edge.
