---
title: Maps, Zones, and Portals
description: How to configure game maps, PvP zones, warp portals, and procedural dungeon generation in Open MMORPG.
sidebar:
  order: 1
---

Every playable area in Open MMORPG is defined by a **Map Info** asset pointing to a Unity scene. Map Infos govern zone rules, background music, default respawn points, and PvP settings.

---

## 1. Creating a Map Info Asset

1. In the **Project** window, right-click and choose **Create → Create GameData → MapInfo → Map Info**.
2. Configure the map in the Inspector:

| Field | Description |
| :--- | :--- |
| **Title** | The region's display name shown when players enter the area. |
| **Scene** | The Unity Scene asset loaded when entering this map. |
| **Default Respawn Position** | World coordinate where players respawn upon death if no checkpoint is active. |
| **Is Safe Zone** | When enabled, player-versus-player combat and hostile attacks are disabled. |
| **Is Pvp Zone** | Enables open-world PvP combat between players in this zone. |
| **Music Clip** | Background music looped while players inhabit this scene. |

> **Add to Scene List:** Remember that every scene referenced by a Map Info must be added to your **File → Build Profiles → Scene List** (see [Before you build](../guide/before-you-build.md#scene-list)).

---

## 2. Warp Portals

Warp portals transport characters between maps or across long distances within the same zone.

### Placing Portals in Scenes
1. Drag the **Warp Portal Entity** prefab into your scene (or create an object with `WarpPortalEntity` and a trigger collider).
2. Configure:
   * **Warp To Map Info**: Destination Map Info asset.
   * **Warp To Position**: Vector3 world coordinates at the destination.
   * **Required Level**: Minimum character level needed to enter.
   * **Required Items**: Keys, quest tokens, or tolls consumed upon warping.

### Warp Portal Database
If you prefer managing portal coordinates across multiple scenes in a single asset rather than placing them by hand in each scene, create a **Warp Portal Database** (**Create → Create GameDatabase → Warp Portal Database**) and link it in [Game Instance](../guide/game-instance.md).

---

## 3. Procedural Map and Dungeon Loading

Open MMORPG supports procedural dungeon generators and custom asynchronous map loading.

When a player enters a procedurally generated map:
1. Implement the `ICustomMapSystemLoadingAwaiting` interface on your dungeon generation manager.
2. The map server pauses player spawning and client handshakes until your generator finishes creating geometry, baking NavMeshes, and positioning spawners.
3. Once your generator calls `FinishLoading()`, the server notifies connecting clients, and characters are spawned into the finished dungeon.
