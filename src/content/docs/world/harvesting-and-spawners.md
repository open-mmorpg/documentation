---
title: Resource Harvesting and Monster Spawners
description: Setting up harvestable resource nodes, gathering tools, drop tables, and monster spawn areas in Open MMORPG.
sidebar:
  order: 2
---

Populating world scenes in Open MMORPG involves placing interactive resource nodes (trees, mining ores, herb bushes) and dynamic monster spawn areas that keep the world active.

---

## 1. Resource Harvesting

The harvesting system allows characters to gather raw materials from world objects using equipped gathering tools.

### Step 1: Create Harvestable Data
1. Right-click in the **Project** window and choose **Create → Create GameData → Harvestable**.
2. Configure the resource node:
   * **Title**: Display name shown when aiming at the node (e.g., "Iron Ore Deposit").
   * **Max Hp**: Hit points of the node before it breaks (e.g. `5` hits).
   * **Require Weapon Types**: Tool needed to harvest (e.g., Pickaxe or Wood Axe).
   * **Items / Drop Table**: Items awarded when harvested (e.g., Iron Ore, Rough Stone).
   * **Respawn Delay**: Duration in seconds before the depleted node respawns.

### Step 2: Set Up the Harvestable Entity Prefab
1. Create a GameObject with a 3D model, mesh collider, and the `HarvestableEntity` component.
2. Link your `Harvestable` game data asset to the entity.
3. Configure **Depleted Models**: A visual model swapped in when the node is harvested (e.g., a tree stump or shattered rock).

### Step 3: Placing Nodes in Scenes
* Place individual `HarvestableEntity` prefabs directly in your map scenes, or
* Use a **Harvestable Spawn Area** (`HarvestableSpawnArea` component) to automatically scatter resource nodes across a designated radius or terrain area.

---

## 2. Monster Spawn Areas

Rather than placing individual static enemies across a map, monsters are managed dynamically by **Monster Spawn Areas**.

### Setting Up a Spawner

1. In your map scene, create an empty GameObject where you want monsters to spawn.
2. Add the `MonsterSpawnArea` component.
3. Configure the spawner:

| Field | Description |
| :--- | :--- |
| **Spawning Data** | List of [Monster Character Entities](../characters/player-and-monster-entities.md#monster-characters) to spawn, each with its relative spawn weight and level range. |
| **Max Amount** | Maximum number of living monsters allowed from this spawner at any time. |
| **Respawn Delay** | Seconds to wait after a monster dies before spawning a replacement. |
| **Spawn Radius** | Circular radius around the spawner center where monsters randomly appear. |

> **NavMesh Positioning:** Ensure your monster spawn area overlaps a baked Unity NavMesh so ground enemies spawn at valid walkable coordinates.
