---
title: MMO Server Architecture
description: Overview of the distributed server architecture, Central, Login, Map, Map Spawner, Database nodes, and instance dungeons in Open MMORPG.
sidebar:
  order: 1
---

Open MMORPG is architected from the ground up as a distributed, high-concurrency multiplayer server cluster. Rather than running the entire virtual world inside a single monolithic process, responsibilities are partitioned across specialized server roles.

---

## Server Roles Overview

```
                                 [ Game Clients ]
                                  │            │
            ┌─────────────────────┘            └──────────────────────┐
            ▼                                                         ▼
    [ Login Server ] (Port 5002)                               [ Central Server ] (Port 5000)
            │                                                         │
            │ (Cluster Auth)                                          │ (Cluster Management)
            └─────────────────────┬───────────────────────────────────┘
                                  ▼
                         [ Cluster Bus (Port 6000) ]
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
 [ Database Server ]     [ Map Spawn Server ]        [ Map Server 1 ] (Island)
    (Port 5003)             (Port 5001)             [ Map Server 2 ] (Dungeon)
  (SQLite / MySQL)          │                       [ Map Server N ] (...)
                            └── Spawns Processes ──►   (Ports 8000+)
```

### 1. Central Server
The cluster coordinator. It tracks active channels, monitors connected client sessions, manages global chat, routes cross-map whispers, and brokers private instance dungeon requests.

### 2. Login Server
Handles account authentication, user registrations, password hashing, and token validation. By keeping the Login Server isolated from the Central Server, high authentication spikes during game launches cannot exhaust resources required for live gameplay.

### 3. Database Server
Manages persistent character data, inventory bags, bank storage, guild rosters, and player buildings. In Open MMORPG, this role is enhanced with a **Sharded Database Network Manager** supporting in-memory caching and throttled writes (see [Database Systems](./database-systems.md)).

### 4. Map Spawn Server
A process supervisor running on each server host machine. When player populations grow or when players request private dungeons, the Map Spawn Server launches new dedicated `OpenMMORPG.exe` (or Linux binary) child processes, assigns them network ports, and registers them with the Central Server.

### 5. Map Servers
The authoritative game simulation servers. Each map server runs the gameplay scene for a specific zone, processing movement via the **Unity Jobs + Burst Movement Pipeline**, evaluating combat damage, ticking monster AI, and broadcasting network snapshots.

---

## Channels and Scalability

A **Channel** represents a complete parallel mirror of world maps:
* Characters choose their preferred channel (e.g., Channel 1, Channel 2) at the character selection screen.
* Channels distribute player density across separate map processes without splitting guild or chat connectivity.
* Channel capacity limits and timeout durations are configured in `ServerConfig` (see [Server Configuration and CLI](./server-configuration-and-cli.md)).

---

## Instance Dungeons

When a party enters an instanced dungeon:
1. The party leader interacts with the dungeon door or warp portal.
2. The Central Server instructs the Map Spawn Server to allocate a private, dedicated map instance with a unique `instanceId`.
3. Party members warp into the isolated instance.
4. When the party leaves or the instance expiration timer finishes, the spawner cleanly terminates the child map process, freeing memory.
