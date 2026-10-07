---
title: Building 2D Games
description: Creating 2D singleplayer, LAN, and MMORPG games using 2D character models, sprite animations, and 2D physics components.
sidebar:
  order: 3
---

While the demo showcases a 3D third-person MMO, Open MMORPG fully supports 2D top-down, isometric, and side-scrolling games using the same networking, combat, and database infrastructure.

---

## 1. 3D vs 2D Component Equivalents

When building a 2D game, swap the 3D physics and animation components on your entity prefabs for their 2D counterparts:

| 3D Component | 2D Equivalent | Notes |
| :--- | :--- | :--- |
| `CharacterController` | `Rigidbody2D` | Set `Rigidbody2D` to **Kinematic** or configure low linear drag. |
| `CharacterControllerEntityMovement` | `RigidBodyEntityMovement2D` | Handles 2D X/Y vector locomotion. |
| `CapsuleCollider` | `CapsuleCollider2D` / `CircleCollider2D` | Hitboxes and world boundaries. |
| `PlayableCharacterModel` | `CharacterModel2D` | Frame-by-frame 2D sprite animation playback using `AnimationClip2D`. |
| `WaterArea` (3D trigger) | `WaterArea2D` (2D trigger) | Water swimming volumes using 2D colliders. |

---

## 2. 2D Sprite Animations (`AnimationClip2D`)

1. In the **Project** window, right-click and choose **Create → Animation Clip 2D**.
2. Drag your sprite sequence into the frames list.
3. Set the frame rate (e.g. `12` or `24` frames per second) and loop mode.
4. On your character entity's `CharacterModel2D` component, map the 2D clips to directional movement states (Up, Down, Left, Right).

---

## 3. Camera and Sprite Sorting

* Set your scene camera projection to **Orthographic**.
* Configure Unity's **Transparency Sort Mode** under **Project Settings → Graphics** to **Custom Axis** with `(0, 1, 0)` so sprites sort based on vertical Y position (characters in front naturally render over characters behind them).
