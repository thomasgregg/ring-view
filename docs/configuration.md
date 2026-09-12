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
    <img src="https://raw.githubusercontent.com/thomasgregg/ring-view/main/docs/images/configuration-editor-wide.png" alt="Ring View visual configuration editor with the interactive dashboard settings expanded" width="860">
  </a>
  <br>
  <sub>Choose a simple preview or expose camera controls directly on the dashboard.</sub>
</p>

| Option | UI configuration | Default | Accepted values | Purpose |
| --- | --- | --- | --- | --- |
| `type` | No — added automatically | Required | `custom:ring-view` | Identifies the custom card. Added automatically by the card picker. |
| `recording_entity` | Yes — Config tab | Required | `camera.*` entity ID | Camera entity containing the latest recording. |
| `live_entity` | Yes — Config tab | Required | `camera.*` entity ID | Camera entity that starts the Ring live view. |
| `snapshot_entity` | Yes — Dashboard preview | Not set | `camera.*` entity ID | Device snapshot camera, such as the snapshot entity created by Ring-MQTT. Used by snapshot previews and preferred for manual snapshots when configured and available. |
| `name` | Yes — Config tab | Entity name | Text | Optional label used instead of the recording entity's friendly name. |
| `last_activity_entity` | Yes — Card appearance | Not set | `sensor.*`, `event.*`, or `input_datetime.*` entity ID | Shows the selected entity state's date and time as a localized relative timestamp at the top left. |
| `default_mode` | Yes — Config tab | `last_recording` | `last_recording`, `live` | View selected when the viewer opens. |
| `remember_last_mode` | Yes — Config tab | `false` | `true`, `false` | Remembers the most recent view in the current browser and uses it instead of `default_mode`. |
| `autoplay_recording` | Yes — Config tab | `true` | `true`, `false` | Starts the latest recording immediately; when disabled, the viewer waits for Play. |
| `live_muted` | Yes — Config tab | `false` | `true`, `false` | Starts Live muted. Browser autoplay rules can still require muted playback. |
| `dashboard_behavior` | Yes — Dashboard card | `open_viewer` | `open_viewer`, `interactive` | Keeps the passive card that opens fullscreen, or exposes camera controls directly in the card. |
| `dashboard_start` | Yes — Dashboard card, interactive only | `on_demand` | `on_demand`, `last_recording`, `live` | Waits for a tap, starts the recording, or starts Live when an interactive card becomes visible. |
| `dashboard_live_muted` | Yes — Dashboard card, interactive only | `true` | `true`, `false` | Controls audio when Live starts inside the dashboard. Muted is recommended for tablets and autoplay. |
| `two_way_audio` | Yes — Fullscreen viewer | `false` | `true`, `false` | Uses one direct WebRTC session for live video, listening, and push-to-talk when `live_entity` is an official Ring `live_view` camera. |
| `doorbell_entity` | Yes, Doorbell features | Not set | `event.*` entity ID | Displays a temporary ring alert when the selected doorbell event reports `ring`. |
| `door_entity` | Yes — Door access | Not set | `lock.*` entity ID | Enables door access for the selected Home Assistant lock. |
| `door_contact_entity` | Yes — Door access | Not set | `binary_sensor.*` entity ID | Optionally makes the icon reflect the physical door state. An open contact replaces and disables the door action until the door closes. |
| `door_action` | Yes — Door access | `unlock` | `unlock`, `open` | Calls `lock.unlock`, or `lock.open` for locks that advertise latch-opening support. |
| `door_control_visibility` | Yes — Door access | `live_only` | `live_only`, `all_views` | Shows the door action only in Live by default, or also over recordings. |
| `door_hold_to_activate` | Yes — Door access | `true` | `true`, `false` | Requires a 900 ms press-and-hold confirmation. Disable for one-tap operation. |
| `door_control_location` | Yes — Door access, interactive only | `viewer_only` | `viewer_only`, `dashboard_and_viewer` | Keeps the door action in fullscreen only, or places it on both the interactive dashboard card and fullscreen viewer. |
| `show_name` | Yes — Config tab | `false` | `true`, `false` | Shows the camera name at the top left of both the dashboard card and viewer. |
| `show_snapshot_button` | Yes — Snapshots | `false` | `true`, `false` | Shows one manual snapshot action while Live is active. |
| `snapshot_directory` | Yes — Snapshots | `/media/ring-view` | Absolute directory path | Folder where manual snapshots are saved by Home Assistant. |
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
| `min_columns` | `12` | Minimum supported width in grid columns in both dashboard modes. |
| `min_rows` | `3` | Minimum supported height in grid rows in both dashboard modes. |
| `max_columns` | Not set | Optional maximum width. |
| `max_rows` | Not set | Optional maximum height. |

### Complete YAML example

