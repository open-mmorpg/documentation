---
title: Character Models and Animations
description: Comparing animation architectures in Open MMORPG, including Playable Character Model, Mecanim Animator, 2D animations, FPS hands, and weapon sheathing.
sidebar:
  order: 3
---

Open MMORPG decouples character networking and combat logic from the underlying visual representation. The same character entity can drive high-performance 3D models using Unity's Playables API, standard Mecanim Animator controllers, legacy animation components, or 2D sprite frames.

---

## Model Architecture Comparison

| Model Component | System | Best For | Advantages |
| :--- | :--- | :--- | :--- |
| **Playable Character Model** | Unity Playables API (`PlayableGraph`) | Large MMOs, dense player populations, mobile targets | **Fastest performance.** Bypasses Mecanim state-machine overhead. Configured entirely in Inspector without creating `.controller` assets. |
| **Animator Character Model** | Unity Mecanim | Complex custom state machines, root-motion blending | Native Mecanim animator controller support. Supports layers, blend trees, and parameter transitions. |
| **Animation Character Model** | Legacy Unity Animation | Retro or low-overhead simple 3D games | Simple legacy clip playback. Low memory footprint. |
| **Character Model 2D** | Sprite Renderer + `AnimationClip2D` | 2D isometric, top-down, or side-scroller games | Frame-by-frame 2D directional animation playback. |

---

## 1. Playable Character Model (Recommended)

`PlayableCharacterModel` manages animations directly using Unity's C# `PlayableGraph` API. In massive multiplayer scenarios where hundreds of characters are active in a single scene, standard Mecanim animator controllers incur measurable CPU evaluation costs. The Playable model solves this by blending and crossfading animations purely on demand.

### Key Configuration Fields

* **Idle / Move Clips**: Standby and locomotion clips (walk, run, sprint, backwards, strafe).
* **Jump / Fall / Land Clips**: Aerial states and landing impacts.
* **Attack Animations**: List of basic attack animations corresponding to equipped weapon types.
* **Skill Cast Animations**: Specific cast animations mapped by skill category.
* **Hurt / Dead Clips**: Hit-reactions, stagger animations, and death collapses.
* **Default Weapon Mount**: Bone transforms where equipped weapons (right hand, left hand, shield, back) attach.

> **Testing in Editor:** Use **Open MMORPG → Develop → Test Playable Character Model Animation** to preview clips and blend states directly in the scene view while working on your character prefabs.

---

## 2. Animator Character Model

`AnimatorCharacterModel` is designed for projects that rely on standard Unity Animator Controllers (`.controller` assets) with existing layers, parameters, and blend trees.

### Requirements:
* The character prefab must have an `Animator` component.
* Open MMORPG supplies a base Animator Controller containing standard parameters (`Speed`, `DoAction`, `ActionIndex`, `IsDead`).
* To swap animations between classes or races, you can assign an **Animator Override Controller** on the component without re-wiring the entire state graph.

---

## 3. Character Model 2D

For 2D projects, add `CharacterModel2D` to your character prefab:

1. Right-click in the **Project** window and choose **Create → Animation Clip 2D**.
2. Assign the sprite frames, playback speed, and loop mode.
3. On the `CharacterModel2D` component, map the `AnimationClip2D` assets to the directional states (Up, Down, Left, Right) for Idle, Move, and Attack.

---

## 4. First-Person View (FPS Hands Model)

When building games that support first-person combat:

1. Place a dedicated arms-only mesh as a child under the **Fps Camera Target Transform**.
2. Add the `FpsHandsModel` component to the arms GameObject.
3. Configure separate first-person weapon sway, weapon recoil animations, and reload clips.
4. The system automatically hides the full third-person body and enables the FPS hands when the player switches camera mode into first-person.

---

## 5. Weapon Sheathing and Holstering

Open MMORPG supports automatic weapon sheathing when characters exit combat:

1. On your character model, configure two transform sockets for each weapon slot:
   * **Equipped Socket**: The hand bone transform where the weapon rests during combat.
   * **Sheathed Socket**: The spine, hip, or shoulder bone transform where the weapon holsters when idle.
2. When the character enters combat (initiating an attack or casting a skill), weapons unsheath into the hands.
3. After the out-of-combat timer expires without hostile action, weapons transition back to their holstered positions with sheathing animation clips.

---

## 6. Mounted Animations

When a character rides a mount or vehicle:

1. Open the `CharacterModelManager` component on your character entity.
2. Under **Vehicle Models**, add an entry corresponding to the **Vehicle Type** (e.g., Horse, Dragon, Carriage).
3. Assign seat-specific riding poses or animation controllers for each seat index.
4. When the player mounts, Open MMORPG automatically swaps the active character model to the riding state, ensuring characters sit or hold reins correctly.
