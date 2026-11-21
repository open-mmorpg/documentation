---
title: Server Configuration and CLI Arguments
description: Complete reference for server command line arguments, network ports, WebSocket flags, and configuration files in Open MMORPG.
sidebar:
  order: 2
---

Open MMORPG server builds can be launched as specific server roles using command line arguments or configured in the `Config/serverConfig.json` file.

A server build takes each setting from the first of these that has it:

1. a command line argument,
2. `./Config/serverConfig.json`,
3. the value on **MMOServerInstance** and its child network managers in your init scene (`00Init` in the demo).

In the editor neither the arguments nor the file are read. The **Running In Editor** fields on **MMOServerInstance** (**Start Login On Awake**, **Start Central On Awake** and so on) decide which servers start when you press Play.

---

## 1. Command Line Launch Arguments

When launching the server executable from a terminal, shortcut, or systemd daemon, pass role flags to dictate which servers run in the process. Any mix of them can run in one process.

| Argument | Description |
| :--- | :--- |
| `-startCentralServer` | Starts the cluster Central Server. |
| `-startLoginServer` | Starts the Login Server players connect to. It needs `-startCentralServer` in the same process. |
| `-startDatabaseServer` | Starts the Database Server. |
| `-startMapSpawnServer` | Starts the Map Spawn Server, which starts the map servers. |
| `-startMapServer` | Starts a map server for one map and channel. |

For example, to run everything except the map servers in one process, as the demo does in the editor:

```
OpenMMORPG.exe -batchmode -nographics -startDatabaseServer -startCentralServer -startLoginServer -startMapSpawnServer
```

### Map Server Arguments
The map spawn server normally starts map servers and passes these itself. You only need them to start a map server by hand:

* `-mapName <MapInfoId>`: The id of the **Map Info** to load, not the scene name. The demo's are `VerdantIsle` (the island, scene `DemoMap`) and `CultistCrypt`.
* `-channelId <ChannelId>`: The channel this map server belongs to. The demo's channels are `1` and `2`; the map spawn server falls back to `default` when it has no channels set.
* `-mapPort <Port>`: The port this map server listens on.
* `-publicAddress <Address>`: The address players are told to connect to for this map server.
* `-instanceId <InstanceId>`: Set by the map spawn server when it starts an instance dungeon. Central generates the id (32 hexadecimal characters).

---

## 2. Network Port Configuration

The ports used by the demo's **MMOServerInstance** prefab. Every connection is LiteNetLib over UDP. With WebSockets turned on (section 3), the login, central and map servers use WebSockets over TCP instead; the cluster and database connections stay on UDP.

| Argument | Demo port | Players connect? | Description |
| :--- | :--- | :--- | :--- |
| `-loginPort` | `7500` | Yes | The login server: login, registration, channels and characters. |
| `-spawnStartPort` | `8000` | Yes | The first port map servers use. Each map server the map spawn server starts takes the next free one (`8000`, `8001`, `8002`, ...). |
| `-clusterPort` | `6010` | No | Central's cluster port. The login, map spawn and map servers connect to central here. |
| `-databaseManagerPort` | `6100` | No | The database server. The other servers send their database requests here. |
| `-centralPort` | `7000` | No | Central's own listener. Nothing in the kit connects to it. |
| `-mapSpawnPort` | `6001` | No | The map spawn server's own listener. Central reaches the map spawn server through the cluster port instead. |

The addresses the servers use to find each other:

| Argument | Demo value | Description |
| :--- | :--- | :--- |
| `-centralAddress` | `127.0.0.1` | Where central is, for the login, map spawn and map servers. |
| `-databaseManagerAddress` | `127.0.0.1` | Where the database server is. |
| `-publicAddress` | `127.0.0.1` | The address players use to reach the map servers on this machine. On a real server, set it to the machine's public IP address or host name. |
| `-loginAddress` | `127.0.0.1` | The login server's address, as it reports it to central. |

