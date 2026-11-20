---
title: GM Commands and Server Administration
description: In-game Game Master chat commands, moderation tools, player teleports, item spawning, and server rate modifiers in Open MMORPG.
sidebar:
  order: 4
---

Open MMORPG provides a complete suite of Game Master (GM) chat commands for in-game moderation, debugging, event hosting, and live administration.

The commands come from `DefaultGMCommands`, which the kit uses when the **Gm Commands** field on the Game Instance (under **Gameplay Systems**) is empty. To change them, write your own class derived from `BaseGMCommands` and assign an asset of it there.

---

## 1. Granting GM Privileges

GM commands are restricted to accounts whose user level is above `0`. There is only one tier: every account above `0` can use every command.

1. Open your database: `mmorpgtemplate.sqlite3` in your project folder with an SQLite browser, or your MySQL database with any MySQL client.
2. Open the `userlogin` table.
3. Find your account's row by its `username` and set its `userLevel` column to `1`.
4. Save the change, then log out and back in. A map server reads the user level when your character enters it.

---

## 2. In-Game GM Command Reference

Type any command directly into the in-game chat box. Arguments are separated by spaces, so write `_` for a space in an item, map or monster id. Commands that name a character use the character's name.

In an MMO, a GM command goes through central to every map server, and each one checks the sender's user level and runs the command. That is why commands that name another character work wherever that character is.

### Character Progression & Currency

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/level` | `/level 50` | Sets your character's level to the specified value. |
| `/statpoint` | `/statpoint 100` | Sets your unspent stat points to the specified value. |
| `/skillpoint` | `/skillpoint 20` | Sets your unspent skill points to the specified value. |
| `/gold` | `/gold 50000` | Sets your character's current gold amount. |
| `/give_gold` | `/give_gold Aldric 1000` | Adds gold to another online character. |

### Item Spawning

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/add_item` | `/add_item IronLongsword 1` | Adds an item to your inventory: `/add_item {item_id} {amount} {level}`. Without an amount you get a full stack; the level is 1 unless you give one. The id is the item's **Id** or its asset name. |
| `/give_item` | `/give_item Aldric MinorHealingPotion 10` | Adds items to another character's inventory: `/give_item {name} {item_id} {amount}`. The amount is required. |

### Teleportation & World Navigation

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/warp` | `/warp CultistCrypt` | Warps you to a map's start position. It takes the **Map Info** id only, no coordinates. |
| `/warp_character` | `/warp_character Aldric CultistCrypt 0 1 0` | Warps a character to a map and position. Give your own name to warp yourself to a position. |
| `/warp_to_character` | `/warp_to_character Aldric` | Warps you to the target character's position. |
| `/summon` | `/summon Aldric` | Warps the target character to your position. |

### Spawning & Combat

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/monster` | `/monster DemoWolf 10 3` | Spawns monsters where you stand: `/monster {monster_id} {level} {amount}`, so this spawns 3 level-10 wolves. The id is the monster entity prefab's name. |
| `/kill` | `/kill Aldric` | Instantly slays the specified character. |
| `/suicide` | `/suicide` | Instantly slays your own character. |

### Server Multipliers (Live Events)

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/gold_rate` | `/gold_rate 2` | Multiplies the gold players get for killing monsters, including party shares (`1` is normal, `2` doubles it). |
| `/exp_rate` | `/exp_rate 1.5` | Multiplies the experience players get for killing monsters, including party shares (+50% here). |
| `/item_drop_rate` | `/item_drop_rate 2` | Multiplies the chance of monsters dropping items. |

The rates change on every map server that is running when you send the command. They are not saved: a map server that starts later, or restarts, uses `1` again.

### Moderation & Punishments

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/mute` | `/mute Spammer 60` | Stops the character sending chat messages, in every channel, for `minutes`. |
| `/unmute` | `/unmute Spammer` | Removes chat mute restriction immediately. |
| `/kick` | `/kick Spammer` | Disconnects the character. |
| `/ban` | `/ban Cheater 7` | Disconnects the character and bans the account that owns it for `days`. |
| `/unban` | `/unban Cheater` | Lifts the ban on the account that owns the character. |

Mutes and bans are saved in the database, so they last across logins and server restarts.

### Other Commands

| Command | Usage Example | Effect |
| :--- | :--- | :--- |
| `/help` | `/help` | Lists the commands. |
| `/invisible` | `/invisible` | Hides your character from other players. |
| `/visible` | `/visible` | Shows your character to other players again. |
| `/close_servers` | `/close_servers` | Disconnects every player and makes every map server refuse new connections until it restarts. |
| `/close_server` | `/close_server 1` | The same, for the map servers of one channel. |
