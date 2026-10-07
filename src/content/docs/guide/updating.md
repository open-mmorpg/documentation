---
title: Updating Open MMORPG
description: How to move a project to a newer release of the kit without leaving stale files behind.
sidebar:
  order: 2
---

Every release of Open MMORPG is published on the
[releases page](https://github.com/open-mmorpg/OpenMMORPG/releases), with notes on what changed.
Read the notes for every release between your version and the new one before you update.

## Before you start

- **Commit your project to version control**, or make a copy of it. An update replaces
  hundreds of files at once, and version control is the easiest way to see exactly what
  changed and to undo it.
- **Keep your own work outside `Assets/OpenMMORPG`.** An update replaces whatever is in that
  folder. If you changed kit or demo files in place, copy those changes somewhere else first,
  or better, move them into your own assets. (A good habit from day one: duplicate the demo's
  prefabs and data into your own folder and build on the copies.)

## Importing over the top

For most releases, import the new version exactly the way you installed the first one:

- **Asset Store:** **Window → Package Manager → My Assets**, select Open MMORPG, choose
  **Update**, then **Import**.
- **GitHub:** download the new `OpenMMORPG.unitypackage` and choose
  **Assets → Import Package → Custom Package...**

Accept the dependency prompt (**Install/Upgrade**) so the Unity packages the kit depends on
are brought up to the versions it now needs.

Run **Open MMORPG → Install → Import Project Settings** again only when the release notes say
the project settings changed. It replaces your input, physics, tag, layer, quality and time
settings, so any changes you made to those are lost.

## A clean update

Importing a package adds and replaces files, but it never deletes any. When a release moves
or removes scripts, the old copies stay in your project, and Unity then finds the same class
twice and stops compiling. The usual symptom is a wall of errors such as
*"The type ... already contains a definition for ..."*, or *"... is defined multiple times"*.

To avoid that, delete the old kit before importing the new one:

1. Make sure your project is committed, as above.
2. Close any scene or prefab that uses kit components, without saving.
3. Delete the `Assets/OpenMMORPG` folder from the **Project** window.
4. Import the new version straight away, as described above. Don't save anything in between.

Your own prefabs and scenes keep working: Unity links assets by an ID stored with each file,
and the new package brings back the same IDs for everything that still exists.

Do a clean update whenever the release notes mention moved or removed files, or whenever an
ordinary import leaves you with duplicate-definition errors.

## After updating

- If your game uses MMO mode, **rebuild your map server**. A build made before the update
  still contains the old kit, and the editor and the server have to agree. See
  [Getting started](./getting-started.md#6-build-the-map-server).
- Check the console for warnings about obsolete fields or settings. Releases that rename
  something say so in their notes.
