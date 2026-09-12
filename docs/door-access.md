# Door access guide

[← Ring View](../README.md) · [Configuration reference](configuration.md)

## Overview

Door access is an opt-in feature in `0.6.0`. It lets a Ring View camera viewer
operate a Home Assistant `lock.*` entity—for example, a Nuki lock—without
leaving the camera view.

The feature is deliberately disabled until a lock entity is selected. Existing
cards keep their current layout and behavior.

The design has three priorities:

1. Keep the visitor and the door action in the same visual context.
2. Make an accidental door operation difficult without slowing down routine use.
3. Keep Talk and door access visually related while preserving clear separation.

## Viewer design

### One visitor-action dock

When Talk and door access are both available, they share one compact glass dock
at the bottom of the viewer:

```text
┌───────────────────────┬───────────────────────┐
│  microphone  Talk     │  lock-open  Unlock   │
└───────────────────────┴───────────────────────┘
                        ↑
                short vertical divider
```

- Both actions use the same height, corner radius, typography, and translucent
  surface, so they read as one visitor interaction.
- A short, low-contrast vertical bar separates the communication action from the
  physical-access action. Balanced spacing on both sides gives the divider room
  to breathe without making the dock look like two unrelated buttons. Matching
  horizontal inset at the two outer edges keeps that spacing optically balanced.
- In the combined dock, only the two outer ends are rounded. The sides facing
  the divider are flat, so hover, hold, active, and success fills read as two
  segments of one control instead of nested pills.
- Talk remains neutral and becomes red while active. Door access uses a warm
  accent for its icon and hold progress, then briefly becomes green on success.
- If only one action is shown, the dock collapses to a balanced single-action
  pill with both ends fully rounded. There is no empty segment or divider.
- The dock respects phone safe areas and stays reachable in portrait and
  landscape layouts.

### Availability and layout

Door access appears only when `door_entity` is configured.

- **Live view only** is the default and recommended visibility. It keeps the door
  operation next to a current camera view.
- **Door control location** explicitly chooses **Fullscreen viewer only** or
  **Dashboard and fullscreen**. Selecting a lock defaults to fullscreen only.
- On an interactive card, a Live-only action is disabled as **Waiting for
  Live…** until the current Live picture is ready and hides if Live fails.
- **Live and recordings** is an explicit option for households that need the
  action in both modes.
- When Talk is available, both controls always appear in the shared dock.
- When Talk is disabled or unsupported, the dock automatically collapses to the
  door-only pill. No separate layout setting is needed.
- Talk itself remains a Live-only action because it depends on the live WebRTC
  session.
- An optional `door_contact_entity` makes the door segment aware of the physical
  door state. It has no effect unless explicitly configured.

### Safe activation

The default confirmation is a press-and-hold interaction, not a second dialog:

1. Press and hold the door control.
2. A visible fill completes over 900 milliseconds.
3. Releasing early cancels without calling Home Assistant.
4. At completion, the configured lock service is called exactly once.

This keeps the visitor visible and avoids a modal covering the camera. Advanced
users can disable the hold requirement; the control then operates on a single
tap or click. Keyboard users hold Space or Enter for the same confirmation.

The hold is cancelled if the viewer closes, its view changes, the page becomes
hidden, focus is lost, the pointer is cancelled, or the lock becomes unsafe to
operate.

### Door-contact display logic

The optional contact sensor decides what the icon means. With a contact, the
icon shows the physical door state. Without one, it shows the configured action.

| Contact configured | Sensor state | Icon | Primary text | Can operate? |
| --- | --- | --- | --- | --- |
| No | — | Unlock icon for `unlock`; open-door icon for `open` | **Hold to unlock/open** or **Unlock/Open door** | Yes, when the lock is safe and available. |
| Yes | Closed (`off` or `closed`) | Closed door | The configured action text | Yes, when the lock is safe and available. |
| Yes | Open (`on` or `open`) | Open door | **Door open** | No; the action is replaced by physical-door status. |
| Yes | Unknown, unavailable, or missing | Warning | Configured action plus **Status unknown** | Yes, unless the lock itself is unsafe or unavailable. |

The contact reports only whether the door leaf is physically open. It does not
say whether a closed door is locked or unlocked; the action text continues to
make that distinction.

The physical-state icon takes priority for as long as a contact is configured.
Progress is therefore communicated by the text, color, and hold fill without
temporarily suggesting that the door has physically moved.

| Action phase | Without a contact sensor | With a contact sensor |
| --- | --- | --- |
| Ready or holding | Configured unlock/open action icon | Current closed/open/warning physical-state icon |
| Working | Loading icon | Current physical-state icon until the sensor changes |
| Success | Check icon | Current physical-state icon until the sensor changes |
| Error | Warning icon | Current physical-state icon; the error text appears above the dock |

### Action states and feedback

| State | Text and feedback | Can operate? |
| --- | --- | --- |
| Ready | **Hold to unlock/open** when confirmation is enabled; otherwise **Unlock/Open door**. | Yes. |
| Holding | Warm progress fill advances from left to right. Releasing cancels. | In progress; no service call until complete. |
| Working | **Unlocking…** or **Opening…** and repeat calls are blocked. | No. |
| Success | Brief green **Unlocked** or **Door opened** state, also announced to assistive technology. | No until the success feedback clears. |
| Error | Returns to the configured action and shows a concise error above the dock. | Yes; retry is available. |
| Lock unavailable | Disabled with **Door unavailable**. | No. |
| Lock jammed | Disabled with **Lock jammed**. | No. |
| Unsupported open action | Disabled with **Open unsupported** and a configuration warning. | No. |

