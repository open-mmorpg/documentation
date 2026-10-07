---
title: Player and Monster Entities
description: How to create and configure playable characters and monster entities using the Character Entity Creator and game data assets.
sidebar:
  order: 2
---

In Open MMORPG, every actor in the world is split into two halves:

1. **Game Data (`BaseCharacter`)**: A ScriptableObject that defines the character's rules, progression, starting attributes, level scaling, and rewards.
2. **Entity Prefab (`BaseCharacterEntity`)**: A networked GameObject prefab that physically exists in the world, carrying the colliders, animations, visual transforms, audio sources, and network synchronization components.

This separation keeps networking clean: clients and servers look up game data by ID, while the entity handles the realtime simulation and physics.

---

## The Character Entity Creator (3D)

Open MMORPG includes an automated editor tool that configures a rigged 3D humanoid model into a fully functional character prefab in seconds.

1. Open **Open MMORPG → Develop → Character Entity Creator (3D)**.
2. In the creator window:
   * **Source Object**: Drag your humanoid 3D model FBX or prefab.
   * **Entity Type**: Choose **Player Character Entity** or **Monster Character Entity**.
   * **Movement Type**: Select **Character Controller** (standard TPS/MMO movement) or **NavMesh** (point-and-click / AI).
   * **Model Type**: Select **Playable Character Model** (recommended for performance) or **Animator Character Model** (standard Mecanim).
3. Click **Create Entity**.
4. The tool automatically sets up standard hitboxes, capsule colliders, root motion adjustments, required child transforms, and network identity components.
5. Save the generated GameObject as a prefab into your project (outside `Assets/OpenMMORPG`).

---

## Player Characters

### 1. Creating the Player Character Data

The `PlayerCharacter` asset defines a playable class (such as Warrior, Ranger, or Mage).

1. In the **Project** window, right-click and choose **Create → Create GameData → Player Character**.
2. Give the asset a clean name (e.g. `Class_Warrior`).
3. Configure the class properties in the Inspector:

| Field | Description |
| :--- | :--- |
| **Title** | The display name shown in the character creation screen and character sheet. |
| **Description** | Lore or class description displayed at character creation. |
| **Icon** | The class icon sprite used in UI menus. |
| **Stats** | Base stats at Level 1 and incremental stat scaling per level. |
| **Attributes** | Starting attributes (Strength, Agility, Vitality) and amount gained per level. |
| **Resistances / Armors** | Inherent elemental damage resistances and armor values. |
| **Skill Levels** | Default skills granted to this class and their starting skill levels. |
| **Right / Left Hand Equip Item** | Starting weapon, shield, or tool equipped upon character creation. |
| **Armor Items** | Starting equipment (helmet, chestpiece, boots, gloves). |
| **Start Map** | The Map Info where characters of this class first spawn (registered in the [Game Database](../guide/game-database.md)). If empty, the default map from the Game Database is used. |

### 2. Setting Up the Player Character Entity Prefab

A player character entity requires several designated child transforms so the camera, combat system, and UI can attach accurately:

* **Camera Target Transform**: Position where the third-person camera orbits and looks. Usually centered around the chest or neck.
* **Fps Camera Target Transform**: Position for the first-person camera, placed between the eyes.
* **Combat Text Transform**: Location where floating damage numbers, healing ticks, and status text spawn. Usually placed slightly above the character's head.
* **Opponent Aim Transform**: The target position that other players and monsters aim towards when attacking this entity.
* **Melee Damage Transform**: Center point used to calculate melee sweep hit detection.
* **Missile Damage Transform**: Spawn origin for outgoing arrows, magic missiles, or bullets.
* **Character UI Transform**: Anchor for floating overhead nameplates, guild tags, and health/mana bars.
* **Mini Map UI Transform**: Anchor for the minimap icon representing this player.

> **Player Characters List:** On the `PlayerCharacterEntity` component, ensure the **Player Characters** list includes all playable classes permitted to use this visual entity model.

---

## Monster Characters

### 1. Creating the Monster Character Data

The `MonsterCharacter` asset defines the stats, combat AI, rewards, and loot drops of an enemy.

1. Right-click in the **Project** window and choose **Create → Create GameData → Monster Character**.
2. Configure the monster properties:

| Field | Description |
| :--- | :--- |
| **Title** | The enemy's display name shown above its head and on target frames. |
| **Stats** | Health, attack speed, movement speed, and defense values. |
| **Damage Element** | The elemental type of the monster's standard attacks (e.g., Physical, Fire). |
| **Damage Amount** | Min and Max base damage dealt by basic attacks. |
| **Exp / Gold Reward** | Experience points and gold awarded to players when defeated. |
| **Random Items** | The drop table assets defining which items can drop and their drop rates. |
| **Aggressive** | When enabled, the monster attacks players on sight within its visual range. |
| **Visual Range** | The radius (in meters) within which the monster detects hostile targets. |
| **Attack Skills** | Spells and combat abilities the monster uses during combat. |

### 2. Setting Up the Monster Character Entity Prefab

A monster entity carries AI components that dictate how it roams and attacks:

* **Monster Activity Component**: Manages monster behavior states (Idle, Wander, Chase, Attack, Turn to Target).
* **Movement Component**: Usually a `NavMeshEntityMovement` for ground monsters using Unity's NavMesh, or `CharacterControllerEntityMovement` for physics-based movement.
* **Aggro and Leash Distances**:
  * **Visual Range**: Detection radius.
  * **Wander Radius**: Maximum roaming distance from its spawn point.
  * **Leash Distance**: If pulled beyond this distance from its spawn point, the monster disengages, evades damage, and runs back to its origin while resetting its health.

---

## Registering in the Game Database

Entities and game data assets will not appear in-game until registered in your game database:

1. Open your Game Database asset (or open **Open MMORPG → Develop → Game Database**).
2. Add your `PlayerCharacter` and `MonsterCharacter` assets to the **Characters** list.
3. Add your `PlayerCharacterEntity` prefabs to **Player Character Entities**.
4. Add your `MonsterCharacterEntity` prefabs to **Monster Character Entities**.

See the [Game Database](../guide/game-database.md) guide for details on automatic related data registration.
