---
title: Combat Effects, Impacts, and Statuses
description: Managing visual particle effects, surface impact reactions, and lingering status effects in Open MMORPG.
sidebar:
  order: 2
---

Combat feedback in Open MMORPG relies on three interrelated systems: **Game Effects** (pooled particle and audio prefabs), **Impact Effects** (contextual surface hits), and **Status Effects** (lingering buffs, debuffs, and crowd control).

---

## 1. Game Effects (`GameEffect`)

A `GameEffect` is a lightweight prefab that combines visuals (such as Unity `ParticleSystem` or trail renderers) with audio playback and automatic destruction.

### Setting Up a Game Effect Prefab

1. Create a GameObject in your scene with your particle systems, lights, or meshes.
2. Add the `GameEffect` component to the root object.
3. Attach an `AudioSource` component to play sound effects on spawn.
4. Configure the component:
   * **Destroy Delay**: Duration (in seconds) after which the effect is returned to the object pool or destroyed.
   * **Auto Destroy**: Automatically despawns after particle playback completes.
   * **Fade Out**: Gradually fades associated light components or particle alphas before removal.
5. Save the GameObject as a prefab into your project.

> **Zero Allocation Pooling:** Open MMORPG automatically pools `GameEffect` instances at runtime. Reusing instances avoids GC spikes when dozens of players cast spells simultaneously.

---

## 2. Impact Effects Database

When a melee blade swings or an arrow strikes a target, the visual and sound effect should match both the **attack's damage element** and the **target's physical surface** (metal armor, stone shield, wood barrier, or organic flesh).

The **Impact Effects** asset maps these combinations:

1. Right-click in the **Project** window and choose **Create → Create GameDatabase → Impact Effects**.
2. Under **Impact Effect Pairs**, define rules:
   * **Damage Element**: (e.g., Physical, Fire, Ice).
   * **Physics Material**: The Unity `PhysicMaterial` attached to the target's collider (e.g., Flesh, Wood, Stone, Metal).
   * **Effect Prefab**: The `GameEffect` to instantiate at the hit point.
   * **Audio Clips**: Impact sounds played on collision.
3. Assign the created asset to the **Default Hit Effect** field in your [Game Instance](../guide/game-instance.md).

---

## 3. Status Effects (Buffs, Debuffs & Crowd Control)

Status effects represent temporary or permanent conditions applied to characters by skills, potions, traps, or weapon procs.

### Creating a Status Effect

1. Right-click in the **Project** window and choose **Create → Create GameData → Status Effect**.
2. Configure the asset:

| Field | Description |
| :--- | :--- |
| **Title & Icon** | The buff name and icon shown in the player's active buffs tray. |
| **Duration** | Lifespan of the status effect in seconds. Set to `0` for permanent auras. |
| **Tick Interval** | Interval in seconds between periodic damage or healing pulses (e.g., every 1.0 second). |
| **Stats Modifier** | Flat or percentage adjustments applied to the character's `CharacterStats` while active. |
| **Attributes Modifier** | Flat bonuses or penalties applied to core attributes. |
| **Damage Amounts** | Periodic damage applied each tick (e.g., Poison or Burning damage). |
| **Recovery Amounts** | Periodic HP, MP, or Stamina restored each tick (e.g., Regeneration). |

### Action and Movement Restrictions (Crowd Control)

Status effects can also disable specific actions:

* **Freeze / Stun**: Completely halts character movement, basic attacks, and skill casting.
* **Mute / Silence**: Prevents active skill casting while permitting movement and standard attacks.
* **Disarm**: Prevents basic weapon attacks while permitting movement and spells.
* **Root**: Prevents movement and jumping while allowing attacks and casting.
