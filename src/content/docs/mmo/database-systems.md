---
title: Database Systems and Sharding
description: Configuring SQLite, MySQL, and PostgreSQL backends, along with Open MMORPG's high-concurrency Sharded Database Network Manager.
sidebar:
  order: 3
---

Player persistence in Open MMORPG is decoupled through a dedicated database network layer. The framework supports embedded SQLite databases out of the box for instant development, and scales to MySQL or PostgreSQL for production live deployments.

---

## 1. Supported Database Systems

| Database | Best For | Setup Overhead | Configuration |
| :--- | :--- | :--- | :--- |
| **SQLite (Default)** | Local development, single-machine testing, demo playthroughs | **Zero setup.** Ships pre-configured; database file created automatically in project root. | Default configuration (`mmorpgtemplate.sqlite3`). |
| **MySQL / MariaDB** | Production multi-server live MMO deployments | Requires installing MySQL Server 8.0+ or MariaDB. | Set MySQL connection string in Database Network Manager. |
| **PostgreSQL** | Enterprise production deployments requiring advanced replication | Requires PostgreSQL Server 14+. | Set PostgreSQL connection string. |

---

## 2. Zero-Setup SQLite (Development Standard)

In upstream MMORPG Kit, developers were required to install and maintain an external MySQL instance before running the project in the editor.

In Open MMORPG, the project ships with an embedded SQLite driver enabled by default. When you press Play on `00Init`, the Database Server initializes `mmorpgtemplate.sqlite3` directly inside your project folder. No database servers or third-party drivers need to be installed.

---

## 3. Switching to MySQL or PostgreSQL for Production

When preparing for live player testing on external servers:

1. Open your initialization scene (`00Init`).
2. Select the **MMOServerInstance** GameObject.
3. Locate the **Database Network Manager** component in the Inspector.
4. Set **Database Option** to **MySQL** (or **PostgreSQL**).
5. Configure the connection string:
   * **Host / Address**: e.g., `127.0.0.1` or internal private VPC IP.
   * **Port**: `3306` (MySQL) or `5432` (PostgreSQL).
   * **Database Name**: e.g., `openmmorpg_live`.
   * **Username / Password**: Your database service credentials.
6. The database manager automatically executes required schema migration tables on initial launch.

---

## 4. Open MMORPG's Sharded Database Network Manager

High player counts in traditional MMO architectures frequently suffer from database contention: when dozens of players save inventory states or disconnect simultaneously, synchronous queries block server threads, resulting in lag spikes.

Open MMORPG introduces the **Sharded Database Network Manager** to eliminate persistence bottlenecks:

### Key Architectural Pillars:
* **Lane-Based Concurrency**: Incoming persistence queries are distributed across parallel worker lanes based on character ID hash. Queries for separate players never block each other.
* **Queued & Throttled Persistence**: Save operations are staged in non-blocking queues with a configurable `maxSavesPerTick` limit. Burst traffic is smoothed into steady background disk writes.
* **In-Memory Thread-Safe Cache**: Active character snapshots are maintained in memory using `ConcurrentDictionary`. Frequent read operations (such as character inspections or party lookups) are resolved instantly without touching the disk.
