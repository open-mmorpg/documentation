---
title: GM Commands and Server Administration
description: In-game Game Master chat commands, moderation tools, player teleports, item spawning, and server rate modifiers in Open MMORPG.
sidebar:
  order: 4
---

Open MMORPG provides a complete suite of Game Master (GM) chat commands for in-game moderation, debugging, event hosting, and live administration.

---

## 1. Granting GM Privileges

GM commands are restricted to authorized accounts:

1. Open your database (via SQLite browser or MySQL workbench).
2. Locate the `user_auth` (or accounts) table.
3. Find your user row and set the `userLevel` column to `1` (Game Master) or `2` (Server Administrator).
4. Save the database row and re-log into your account.

---

## 2. In-Game GM Command Reference

Type any command directly into the in-game chat box:

### Character Progression & Currency

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/level` | `/level 50` | Sets your character's level to the specified value. |
| `/statpoint` | `/statpoint 100` | Adds unallocated attribute stat points. |
| `/skillpoint` | `/skillpoint 20` | Adds unallocated skill points. |
| `/gold` | `/gold 50000` | Sets your character's current gold amount. |
| `/give_gold` | `/give_gold Aldric 1000` | Awards gold to another online character. |

### Item Spawning

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/add_item` | `/add_item Item_Sword01 1` | Spawns the specified item ID into your bags. |
| `/give_item` | `/give_item Aldric Item_PotionHP 10` | Spawns items directly into another player's inventory. |

### Teleportation & World Navigation

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/warp` | `/warp DemoMap 120 15 45` | Teleports you to the specified Map ID and coordinates. |
| `/warp_character` | `/warp_character Aldric DemoDungeon 0 1 0` | Teleports another player to a specific map and position. |
| `/warp_to_character` | `/warp_to_character Aldric` | Teleports you immediately to the target character's position. |
| `/summon` | `/summon Aldric` | Summons the target character to your current position. |

### Spawning & Combat

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/monster` | `/monster Monster_Skeleton 10 3` | Spawns `amount` of monster `ID` at your current location at level `level`. |
| `/kill` | `/kill Aldric` | Instantly slays the specified character. |
| `/suicide` | `/suicide` | Instantly slays your own character. |

### Server Multipliers (Live Events)

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/gold_rate` | `/gold_rate 2.0` | Sets server-wide gold drop multiplier (e.g. 2.0 = 200%). |
| `/exp_rate` | `/exp_rate 1.5` | Sets server-wide experience multiplier (+50% Exp). |
| `/item_drop_rate` | `/item_drop_rate 2.0` | Sets server-wide item drop rate multiplier. |

### Moderation & Punishments

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/mute` | `/mute Spammer 60` | Silences character from public and channel chat for `minutes`. |
| `/unmute` | `/unmute Spammer` | Removes chat mute restriction immediately. |
| `/ban` | `/ban Cheater 7` | Disconnects and bans the user account for `days`. |
| `/unban` | `/unban Cheater` | Lifts an active account login ban. |