```yaml
type: custom:ring-view

recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view
snapshot_entity: camera.front_door_snapshot
name: Entrance
last_activity_entity: sensor.front_door_last_activity

default_mode: last_recording
remember_last_mode: false
autoplay_recording: true
live_muted: false

dashboard_behavior: interactive
dashboard_start: on_demand
dashboard_live_muted: true

show_snapshot_button: true
snapshot_directory: /media/ring-view

two_way_audio: true
doorbell_entity: event.front_door_ding

door_entity: lock.front_door
door_contact_entity: binary_sensor.front_door_contact
door_action: open
door_control_visibility: live_only
door_hold_to_activate: true
door_control_location: viewer_only

show_name: true
preview_source: newest
preview_fallback: last_recording
aspect_ratio: "16:9"
fit_mode: cover

grid_options:
  columns: 12
  rows: 3
  min_columns: 12
  min_rows: 3
```

Ring View 0.2 and newer use this flat configuration only. Earlier nested `preview`, `appearance`, `viewer`, and `performance` structures are not supported.

### Last activity timestamp

Open **Card appearance** and choose **Last activity timestamp** to show compact
relative text such as **2 min. ago**. When the camera name is visible, the time
appears directly below it. When the name is hidden, the time takes the same
top-left position without leaving an empty line. The option works in the
dashboard card and fullscreen viewer.

The selected entity's state must contain a complete date and time. Ring View
accepts ISO 8601 values, Home Assistant input-datetime values such as
`2026-09-12 10:15:30`, and Unix timestamps in seconds or milliseconds. Sensor,
event, and input-datetime entities are offered in the editor so the timestamp
can represent a Ding, motion, recording, or a template sensor that chooses the
newest relevant event.

Hovering the relative time shows the exact localized date and time. Assistive
technology receives the fuller label **Last activity, 2 minutes ago**. Unknown,
unavailable, or invalid values are not displayed; the visual editor shows a
configuration warning instead.

## Saving a manual snapshot

Open **Snapshots** and enable **Show snapshot button**. One camera button then
appears in the header only while Live is actually active. It is available in
the interactive dashboard card and fullscreen viewer. It stays hidden on the
passive dashboard card, in Recording, and while an on-demand card is waiting
for its first tap.

The button is both **Take snapshot** and **Save**. Ring View asks Home Assistant
to run `camera.snapshot` and gives it a timestamped JPEG filename. No separate
automation, script, or second save button is required.

Ring View automatically chooses the capture entity:

1. Use the configured `snapshot_entity` when that entity exists and is
   available. This is normally the Ring-MQTT snapshot camera.
2. Otherwise use the configured `live_entity`, normally the official Ring Live
   view camera.
3. Disable the button if neither camera is available.

The first choice uses the same **Device snapshot camera** already configured
for dashboard snapshot previews. The Snapshots section deliberately does not
add another camera selector. The saved image comes from the selected Home
Assistant camera entity; it is not a browser screenshot of the visible video
frame.

The official Ring Live camera is a compatibility fallback, not a guarantee of
a current Live frame. `camera.snapshot` can save only the still image that the
entity exposes to Home Assistant. It cannot copy pixels from the active WebRTC
player. With current official Ring behavior, the result can be unavailable or
represent the latest recording instead. Configure the Ring-MQTT snapshot
camera when a fresh device snapshot is required.

