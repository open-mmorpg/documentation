---
title: Environment, Weather, and Time
description: Setting up the day-night time updater, environmental light cycles, and water swimming areas in Open MMORPG.
sidebar:
  order: 3
---

Open MMORPG provides built-in systems for synchronized in-game clocks, dynamic day-night cycles, and interactive water volumes with swimming and drowning mechanics.

---

## 1. Day-Night Time System

The day-night system keeps server and client time in sync and smoothly drives sun rotation and ambient lighting.

### Creating the Time Updater Asset
1. Right-click in the **Project** window and choose **Create → Create DayNightTimeUpdater → Default Day Night Time Updater**.
2. Configure time parameters:
   * **Day Length (Minutes)**: Real-world minutes that equal 24 hours of in-game time (e.g. `30` minutes for a complete day-night cycle).
   * **Start Time**: The in-game hour characters see when first entering the world (e.g., `8.0` for 8:00 AM).
3. Assign the created asset to the **Day Night Time Updater** field in your [Game Instance](../guide/game-instance.md).

### Connecting to Scene Lighting
In your map scene, add the `DayNightTimeController` component to your directional sunlight object. The controller rotates the directional light across the skybox based on the network time and updates ambient lighting gradients from sunrise to midnight.

---

## 2. Water Areas and Swimming

Open MMORPG natively supports swimming states when characters enter bodies of water.

### Setting Up a Water Volume
1. Create a 3D box or plane covering your ocean, lake, or river.
2. Ensure the object has a **BoxCollider** with **Is Trigger** set to `true`.
3. Add the `WaterArea` component to the GameObject.
4. Set the layer to the **Water** layer.

### Swimming Mechanics
* When a player or monster steps into the water trigger, the character movement component automatically transitions to the **Swimming** movement state.
* **Swimming Animations**: The character model plays water tread and swim clips.
* **Underwater Breath & Drowning**: If the character's head transform submerges below the water surface level, an oxygen meter appears. If oxygen depletes completely, the character takes periodic drowning damage until surfacing.
