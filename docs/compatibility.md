# Compatibility

## Supported Home Assistant versions

The release target is Home Assistant 2026.9 and the previous two monthly releases where practical. Version 0.1.0 declares Home Assistant 2026.7.0 as its minimum.

## Official Ring and Ring-MQTT sources

Ring View resolves each configured role independently. Official Ring,
Ring-MQTT, a manually configured Generic Camera, and a Home Assistant lock can
therefore be mixed without changing the editor structure, viewer modes,
controls, spacing, or status design.

| Ring View feature | Official Ring source | Ring-MQTT source | User-visible behavior |
| --- | --- | --- | --- |
| Last recording | Last recording `camera.*` | `select.*` Event Select | Same Last recording tab and video controls. The Event Select's current option chooses the Ring-MQTT event. |
| Live | Live view `camera.*` | Home Assistant Generic Camera or RTSP-to-WebRTC camera configured from Ring-MQTT's `_live` RTSP path | Same Live tab and Home Assistant camera player. Ring-MQTT does not auto-discover this camera entity. |
| Dashboard still | Last recording or Live camera image | Ring-MQTT snapshot `camera.*` | Same passive card. A snapshot camera is also the poster for Event Select recordings. |
| Manual snapshot | Configured snapshot camera, otherwise Live camera | Snapshot camera plus its same-device Take Snapshot button | Same camera action and feedback. Ring View waits for Ring-MQTT's timestamp update before saving. |
| Doorbell alert | Ding `event.*` | Ding `binary_sensor.*` | Same bell indicator and Open live view action. |
| Last activity | Timestamp state from a sensor, event, or helper | Ding or motion binary-sensor attributes | Same localized relative time. The freshest supported same-device MQTT activity wins. |
| Door access | Any Home Assistant `lock.*` and optional contact sensor | Same | Provider-independent. |

The visual editor always offers the same fields and choices. It never reveals
or removes design settings based on an entity's integration. The runtime uses
the selected entity's registry identity only to adapt the transport behind the
same interface: signed Event Select MP4, snapshot refresh button, activity
attributes, or normal Home Assistant camera playback. Renamed entities remain
supported through registry `device_id`, `unique_id`, and original-name data;
ambiguous companion controls are not guessed.

Two-way audio is the one deliberate provider limitation. The official Ring
Live view camera exposes the WebRTC signaling path needed to add a browser
microphone track. Ring-MQTT exposes a one-way RTSP gateway and no equivalent
microphone return path, so Ring View cannot implement talkback for it. The
editor remains unchanged and displays a capability warning if two-way audio is
enabled with a different Live camera.

Ring-MQTT also requires its [documented one-time Home Assistant camera setup](https://github.com/tsightler/ring-mqtt/wiki/Video-Streaming#home-assistant-generic-camera-configuration)
for the RTSP path; that setup is outside the card. The included notification
blueprint and optional Ring WebRTC backend patch still target the official Ring
integration. Other camera pairings remain compatible in principle when a
recording camera exposes `video_url` or `entity_picture` and the Live camera
advertises stream support.

The viewer uses Home Assistant's application-level `show-dialog` contract for
dialog placement, browser Back behavior, and independence from responsive card
relayouts. The dialog itself remains part of Ring View and continues to own its
camera and talkback lifecycle.

Like Home Assistant's native camera More info dialog, Ring View places the
active camera identity and view mode in the current URL while the viewer is
open. Home Assistant's `refreshUrl` history convention lets a matching card
reconstruct the dialog if an iOS Companion Web View rebuild occurs during
rotation. Closing the viewer removes those parameters. Camera credentials,
media URLs, and microphone state are never stored there; media and talkback are
negotiated again after restoration. A restored Live session starts muted to
comply with the iOS Companion Web View's user-gesture requirement for audible
playback; the native video control can enable sound afterward.

The implementation currently expects `ha-camera-stream` to expose these properties:

- `stateObj`
- `controls`
- `muted`
- `allowExoPlayer`
- `aspectRatio`
- `fitMode`

These assumptions live only in `src/media/native-camera-adapter.ts`. The adapter checks for the custom element, asks `loadCardHelpers().importMoreInfoControl("camera")` to load it when needed, waits for definition, and reports a compatibility failure instead of leaving a spinner indefinitely. When two-way audio is enabled, Live instead uses Ring View's single-session WebRTC player so a microphone track can be added without reconnecting the video.

## Why use an internal component?

Home Assistant does not expose a public, standalone camera-player web component. Reusing its internal camera stream provides the same WebRTC/HLS negotiation and the MJPEG fallback needed by Ring recording entities that do not advertise `STREAM`. Reimplementing those protocols in this card would duplicate Home Assistant logic and create different live-session behavior.

The tradeoff is tracked explicitly: Home Assistant may change the internal component at any release. The automated adapter tests, visual-editor compatibility warning, and fallback path reduce the impact to one module.

## Browser scope

The intended browser scope is the set supported by Home Assistant: current Chrome, Edge, Firefox, Safari, and the iOS/Android Companion app webviews. Fullscreen uses the browser Fullscreen API when available and a full-viewport CSS fallback otherwise.