The default folder is `/media/ring-view`. [Home Assistant OS creates `/media`
automatically](https://www.home-assistant.io/more-info/local-media/setup-media/).
Home Assistant Container users must mount a directory at
`/media`. Open **Media > My media > ring-view** to view saved files. Media files
require Home Assistant authentication, unlike files under `/config/www`, which
can be publicly accessible.

The editor checks that the configured path is absolute and rejects the
filesystem root, path traversal, control characters, and template markers. It
warns about `/config/www` and custom locations. Only Home Assistant can verify
that the server folder exists and is writable, so the real write check happens
when the button is pressed. Custom locations may need to be added to
[`allowlist_external_dirs`](https://www.home-assistant.io/docs/configuration/basic/)
in `configuration.yaml`. Home Assistant creates the final subfolder when the
standard [`camera.snapshot`](https://www.home-assistant.io/actions/camera.snapshot/)
action saves the first image.

Files are named like
`entrance_2026-09-12_18-42-03-125.jpg`, using Home Assistant's configured time
zone. Each tap creates a new file. Ring View does not currently provide a
gallery, automatic cleanup, or a retention limit.

Saving a file does not replace the dashboard preview. The preview continues to
follow **Image source** and its own camera entity. A saved JPEG is a file, not a
camera entity, so treating it as the new preview would require a separate
Local file camera and would change the meaning of the existing preview setting.

## Dashboard card behavior

Open **Dashboard card** and choose one of two intentionally distinct surfaces:

| Behavior | Dashboard | Fullscreen |
| --- | --- | --- |
| **Open fullscreen viewer** (default) | One passive still image; tapping opens the viewer. | Recording, Live, Talk, and configured door access. |
| **Control camera in card** | Recording/Live tabs, media controls, optional Talk and optional door access, plus fullscreen. | The same full viewer, opened with the currently selected mode. |

The interactive fields appear only after that mode is selected. **No — wait for
a tap** is the safest startup and does not mount a player until Recording or
Live is started. The selected view remains highlighted while its still image is
idle, making it clear what tapping the image will start. When a recording is
waiting to start in either the dashboard card or fullscreen viewer, tap or
click the camera image to play it. The large central Play button is
intentionally omitted so the image stays unobstructed. The image surface is
also keyboard accessible. The Recording mode remains highlighted after the
video ends because it identifies the selected view, not the current playback
state. Automatic Live starts only while the card is visible and is muted by
default. Home Assistant edit and card-picker previews never connect to the
camera and never expose Talk or door actions.

### Settings that control different parts of the experience

| Visual editor setting | It controls | It does not control |
| --- | --- | --- |
| **Dashboard behavior** | Whether the dashboard is a still image or an interactive camera. | Which media starts. |
| **Start media automatically** | What an interactive card starts: nothing, Recording or Live. | What opens in fullscreen. |
| **Open viewer on** | Whether fullscreen initially shows Recording or Live. | The interactive dashboard startup. |
| **Show control in** | Whether the door action appears only in Live or also over recordings. | Whether it appears on the dashboard. |
| **Door control location** | Fullscreen only, or dashboard and fullscreen. | Whether Talk is supported. |

Talk is always Live-only and requires **Enable two-way audio** plus the official
Ring Live view camera. If Talk and door access are both available, they form one
segmented dock. If either is unavailable, the dock automatically becomes one
fully rounded control.

### Common configurations

| Use case | Dashboard behavior | Startup | Door location | Suggested safety |
| --- | --- | --- | --- | --- |
| Normal phone or desktop dashboard | Open fullscreen viewer | Not applicable | Fullscreen only | Live-only door action with hold enabled. |
| Shared family dashboard | Open fullscreen viewer | Not applicable | Fullscreen only | Keep the door action out of the dashboard. |
| Wall tablet, start only when needed | Control camera in card | No, wait for a tap | Dashboard and fullscreen | Live-only, muted Live, hold enabled. |
| Always-on entrance monitor | Control camera in card | Live | Your choice | Start muted; add dashboard door access only on a trusted tablet. |

#### Wall tablet with on-demand media, Talk and a latch action

```yaml
type: custom:ring-view
recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view

dashboard_behavior: interactive
dashboard_start: on_demand
dashboard_live_muted: true
two_way_audio: true

door_entity: lock.front_door
door_contact_entity: binary_sensor.front_door_contact
door_action: open
door_control_visibility: live_only
door_control_location: dashboard_and_viewer
door_hold_to_activate: true
```

#### Muted Live monitor with Talk

```yaml
type: custom:ring-view
recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view

dashboard_behavior: interactive
dashboard_start: live
dashboard_live_muted: true
two_way_audio: true
```

#### Door access kept inside the fullscreen viewer

```yaml
type: custom:ring-view
recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view

door_entity: lock.front_door
door_contact_entity: binary_sensor.front_door_contact
door_action: unlock
door_control_visibility: live_only
door_control_location: viewer_only
door_hold_to_activate: true
```

**Door control location** makes the placement explicit: **Fullscreen viewer
only** or **Dashboard and fullscreen**. With Live-only visibility, the action
reads **Open when ready** or **Unlock when ready** and stays disabled until the
current Live player has connected. It hides if Live fails, leaving the compact
Retry state and the existing mode tabs.

## Door access

Open **Door access** and select a Home Assistant lock to enable the feature. The
remaining settings appear only after a lock is selected. Removing the lock
returns the card to its previous behavior and removes the inactive door settings
from the saved visual configuration.

**Door contact sensor** is optional. When configured, `on` means the physical
door is open and `off` means it is closed, following Home Assistant's binary
sensor convention. The icon then follows the physical state: closed door for
`off`, open door for `on`, and a warning for an unknown or unavailable state.
While open, the door segment reads **Door open** and cannot be activated. A
closed contact leaves the configured Unlock or Open action available. If the
contact is unknown or unavailable, the action remains usable and shows
**Status unknown**; only a positive open state blocks it. Without a contact
sensor, the icon continues to represent the configured action.

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

[Full door-access guide](door-access.md)

## Freshest snapshot preview

With **Open fullscreen viewer** selected, open **Dashboard card**, set **Image source** to **Newest snapshot or
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
