# Door access beta specification

[← Ring View](../README.md) · [Configuration reference](configuration.md)

## Status and intent

Door access is available as an opt-in beta in `0.6.0-beta.2`. It lets a Ring
View camera viewer operate a Home Assistant `lock.*` entity—for example, a Nuki
lock—without leaving the camera view.

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
  physical-access action. It is visible without making the dock look like two
  unrelated buttons.
- Talk remains neutral and becomes red while active. Door access uses a warm
  accent for its icon and hold progress, then briefly becomes green on success.
- If only one action is shown, the dock collapses to a balanced single-action
  pill. There is no empty segment or divider.
- The dock respects phone safe areas and stays reachable in portrait and
  landscape layouts.

### Availability and layout

Door access appears only when `door_entity` is configured.

- **Live view only** is the default and recommended visibility. It keeps the door
  operation next to a current camera view.
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

### States and feedback

| State | Door control behavior |
| --- | --- |
| Ready | Shows **Hold to unlock/open** when confirmation is enabled; otherwise **Unlock/Open door**. |
| Holding | Warm progress fill advances from left to right. Releasing cancels. |
| Working | Shows **Unlocking…** or **Opening…** with a loading indicator and blocks repeat calls. |
| Success | Brief green state reading **Unlocked** or **Door opened**, also announced to assistive technology. |
| Error | Returns to an actionable control and shows a concise error message above the dock. |
| Unavailable | Disabled with **Door unavailable**. |
| Jammed | Disabled with **Lock jammed**. |
| Unsupported open action | Disabled with **Open unsupported** and a configuration warning. |
| Contact reports open | Replaces the action with a disabled **Door open** state and an open-door icon. |
| Contact is unknown or unavailable | Keeps the configured action available and adds a subtle **Status unknown** label. |

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
2. Dashboard preview
3. Viewer behavior
4. Doorbell features
5. Door access
6. Card appearance

The **Door access** section uses progressive disclosure:

1. Initially, show only **Door lock**.
2. Once a `lock.*` entity is selected, reveal the optional **Door contact
   sensor**, followed by **Action when pressed**, **Show control in**, and
   **Require hold to activate**.
3. If the lock does not support `open`, explain the issue next to the
   configuration while leaving **Unlock** available.

This places the highest-impact choice first, keeps inactive settings out of the
way, and presents dependent choices only when they can affect the viewer.

## Configuration contract

| Option | Default | Accepted values | Meaning |
| --- | --- | --- | --- |
| `door_entity` | Not set | `lock.*` entity ID | Enables door access for the selected lock. |
| `door_contact_entity` | Not set | `binary_sensor.*` entity ID | Optionally replaces the door action with a disabled **Door open** state while the physical door is open. |
| `door_action` | `unlock` | `unlock`, `open` | Selects the Home Assistant lock service. |
| `door_control_visibility` | `live_only` | `live_only`, `all_views` | Limits the control to Live or also shows it over recordings. |
| `door_hold_to_activate` | `true` | `true`, `false` | Requires the 900 ms hold confirmation or enables one-tap operation. |

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

## Beta acceptance criteria

- A card without `door_entity` is visually and behaviorally unchanged.
- A card without `door_contact_entity` keeps the existing door-control behavior.
- A configured contact reporting open disables the action and shows **Door open**; closed restores the configured action immediately.
- An unknown or unavailable contact never blocks the configured action.
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
