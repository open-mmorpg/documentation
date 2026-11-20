---
title: Database Systems
description: Configuring SQLite, MySQL, and PostgreSQL backends, and how the database server caches data and spreads out character saves in Open MMORPG.
sidebar:
  order: 3
---

Player persistence in Open MMORPG goes through a dedicated database server that the other servers send their requests to. The kit supports SQLite out of the box for instant development, and MySQL for production deployments. PostgreSQL is not available in Unity builds.

---

## 1. Supported Database Systems

| Database | Best For | Setup Overhead | Configuration |
| :--- | :--- | :--- | :--- |
| **SQLite (Default in the editor)** | Local development, single-machine testing, demo playthroughs | **Zero setup.** Ships with the kit; the server creates the database file and its tables. | `mmorpgtemplate.sqlite3`: in the project folder in the editor, and `sqliteDbPath` in `Config/sqliteConfig.json` in a build. |
| **MySQL / MariaDB** | Production multi-server live MMO deployments | Requires a MySQL or MariaDB server, and importing `MMO/SQLs/mysql_main.sql` once. | The **MySQLDatabase** object in the editor, `Config/mySqlConfig.json` in a build. |
| **PostgreSQL** | Deployments that already run PostgreSQL | Requires a PostgreSQL server. | Not available in Unity builds (see below). |

---

## 2. Zero-Setup SQLite (Development Standard)

The demo's `00Init` scene uses SQLite. When you press Play on `00Init`, the database server opens `mmorpgtemplate.sqlite3` in your project folder, creating the file and its tables if they don't exist yet. No database servers or third-party drivers need to be installed.

Which database the editor uses is the **Database Option Index** field on **MMOServerInstance** (under **Running In Editor**). It picks an entry of the **Database Options** list on the **Database Network Manager**, a child of **MMOServerInstance**. In the demo that list is:

| Index | Database |
| :--- | :--- |
| `0` | **MySQLDatabase** |
| `1` | **SQLiteDatabase** |

`00Init` sets **Database Option Index** to `1`, SQLite.

> **A server build ignores Database Option Index.** A build reads `databaseOptionIndex` from the command line or `Config/serverConfig.json`, and without it uses the **Database** field on the **Database Network Manager**, which is **MySQLDatabase** in the demo. To run a demo database server build on SQLite, start it with `-databaseOptionIndex 1` or set `"databaseOptionIndex": 1` in `Config/serverConfig.json` (see [Server Configuration and CLI](./server-configuration-and-cli.md)).

In a build, the SQLite file's location is `sqliteDbPath` in `Config/sqliteConfig.json`, `./mmorpgtemplate.sqlite3` by default, relative to the folder the server runs in. The server writes that file the first time it starts. A `sqliteDbPath` environment variable overrides it.

---

## 3. Switching to MySQL for Production

When preparing for live player testing on external servers:

1. Create a database on your MySQL or MariaDB server and import `Assets/OpenMMORPG/MMO/SQLs/mysql_main.sql` into it. This creates the base tables. The database server applies the later schema changes itself each time it starts, but it doesn't create the base tables.
2. Open your initialization scene (`00Init`).
3. Select the **MySQLDatabase** object, a child of **MMOServerInstance**, and fill in its fields:
   * **Address**: e.g., `127.0.0.1` or internal private VPC IP.
   * **Port**: `3306`.
   * **Db Name**: the database you imported the tables into.
   * **Username / Password**: Your database service credentials.
   * **Connection String**: optional. If you fill it in, it is used instead of the fields above.
4. Select **MMOServerInstance** and set **Database Option Index** to `0`, the position of **MySQLDatabase** in the **Database Options** list.
5. For a server build, set `"databaseOptionIndex": 0` in `Config/serverConfig.json` (or pass `-databaseOptionIndex 0`).

The first time the database server starts with MySQL, it writes the connection settings to `Config/mySqlConfig.json` (in the project folder when you play in the editor, in the folder the server runs in otherwise), and from then on reads them from that file rather than from the Inspector. Edit the file to change them, or delete it so the Inspector values are written again. Its keys are `mySqlAddress`, `mySqlPort`, `mySqlUsername`, `mySqlPassword`, `mySqlDbName` and `mySqlConnectionString`; environment variables with the same names override the file.

> **PostgreSQL is not available in Unity builds.** The kit's PostgreSQL code only compiles outside Unity, so a Unity database server can't use it.

---

## 4. Caching and Deferred Character Saves

When dozens of players save or disconnect at the same moment, writing every save straight to the database makes the database the bottleneck. The **Database Network Manager** has two features against that, both on by default.

### In-memory cache
The database server keeps the data it has read or written in memory: characters, social data, buildings, parties, guilds, storage items and summon buffs. Reads are answered from memory when the data is there, without a database query. Tick **Disable Database Caching** on **MMOServerInstance** (or set `disableDatabaseCaching` in `Config/serverConfig.json` for a build) to turn it off.

### Deferred character saves
With **Use Deferred Character Save Scheduler** ticked, a character save from a map server updates the cache and is answered at once, and the database write is queued:

* Saves of the same character that arrive while one is waiting are merged into one write.
* A character is written at most once every **Character Save Min Interval Seconds** (20).
* Characters are spread over **Character Save Lane Count** queues (32) by a hash of their id. Every **Character Save Tick Milliseconds** (500), the next queue in turn writes up to **Character Save Max Per Tick** (8) of its characters whose interval has passed.
* A write that fails is tried again after **Character Save Retry Delay Seconds** (5).

Before a database server build quits, it waits 30 seconds and then writes every save still queued. Stopping Play in the editor writes them too.
