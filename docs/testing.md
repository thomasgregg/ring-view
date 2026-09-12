# Testing and development

Node.js 20 or newer is required. Install the project dependencies with
`npm install`.

The production artifact is `dist/ring-view.js`. The browser suite uses a local
demo harness with mocked camera elements for interface behavior and renderer
teardown. The recovery fixture also connects real browser WebRTC peers and checks
advancing video frames in Chromium and WebKit. Home Assistant signaling and the
microphone source are simulated; no Ring session or physical microphone is used.
These checks do not replace Companion app testing against a real Ring camera.

The gesture-free recovery test uses fresh browser contexts, disables trace DOM
snapshots, and waits for the fixture to report six decoded video frames before
inspecting the page. This is intentional: Playwright's page evaluation (including
trace snapshots) can grant simulated user activation. The attached proof records
no activation at startup, playback, or after the moving frames; other recovery
tests retain normal failure traces.

## Automated checks

Run before every release:

```bash
npm run check
npm test
npm run test:browser
npm run build
```

The unit suite covers configuration defaults and validation, manual snapshot
source selection, paths, timezone-aware filenames and service feedback,
snapshot timestamp parsing and freshest-preview fallbacks, last-activity
timestamp formats and localization, native editor structure and progressive
dashboard fields, entity and talkback capability states, unsupported-camera
fallback, doorbell alerts, timeout invalidation, passive-dashboard privacy,
single-renderer switching, close teardown, disconnect teardown, single-offer
two-way audio, press-to-talk muting, interrupted microphone permission, and
insecure-connection guidance.

The browser suite additionally covers the unobstructed on-demand image start
surface, automatic starts, door-location and Live-readiness gating, fixed inline
action sizing across card widths, inert edit previews, duplicate inline cards, and inline-to-fullscreen
handoff without overlapping streams. It also checks activity placement with and
without a camera name, long and localized relative times, invalid-to-valid
entity changes, and separation from every header control at responsive widths.
Existing opening, switching, recovery,
accessibility, layout, and stream-count checks remain.

The lifecycle regressions additionally cover repeated recording background/resume,
late playback promises after switching or reopening, stalled subscription and
unsubscribe acknowledgments, and doorbell alert expiry across card reinsertion.
Connection-event mocks use HA's live-array iteration rather than DOM EventTarget
semantics where listener removal matters. Browser recovery checks verify Retry,
advancing frames, and fresh talkback while an old cleanup acknowledgment remains
pending, and confirm that completing the old cleanup cannot disturb the new peer.
Native playback failures are exercised through the real adapter contract and
timeouts, not a synthetic native media-error event that production never emits.

## Real Home Assistant acceptance pass

Add the custom card alongside—not in place of—the existing native `picture-entity` card and live tile:

```yaml
type: custom:ring-view
recording_entity: camera.front_door
live_entity: camera.front_door_live_view
name: Entrance test
```

Verify each item on current stable Home Assistant and, where practical, the previous two monthly releases:

1. The dashboard preview remains a still and no Ring live session starts.
2. The viewer opens on **Recording** and visible motion plays through the MJPEG fallback.
3. **Live** starts a real Ring WebRTC/HLS session with the same startup behavior as Home Assistant’s native viewer.
4. Switching to **Recording** closes the live session.
5. Closing, browser Back, dashboard navigation, and hiding the tab close the live session.
6. Rapid repeated switching never leaves two active media renderers.
7. iOS and Android Companion apps both play recording and live views.
8. Native controls and audio behavior work with the configured mute setting.
9. No authenticated URL or token appears in browser logs or Lovelace storage.
10. With two-way audio enabled, Live connects once with incoming audio and no microphone prompt.
11. Holding **Hold to talk** requests permission when needed, sends audio only while held, and does not interrupt or replace the video session.
12. Releasing, cancelling the press, switching apps, or hiding the page immediately mutes the microphone.
13. A configured doorbell event shows the in-card alert without opening a new live session.
14. A configured Ring-MQTT snapshot uses its `timestamp`, falls back when unavailable, and never adds a third viewer tab.
15. Rotating without a frontend reload preserves the current player and moving video.
16. If the Companion app reloads during rotation (the HA logo appears), the restored viewer attempts automatic muted playback once. Confirm visible motion without a tap, then enable incoming audio and try a new talk press. If the automatic connection fails, a centered **Resume live view** button offers one manual attempt without a retry loop.
17. If the browser blocks playback, the centered **Play** button remains available without a connection-error timeout. Tapping it resumes the existing session.
18. Losing the Home Assistant connection or reloading while talking immediately releases the microphone. After resuming, speech is sent only after a fresh talk press.
19. Automatic recovery waits while the page is hidden or Home Assistant is offline; closing or switching mode cancels it. Check both a full frontend reload and a persisted page-cache return. The automated tests simulate page-cache events; actual Companion behavior still needs device validation.
20. Start a recording, switch to another app, and return twice. The replacement
    recording remains playable beyond 20 seconds without a false unavailable error.
21. Trigger a doorbell alert and move the dashboard card while it is visible.
    The alert still expires twelve seconds after the ring, not twelve seconds
    after the move. Returning after expiry must not force the next opening to Live.
22. Configure a last-activity timestamp, then check the card and fullscreen
    viewer with the camera name both enabled and disabled. Confirm the relative
    time updates, the exact hover time is correct, and neither line reaches the
    mode or close/fullscreen controls at the narrowest supported card width.
23. Enable manual snapshots with `/media/ring-view`. Confirm the camera button
    is absent while on-demand is idle, appears after selecting Live, saves one
    timestamped JPEG per tap, and reports success without changing the selected
    dashboard preview source.
24. If a Ring-MQTT snapshot camera is configured, confirm it is targeted first.
    Make it unavailable and confirm the official Live camera is used instead.
    Also verify the button does not collide with the mode or fullscreen controls
    at the narrowest supported card width.

## Visual matrix

Check light and dark themes at:

- 320 × 568 phone portrait
- 390 × 844 phone portrait
- 844 × 390 phone landscape
- 768 × 1024 tablet portrait
- 1024 × 768 tablet landscape
- 1280 × 800 desktop
- 1920 × 1080 desktop
- 200% browser zoom

There must be no horizontal page scroll, clipped safe-area controls, double dialog scrollbar, media layout jump, touch target under 44px, or persistent black/empty region after resize.