---

## 3. WebSockets and SSL (Browser Clients)

If building for WebGL or browser environments:

* `-useWebSocket`: The login, central and map servers started by this process use WebSockets instead of UDP. The game client must use WebSockets too: tick **Use Web Socket** on **MMOClientInstance** (WebGL builds always use them).
* `-webSocketSecure`: Enables Secure WebSockets (WSS). Tick **Web Socket Secure** on **MMOClientInstance** as well.
* `-webSocketCertPath <Path>`: The certificate file, with its private key, usually a `.pfx` (PKCS #12) file. A relative path starts from the folder the server runs in.
* `-webSocketCertPassword <Password>`: The certificate file's password, if it has one.

The map spawn server does not pass these arguments on to the map servers it starts. Map servers read `Config/serverConfig.json` instead, so set `useWebSocket`, `webSocketSecure`, `webSocketCertPath` and `webSocketCertPassword` there.

---

## 4. Configuration File (`Config/serverConfig.json`)

Instead of passing dozens of command line switches, put them in `Config/serverConfig.json`. The server reads it from `./Config/` in the folder it is started from (its working directory), which is not necessarily the folder the executable is in. Map servers started by the map spawn server run in the same folder, so they read the same file.

If the file doesn't exist when a server starts, the server writes one with the values it is using, including that run's command line arguments. That is the easiest way to get a complete file to edit.

The keys are the argument names without the dash. Case doesn't matter: the server writes the login keys as `LoginAddress`, `LoginPort` and `MaxConcurrentRequest`. With the demo's values:

```json
{
  "loginAddress": "127.0.0.1",
  "loginPort": 7500,
  "maxConcurrentRequest": 150,
  "centralAddress": "127.0.0.1",
  "centralPort": 7000,
  "clusterPort": 6010,
  "publicAddress": "127.0.0.1",
  "databaseOptionIndex": 1,
  "databaseManagerAddress": "127.0.0.1",
  "databaseManagerPort": 6100,
  "mapSpawnPort": 6001,
  "spawnStartPort": 8000,
  "spawnExePath": "./builds/OpenMMORPG.exe",
  "notSpawnInBatchMode": false,
  "spawnMaps": ["VerdantIsle", "CultistCrypt"],
  "spawnChannels": ["1"]
}
```

The keys that aren't ports or addresses:

| Key | Description |
| :--- | :--- |
| `maxConcurrentRequest` | How many logins the login server processes at once (150 by default). Further logins wait in a queue. |
| `databaseOptionIndex` | Which entry of the **Database Options** list on the **Database Network Manager** the database server uses. In the demo `0` is MySQL and `1` is SQLite. If it isn't set, a build uses the **Database** field, which is MySQL in the demo. See [Database Systems](./database-systems.md). |
| `disableDatabaseCaching` | `true` turns off the database server's in-memory cache. |
| `spawnExePath` | The map server executable the map spawn server starts. The demo's `00Init` sets `./builds/OpenMMORPG.exe`; on Linux point it at your `.x86_64` file. |
| `notSpawnInBatchMode` | `true` starts map servers with a window instead of `-batchmode -nographics`. |
| `spawnMaps` | The **Map Info** ids the map spawn server starts. If it's empty, the spawner's **Spawning Maps** list is used, and if that is empty too, every map in the Game Instance. |
| `spawnChannels` | The channels the map spawn server starts each map for. |
| `channels`, `defaultChannelMaxConnections` | Central's channel list and the player limit for a channel that doesn't set its own. |
| `mapPort`, `mapMaxConnections` | A map server's port and player limit, for a map server you start by hand. |
| `useCustomDatabaseClient` | `true` uses the object in **Custom Database Client Source** (the demo's **Rest Database Client**) instead of the database server. On the command line it is written without a leading dash: `useCustomDatabaseClient`. |

Any explicit argument passed on the command line overrides the value in `Config/serverConfig.json`.
