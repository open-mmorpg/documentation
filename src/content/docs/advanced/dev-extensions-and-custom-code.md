---
title: Dev Extensions and Custom Code
description: Extending Open MMORPG without modifying core files using the Dev Extension attribute and partial classes.
sidebar:
  order: 1
---

A primary goal of Open MMORPG is ensuring you can safely [update the kit](../guide/updating.md) when new versions release on the Unity Asset Store or GitHub without losing your gameplay changes.

The **Dev Extension** system solves this by using C# `partial` classes and the `[DevExtMethods]` attribute to let you inject custom methods into core events without modifying a single line of core code.

---

## How Dev Extensions Work

Many core classes in Open MMORPG—including `BasePlayerCharacterEntity`, `BaseCharacterEntity`, `CharacterStats`, and `GameInstance`—are marked as `partial`.

Inside core methods (such as `Awake()`, `OnDead()`, or `OnLevelUp()`), the engine scans for and invokes any method decorated with `[DevExtMethods("EventName")]`.

```
Core Engine: PlayerCharacterEntity.Awake()
     │
     └── Calls DevExtMethods("Awake") ──► YourScript: MyCustom_Awake()
```

---

## 1. Example: Hooking into Character Death

To trigger custom analytics or special death rewards when any character dies, create a separate script anywhere in your own folder:

```csharp
using UnityEngine;

namespace MultiplayerARPG
{
    public partial class BaseCharacterEntity
    {
        [DevExtMethods("OnDead")]
        public void CustomDeathHandler()
        {
            if (IsServer)
            {
                Debug.Log($"[Server] Entity {Title} has perished at {transform.position}");
                // Execute custom server logic, grant achievements, or record stats
            }
        }
    }
}
```

Because this file lives in your project outside `Assets/OpenMMORPG`, importing a new version of the kit will never touch or overwrite it.

---

## 2. Example: Custom Stat Additions

As shown in [Character Stats and Attributes](../characters/characters-and-stats.md#extending-character-stats-via-dev-extensions), you can add custom stats to `CharacterStats` using Dev Extensions:

```csharp
namespace MultiplayerARPG
{
    public partial struct CharacterStats
    {
        public float lifestealBonus;

        [DevExtMethods("Add")]
        public CharacterStats Custom_Add(CharacterStats b)
        {
            lifestealBonus += b.lifestealBonus;
            return this;
        }

        [DevExtMethods("Multiply")]
        public CharacterStats Custom_Multiply(float multiplier)
        {
            lifestealBonus *= multiplier;
            return this;
        }
    }
}
```

---

## Best Practices

* **Always keep custom scripts outside `Assets/OpenMMORPG`**: Create a top-level `MyGame/Scripts` directory for all your game's additions.
* **Check network execution**: Use `IsServer` or `IsOwnerClient` guards inside extension methods to ensure logic only executes on appropriate network authorities.
