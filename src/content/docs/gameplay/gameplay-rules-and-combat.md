---
title: Gameplay Rules and Combat Formulas
description: Customizing combat calculations, damage formulas, experience progression tables, hunger, thirst, and death penalties in Open MMORPG.
sidebar:
  order: 1
---

The core simulation rules of Open MMORPG—including damage equations, hit probabilities, level-up stat gains, and survival mechanics—are defined in the **Gameplay Rule** asset attached to your [Game Instance](../guide/game-instance.md#gameplay-rule).

---

## 1. The Gameplay Rule Asset

1. In the **Project** window, right-click and choose **Create → Create GameplayRule → Default Gameplay Rule**.
2. Assign the created asset to the **Gameplay Rule** field in [Game Instance](../guide/game-instance.md).

### Key Rule Fields

| Category | Settings |
| :--- | :--- |
| **Level Progression** | Stat points and skill points granted per level-up. |
| **Experience Table** | The `ExpTable` asset determining the total experience points required for each character level. |
| **Death Penalties** | Percentage of current level experience lost upon character death (e.g. `0.05` for a 5% exp penalty). |
| **Regeneration** | Health, mana, and stamina recovery rates while idle, in combat, or resting. |
| **Survival Mechanics** | Depletion rates for hunger (**Food**) and thirst (**Water**), and the damage taken when either reaches zero. |
| **Mobility Modifiers** | Multipliers applied to movement speed while sprinting, swimming, or carrying excess weight. |

---

## 2. Experience Tables (`ExpTable`)

Rather than hand-typing experience values for 100+ levels:

1. Right-click and choose **Create → Create GameData → Exp Table**.
2. Set your **Max Level** (e.g., `100`), **Base Exp** (e.g., `100`), and exponential curve factor.
3. Click **Calculate Exp** to automatically compute the entire progression curve.
4. Assign the table to your **Gameplay Rule**.

---

## 3. Customizing Combat Formulas in C#

You can override combat math by creating a class that inherits from `BaseGameplayRule` or `DefaultGameplayRule`:

```csharp
using UnityEngine;

namespace MultiplayerARPG
{
    [CreateAssetMenu(fileName = "Custom Gameplay Rule", menuName = "Create GameplayRule/Custom Gameplay Rule")]
    public class CustomGameplayRule : DefaultGameplayRule
    {
        // Custom Damage Reduction Formula
        public override float GetDamageReducedByResistance(DamageElement damageElement, float damage, float resistance)
        {
            // Diminishing returns resistance formula: Damage * 100 / (100 + Armor)
            float reductionFactor = 100f / (100f + Mathf.Max(0, resistance));
            return damage * reductionFactor;
        }

        // Custom Critical Strike Probability
        public override float GetCriticalChance(CharacterStats attackerStats, CharacterStats defenderStats)
        {
            return Mathf.Clamp01(attackerStats.criRate * 1.25f);
        }
    }
}
```

The demo project uses this exact pattern with its `CombatGameplayRule` asset.
