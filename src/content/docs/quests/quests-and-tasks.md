---
title: Quests and Tasks
description: Creating quests, objective tasks (kill monster, collect item, talk to NPC), reward configurations, and HUD quest tracking in Open MMORPG.
sidebar:
  order: 2
---

The quest system in Open MMORPG guides player progression through structured storylines and repeatable daily objectives. Quests track multiple simultaneous objectives and automatically update the player's HUD.

---

## 1. Creating a Quest Asset

1. In the **Project** window, right-click and choose **Create → Create GameData → Quest**.
2. Configure basic settings:
   * **Title & Description**: Story background and lore displayed in the Quest Journal (**L** key).
   * **Can Repeat**: Enable for daily or repeatable bounties.
   * **Drop Quest Rule**: Controls whether players can abandon the quest while in progress.

---

## 2. Quest Tasks (Objectives)

Each quest can contain one or more sequential or concurrent tasks:

### Kill Monster Task
* Select the target [Monster Character](../characters/player-and-monster-entities.md#monster-characters) data.
* Set the required kill count (e.g., Defeat 10 Forest Bandits).
* In party play, kills can be shared across party members within range according to your social settings.

### Collect Item Task
* Specify the target item and required quantity (e.g., Gather 5 Wolf Pelts).
* Items can be looted from monster drop tables or gathered from harvestable nodes.

### Talk to NPC Task
* Directs the player to visit and speak with a specific NPC dialog entity to advance the story.

---

## 3. Rewards

Upon completing all tasks and speaking with the turn-in NPC, players receive:

* **Experience Points**: Character exp advancing their level.
* **Gold & Currencies**: In-game gold or alternate currencies (such as Arena Tokens).
* **Reward Items**:
  * **Fixed Rewards**: Items granted unconditionally to all characters completing the quest.
  * **Selectable Rewards**: A list of items from which the player chooses one (e.g., choice between a Sword, Staff, or Bow).

---

## 4. Quest HUD Tracking

Active quests automatically render in the player's HUD:
* **UI Quest Tracker**: Displays active objectives, progress counts (e.g. `Bandits Defeated 7/10`), and completed status.
* **Minimap Quest Markers**: Renders yellow or exclamation icons above NPC heads and on the minimap to indicate quest givers and turn-in locations.

Remember to add all quest assets to your [Game Database](../guide/game-database.md).
