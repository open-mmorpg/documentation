---
title: Character Customization and Custom Data
description: Implementing modular character appearance customization (hair, skin, beards) and storing custom persistent character data.
sidebar:
  order: 4
---

Open MMORPG includes built-in systems for player character appearance customization during character creation, as well as an extensible key-value custom data system for persistent character stats.

---

## 1. Modular Appearance Customization

The demo project showcases character creation with customizable hair, beards, skin tones, and scales.

### Appearance Options Asset
1. Right-click in the **Project** window and choose **Create → Create Player Character Appearance Option → Player Character Body Part Component Option**.
2. Configure appearance variants:
   * **Meshes / Prefabs**: Array of 3D modular meshes (e.g. different hairstyles or facial hair models).
   * **Color Palettes**: Available color tints (e.g. hair colors, eye colors, skin tones).
3. Attach the appearance manager component to your character creation scene and playable character entity prefab.

When players finalize character creation, their selected appearance IDs and color indices are saved to the character record in the database and automatically applied whenever the character spawns in game maps.

---

## 2. Custom Character Data (`CustomCharacterData`)

When building specialized game mechanics—such as morality alignment, faction reputations, player titles, or achievement counters—you can attach arbitrary data to character records without altering the database schema.

### Key-Value Data Architecture
Each character holds a collection of persistent `CharacterCustomData` entries containing a string **Key** and a float/integer/string **Value**.

### Reading and Writing Custom Data in C#

```csharp
// Setting custom data on the server
playerEntity.SetCustomFloat("KarmaScore", 150.5f);
playerEntity.SetCustomString("GuildRankTitle", "High Commander");

// Reading custom data on client or server
if (playerEntity.TryGetCustomFloat("KarmaScore", out float karma))
{
    Debug.Log($"Player Karma is: {karma}");
}
```

Any custom data set on the server is automatically synchronized to clients and saved to the database upon character save intervals or logout.
