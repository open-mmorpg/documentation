---
title: MMO Server Architecture
description: Overview of the distributed server architecture, Central, Login, Map, Map Spawner, Database nodes, and instance dungeons in Open MMORPG.
sidebar:
  order: 1
---

Open MMORPG runs an MMO as several servers working together. Rather than running the entire virtual world inside a single process, responsibilities are split across server roles, and every map runs as a server process of its own.

---

## Server Roles Overview

The ports below are the ones the demo's **MMOServerInstance** prefab uses. All of them are LiteNetLib (UDP). With WebSockets turned on, the login, central and map servers use WebSockets over TCP instead (see [Server Configuration and CLI Arguments](./server-configuration-and-cli.md)).

```
                        [ Game client ]
                         │           │
        login and        │           │   gameplay
        characters       ▼           ▼
  ┌─ one process ──────────────┐   [ Map servers ]  from port 8000
  │ [ Login server ]   7500    │     8000  VerdantIsle
  │ [ Central server ]         │     8001  CultistCrypt
  │     cluster port   6010 ◄──┼──── every map server registers here
  └────────────────────────────┘
                ▲
                │ registers, receives "start this map" requests
  [ Map spawn server ] ── starts map server processes ──► [ Map servers ]

  [ Database server ]  6100 ◄── the other servers send their database requests here
                                (SQLite or MySQL)
```

The game client only connects to the login server and to map servers. Everything else stays between your servers.

### 1. Central Server
The cluster coordinator. It opens the **cluster port** that the login, map spawn and map servers connect to, and through it:

* keeps the channel list,
* knows which map servers are running and which players are online on each of them,
* passes chat, party and guild updates from one map server to the others,
* asks a map spawn server to start a map server when an instance dungeon is needed.

Central also listens on its own port (`7000` in the demo), but nothing in the kit connects to it.

### 2. Login Server
The server players connect to first. It handles login, registration and logout, lists the channels, and lists, creates, deletes and selects characters. When a character is selected it tells the client which map server to connect to.

The login server reads central's channels and cluster connections directly, so it must run in the **same process** as the central server. Login spikes are handled by a queue instead: at most `maxConcurrentRequest` logins (150 by default) are processed at once, and the rest wait their turn.

### 3. Database Server
Reads and writes persistent data for the other servers: accounts, characters, inventory, storage, parties, guilds, mail and buildings. It keeps a cache of that data in memory and can defer character saves so that many saves arriving at once are spread out (see [Database Systems](./database-systems.md)).

Passwords are checked and hashed here, not in the login server. The default `DefaultDatabaseUserLogin` stores passwords as MD5 hashes; its own code comment recommends replacing it with a stronger scheme for a live game.

### 4. Map Spawn Server
Starts map server processes on its machine. When it has registered with central, it starts a map server for every map in its list on every channel in its list (in the demo, `VerdantIsle` and `CultistCrypt` on channel `1`), and starts it again if it exits. When central asks for an instance dungeon, it starts another one. Each map server gets the next free port from **Start Port** (`8000`) upward. It does not start or stop map servers as the number of players changes.

### 5. Map Servers
The authoritative game simulation servers. Each map server is a Unity build running one map's scene for one channel: it moves the entities, resolves combat, runs monster AI and sends each player the entities around them. Which entities a player can see is worked out on a grid by a Burst-compiled job.

---

## Channels and Scalability

A **Channel** represents a complete parallel mirror of world maps:
* Characters choose their preferred channel (e.g., Channel 1, Channel 2) at the character selection screen.
* Each channel has its own map servers, so channels spread players across separate processes. Chat, parties and guilds still work across channels, because central passes them between all map servers.
* The channel list and each channel's player limit are set on the **Central Network Manager** (**Channels** and **Default Channel Max Connections**), or with `channels` and `defaultChannelMaxConnections` in `Config/serverConfig.json`. Which channels a map spawn server starts maps for is its **Spawning Channel Ids** list, or `spawnChannels` (see [Server Configuration and CLI](./server-configuration-and-cli.md)).

---

## Instance Dungeons

When a character enters an instance dungeon through a warp portal whose **Warp Portal Type** is **Enter Instance**:
1. If the character leads a party, party members within **Join Instance Map Distance** (20 m by default, on the **Game Instance**) go along. A party member who is not the leader cannot open an instance.
2. The map server asks central for a new instance of that map. Central gives it a unique instance id and asks a map spawn server to start a map server for it.
3. The characters are saved and moved to the new map server.
4. An instance map server shuts itself down 30 seconds after its last player leaves.

The demo's crypt is not an instance: `CultistCrypt` is an ordinary map that every player shares.
