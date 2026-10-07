---
title: Character Stats and Attributes
description: How character stats, attributes, damage elements, incremental leveling values, and battle points are calculated and configured.
sidebar:
  order: 1
---

Every character in Open MMORPG—whether a player, monster, NPC companion, or summon—relies on a unified stats and attributes architecture. Stats determine combat effectiveness (health, attack speed, evasion), utility limits (inventory capacity, movement speed), and survival parameters (hunger, thirst).

This page details how stats are structured, how incremental leveling calculates progression, how elemental damage and resistances work, and how to extend stats without modifying the core codebase.

## Stats Architecture Overview

Character progression is divided into three distinct layers:

1. **Character Stats (`CharacterStats`)**: The raw numerical properties used directly by the combat, physics, and inventory engines (such as maximum HP, accuracy, movement speed, and weight limits).
2. **Attributes (`Attribute`)**: Core RPG attributes (such as Strength, Dexterity, Vitality, and Intelligence) that can be raised by stat points on level-up, equipment bonuses, and buffs. Attributes directly scale one or more `CharacterStats` and increase weapon damage.
3. **Damage Elements (`DamageElement`)**: Elemental types (such as Physical, Fire, Ice, Lightning, Poison) that govern attack damages and elemental resistances.

```
[Stat Points / Equipment / Buffs]
              │
              ▼
        [Attributes] (Strength, Dexterity, Vitality, Intelligence)
              │
              ▼
     [Character Stats] (Max HP, Accuracy, Move Speed, Weight Limit)
              │
              ▼
   [Gameplay Combat Rules] (Hit Chance, Criticals, Block, Damage)
```

---

## Character Stats

The `CharacterStats` struct defines all standard character statistics. You can find these fields on character assets, equipment items, status effects, and passive skills:

### Health and Vigor

| Stat | Inspector Name | Description |
| :--- | :--- | :--- |
| `hp` | **Hp** | Maximum Health Points. When this reaches 0, the character dies. |
| `hpRecovery` | **Hp Recovery** | Natural HP regenerated per second outside of combat restrictions. |
| `hpLeechRate` | **Hp Leech Rate** | Percentage of dealt damage restored to health when attacking. |
| `mp` | **Mp** | Mana Points required to cast spells and active skills. |
| `mpRecovery` | **Mp Recovery** | Natural MP regenerated per second. |
| `mpLeechRate` | **Mp Leech Rate** | Percentage of dealt damage restored to mana when attacking. |
| `stamina` | **Stamina** | Action energy consumed by sprinting, jumping, or physical skills. |
| `staminaRecovery` | **Stamina Recovery** | Natural stamina restored per second. |
| `staminaLeechRate` | **Stamina Leech Rate** | Percentage of dealt damage restored to stamina. |
| `food` | **Food** | Hunger meter. If enabled in your gameplay rule, depletion causes health degeneration. |
| `water` | **Water** | Thirst meter. If enabled in your gameplay rule, depletion causes health degeneration. |

### Combat Offense and Defense

| Stat | Inspector Name | Description |
| :--- | :--- | :--- |
| `accuracy` | **Accuracy** | Offense rating used against the target's evasion to determine hit chance. |
| `evasion` | **Evasion** | Defense rating used to evade incoming attacks. |
| `criRate` | **Critical Rate** | Probability of landing a critical strike (e.g., `0.1` = 10% chance). Clamped between 0 and 1. |
| `criDmgRate` | **Critical Damage Rate** | Damage multiplier applied when a critical strike lands (e.g., `1.5` = 150% damage). |
| `blockRate` | **Block Rate** | Probability of blocking an incoming attack with an equipped shield. |
| `blockDmgRate` | **Block Damage Rate** | Percentage by which blocked damage is reduced (e.g., `0.5` = 50% damage reduction). |
| `headDamageAbsorbs` | **Head Damage Absorbs** | Percentage reduction for damage hitting the head hitbox. |
| `bodyDamageAbsorbs` | **Body Damage Absorbs** | Percentage reduction for damage hitting the torso hitbox. |
| `fallDamageAbsorbs` | **Fall Damage Absorbs** | Percentage reduction for impact damage taken from falling. |

### Mobility and Utility

| Stat | Inspector Name | Description |
| :--- | :--- | :--- |
| `moveSpeed` | **Move Speed** | Base walking and running movement speed in units per second. |
| `sprintSpeed` | **Sprint Speed** | Movement speed while holding the sprint key. |
| `jumpHeight` | **Jump Height** | Maximum vertical velocity or upward force applied when jumping. |
| `atkSpeed` | **Attack Speed** | Multiplier applied to basic attack and weapon animations. |
| `weightLimit` | **Weight Limit** | Maximum inventory weight capacity before encumbrance penalties apply. |
| `slotLimit` | **Slot Limit** | Number of active inventory slots available to the character. |
| `goldRate` | **Gold Rate** | Multiplier applied to gold earned from defeating monsters. |
| `expRate` | **Exp Rate** | Multiplier applied to experience points gained from monsters and quests. |
| `itemDropRate` | **Item Drop Rate** | Bonus multiplier applied to monster item drop probabilities. |

---

## Combat Calculations

