---
title: Vehicles and Mounts
description: Creating rideable mounts, multi-passenger vehicles, vehicle types, seats, and the Vehicle Entity Creator in Open MMORPG.
sidebar:
  order: 4
---

Open MMORPG includes complete support for player-rideable mounts (horses, beasts, flying creatures) and multi-passenger vehicles (carriages, boats, airships).

---

## 1. Creating Vehicle Entities

You can generate mount and vehicle prefabs using the **Vehicle Entity Creator**:

1. Open **Open MMORPG → Develop → Vehicle Entity Creator (3D)**.
2. Assign your rigged mount mesh or vehicle model.
3. Configure the title, movement type (Character Controller or Rigidbody), and default speeds.
4. Click **Create Entity**.
5. Save the generated GameObject as a prefab in your project.

Alternatively, add the `VehicleEntity` component to any GameObject carrying movement and collider components.

---

## 2. Vehicle Types (`VehicleType`)

Every mount entity is categorized by a **Vehicle Type** asset:

1. Right-click in the **Project** window and choose **Create → Create GameData → Vehicle Type**.
2. Give the asset a descriptive name (e.g., `Vehicle_Horse` or `Vehicle_Cart`).
3. Assign the asset to the **Vehicle Type** field on your `VehicleEntity` prefab.

> **Animation Linking:** Characters use the assigned `VehicleType` to look up corresponding riding poses in `CharacterModelManager` (see [Character Models and Animations](./character-models-and-animation.md#6-mounted-animations)).

---

## 3. Seats Configuration

Mounts can support single riders or multiple passengers:

On the `VehicleEntity` component, expand the **Seats** list. Each entry defines a passenger slot:

| Field | Description |
| :--- | :--- |
| **Passenging Transform** | Transform where the rider's character model attaches while seated. |
| **Exit Transform** | World position where the rider dismounts and spawns when exiting the vehicle. |
| **Can Attack** | If enabled, the passenger in this seat can perform basic attacks while mounted. |
| **Can Use Skill** | If enabled, the passenger can cast active spells and skills while mounted. |
| **Camera Target** | Custom camera focus transform for passengers in this seat. |

* **Seat 0** is the driver/pilot seat controlling locomotion.
* **Seats 1+** are passenger seats that orient with the vehicle without driving.

---

## 4. Summoning and Dismounting

Players can enter vehicles through two primary mechanics:

1. **Mount Skills**: An active skill with **Skill Type** set to **Mount** (`Create GameData/Skill/Skill`).
2. **Mount Items**: A consumable inventory item with **Item Type** set to **Mount** (`Create GameData/Item/Mount Item`).
3. **World Vehicles**: Walking up to an unowned or wild vehicle entity and pressing the interaction key (**E**).

To dismount, players press the designated dismount hotkey (**V** by default) or click the active mount buff in the buffs tray.
