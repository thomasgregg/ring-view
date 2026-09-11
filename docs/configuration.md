# Installation and configuration

[← Ring View](../README.md)

## Manual installation

1. Download `ring-view.js` from the [latest release](https://github.com/thomasgregg/ring-view/releases/latest).
2. Copy it to `<config>/www/ring-view.js`.
3. Add `/local/ring-view.js` as a **JavaScript module** under **Settings → Dashboards → Resources**.
4. Refresh the browser. After upgrades, a hard refresh may be necessary.

For the recommended HACS installation, see [Get started](../README.md#get-started).

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
| `snapshot_entity` | Yes — Dashboard preview | Not set | `camera.*` entity ID | Device snapshot camera, such as the snapshot entity created by Ring-MQTT. Shown when the selected image source needs it. |
| `name` | Yes — Config tab | Entity name | Text | Optional label used instead of the recording entity's friendly name. |
| `default_mode` | Yes — Config tab | `last_recording` | `last_recording`, `live` | View selected when the viewer opens. |
| `remember_last_mode` | Yes — Config tab | `false` | `true`, `false` | Remembers the most recent view in the current browser and uses it instead of `default_mode`. |
| `autoplay_recording` | Yes — Config tab | `true` | `true`, `false` | Starts the latest recording immediately; when disabled, the viewer waits for Play. |
| `live_muted` | Yes — Config tab | `false` | `true`, `false` | Starts Live muted. Browser autoplay rules can still require muted playback. |
| `two_way_audio` | Yes — Viewer behavior | `false` | `true`, `false` | Uses one direct WebRTC session for live video, listening, and push-to-talk when `live_entity` is an official Ring `live_view` camera. |
| `doorbell_entity` | Yes, Doorbell features | Not set | `event.*` entity ID | Displays a temporary ring alert when the selected doorbell event reports `ring`. |
| `door_entity` | Yes — Door access | Not set | `lock.*` entity ID | Enables the door-access beta for the selected Home Assistant lock. |
| `door_contact_entity` | Yes — Door access | Not set | `binary_sensor.*` entity ID | Optionally makes the icon reflect the physical door state. An open contact replaces and disables the door action until the door closes. |
| `door_action` | Yes — Door access | `unlock` | `unlock`, `open` | Calls `lock.unlock`, or `lock.open` for locks that advertise latch-opening support. |
| `door_control_visibility` | Yes — Door access | `live_only` | `live_only`, `all_views` | Shows the door action only in Live by default, or also over recordings. |
| `door_hold_to_activate` | Yes — Door access | `true` | `true`, `false` | Requires a 900 ms press-and-hold confirmation. Disable for one-tap operation. |
| `show_name` | Yes — Config tab | `false` | `true`, `false` | Shows the camera name at the top left of both the dashboard card and viewer. |
| `preview_source` | Yes — Dashboard preview | `last_recording` | `last_recording`, `live`, `default`, `snapshot`, `newest` | Chooses the entity used for the dashboard still. `default` follows the view that will open; `newest` compares the optional snapshot with the latest recording. |
| `preview_fallback` | Yes — Dashboard preview | `last_recording` | `last_recording`, `snapshot` | Chooses the still used by `newest` when capture times or update order cannot be compared. Only shown for `newest`. |
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

door_entity: lock.front_door
door_contact_entity: binary_sensor.front_door_contact
door_action: open
door_control_visibility: live_only
door_hold_to_activate: true

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

## Door access beta

Open **Door access** and select a Home Assistant lock to enable the feature. The
remaining settings appear only after a lock is selected. Removing the lock
returns the card to its previous behavior and removes the inactive door settings
from the saved visual configuration.

**Door contact sensor** is optional. When configured, `on` means the physical
door is open and `off` means it is closed, following Home Assistant's binary
sensor convention. While open, the door segment reads **Door open** and cannot
be activated. A closed contact leaves the configured Unlock or Open action
unchanged. If the contact is unknown or unavailable, the action remains usable
and shows **Status unknown**; only a positive open state blocks it. Without a
contact sensor, the control behaves exactly as before.

**Unlock** uses the standard `lock.unlock` service. **Open door** uses
`lock.open`, intended for locks such as compatible Nuki devices that can release
the latch. Ring View disables Open when the selected entity does not advertise
that capability.

**Require hold to activate** is the default confirmation. It is not a pop-up:
hold the action for 900 ms while a visible progress fill completes, or release
early to cancel. Turning it off makes the action respond to a single deliberate
tap, click, Space, or Enter activation.

**Live view only** is the recommended default. **Live and recordings** is
available for users who intentionally want door access while viewing historical
footage. When Talk and door access are both visible, they share one dock with a
short divider. If Talk is disabled or unsupported by the configured camera, the
dock automatically collapses to the door-only pill.

[Full door-access beta specification](door-access-beta.md)

## Freshest snapshot preview

Open **Dashboard preview**, set **Image source** to **Newest snapshot or
recording**, and select the now-visible **Device snapshot camera**. Ring View still
renders only one passive image on the dashboard, and tapping it opens the
configured Recording or Live view—there is no third viewer tab.

Ring-MQTT publishes a Unix-seconds `timestamp` attribute whenever it
successfully retrieves a new snapshot. Ring View compares explicit capture
timestamps when both camera entities provide them. The official Ring
last-recording entity currently exposes `last_video_id` but no capture time, so
Ring View also follows the order of snapshot timestamp and recording ID changes
received after the card loads. On initial load, after a reload, or whenever the
two sources remain incomparable, **If capture times cannot be compared** makes
the result deterministic. General Home Assistant `last_updated` values are not
treated as media capture times.

## Choosing camera entities

Use the official Ring integration's last-recording and live-view entities. With a suitable Ring subscription, Home Assistant provides both but [disables Last recording by default](https://www.home-assistant.io/integrations/ring/#camera).

1. Open **Settings → Devices & services → Ring**, then open your Ring device and its entity list.
2. Show disabled entities. Before enabling it, the disabled camera entry is **Last recording**; enable it if you have the required Ring subscription. The camera enabled by default is **Live view**.
3. Open each entry and copy its exact entity ID into the corresponding Ring View field.

The `_last_recording` and `_live_view` suffixes in this guide are examples, not requirements. Home Assistant entity IDs can be changed and may be assigned differently. In one [field report covering fresh 2K and 4K Ring doorbell installations](https://community.home-assistant.io/t/ring-doorbell-live-stream/855118/8), both camera entries appeared alike and neither entity ID used the expected suffix. Identify the entities by their roles and default enabled state rather than relying on their displayed names or ID suffixes.

For **two-way audio**, `live_entity` must be the official Ring `live_view` camera. A Ring-MQTT or Generic Camera RTSP entity does not expose the microphone return path Ring View needs. Ring-MQTT can still supply the optional `snapshot_entity` alongside the official Ring live camera.

The editor warns when two-way audio is selected for an unsupported live camera. The viewer then uses Home Assistant's normal player without **Hold to talk**.

[Playback and troubleshooting](playback-and-troubleshooting.md) · [Doorbell notifications](notifications.md)