All formulas are evaluated on the server (and predicted locally in single-player or LAN mode) by the active **Gameplay Rule** asset (see [Game Instance](../guide/game-instance.md#gameplay-rule)). The default implementations in `DefaultGameplayRule` work as follows:

### Hit Chance

When an attacker strikes a target:

$$ \text{Hit Chance} = 2 \times \frac{\text{Accuracy}_{\text{attacker}}}{\text{Accuracy}_{\text{attacker}} + \text{Evasion}_{\text{target}}} $$

* If the attacker has **10 Accuracy** and the target has **30 Evasion**:
  $$ \text{Hit Chance} = 2 \times \frac{10}{10 + 30} = 2 \times 0.25 = 0.50 \text{ (50\%)} $$
* If the random roll from $0.0$ to $1.0$ is less than or equal to $0.50$, the attack lands; otherwise, it misses.

### Critical Strikes

* A random number between $0.0$ and $1.0$ is generated.
* If the roll is $\le \text{Critical Rate}$, the hit is critical.
* Base damage is multiplied by $\text{Critical Damage Rate}$.

### Shield Blocking

* Evaluated if the defender has an equipped shield or skill granting `blockRate`.
* If the roll is $\le \text{Block Rate}$, the hit is blocked.
* Damage is reduced by:
  $$ \text{Damage} = \text{Damage} \times (1.0 - \text{Block Damage Rate}) $$

---

## Attributes

Attributes represent primary stats that characters increase using attribute points awarded upon levelling up.

### Creating an Attribute

1. In the **Project** window, right-click and choose **Create → Create GameData → Attribute**.
2. Give the asset a descriptive name (e.g. `Attribute_Strength`).
3. Add the asset to your [Game Database](../guide/game-database.md).

### Attribute Fields

* **Stats**: How many flat `CharacterStats` this attribute grants per point invested (for example, 1 Vitality = +10 HP, +0.5 HP Recovery).
* **Effectiveness Attributes**: Increases the effectiveness of weapons assigned to this attribute. For example:
  * A sword has `0.1` Strength effectiveness.
  * A character with **30 Strength** using a sword dealing **10 to 20** base damage will deal:
    $$ \text{Total Damage} = [10, 20] + (0.1 \times 30) = [13, 23] $$
* **Damage Amounts**: Flat or elemental damage added directly to attacks per attribute point.
* **Resistances**: Elemental resistances increased by this attribute.

---

## Damage Elements and Resistances

Damage elements categorize attack damage types (Physical, Fire, Ice, Lightning, Poison).

### Creating a Damage Element

1. Right-click in the **Project** window and choose **Create → Create GameData → Damage Element**.
2. Configure:
   * **Max Resistance Amount**: The cap on resistance from gear or buffs (e.g., `0.75` for a 75% resistance cap).
   * **Damage Hit Effects**: Visual and sound effects instantiated when this element hits a target.
3. Add the asset to your [Game Database](../guide/game-database.md).

### Resistance Formula

Damage after resistance is calculated as:

$$ \text{Dealt Damage} = \text{Element Damage} \times (1.0 - \min(\text{Resistance}, \text{Max Resistance})) $$

* If an attacker strikes with **100 Fire Damage** and the target has **0.25 (25%) Fire Resistance**:
  $$ \text{Final Damage} = 100 \times (1.0 - 0.25) = 75 $$

---

## Incremental Values Calculation

Many systems in Open MMORPG—including character base stats per level, monster scaling, skill damages, and attribute gains—use `IncrementalFloat` and `IncrementalInt` structures.

Each incremental setting has three primary fields:

* **Base Amount** (`baseAmount`): The value at Level 1.
* **Amount Increase Each Level** (`amountIncreaseEachLevel`): A flat addition applied for every level beyond Level 1.
* **Rate Increase Each Level** (`rateIncreaseEachLevel`): A compounding percentage added for every level beyond Level 1 (e.g. `0.05` for +5% per level).

### Mathematical Formula

For any level $L \ge 2$, the value is calculated iteratively:

$$ V_1 = \text{Base Amount} $$
$$ V_k = (V_{k-1} + \text{Amount Increase}) \times (1.0 + \text{Rate Increase}) \quad \text{for } k = 2 \dots L $$

> **Tiered Scaling:** You can also specify **Incremental By Levels** to change the scaling rate when the character passes certain level milestones (e.g., slower scaling from levels 1–50, and accelerated scaling from 51–100).

---

## Battle Points (BP)

**Battle Points** represent a composite number summarizing a character's total power, visible in the character UI or inspection windows.

Battle points are calculated in the active gameplay rule (`DefaultGameplayRule.GetBattlePointFromCharacterStats`). Each stat contributes a configured weight:

$$ \text{BP} = (\text{HP} \times 5) + (\text{MP} \times 5) + (\text{Accuracy} \times 10) + (\text{Evasion} \times 10) + (\text{Move Speed} \times 10) + \dots $$

You can modify each individual stat's Battle Point weight directly on the **Default Gameplay Rule** asset in the Inspector without editing code.

---

## Extending Character Stats via Dev Extensions

You can add custom stats to `CharacterStats` (such as `magicPenetration`, `cooldownReduction`, or `threatMultiplier`) without modifying the core files by using a C# `partial struct` and the `[DevExtMethods]` attribute:

```csharp
using UnityEngine;

namespace MultiplayerARPG
{
    public partial struct CharacterStats
    {
        // Add your custom stat field
        public float cooldownReduction;

        // Hook into the Add method
        [DevExtMethods("Add")]
        public CharacterStats DevExt_Add(CharacterStats b)
        {
            cooldownReduction += b.cooldownReduction;
            return this;
        }

        // Hook into the Multiply method
        [DevExtMethods("Multiply")]
        public CharacterStats DevExt_Multiply(float multiplier)
        {
            cooldownReduction *= multiplier;
            return this;
        }
    }
}
```

Any stats added this way will automatically participate in character stat recalculations, equipment stat additions, and buff applications across the entire game engine.
