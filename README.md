# Ring View

[![Latest release](https://img.shields.io/github/v/release/thomasgregg/ring-view?display_name=tag&sort=semver)](https://github.com/thomasgregg/ring-view/releases/latest)
[![Validate](https://github.com/thomasgregg/ring-view/actions/workflows/validate.yml/badge.svg)](https://github.com/thomasgregg/ring-view/actions/workflows/validate.yml)
[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://www.hacs.xyz/)
[![License: MIT](https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/license-mit.svg)](https://github.com/thomasgregg/ring-view/blob/main/LICENSE)

## One clean Ring camera experience for Home Assistant

Ring exposes the latest recording and the live stream as separate Home Assistant camera entities. Ring View brings them together in one focused dashboard card and one native-feeling viewer.

<p align="center">
  <a href="https://github.com/thomasgregg/ring-view/blob/main/docs/images/ring-view-modes-rounded.png">
    <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/ring-view-modes-rounded.png" alt="Ring View viewer showing the latest recording, live view, and Hold to talk controls" width="100%">
  </a>
  <br>
  <sub>Switch between the latest recording and Live, then listen and use push-to-talk in the same session.</sub>
</p>

## Contents

- [Why Ring View?](#why-ring-view)
  - [Ring View or a native card?](#ring-view-or-a-native-card)
- [Requirements](#requirements)
- [Install with HACS](#install-with-hacs)
- [Quick start](#quick-start)
- [Configuration reference](#configuration-reference)
  - [Layout options](#layout-options)
  - [Complete YAML example](#complete-yaml-example)
- [Freshest snapshot preview](#freshest-snapshot-preview)
- [Two-way audio and doorbell notifications](#two-way-audio-and-doorbell-notifications)
- [How preview and playback work](#how-preview-and-playback-work)
- [Themes, languages, and accessibility](#themes-languages-and-accessibility)
- [Security and privacy](#security-and-privacy)
- [A note on privacy & legality](#a-note-on-privacy--legality)
- [Documentation](#documentation)
- [License](#license)

## Why Ring View?

The official [Ring integration](https://www.home-assistant.io/integrations/ring/) deliberately models `last_recording` and `live_view` as different camera entities. Home Assistant's native [picture entity card](https://www.home-assistant.io/dashboards/picture-entity/) is excellent when one camera entity is all you need. A Ring doorbell commonly needs two cards, custom actions, or repeated navigation to move between its recording and live view.

Ring View fills that gap:

- **One card, both Ring views.** Move between the latest recording and Live without leaving the viewer.
- **A quiet dashboard.** The card always displays a still image; it never mounts a live player in the dashboard.
- **Optional freshest still.** A Ring-MQTT snapshot camera can compete with the
  latest recording for the dashboard preview without adding another viewer mode.
- **Live only when requested.** A live session begins only after the viewer opens and Live is selected.
- **Native media rendering.** Home Assistant still chooses WebRTC, HLS, or MJPEG and provides the media controls.
- **Optional two-way audio.** One Ring WebRTC session carries live video,
  incoming audio, and push-to-talk without reconnecting when the microphone is enabled.
- **Doorbell awareness.** A native Ring event entity can show an incoming-ring
  banner without automatically starting or replacing the camera stream.
- **Intentional stream lifecycle.** Only one camera renderer is active, and it is torn down when the mode changes, the viewer closes, the card is removed, the browser goes Back, or the tab is hidden.
- **A polished, consistent interface.** Recording and Live use the same compact icon language on the card and in the viewer.
- **Built for dashboards.** Responsive layout, keyboard navigation, focus management, safe-area support, light and dark themes, and 44-pixel touch targets are included.
- **Easy to configure.** The visual editor uses Home Assistant entity pickers, grouped settings, capability warnings, and automatic English or German text.

### Ring View or a native card?

| Capability | Ring View | Native picture entity card |
| --- | --- | --- |
| Show one camera entity | Yes | Yes |
| Combine Ring recording and live entities | One card and viewer | Normally separate cards or actions |
| Switch views without closing the viewer | Yes | Not built in |
| Keep the dashboard on a still image | Always | Configurable for one camera |
| Remember the last selected view | Optional | Not built in |
| Choose a preview independently of the opening view | Yes | Not built in |
| Listen and use push-to-talk | Optional, in the same live session | Not exposed for Ring |
| React to a Ring doorbell event | In-card alert and notification blueprint | Requires a separate automation |
| Explicitly tear down the inactive renderer | Yes | Not applicable to a two-entity viewer |

Use a native card for a simple single-camera tile. Use Ring View when you want the recording/live pair to feel like one camera experience.

## Requirements

- Home Assistant **2026.7 or newer**
- [HACS](https://www.hacs.xyz/) for the recommended installation
- The official Home Assistant [Ring integration](https://www.home-assistant.io/integrations/ring/)
- A Ring `last_recording` camera entity and a separate `live_view` camera entity
- A Ring Protect plan for recording access
- A current Chrome, Edge, Firefox, Safari, or Home Assistant Companion app webview

The Ring integration disables the last-recording entity by default, so enable it in the device's entity list before configuring the card. Entity IDs depend on the device name and may resemble:

```text
camera.front_door_last_recording
camera.front_door_live_view
```

Home Assistant's standard Ring camera UI does not currently expose two-way
audio. Ring View negotiates the required send-and-receive audio
channel through the official `live_view` entity and Home Assistant camera
WebSocket API. It does not require a custom integration or additional Ring
credentials.

## Install with HACS

[![Open your Home Assistant instance and open this repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasgregg&repository=ring-view&category=plugin)

1. Select the button above and add **Ring View** to HACS.
2. Download the latest release.
3. Refresh Home Assistant. After an upgrade, a hard browser refresh may be required.
4. Edit a dashboard, select **Add card**, and choose **Ring View**.
5. Select the recording and live camera entities.

HACS registers `/hacsfiles/ring-view/ring-view.js` as a JavaScript module automatically.

<details>
<summary>Manual installation</summary>

1. Download `ring-view.js` from the [latest release](https://github.com/thomasgregg/ring-view/releases/latest).
2. Copy it to `<config>/www/ring-view.js`.
3. Add `/local/ring-view.js` as a **JavaScript module** under **Settings → Dashboards → Resources**.
4. Refresh the browser.

</details>

## Quick start

The visual editor is the recommended way to configure Ring View. The equivalent minimal YAML is:

```yaml
type: custom:ring-view
recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view
```

Select the card to open the viewer. The history icon opens the latest recording, and the red dot selects Live. Playback, volume, seeking, and fullscreen remain in Home Assistant's native media bar.

## Configuration reference

Every Ring View setting is available through Home Assistant's visual card configuration. The **UI configuration** column below shows whether an option appears in Ring View's **Config** tab, Home Assistant's standard **Layout** tab, or is handled automatically.

<p align="center">
  <a href="https://github.com/thomasgregg/ring-view/blob/main/docs/images/configuration-editor-wide.png">
    <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/configuration-editor-wide.png" alt="Ring View visual configuration editor with camera, two-way audio, and doorbell event settings" width="100%">
  </a>
  <br>
  <sub>Configure the cameras, viewer behavior, two-way audio, doorbell alerts, and appearance without writing YAML.</sub>
</p>

| Option | UI configuration | Default | Accepted values | Purpose |
| --- | --- | --- | --- | --- |
| `type` | No — added automatically | Required | `custom:ring-view` | Identifies the custom card. Added automatically by the card picker. |
| `recording_entity` | Yes — Config tab | Required | `camera.*` entity ID | Camera entity containing the latest recording. |
| `live_entity` | Yes — Config tab | Required | `camera.*` entity ID | Camera entity that starts the Ring live view. |
| `snapshot_entity` | Yes — Config tab | Not set | `camera.*` entity ID | Optional device snapshot camera, such as the snapshot entity created by Ring-MQTT. |
| `name` | Yes — Config tab | Entity name | Text | Optional label used instead of the recording entity's friendly name. |
| `default_mode` | Yes — Config tab | `last_recording` | `last_recording`, `live` | View selected when the viewer opens. |
| `remember_last_mode` | Yes — Config tab | `false` | `true`, `false` | Remembers the most recent view in the current browser and uses it instead of `default_mode`. |
| `autoplay_recording` | Yes — Config tab | `true` | `true`, `false` | Starts the latest recording immediately; when disabled, the viewer waits for Play. |
| `live_muted` | Yes — Config tab | `false` | `true`, `false` | Starts Live muted. Browser autoplay rules can still require muted playback. |
| `two_way_audio` | Yes, Doorbell features | `false` | `true`, `false` | Uses one direct WebRTC session for live video, listening, and push-to-talk. |
| `doorbell_entity` | Yes, Doorbell features | Not set | `event.*` entity ID | Displays a temporary ring alert when the selected doorbell event reports `ring`. |
| `show_name` | Yes — Config tab | `false` | `true`, `false` | Shows the camera name at the top left of both the dashboard card and viewer. |
| `preview_source` | Yes — Config tab | `last_recording` | `last_recording`, `live`, `default`, `snapshot`, `newest` | Chooses the entity used for the dashboard still. `default` follows the view that will open; `newest` compares the optional snapshot with the latest recording. |
| `preview_fallback` | Yes — Config tab | `last_recording` | `last_recording`, `snapshot` | Chooses the still used by `newest` when capture times or update order cannot be compared. |
| `aspect_ratio` | Yes — Config tab | `16:9` | `auto`, `16:9`, `4:3`, `1:1` | Sets the dashboard image shape. |
| `fit_mode` | Yes — Config tab | `cover` | `cover`, `contain` | Crops the image to fill the card or fits the entire image inside it. |
| `grid_options` | Yes — Layout tab | See below | Object | Standard Home Assistant Sections-layout sizing. Configure it in the Layout tab. |

### Layout options

These are standard Home Assistant card layout fields rather than Ring View behavior:

| Field | Card default | Purpose |
| --- | --- | --- |
| `columns` | `12` | Preferred number of grid columns, or `full`. |
| `rows` | `3` | Preferred number of grid rows. |
| `min_columns` | `6` | Minimum supported width in grid columns. |
| `min_rows` | `2` | Minimum supported height in grid rows. |
| `max_columns` | Not set | Optional maximum width. |
| `max_rows` | Not set | Optional maximum height. |

### Complete YAML example

```yaml
type: custom:ring-view

recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view
snapshot_entity: camera.front_door_snapshot
name: Entrance

default_mode: last_recording
remember_last_mode: false
autoplay_recording: true
live_muted: false

two_way_audio: true
doorbell_entity: event.front_door_ding

show_name: true
preview_source: newest
preview_fallback: last_recording
aspect_ratio: "16:9"
fit_mode: cover

grid_options:
  columns: 12
  rows: 3
  min_columns: 6
  min_rows: 2
```

Ring View 0.2 and newer use this flat configuration only. Earlier nested `preview`, `appearance`, `viewer`, and `performance` structures are not supported.

## Freshest snapshot preview

Select an optional **Device snapshot camera** in the visual editor, then set
**Card preview image** to **Newest snapshot or recording**. Ring View still
renders only one passive image on the dashboard, and tapping it opens the
configured Recording or Live view—there is no third viewer tab.

Ring-MQTT publishes a Unix-seconds `timestamp` attribute whenever it
successfully retrieves a new snapshot. Ring View compares explicit capture
timestamps when both camera entities provide them. The official Ring
last-recording entity currently exposes `last_video_id` but no capture time, so
Ring View also follows the order of snapshot timestamp and recording ID changes
received after the card loads. On initial load, after a reload, or whenever the
two sources remain incomparable, **Fallback when freshness is unknown** makes
the result deterministic. General Home Assistant `last_updated` values are not
treated as media capture times.

## Two-way audio and doorbell notifications

Version `0.4.0` adds an optional direct WebRTC player for Ring live view.
Open **Doorbell features** in the visual editor and select
**Enable two-way audio**. Live video and
incoming audio connect first without opening the microphone. Pressing
**Hold to talk** requests microphone permission when needed and inserts the
track into the existing session. Audio is sent only while the button remains
pressed. If the permission prompt interrupts the first hold, release and hold
again after granting access.

To show ring alerts inside the card, also select the Ring Ding event entity,
for example `event.front_door_ding`. A fresh event displays **Someone is at the
door** for twelve seconds. Selecting the card during that alert opens Live.
An already active Live session is left untouched.

A dashboard card cannot deliver reliable background phone notifications while
the dashboard is closed. The included
[`Ring View doorbell notification`](blueprints/automation/ring_view/doorbell_notification.yaml)
blueprint handles that through Home Assistant. It sends an immediate alert,
opens the configured Ring View dashboard when tapped, and replaces the alert
with a preview when the new Ring recording becomes available. The preview uses
the recording camera and does not start another Ring live session.

[![Open your Home Assistant instance and import the Ring View doorbell notification blueprint.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https://github.com/thomasgregg/ring-view/blob/main/blueprints/automation/ring_view/doorbell_notification.yaml)

Microphone permission requires HTTPS. Temporary WebRTC disconnections are left
open for browser recovery, but Ring cloud outages, network loss, device session
limits, browser suspension, and competing Ring clients can still interrupt a
live view.

## How preview and playback work

The dashboard requests an authenticated still through Home Assistant's camera proxy. It sizes the request to the rendered card and screen pixel density, refreshes it every ten seconds only while visible, and reacts to meaningful layout changes. It does not mount `ha-camera-stream` or preconnect a live renderer.

Inside the viewer, Ring View delegates camera rendering to Home Assistant so the platform can select the appropriate WebRTC, HLS, or MJPEG path. A recording starts automatically unless `autoplay_recording` is disabled. Live starts only when selected. If audible autoplay is rejected by the browser, Ring View retries muted. When two-way audio is enabled, Ring View uses its single-session WebRTC player for Live instead.

Unavailable or missing entities are reported immediately. A live connection times out after 20 seconds and retries once. If Home Assistant's camera renderer is unavailable, recording playback can fall back to the current ephemeral `video_url`; Live offers Home Assistant's standard camera dialog instead.

## Themes, languages, and accessibility

Ring View uses Home Assistant theme variables instead of fixed light or dark surfaces, so it follows the active dashboard theme. English and German are included throughout the editor, tooltips, viewer states, warnings, and accessibility announcements. Regional variants such as `de-DE`, `de-AT`, and `de-CH` use German; unsupported languages fall back to English.

The card supports keyboard activation, Escape to close, focus trapping and restoration, screen-reader status messages, visible focus treatment, responsive phone and tablet layouts, and device safe areas.

## Security and privacy

- Ring View communicates only with Home Assistant-provided entities, endpoints, and frontend components.
- It includes no Ring authentication, direct Ring requests, external scripts, remote fonts, telemetry, or analytics.
- Camera tokens, authenticated URLs, and `video_url` values are never copied into configuration, browser storage, or logs.
- Microphone access is requested only after the user presses **Hold to talk**.
  The track remains muted whenever the button is not actively held.
- The optional remembered view stores only the selected mode for that entity pair in the local browser.

## A note on privacy & legality

Camera surveillance is regulated differently around the world. In many countries (including Germany and much of the EU), **recording public streets, sidewalks, or your neighbor's property may be restricted or unlawful**—home-camera use that extends even partially into a public space or neighboring property can fall outside the GDPR's household exemption. Before positioning a camera, check your local laws, use privacy zones or masking where your camera or platform supports them, and be transparent with visitors where required. Ring View only displays what the Ring integration makes available through Home Assistant—the legal responsibility for how your camera is positioned and what it records remains with you. See the [European Data Protection Board's video-device guidelines](https://www.edpb.europa.eu/documents/guideline/guidelines-32019-on-processing-of-personal-data-through-video-devices_en) for further guidance.

## Documentation

- [Compatibility and support policy](COMPATIBILITY.md)
- [Development, testing, and release acceptance](TESTING.md)
- [Release recovery](ROLLBACK.md)
- [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)
