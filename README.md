# <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/ring-view-icon.png" alt="" width="48" height="48" align="absmiddle"> Ring View

[![Latest release](https://img.shields.io/github/v/release/thomasgregg/ring-view?display_name=tag&sort=semver)](https://github.com/thomasgregg/ring-view/releases/latest)
[![Validate](https://github.com/thomasgregg/ring-view/actions/workflows/validate.yml/badge.svg)](https://github.com/thomasgregg/ring-view/actions/workflows/validate.yml)
[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://www.hacs.xyz/)
[![License: MIT](https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/license-mit.svg)](https://github.com/thomasgregg/ring-view/blob/main/LICENSE)

## Your Ring camera. One card. Recording, Live, snapshots, talkback, and door access.

See what happened, check what is happening, save the moment, and answer the door without leaving the same viewer. Ring View brings Ring media together in one Home Assistant dashboard card. It supports Home Assistant's official Ring integration, Ring-MQTT, or a mix of entities from both.

<p align="center">
  <a href="https://github.com/thomasgregg/ring-view/blob/main/docs/images/ring-view-modes-rounded.png">
    <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/ring-view-modes-rounded.png" alt="Ring View viewer annotated with camera name, last activity, Recording, Live, snapshot, Hold to talk, and Hold to open controls" width="100%">
  </a>
  <br>
  <sub>Recording, Live, snapshots, talkback, and door access in one viewer.</sub>
</p>

## Contents

- [What Ring View can do](#what-you-can-do)
- [Choose official Ring, Ring-MQTT, or both](#choose-official-ring-ring-mqtt-or-both)
- [Install and get started](#get-started)
  - [Configure visually](#configure-visually)
  - [Choose the dashboard card behavior](#choose-how-the-dashboard-card-works)
  - [Save a snapshot](#save-a-snapshot)
  - [Add Talk or door access](#add-talk-or-door-access)
- [Built-in Ring integration and optional patch](#built-in-ring-integration-or-the-temporary-patch)
- [Doorbell notifications](#make-your-doorbell-do-more)
- [Guides and support](#guides-and-support)

## What you can do

- **Go from recording to Live in one tap.** Switch views inside the same viewer, with familiar playback and sound controls.
- **Listen and talk to visitors.** Optional **Hold to talk** adds push-to-talk to the official Ring live camera, using the same connection as the video.
- **Operate the door while you watch.** Door access adds a configurable Home Assistant lock action, with a safe hold gesture, optional physical-door status, and a shared Talk/door control rail.
- **Choose a calm or hands-on dashboard.** Keep the lightweight still-image card, or opt into direct Recording, Live, Talk, and door controls for a wall tablet.
- **Show the freshest view.** Optionally combine the latest recording with a Ring-MQTT snapshot camera for the dashboard preview.
- **Save a moment from Live.** Optionally show one snapshot button that saves a timestamped image through Home Assistant, with no custom automation.
- **See when something last happened.** Optionally show a localized relative time from a timestamp sensor, event entity, or date-and-time helper.
- **Know when someone rings.** A temporary doorbell alert works with official Ring event entities and Ring-MQTT Ding binary sensors. Tap it to open Live.
- **Take the doorbell beyond the dashboard.** The included notification blueprint works with official Ring and Ring-MQTT, sends a phone alert, then adds a fresh camera preview when it is ready.
- **Make it yours without YAML.** Choose cameras, opening behavior, layout, and doorbell features in the visual editor.
- **Use it across your home.** Responsive phone, tablet, and desktop layouts; Home Assistant themes; English and German; keyboard and screen-reader support.

## Choose official Ring, Ring-MQTT, or both

Ring View supports both Home Assistant's built-in **Ring integration** and the
separate [**Ring-MQTT add-on**](https://github.com/tsightler/ring-mqtt). You do
not have to choose one provider for the whole card: each feature can use the
source that works best for it. The visual editor, viewer, controls, and layout
remain the same whichever entities you select.

| Ring View feature | Official Ring integration | Ring-MQTT | Our recommendation |
| --- | --- | --- | --- |
| **Last recording** | ✅ Select the **Last recording** camera. Home Assistant follows the newest Ring history event automatically, but [some cameras using 24/7 recording can remain on an old clip](https://github.com/home-assistant/core/issues/176299). | ✅ Select **Event Select**. Automatic mode uses the configured Last activity source to choose slot 1 from the newest Ding, Motion, Person, or on-demand category; manual mode preserves a chosen historical event. Ring View also requests the matching **(Transcoded)** option when needed. | Start with the official camera. Use Event Select when the official camera is stale or missing, or when manual history selection is useful. |
| **Live video** | ✅ Select the **Live view** camera. It works directly and is the only source that supports Ring View talkback. A [known upstream cleanup problem](docs/backend-patch.md) can affect repeated Live sessions on some systems. | ✅ Works after a one-time Home Assistant camera setup using Ring-MQTT's Live stream. It provides video and audio from the doorbell, but not talkback. | Use the official Live view camera, especially when you want **Hold to talk**. |
| **Two-way audio** | ✅ **Hold to talk** is supported. | ❌ Ring-MQTT's Live stream has no microphone return path. This is a source limitation, not a Ring View setting or bug. | Use the official Live view camera. |
| **Doorbell alert inside the card** | ✅ Works through the Ring Ding event while its realtime listener is healthy. Upstream failures can leave that listener stopped ([#526](https://github.com/python-ring-doorbell/python-ring-doorbell/issues/526), [#537](https://github.com/python-ring-doorbell/python-ring-doorbell/issues/537)). | ✅ Works through the Ding binary sensor. | Prefer the Ring-MQTT Ding sensor for reliability today. |
| **Last activity time** | ✅ A Ring event or another Home Assistant timestamp can be used, but a Ring event depends on the same realtime listener. | ✅ Ring-MQTT Ding and motion sensors are supported directly; Ring View chooses the freshest activity time from the device. | Prefer a Ring-MQTT Ding or motion sensor. |
| **Dashboard image and saved snapshots** | ⚠️ A Ring camera may provide a still image, but the official Live camera does not always expose the current Live frame for saving. | ✅ The snapshot camera provides the dashboard image. For a manual save, Ring View asks **Take Snapshot** for a new image first. | Use the Ring-MQTT snapshot camera for the freshest and most dependable image. |
| **Phone-notification blueprint** | ✅ Select the Ding event, Last recording camera for both the preview and recording action, and Live view camera. The alert opens Live immediately; a fresh recording preview and playback action follow. | ✅ Select the Ding binary sensor, Snapshot camera for the preview, Event Select for the recording action, and the Live camera used by Ring View. Repeated presses are detected while Ding remains on. | Prefer Ring-MQTT Ding and Snapshot for reliable detection and previews, with the card's normal recording and Live sources for the viewer actions. Set Snapshot Mode to an option that includes **Ding**. |
| **Door access** | ✅ Any Home Assistant lock and optional contact sensor. | ✅ The same—door access is independent of the camera provider. | Use whichever lock is already connected to Home Assistant. |

### Recommended mixed setup

For the most complete experience today, keep both integrations and choose:

- **Last recording:** Ring-MQTT **Event Select**.
- **Live and Hold to talk:** official Ring **Live view** camera.
- **Dashboard image and manual snapshots:** Ring-MQTT **Snapshot** camera.
- **Doorbell alert and last activity:** Ring-MQTT **Ding** and motion sensors.
- **Phone notification:** Ring-MQTT **Ding** sensor and **Snapshot** camera,
  plus the same **Event Select** and **Live** camera used by Ring View.
- **Door access:** any Home Assistant lock and optional contact sensor.

This combines Ring-MQTT's dependable events and snapshots with the official
integration's Live talkback path. You can still choose only official Ring or
only Ring-MQTT when that better matches your installation. See the
[provider guide](docs/compatibility.md#official-ring-and-ring-mqtt-sources) for
the detailed source mapping and limitations.

## Get started

You need Home Assistant **2026.7 or newer** and Ring media exposed through Home
Assistant. Install the official [Ring integration](https://www.home-assistant.io/integrations/ring/),
Ring-MQTT, or both. Recording access requires a suitable Ring subscription.
Ring View itself needs no Ring login; it uses the entities already available
in Home Assistant.

The core viewer can also use another Home Assistant recording camera when it
exposes recorded media, and any Live camera that advertises stream support.
Two-way audio and the optional backend patch remain specific to the official
Ring Live view camera. [The provider parity guide](docs/compatibility.md#official-ring-and-ring-mqtt-sources)
shows the exact source for every feature.

[![Open Ring View in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasgregg&repository=ring-view&category=plugin)

1. Open Ring View in HACS using the button above and download the latest release.
2. Refresh Home Assistant.
3. Edit your dashboard, select **Add card → Ring View**, and choose a recording source and Live camera.

HACS registers the JavaScript module automatically. Prefer manual installation? See the [installation and configuration guide](docs/configuration.md#manual-installation).

The minimal YAML equivalent is:

```yaml
type: custom:ring-view
recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view
```

### Configure visually

YAML is optional. The visual editor lets you select the media sources and configure
dashboard behavior, manual snapshots, Talk, doorbell features, door access and
appearance.

#### If you use Ring-MQTT Event Select for recordings

Event Select is a Home Assistant menu that divides recordings into Ding,
Motion, Person, and on-demand categories. Ring View offers two behaviors:

- **Newest event (automatic)** is the default. Configure **Last activity
  timestamp** with a Ring source that reports an event category. Ring View maps
  that latest category to its slot 1, waits for Ring-MQTT to publish the matching
  event ID and URL, and then starts playback.
- **Selected event (manual)** keeps the Event Select choice. Use it to browse
  older entries such as Ding 3 or Motion 2.

Automatic mode also reselects slot 1 when a second event arrives in the same
category, even though the menu text did not change. While Ring is processing a
new event, the previous URL is not reused. On iPhone/iPad Ring View requests the
matching **(Transcoded)** delivery path before playback; on other browsers it
does so only if the direct Ring URL fails. Ring-MQTT can take several seconds to
prepare that URL, during which Ring View shows its normal loading message.

<p align="center">
  <a href="https://github.com/thomasgregg/ring-view/blob/main/docs/images/configuration-editor.png">
    <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/configuration-editor.png" alt="Ring View visual configuration editor showing camera selection, Dashboard card, Fullscreen viewer, Snapshots, Doorbell features, Door access, and Card appearance" width="760">
  </a>
  <br>
  <sub>Everything can be configured from the Home Assistant card editor.</sub>
</p>

Tap the card to open the viewer. The history icon selects the latest recording;
the red dot selects Live. Ring View's own controls use consistent dark,
borderless rails over the camera image. The browser or Home Assistant player's
native playback, volume, timeline, and fullscreen controls remain unchanged.

### Choose how the dashboard card works

In the visual editor, open **Dashboard card → Dashboard behavior**:

| Choose | What it does | Good for |
| --- | --- | --- |
| **Open fullscreen viewer** (default) | Shows a still image. Tap it to open the complete viewer. | Phones and everyday dashboards. |
| **Control camera in card** | Adds Recording, Live and optional visitor controls directly to the card. The enlarge button remains at the top right and opens the complete Ring View viewer. | Wall tablets and hands-on dashboards. |

For an interactive card, **No — wait for a tap** is the calmest startup choice.
The selected Recording or Live view remains highlighted while its still image
waits for your tap, but no player is loaded yet. You can instead start the last
recording or Live automatically. The two nearby sound switches independently
choose whether dashboard recordings and dashboard Live start muted. This keeps
the choice visible and predictable instead of letting the card decide from the
device type. The card requires at least **12 columns × 3 rows** in a Sections
dashboard.

Common starting points:

- **Everyday dashboard:** open the fullscreen viewer when the card is tapped.
- **Wall tablet:** show controls in the card and wait for a tap before starting media.
- **Entrance monitor:** show controls in the card, start media automatically,
  and leave its matching dashboard sound switch enabled.

[Compare every dashboard option and see complete examples](docs/configuration.md#dashboard-card-behavior)

### Save a snapshot

Open **Snapshots** and enable **Show snapshot button**. A camera button then
appears while Live is active in the fullscreen viewer or interactive dashboard
card. Each tap saves a timestamped JPEG to `/media/ring-view` by default. Open
**Media > My media > ring-view** in Home Assistant to view the saved images.

The icon briefly turns green after a successful save. If saving fails, the
viewer uses the same centered status display as its other actionable errors.
Ring View automatically reuses the device snapshot camera selected under
**Dashboard card**, such as Ring-MQTT, and otherwise asks the Live camera for a
snapshot. The official Ring Live camera may not expose the current WebRTC
frame, so use a Ring-MQTT snapshot camera when you need a reliably fresh device
image.

[Snapshot source, folder, validation, and privacy details](docs/configuration.md#saving-a-manual-snapshot)

### Add Talk or door access

Enable **Fullscreen viewer → Two-way audio** to add **Hold to talk**. This requires
the official Ring Live view camera, an HTTPS Home Assistant connection and
microphone permission.

Talk and door access share one calm, borderless action rail with 48-pixel touch
targets. Talk becomes red only while audio is being transmitted. A door action
fills from left to right during its 1.6-second confirmation and stays the same
size throughout the hold.

To add a door action, open **Door access** and select a lock. Choose **Unlock**
or, for a compatible lock such as Nuki, **Open door** to release the latch. An
optional contact sensor makes the icon show whether the physical door is open
or closed. Door actions are Live-only, fullscreen-only and hold-to-activate by
default.

[Door states and safety options](docs/door-access.md) · [All settings and examples](docs/configuration.md) · [Talkback help](docs/playback-and-troubleshooting.md)

## Built-in Ring integration or the temporary patch?

**Ring View works with Home Assistant's built-in Ring integration.** The separate [Ring WebRTC Backend Patch](https://github.com/thomasgregg/ring-webrtc-backend-patch) is optional; it does not unlock features or provide Ring credentials.

| Setup | What changes |
| --- | --- |
| Built-in Ring integration only | Recording, Live, and supported talkback work through your existing Ring entities. A known backend teardown defect can affect later Live connections after a session closes. |
| Built-in Ring + optional backend patch | The same cameras and features, with a narrowly scoped workaround for that teardown defect on the supported Ring library version. The patch runs alongside Ring; it does not replace it. |

The patch is **temporary**, intended only until the upstream Ring library fix is released and included in Home Assistant. It does not bypass iPhone autoplay restrictions or fix every network/camera connection problem.

[When to use it, upstream tracking, and how to remove it safely](docs/backend-patch.md)

## Make your doorbell do more

The included **Ring View doorbell notification** blueprint connects either an
official Ring Ding event or Ring-MQTT Ding sensor, a preview camera, and the
Companion app:

1. Someone rings → your phone gets an immediate notification.
2. Tap the notification or choose **View Live** → Ring View opens directly in
   its fullscreen Live viewer.
3. The official recording or Ring-MQTT snapshot becomes available → the same
   notification gains a fresh preview and a **Watch Recording** action.

It works even when the dashboard is closed, and the preview does not start
another live session. Select the matching Ring View Live camera and recording
source when creating or updating the blueprint automation.

If iOS can display the expanded camera view but shows an attachment error in
the compact thumbnail, the blueprint can optionally save the fresh frame in
`/config/www` and use your full external Home Assistant HTTPS address. This is
opt-in because files served through `/local` are publicly accessible to anyone
who knows their URL.

[![Import the Ring View doorbell notification blueprint.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https://github.com/thomasgregg/ring-view/blob/main/blueprints/automation/ring_view/doorbell_notification.yaml)

Already using an older version? Import it again and choose **Overwrite**. Your
automation must then be updated with the Ring View Live camera and recording
source used by the card. You can also switch its Ding and preview entities
between official Ring and Ring-MQTT in the normal visual editor.

Use the same doorbell signal in your own Home Assistant automations for porch
lights, announcements, or presence-aware alerts. Those are ideas for
additional automations—not actions the included blueprint runs automatically.

[Set up notifications and explore automation ideas](docs/notifications.md)

## Guides and support

- [Configuration, visual editor, manual snapshots, layouts, and previews](docs/configuration.md)
- [Door-access design, states, and configuration](docs/door-access.md)
- [Playback, talkback, iPhone rotation, and troubleshooting](docs/playback-and-troubleshooting.md)
- [Optional temporary backend patch](docs/backend-patch.md)
- [Doorbell notifications and automation blueprint](docs/notifications.md)
- [Official Ring realtime-listener reliability analysis](docs/ring-listener-reliability-analysis.md)
- [Security, privacy, and accessibility](docs/privacy-and-accessibility.md)
- [Compatibility](docs/compatibility.md) · [Testing and development](docs/testing.md) · [Rollback](docs/rollback.md) · [Changelog](CHANGELOG.md)

Ring View communicates through Home Assistant, not directly with Ring, and includes no telemetry or analytics. Microphone access is requested only when you press **Hold to talk**.

## License

[MIT](LICENSE)
