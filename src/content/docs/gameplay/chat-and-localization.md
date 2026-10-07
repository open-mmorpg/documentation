---
title: Chat Channels and Localization
description: Configuring chat channels, chat bubble prefabs, profanity filters, and multi-language localization in Open MMORPG.
sidebar:
  order: 5
---

Communication and internationalization in Open MMORPG are powered by two dedicated subsystems: the **Chat System** (`UIChatHandler`, `UIChatBubbleManager`) and the **Language Manager** (`LanguageManager`, `UILanguageText`).

---

## 1. Chat System Architecture

The chat system supports channel-based routing, overhead speech bubbles, configurable command prefixes, and server-side profanity filtering.

### Chat Channels

| Channel | Default Prefix | Scope | Description |
| :--- | :--- | :--- | :--- |
| **Local** | *(None)* | Proximity | Transmitted only to characters within proximity range defined by `localChatDistance` on [Game Instance](../guide/game-instance.md). |
| **Global** | `/a <message>` | Server / Map | Broadcast across the entire server or map instance. |
| **Whisper** | `/w <target> <msg>` | Private | Direct private message sent between two characters. |
| **Party** | `/p <message>` | Group | Broadcast exclusively to members of the player's active party. |
| **Guild** | `/g <message>` | Guild | Broadcast exclusively to members of the player's guild. |
| **System** | `/s <message>` | System | Informational notices, combat log text, and administrative announcements. |

> [!NOTE]
> Local proximity chat distance is configured under **Game Instance → Local Chat Distance** (default: `20` Unity units). Characters outside this radius will not receive local chat packets.

---

## 2. In-Game Chat UI (`UIChatHandler`)

The chat interface is located inside the player HUD canvas prefab (`Assets/OpenMMORPG/Demo/Prefabs/UI/GamePlay/Standalone/UIChat_Standalone.prefab` or inside `CanvasGameplay`).

### Configuration Properties

* **Chat Channel**: The default active channel when pressing Enter without typing a slash command prefix.
* **Showing Messages From All Channels**: If checked, the main chat log displays messages from all channels simultaneously. When unchecked, only messages matching the selected tab/channel are displayed.
* **Enter Chat Key**: Keycode used to focus the input field (default: `KeyCode.Return`).
* **Chat Entry Size**: Maximum number of historical messages retained in memory before older entries are purged (default: `30`).
* **Entry Click Response Mode**: Action taken when clicking a character name in the chat log:
  * `SetWhisperAsCommand`: Fills the input field with `/w <PlayerName> `.
  * `SetWhisperReceiverToField`: Populates a designated private recipient field.
  * `Custom`: Dispatches an event for custom UI handling.

### Customizing Chat Prefabs

Each message rendered in the chat log uses a `UIChatMessage` prefab:
* **UI Prefab Mine**: Styling used for messages sent by the local player (e.g., green tint).
* **UI Prefab Other**: Styling used for messages sent by other players.
* Container hierarchy: Instantiated dynamically into a scrollable `UIList` inside `uiContainer`.

---

## 3. Overhead Chat Bubbles (`UIChatBubbleManager`)

Open MMORPG renders temporary visual speech bubbles above character heads when messages are spoken in the game world.

Speech bubbles are managed by the `UIChatBubbleManager` component:

* **Visible Duration**: Time in seconds before the bubble fades out (default: `3.0` seconds).
* **Channel Prefabs**: Distinct bubble prefabs can be assigned per channel:
  * `uiLocalChatMessagePrefab` (`UIChatBubble_Local.prefab`)
  * `uiGlobalChatMessagePrefab` (`UIChatBubble_Global.prefab`)
  * `uiWhisperChatMessagePrefab` (`UIChatBubble_Whisper.prefab`)
  * `uiPartyChatMessagePrefab` (`UIChatBubble_Party.prefab`)
  * `uiGuildChatMessagePrefab` (`UIChatBubble_Guild.prefab`)

Demo bubble prefabs are located at `Assets/OpenMMORPG/Demo/Prefabs/UI/GamePlay/ChatBubble/`.

---

## 4. Profanity Filtering (`IChatProfanityDetector`)

The server map network manager validates chat payloads before broadcasting them to nearby clients or channel subscribers.

* **Interface**: `IChatProfanityDetector` located in `MultiplayerARPG.MMO`.
* **Default Implementation**: `DisabledChatProfanityDetector` allows all messages through without modification.
* **Implementing Custom Filters**: Create a class implementing `IChatProfanityDetector` to integrate custom regex patterns, blacklist lookups, or external moderation webhooks:

```csharp
using Cysharp.Threading.Tasks;
using MultiplayerARPG.MMO;

public class CustomProfanityDetector : IChatProfanityDetector
{
    private static readonly string[] BannedWords = { "badword1", "badword2" };

    public UniTask<ProfanityDetectResult> Proceed(string message)
    {
        string filtered = message;
        foreach (string banned in BannedWords)
        {
            if (filtered.Contains(banned, System.StringComparison.OrdinalIgnoreCase))
            {
                filtered = filtered.Replace(banned, "***");
            }
        }
        return UniTask.FromResult(new ProfanityDetectResult()
        {
            hasProfanity = filtered != message,
            cleanMessage = filtered
        });
    }
}
```

---

## 5. Localization System (`LanguageManager`)

Open MMORPG includes built-in internationalization support allowing strings, UI elements, and database entries to be translated into any number of languages at runtime.

### Configuration

The `LanguageManager` component is attached to the root UI canvas or game manager hierarchy:

* **Default Language Key**: Fallback language identifier (e.g., `ENG`).
* **Player Prefs Key**: Key used to persist user language selection in `PlayerPrefs` (default: `USER_LANG`).
* **Language List**: Array of `Language` entries, each containing a `languageKey` (e.g., `ENG`, `ESP`, `KOR`, `THA`) and a list of `LanguageData` key-value pairs.

### Translating Game Data

ScriptableObjects (Items, Skills, Quests, NPCs) utilize the `LanguageTextSetting` struct to support per-language titles and descriptions:

1. **Default Text**: Standard English or default language string.
2. **Language Specific Texts**: Array of entries pairing specific language keys to translated strings.
3. **Locale Key Setting**: Optional reference to a global key in `LanguageManager.Texts`.

### UI Localization Components

* **`UILanguageText`**: Automatically binds a UI Text or TextMeshPro component to a localized string key. Refreshes immediately whenever `LanguageManager.ChangeLanguage()` is called.
* **`OnClickChangeLanguage`**: Attach to buttons (e.g., flag icons) to switch active language on click.
* **`OnToggleChangeLanguage`**: Attach to toggles or dropdown elements to select languages.
* **`TextSetterByLanguageKeys`**: Sets text based on a composite format string filled with localized replacement keys.

### Changing Languages via Code

```csharp
using MultiplayerARPG;

// Switch language at runtime
LanguageManager.ChangeLanguage("ESP");

// Fetch localized text manually
string greeting = LanguageManager.GetText("UI_GREETING", "Welcome, Adventurer!");
```
