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

Connect to your remote Linux server via SSH:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install required runtime libraries
sudo apt install -y libglu1 libxcursor1 libxrandr2 libasound2
```

Upload your build folder to `/opt/openmmorpg` using `rsync` or `scp`, and grant execution permissions:

```bash
sudo chmod +x /opt/openmmorpg/OpenMMORPG.x86_64
```

---

## 3. Firewall (UFW) Configuration

Only public-facing ports should be opened to the internet. Internal cluster ports (`5003` for database and `6000` for cluster bus) must remain closed:

```bash
# Allow SSH access
sudo ufw allow 22/tcp

# Public game ports
sudo ufw allow 5000/udp      # Central Server
sudo ufw allow 5002/udp      # Login Server
sudo ufw allow 8000:8100/udp # Dynamic Map Server Range

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

## 4. Systemd Service Management

To ensure your servers run automatically and restart if terminated, create systemd service definitions in `/etc/systemd/system/`.

### Example: Map Spawner Service (`/etc/systemd/system/openmmorpg-spawner.service`)

```ini
[Unit]
Description=Open MMORPG Map Spawn Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/openmmorpg
ExecStart=/opt/openmmorpg/OpenMMORPG.x86_64 -batchmode -nographics -startMapSpawnServer
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable openmmorpg-spawner
sudo systemctl start openmmorpg-spawner
```

View live server logs using `journalctl`:

```bash
journalctl -u openmmorpg-spawner -f
```