Success is intentionally shown in the control itself rather than in a second
toast, keeping the interface calm and avoiding duplicate feedback.

## Home Assistant behavior

Ring View does not communicate with a lock vendor directly. It calls the
standard [Home Assistant lock service](https://www.home-assistant.io/integrations/lock/)
for the selected entity:

| Configuration | Home Assistant call | Intended behavior |
| --- | --- | --- |
| `door_action: unlock` | `lock.unlock` | Unlock the selected lock. |
| `door_action: open` | `lock.open` | Release or open the door latch on locks that advertise open support. |

The card validates that `door_entity` belongs to the `lock` domain. If **Open
door** is selected, the editor and viewer check Home Assistant's
[`OPEN` supported-feature flag](https://developers.home-assistant.io/docs/core/entity/lock/).
No lock credentials, access codes, or vendor tokens are stored by Ring View.

Service-call authorization continues to be enforced by Home Assistant. Users
who can view a dashboard containing an enabled one-tap door control may be able
to operate that entity, so dashboard access and Home Assistant permissions must
be treated accordingly.

## Visual editor information architecture

Door access has its own top-level expandable section. It is not nested under
**Doorbell features**, because a lock action and a Ring Ding event are separate
capabilities.

The full editor order is:

1. Cameras
2. Snapshots
3. Dashboard card
4. Fullscreen viewer
5. Doorbell features
6. Door access
7. Card appearance

The **Door access** section uses progressive disclosure:

1. Initially, show only **Door lock**.
2. Once a `lock.*` entity is selected, reveal the optional **Door contact
   sensor**, followed by **Action when pressed**, **Show control in**, and
   **Require hold to activate**.
3. When the dashboard behavior is interactive, also reveal **Door control
   location** after the safer viewer-only settings.
4. If the lock does not support `open`, explain the issue next to the
   configuration while leaving **Unlock** available.

This places the highest-impact choice first, keeps inactive settings out of the
way, and presents dependent choices only when they can affect the viewer.

## Configuration options

| Visual editor setting | YAML option | Default | Accepted values | Meaning |
| --- | --- | --- | --- | --- |
| Door lock | `door_entity` | Not set | `lock.*` entity ID | Enables door access for the selected lock. Removing it hides the control and its dependent editor settings. |
| Door contact sensor | `door_contact_entity` | Not set | `binary_sensor.*` entity ID | Makes the icon show the physical state and replaces the action with disabled **Door open** while open. |
| Action when pressed | `door_action` | `unlock` | `unlock`, `open` | Calls `lock.unlock`, or `lock.open` to release the latch when supported. |
| Show control in | `door_control_visibility` | `live_only` | `live_only`, `all_views` | Keeps the control in Live only, or explicitly also shows it over recordings. |
| Require hold to activate | `door_hold_to_activate` | `true` | `true`, `false` | Requires the 900 ms hold confirmation; `false` enables one-tap operation. |
| Door control location | `door_control_location` | `viewer_only` | `viewer_only`, `dashboard_and_viewer` | Keeps the action in fullscreen only, or places it on both the interactive dashboard card and fullscreen viewer. |

Example:

```yaml
type: custom:ring-view
recording_entity: camera.front_door_last_recording
live_entity: camera.front_door_live_view
two_way_audio: true

door_entity: lock.front_door
door_contact_entity: binary_sensor.front_door_contact
door_action: open
door_control_visibility: live_only
door_hold_to_activate: true
door_control_location: viewer_only
```

## Accessibility and motion

- All controls have visible text and accessible names; meaning is never conveyed
  by color alone.
- State changes use a polite screen-reader announcement. Errors use an alert.
- Disabled states remain legible and explain why the action cannot run.
- Touch targets meet the existing Ring View mobile sizing.
- Reduced-motion preferences remove non-essential animation while preserving the
  hold progress and state meaning.
- Focus is returned safely when the viewer closes, and no door call is allowed
  to continue from a stale or hidden viewer.

## Behavior guarantees

- A card without `door_entity` is visually and behaviorally unchanged.
- A card without `door_contact_entity` keeps the existing door-control behavior.
- A configured contact reporting closed shows a closed-door icon and keeps the configured action available.
- A configured contact reporting open shows an open-door icon, disables the action, and displays **Door open**.
- An unknown or unavailable contact shows a warning icon and never blocks the configured action.
- Talk and door access form one dock with a visible divider when both are shown.
- A single remaining action renders as one centered pill without a divider.
- A short hold never calls a lock service; a completed hold calls it once.
- One-tap mode calls once per deliberate activation.
- Talk appears beside the door action whenever it is supported, and the dock
  collapses automatically when Talk is unavailable.
- `open` is blocked when the lock does not advertise support.
- Unavailable and jammed locks cannot be operated.
- Live-only and Live-plus-recordings visibility work independently of the opening
  view.
- Pointer, touch, and keyboard interaction receive equivalent feedback.
- English and German labels, errors, and announcements are included.
- Desktop and phone browser tests cover the merged dock, cancellation, service
  call, visibility, and automatic door-only fallback.
