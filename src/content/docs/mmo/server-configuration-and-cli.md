---
title: Server Configuration and CLI Arguments
description: Complete reference for server command line arguments, network ports, WebSocket flags, and configuration files in Open MMORPG.
sidebar:
  order: 2
---

Open MMORPG server builds can be launched as specific server roles using command line arguments or configured in a central `config.json` file.

---

## 1. Command Line Launch Arguments

When launching the server executable from a terminal, shortcut, or systemd daemon, pass role flags to dictate which servers run in the process:

| Argument | Description |
| :--- | :--- |
| `-startCentralServer` | Starts the cluster Central Server. |
| `-startLoginServer` | Starts the client authentication Login Server. |
| `-startDatabaseServer` | Starts the database manager persistence server. |
| `-startMapSpawnServer` | Starts the Map Spawner process manager. |
| `-startMapServer` | Starts a dedicated map instance for a specific zone. |

### Map Server Arguments
When `-startMapServer` is passed, supply the target map and channel:
* `-mapName <MapId>`: The ID of the Map Info to load (e.g. `-mapName DemoMap`).
* `-channelId <ChannelId>`: The channel string (e.g. `-channelId Default`).
* `-instanceId <InstanceId>`: Optional GUID for private instance dungeons.

---

## 2. Network Port Configuration

The default network ports used by Open MMORPG:

| Argument | Default Port | Protocol | Description |
| :--- | :--- | :--- | :--- |
| `-centralPort` | `5000` | UDP / LiteNetLib | Public port clients connect to for character selection and world tracking. |
| `-mapSpawnPort` | `5001` | TCP / RPC | Communication port between Central Server and Map Spawner. |
| `-loginPort` | `5002` | UDP or WebSocket | Public authentication endpoint for client login and registration. |
| `-databaseManagerPort` | `5003` | TCP / RPC | Internal port where Central and Map servers communicate with Database server. |
| `-clusterPort` | `6000` | TCP / RPC | Internal cluster bus connecting Central Server to Map nodes. |
| `-spawnStartPort` | `8000` | UDP / LiteNetLib | Base port from which spawned map servers allocate listening ports (`8000`, `8001`, `8002`, ...). |

---

## 3. WebSockets and SSL (Browser Clients)

If building for WebGL or browser environments:

* `-useWebSocket`: Enables WebSocket transport on the Central and Login servers.
* `-webSocketSecure`: Enables Secure WebSockets (WSS).
* `-webSocketCertPath <Path>`: Absolute path to the `.pfx` or `.crt` certificate file on disk.
* `-webSocketCertPassword <Password>`: Private key password for the SSL certificate.

---

## 4. Configuration Files (`config.json`)

Instead of passing dozens of command line switches, you can place a `config.json` file beside your executable:

```json
{
  "loginAddress": "127.0.0.1",
  "loginPort": 5002,
  "loginMaxConnections": 1000,
  "maxConcurrentRequest": 100,
  "centralAddress": "127.0.0.1",
  "centralPort": 5000,
  "clusterPort": 6000,
  "databaseManagerAddress": "127.0.0.1",
  "databaseManagerPort": 5003,
  "mapSpawnPort": 5001,
  "spawnStartPort": 8000,
  "spawnExePath": "./OpenMMORPG.exe",
  "notSpawnInBatchMode": false
}
```

Any explicit argument passed on the command line will override the value declared in `config.json`.
