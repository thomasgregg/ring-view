# <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/ring-view-icon.png" alt="" width="48" height="48" align="absmiddle"> Ring View

[![Latest release](https://img.shields.io/github/v/release/thomasgregg/ring-view?display_name=tag&sort=semver)](https://github.com/thomasgregg/ring-view/releases/latest)
[![Validate](https://github.com/thomasgregg/ring-view/actions/workflows/validate.yml/badge.svg)](https://github.com/thomasgregg/ring-view/actions/workflows/validate.yml)
[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://www.hacs.xyz/)
[![License: MIT](https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/license-mit.svg)](https://github.com/thomasgregg/ring-view/blob/main/LICENSE)

## Your Ring camera. One card. Recording, Live, snapshots, talkback, and door access.

See what happened, check what is happening, save the moment, and answer the door without leaving the same viewer. Ring View brings Ring's separate recording and live camera entities together in one Home Assistant dashboard card.

<p align="center">
  <a href="https://github.com/thomasgregg/ring-view/blob/main/docs/images/ring-view-modes-rounded.png">
    <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/ring-view-modes-rounded.png" alt="Ring View viewer annotated with camera name, last activity, Recording, Live, snapshot, Hold to talk, and Hold to open controls" width="100%">
  </a>
  <br>
  <sub>Recording, Live, snapshots, talkback, and door access in one viewer.</sub>
</p>

## Contents

- [What Ring View can do](#what-you-can-do)
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
- **Operate the door while you watch.** Door access adds a configurable Home Assistant lock action, with a safe hold gesture, optional physical-door status, and a shared Talk/door control dock.
- **Choose a calm or hands-on dashboard.** Keep the lightweight still-image card, or opt into direct Recording, Live, Talk, and door controls for a wall tablet.
- **Show the freshest view.** Optionally combine the latest recording with a Ring-MQTT snapshot camera for the dashboard preview.
- **Save a moment from Live.** Optionally show one snapshot button that saves a timestamped image through Home Assistant, with no custom automation.
- **See when something last happened.** Optionally show a localized relative time from a timestamp sensor, event entity, or date-and-time helper.
- **Know when someone rings.** A temporary doorbell alert works with official Ring event entities and Ring-MQTT Ding binary sensors. Tap it to open Live.
- **Take the doorbell beyond the dashboard.** The included notification blueprint sends a phone alert, then adds a preview when the recording is ready.
- **Make it yours without YAML.** Choose cameras, opening behavior, layout, and doorbell features in the visual editor.
- **Use it across your home.** Responsive phone, tablet, and desktop layouts; Home Assistant themes; English and German; keyboard and screen-reader support.

## Get started

You need Home Assistant **2026.7 or newer** and Ring media exposed through Home
Assistant. Use the official [Ring integration](https://www.home-assistant.io/integrations/ring/),
Ring-MQTT, or mix their entities by role. The official setup uses **Last
recording** and **Live view** cameras. A Ring-MQTT setup uses **Event Select**
for recordings, its snapshot camera, and a Home Assistant camera configured
from Ring-MQTT's live RTSP path. Recording access requires a suitable Ring
subscription. See [Choosing camera entities](docs/configuration.md#choosing-camera-entities)
for both setups.

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

<p align="center">
  <a href="https://github.com/thomasgregg/ring-view/blob/main/docs/images/configuration-editor.png">
    <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/configuration-editor.png" alt="Ring View visual configuration editor showing camera selection, Dashboard card, Fullscreen viewer, Snapshots, Doorbell features, Door access, and Card appearance" width="760">
  </a>
  <br>
  <sub>Everything can be configured from the Home Assistant card editor.</sub>
</p>

Tap the card to open the viewer. The history icon selects the latest recording;
the red dot selects Live.

### Choose how the dashboard card works

In the visual editor, open **Dashboard card → Dashboard behavior**:

| Choose | What it does | Good for |
| --- | --- | --- |
| **Open fullscreen viewer** (default) | Shows a still image. Tap it to open the complete viewer. | Phones and everyday dashboards. |
| **Control camera in card** | Adds Recording, Live and optional visitor controls directly to the card. | Wall tablets and hands-on dashboards. |

For an interactive card, **No — wait for a tap** is the calmest startup choice.
The selected Recording or Live view remains highlighted while its still image
waits for your tap, but no player is loaded yet. You can instead start the last
recording or muted Live automatically. The card requires at least **12 columns
× 3 rows** in a Sections dashboard.

Common starting points:

- **Everyday dashboard:** open the fullscreen viewer when the card is tapped.
- **Wall tablet:** show controls in the card and wait for a tap before starting media.
- **Entrance monitor:** show controls in the card and start Live muted.

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

The included **Ring View doorbell notification** blueprint connects your Ring Ding event, recording camera, and Companion app:

1. Someone rings → your phone gets an immediate notification.
2. Tap the notification → Home Assistant opens your chosen dashboard.
3. The new recording becomes available → the same notification gains a preview.

It works even when the dashboard is closed, and the preview does not start another live session.

[![Import the Ring View doorbell notification blueprint.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https://github.com/thomasgregg/ring-view/blob/main/blueprints/automation/ring_view/doorbell_notification.yaml)

Use the same Ring event in your own Home Assistant automations for porch lights, announcements, or presence-aware alerts. Those are ideas for additional automations—not actions the included blueprint runs automatically.

[Set up notifications and explore automation ideas](docs/notifications.md)

## Guides and support

- [Configuration, visual editor, manual snapshots, layouts, and previews](docs/configuration.md)
- [Door-access design, states, and configuration](docs/door-access.md)
- [Playback, talkback, iPhone rotation, and troubleshooting](docs/playback-and-troubleshooting.md)
- [Optional temporary backend patch](docs/backend-patch.md)
- [Doorbell notifications and automation blueprint](docs/notifications.md)
- [Security, privacy, and accessibility](docs/privacy-and-accessibility.md)
- [Compatibility](docs/compatibility.md) · [Testing and development](docs/testing.md) · [Rollback](docs/rollback.md) · [Changelog](CHANGELOG.md)

Ring View communicates through Home Assistant, not directly with Ring, and includes no telemetry or analytics. Microphone access is requested only when you press **Hold to talk**.

## License

[MIT](LICENSE)
