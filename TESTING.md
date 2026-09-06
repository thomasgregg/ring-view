# Development and testing

Node.js 20 or newer is required. Install the project dependencies with
`npm install`.

The production artifact is `dist/ring-view.js`. The browser suite uses a local
demo harness and mocked camera elements, so it verifies interface behavior and
renderer teardown without opening real Ring sessions.

## Automated checks

Run before every release:

```bash
npm run check
npm test
npm run test:browser
npm run build
```

The unit suite covers configuration defaults and validation, snapshot timestamp parsing and freshest-preview fallbacks, native editor structure, entity capability states, doorbell alerts, timeout invalidation, no dashboard stream, single-renderer switching, close teardown, disconnect teardown, single-offer two-way audio, press-to-talk muting, and interrupted microphone permission.

The browser suite covers opening/closing, recording → live → recording, newest snapshot selection, keyboard operation, focus return, browser Back, entity unavailability while open, camera-frame visibility and size through phone orientation changes, hold-to-talk edge placement, native-style header controls, slow media readiness, and stream-count invariants.

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
