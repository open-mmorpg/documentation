---
title: Skills System
description: Complete guide to configuring active, passive, area-of-effect, summon, and utility skills in Open MMORPG.
sidebar:
  order: 1
---

The skill system in Open MMORPG provides a unified framework for player abilities, class powers, and monster attacks. Skills can deal direct or area damage, apply lingering buffs or debuffs, summon minions, mount steeds, craft recipes, or teleport across the battlefield.

---

## Skill Architecture

All skills in the kit derive from `BaseSkill` and are created as ScriptableObject assets in your project.

```
BaseSkill (Core ScriptableObject)
  ├── Skill (Standard Targeted Attack, Buff, Passive, Craft, Summon, or Mount)
  ├── SimpleAreaAttackSkill (Ground-targeted or radius AoE damage)
  ├── SimpleAreaBuffSkill (Radius AoE friendly party/allies buff)
  ├── SimpleResurrectionSkill (Targeted ally revival)
  ├── SimpleDashToTargetSkill (Combat charge / dash)
  └── SimpleWarpToTargetSkill (Instant blink / teleport attack)
```

To create a new skill, right-click in the **Project** window and choose **Create → Create GameData → Skill → [Skill Type]**.

---

## Skill Types Comparison

| Skill Type | Asset Menu Path | How It Works | Common Use Cases |
| :--- | :--- | :--- | :--- |
| **Targeted Attack** | `Create GameData/Skill/Skill` | Deals direct physical or elemental damage to a single targeted hostile entity. | Melee strikes, targeted fireballs, bow shots. |
| **Passive Skill** | `Create GameData/Skill/Skill` (Skill Type: Passive) | Continuously grants bonus stats or attributes without being cast or hotkeyed. | Weapon masteries, armor proficiency, max health bonuses. |
| **Buff Skill** | `Create GameData/Skill/Skill` (Skill Type: Buff) | Applies a temporary status effect to the caster or a friendly target. | Defensive shields, attack power boosts, healing over time. |
| **Area Attack Skill** | `Create GameData/Skill/Simple Area Attack Skill` | Strikes all hostile entities within a circular radius at the target or on the ground. | Meteor storms, whirlwind slashes, explosive traps. |
| **Area Buff Skill** | `Create GameData/Skill/Simple Area Buff Skill` | Applies beneficial buffs or heals to all friendly allies within a designated radius. | Group battle cries, holy sanctuary healing zones. |
| **Summon Skill** | `Create GameData/Skill/Skill` (Skill Type: Summon) | Spawns a friendly monster entity that fights alongside the caster. | Necromancer minions, hunter pet summons, battle totems. |
| **Mount Skill** | `Create GameData/Skill/Skill` (Skill Type: Mount) | Instantly mounts the player onto a rideable vehicle entity. | Horse whistles, dragon riding. |
| **Resurrection Skill** | `Create GameData/Skill/Simple Resurrection Skill` | Revives a defeated ally, restoring a configurable percentage of HP and MP. | Cleric resurrections, emergency bandages. |
| **Craft Skill** | `Create GameData/Skill/Skill` (Skill Type: Craft) | Opens crafting interfaces or crafts items in the field without an anvil or station. | Field alchemy, cooking campfires. |

---

## Key Skill Fields

### 1. General Settings
* **Title & Icon**: Display name and sprite icon shown on the action bar and skill tree window.
* **Max Level**: The highest level a character can train this skill.
* **Skill Type**: Dictates whether this skill is **Active**, **Passive**, or a **Toggle** ability.

### 2. Casting Costs & Requirements
* **Cast Duration**: The warmup time (in seconds) required before the skill executes. If the caster is interrupted or stunned during this window, casting fails.
* **Cool Down Duration**: Cooldown timer before the skill can be invoked again.
* **Consume Hp / Mp / Stamina**: Energy or health drained per cast (supports incremental scaling per skill level).
* **Require Weapon Types**: Restricts usage to specific equipped items (e.g., Bow for archery skills, Staff for spells).
* **Require Ammo Type**: Consumes projectile ammo (arrows, bullets) upon cast.

### 3. Combat Parameters
* **Cast Distance**: Maximum range from which the skill can be initiated.
* **Damage Amounts**: Flat or scaled base damages dealt by the skill.
* **Damage Effectiveness Attributes**: Attribute scaling (e.g., skill gains additional damage from Intelligence or Strength).
* **Damage Infliction Rate**: Multiplier applied to the character's weapon damage (e.g., `1.5` = 150% weapon damage).
* **Status Effects**: Buffs or debuffs applied to affected targets upon impact.

---

## Skill Progression (Incremental Scaling)

All numerical values on skills—including damage, cooldown reduction, mana cost, and duration—use `IncrementalFloat` or `IncrementalInt`:

```
Base Value (Level 1) ──► + Flat Increase per Level ──► × Rate Increase per Level
```

For example, a fireball spell can deal **50 base damage** at Level 1, with `+15` flat damage per level and a `0.02` (+2%) compounding increase per level.

---

## Adding Skills to Characters

Characters can obtain skills through three mechanisms:

1. **Class Inherent Skills**: On your `PlayerCharacter` asset, add the skill to the **Skill Levels** list with its starting level.
2. **Skill Tree / Levelling**: Players spend skill points earned upon levelling up inside the in-game Skills Window (**P** key).
3. **Skill Learn Items**: Create an item asset with the **Skill Learn** type (**Create → Create GameData → Item/Skill Learn Item**). Using the item unlocks the designated skill in the character's repertoire.

Remember to add all created skills to your [Game Database](../guide/game-database.md) so they are recognized by the server and clients.
