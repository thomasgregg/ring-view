# Ring View

[![Latest release](https://img.shields.io/github/v/release/thomasgregg/ring-view?display_name=tag&sort=semver)](https://github.com/thomasgregg/ring-view/releases/latest)
[![Validate](https://github.com/thomasgregg/ring-view/actions/workflows/validate.yml/badge.svg)](https://github.com/thomasgregg/ring-view/actions/workflows/validate.yml)
[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://www.hacs.xyz/)
[![License: MIT](https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/license-mit.svg)](https://github.com/thomasgregg/ring-view/blob/main/LICENSE)

## Your Ring camera. One card. Recording, Live, talkback, and door access.

See what happened, check what is happening, and answer the door—all without leaving the same viewer. Ring View brings Ring's separate recording and live camera entities together in one Home Assistant dashboard card.

<p align="center">
  <a href="https://github.com/thomasgregg/ring-view/blob/main/docs/images/ring-view-modes-rounded.png">
    <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/ring-view-modes-rounded.png" alt="Ring View viewer showing the latest recording, live view, and Hold to talk controls" width="100%">
  </a>
  <br>
  <sub>Switch between the latest recording and Live, then listen and use push-to-talk in the same session.<br>Real daylight camera capture from Home Assistant; original labels and arrows preserved.</sub>
</p>

## What you can do

- **Go from recording to Live in one tap.** Switch views inside the same viewer, with familiar playback and sound controls.
- **Listen and talk to visitors.** Optional **Hold to talk** adds push-to-talk to the official Ring live camera, using the same connection as the video.
- **Operate the door while you watch.** The door-access beta adds a configurable Home Assistant lock action, with a safe hold gesture and a shared Talk/door control dock.
- **Keep your dashboard quiet.** A lightweight still image previews the camera; no live player runs in the dashboard.
- **Show the freshest view.** Optionally combine the latest recording with a Ring-MQTT snapshot camera for the dashboard preview.
- **Know when someone rings.** A temporary doorbell alert highlights the card. Tap it to open Live.
- **Take the doorbell beyond the dashboard.** The included notification blueprint sends a phone alert, then adds a preview when the recording is ready.
- **Make it yours without YAML.** Choose cameras, opening behavior, layout, and doorbell features in the visual editor.
- **Use it across your home.** Responsive phone, tablet, and desktop layouts; Home Assistant themes; English and German; keyboard and screen-reader support.

A native picture entity card is a good fit for one camera entity. Ring View is for making the Ring recording/live pair feel like one camera.

## Get started

You need Home Assistant **2026.7 or newer**, the official [Ring integration](https://www.home-assistant.io/integrations/ring/), and its **last recording** and **live view** camera entities. Recording access requires a suitable Ring subscription. The last-recording entity is disabled by default. If the two camera entries look identical or their IDs do not use the example `_last_recording` and `_live_view` suffixes, follow [Choosing camera entities](docs/configuration.md#choosing-camera-entities).

[![Open Ring View in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasgregg&repository=ring-view&category=plugin)

1. Open Ring View in HACS using the button above and download the latest release.
2. Refresh Home Assistant.
3. Edit your dashboard, select **Add card → Ring View**, and choose your two camera entities.

HACS registers the JavaScript module automatically. Prefer manual installation? See the [installation and configuration guide](docs/configuration.md#manual-installation).

The minimal YAML equivalent is:

```yaml
type: custom:ring-view
recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view
```

Tap the card to open the viewer. The history icon selects the latest recording; the red dot selects Live. Enable **Viewer behavior → Two-way audio** to add **Hold to talk**. Microphone access needs an HTTPS Home Assistant connection and your permission.

In `0.6.0-beta.1`, selecting **Door access → Door lock** adds an optional **Unlock** or **Open door** action. It defaults to Live view and a 900 ms hold confirmation. When Talk is also enabled, both actions form one control dock with a subtle divider; either action can also be shown alone. See the [door-access beta specification](docs/door-access-beta.md) for the design, safety behavior, and complete configuration contract.

[All settings and visual editor](docs/configuration.md) · [Talkback and playback help](docs/playback-and-troubleshooting.md)

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

- [Configuration, visual editor, layouts, and snapshot previews](docs/configuration.md)
- [Door-access beta design and behavior](docs/door-access-beta.md)
- [Playback, talkback, iPhone rotation, and troubleshooting](docs/playback-and-troubleshooting.md)
- [Optional temporary backend patch](docs/backend-patch.md)
- [Doorbell notifications and automation blueprint](docs/notifications.md)
- [Security, privacy, and accessibility](docs/privacy-and-accessibility.md)
- [Compatibility](COMPATIBILITY.md) · [Testing and development](TESTING.md) · [Rollback](ROLLBACK.md) · [Changelog](CHANGELOG.md)

Ring View communicates through Home Assistant, not directly with Ring, and includes no telemetry or analytics. Microphone access is requested only when you press **Hold to talk**.

## License

[MIT](LICENSE)
