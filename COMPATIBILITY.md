# Compatibility policy

## Supported Home Assistant versions

The release target is Home Assistant 2026.9 and the previous two monthly releases where practical. Version 0.1.0 declares Home Assistant 2026.7.0 as its minimum.

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
