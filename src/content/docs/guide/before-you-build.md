---
title: Before you build
description: Set the build target switches, scene list and Addressables mode before you make a client, server or offline build.
sidebar:
  order: 5
---

Some of the kit's code is switched on or off when your game is compiled, using Unity's
*scripting define symbols*. The editor always compiles everything, so a feature that works
when you press Play can still be missing from a build made with the wrong switches, and
nothing warns you. Check this page before you build.

All the switches are under **Open MMORPG → Build**. Each one changes the define symbols of
the platform your project is set to build for (the active platform in **Build Profiles**),
and Unity then recompiles. Switching platform later? Run the switch again for the new one.

## Build targets

**Open MMORPG → Build → Target** has three choices:

| Menu item | Use it for | What it changes |
| --- | --- | --- |
| **Setup For Offline-Lan Build** | Single-player and LAN games, where any copy of the game may host. | Removes `EXCLUDE_SERVER_CODES` and `UNITY_SERVER`. |
| **Setup For MMO Build** | The game client you give to players. | Adds `EXCLUDE_SERVER_CODES`. |
| **Setup For MMO with Server Codes Build** | A regular (non-dedicated) build that must also run servers. | Removes `EXCLUDE_SERVER_CODES` and `UNITY_SERVER`. |

### What "server code" means here

`EXCLUDE_SERVER_CODES` leaves the server side out of a regular player build: the login,
central, database and map servers, and the database code. A client built that way
can't be turned into a private server, and it's smaller.

Two kinds of build always include the server code, whatever the setting:

- the **Unity editor**, so Play mode can run servers while you work, and
- **dedicated server builds** (the **Windows Server**, **Linux Server** and **macOS Server**
  platforms), because Unity defines `UNITY_SERVER` for them itself.

So a typical MMO project chooses **Setup For MMO Build** once and leaves it. Clients are built
for the normal platforms without server code, and servers are built for the server platforms
with it. You only need **Setup For MMO with Server Codes Build** if a server has to run from a
regular player build. That happens, for example, when Dedicated Server Build Support isn't
installed and you build the demo's map server as a plain **Windows** build.

Servers run on desktop platforms only: Windows, macOS and Linux.

## Scene list

Open **File → Build Profiles** and check the **Scene List** before every build:

- **Your first scene must be at the top.** It holds the [Game Instance](./game-instance.md)
  and starts everything else. In the demo that is `00Init`.
- **Every scene the game can load must be in the list**: the home scene, and every map that
  a Map Info in your [game database](./game-database.md) points to. A map missing from the
  list can't be loaded, by the client or by a map server.

## Addressables

Open MMORPG can load its prefabs, scenes and effects either through direct references or
through Unity's Addressables system. With Addressables you can ship a small client and
download content later, but it adds a build step of its own.

The kit's project settings start with Addressables **off**: they set `DISABLE_ADDRESSABLES`
for desktop builds. The switches are under **Open MMORPG → Build → Addressables**:

- **Enable Addressables** / **Disable Addressables** turn Addressables support on or off.
- **Exclude Prefab Refs** / **Include Prefab Refs** decide whether direct prefab references
  are compiled in as well. Exclude them only when everything your game loads has an
  Addressable reference, so a build doesn't carry two copies of each prefab.

## Checking your data

**Open MMORPG → Build → Asset Tools** has two checks worth running before a release build:

- **Validate Game Data And Prefabs** runs the validation step on every game data asset and
  game database in the project, and fixes up anything outdated or inconsistent. It logs each
  asset it changed in the Console.
- **Validate Opened Scenes** checks the spawn areas in the scenes you have open, and gives
  every networked object in them a scene ID. Run it after you add or copy networked objects,
  such as NPCs or doors, into a map.

## MMO builds: keep the server in step

In an MMO the client and the servers must be built from the same project state. Every
character, monster, item and scene is identified by ID, and a server built before a change
doesn't know about it. If players can't enter a map after you change content, rebuild the
server first. While you work in the editor, that means rebuilding the map server, as
described in [Getting started](./getting-started.md#6-build-the-map-server).

## Server-only scenes

**Open MMORPG → Build → Scenes → Bake Server Scene** strips everything only a player needs
from the scene you have open: terrains, renderers, animators and 3D text. A map scene made
this way loads faster on a server and uses less memory.

> **It changes the open scene in place.** Run it only on a copy of a map scene saved for
> your server build, never on the scene your clients use.
