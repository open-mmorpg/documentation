---
title: Social Systems, Guilds, and PvP
description: Configuring party sharing, guild systems, guild wars, open-world PK, karma, and 1v1 duels in Open MMORPG.
sidebar:
  order: 2
---

Multiplayer interaction in Open MMORPG is managed through the **Social System Setting** asset, governing parties, guilds, open-world player killing (PK), and dueling.

---

## 1. Social System Setting

Create the asset via **Create → Create GameData → Social System Setting** and assign it to the **Social System Setting** field in your [Game Instance](../guide/game-instance.md).

### Party Rules
* **Max Party Members**: Maximum players per group (e.g., `4` or `5`).
* **Exp Share Distance**: Maximum distance between party members to qualify for group experience sharing.
* **Level Cap Difference**: Maximum level gap allowed between members before high-level characters stop sharing exp with low-level characters.
* **Loot Share Modes**: Free-For-All, Round-Robin, or Random distribution.

### Guild Rules
* **Creation Requirements**: Minimum character level and gold fee required to establish a new guild.
* **Max Members**: Base member capacity and scaling per guild level.
* **Guild Ranks**: Leader, Officer, and Member ranks with granular permissions (invite, kick, promote, edit message of the day).
* **Guild Skills (`GuildSkill`)**: Passive buffs unlocked by guilds that grant bonuses to all active guild members.
* **Guild Crests (`GuildIcon`)**: Custom icons displayed beside player nameplates and health bars.

---

## 2. Guild Wars (`GuildWar`)

Guilds can challenge rival guilds to competitive warfare:
* **War Declaration**: Initiated via guild interfaces with acceptable stakes.
* **War Duration**: Timed battle period during which members of opposing guilds become automatically hostile regardless of standard zone rules.
* **Scoring**: Defeating rival guild members awards points; the guild with the highest score when the timer expires wins the conflict.

---

## 3. Player Killing (PK) and Karma System

Open MMORPG supports open-world PvP with consequences:

* **Safe Zones**: Attacking other players is completely disabled inside town borders or sanctuary zones (defined on the [Map Info](../world/maps-and-zones.md)).
* **PvP Zones**: Open combat is enabled without criminal penalties (arenas or battlegrounds).
* **Open-World PK & Karma**:
  * Attacking an innocent player flags the character as an aggressor.
  * Slaying innocent players accrues negative **Karma** and turns the character's nameplate red (**Criminal Status**).
  * Red-named criminals can be attacked by any player without penalty and suffer heavier equipment drop or exp penalties upon death.

---

## 4. 1v1 Dueling

Players can practice combat without risk of death or karma loss:
* A player selects another character and initiates a **Duel Challenge**.
* If accepted, a countdown banner appears on both screens, and a localized boundary circle is established.
* Combat ends when one player's health drops to 1 HP or when a combatant flees outside the boundary circle.
* Characters reset health immediately with zero death penalties.
