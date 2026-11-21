---
title: Dedicated Server Deployment (Linux)
description: Step-by-step guide to building Linux dedicated servers, deploying to a VPS, configuring firewall ports, and setting up systemd services.
sidebar:
  order: 5
---

This guide walks through building headless Linux dedicated server binaries from Unity and deploying them to a cloud virtual private server (VPS) running Ubuntu 22.04 or 24.04 LTS.

---

## 1. Building the Linux Dedicated Server

### Step 1: Install Unity Modules
From Unity Hub, navigate to **Installs → Your Unity Version → Add modules** and check **Linux Dedicated Server Build Support**.

### Step 2: Configure Build Settings
1. In Unity, open **File → Build Profiles**.
2. Select **Linux Server** and click **Switch Platform**.
3. Verify that your scene list has `00Init` at the top, followed by all world maps (see [Before you build](../guide/before-you-build.md)).
4. Choose **Build** and output the files to a folder (e.g. `builds_linux/OpenMMORPG.x86_64`).

---

## 2. Server Host Preparation (Ubuntu)

Connect to your remote Linux server via SSH and update it:

```bash
sudo apt update && sudo apt upgrade -y
```

Upload your build folder to `/opt/openmmorpg` using `rsync` or `scp`, and grant execution permissions:

```bash
sudo chmod +x /opt/openmmorpg/OpenMMORPG.x86_64
```

A Linux Server build is headless, so it doesn't need the desktop graphics and audio libraries a normal Linux player uses. To check that the machine has every library the build needs, list the missing ones:

```bash
cd /opt/openmmorpg
ldd OpenMMORPG.x86_64 UnityPlayer.so | grep "not found"
```

No output means nothing is missing. Otherwise install the packages that provide the libraries it lists.

---

## 3. Server Configuration

The servers read `Config/serverConfig.json` from the folder they run in, `/opt/openmmorpg` here (see [Server Configuration and CLI Arguments](./server-configuration-and-cli.md)). If the file doesn't exist, the first start writes one with the values from your build; edit it afterwards. On a VPS, three settings have to change from the demo's values:

* `publicAddress`: the VPS's public IP address or host name. Map servers tell players to connect to this address, and the default `127.0.0.1` only works on the same machine.
* `spawnExePath`: the Linux build, `./OpenMMORPG.x86_64` or the full path `/opt/openmmorpg/OpenMMORPG.x86_64`. The demo's `00Init` sets `./builds/OpenMMORPG.exe`.
* `databaseOptionIndex`: which database the database server uses. In the demo, `1` is SQLite and `0` is MySQL; without this setting a build uses MySQL. For MySQL, also fill in `Config/mySqlConfig.json` (see [Database Systems](./database-systems.md)).

---

## 4. Firewall (UFW) Configuration

The game client only connects to the login server and to map servers, so only their ports should be opened to the internet. The central (`7000`), cluster (`6010`), database (`6100`) and map spawn (`6001`) ports must remain closed:

```bash
# Allow SSH access
sudo ufw allow 22/tcp

# Public game ports
sudo ufw allow 7500/udp      # Login Server
sudo ufw allow 8000:8100/udp # Map Servers

# Enable firewall
sudo ufw enable
sudo ufw status
```

Map servers take ports from `8000` upward: one for each map on each channel, plus one for each running instance dungeon. Make the range large enough for yours. If you turned on WebSockets, open the same ports for `tcp` instead of `udp`.

If you split the servers across several machines, the other machines need the cluster and database ports too. Open them to those machines' addresses only, for example:

```bash
sudo ufw allow from 203.0.113.20 to any port 6010 proto udp
sudo ufw allow from 203.0.113.20 to any port 6100 proto udp
```

---

## 5. Systemd Service Management

To ensure your servers run automatically and restart if terminated, create systemd service definitions in `/etc/systemd/system/`.

### Example: All Servers on One Machine (`/etc/systemd/system/openmmorpg.service`)

This runs the database, central, login and map spawn servers in one process. The map spawn server then starts the map servers.

```ini
[Unit]
Description=Open MMORPG Servers
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/openmmorpg
ExecStart=/opt/openmmorpg/OpenMMORPG.x86_64 -batchmode -nographics -logFile - -startDatabaseServer -startCentralServer -startLoginServer -startMapSpawnServer
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

`WorkingDirectory` matters: the servers read `Config/` there, the SQLite file is created there by default, and the map servers they start run there too. `-logFile -` sends Unity's log to standard output, where systemd collects it. To split the roles across services or machines, give each service the flags for its roles (see [Server Configuration and CLI Arguments](./server-configuration-and-cli.md)).

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable openmmorpg
sudo systemctl start openmmorpg
```

View live server logs using `journalctl`:

```bash
journalctl -u openmmorpg -f
```

The servers also write daily log files to `Logs/` in the working directory.
