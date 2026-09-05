# Changelog

All notable changes to this project are documented here.

## [Unreleased]

## [0.1.13] - 2026-09-06

### Fixed

- Preserve Home Assistant's native hover-to-reveal media controls across the
  entire live image while continuing to suppress accidental surface clicks.

## [0.1.12] - 2026-09-05

### Fixed

- Let Home Assistant's WebRTC live video fill the entire Ring View media frame
  instead of exposing a stale poster strip below it.
- Keep the live image surface passive so incidental clicks do not pause the
  stream, while preserving access to the native media control strip.

## [0.1.11] - 2026-09-05

### Changed

- Replace the dashboard preview's labeled mode pill with a compact icon-only
  indicator.
- Use one consistent mode language everywhere: a history icon for the last
  recording and a Home Assistant-themed red dot for Live.
- Keep the Live dot clean and solid, with only a subtle dark separation shadow
  instead of a contrasting white keyline.
- Rename the editor setting to **Show view icon** and include the selected mode
  in the card's accessible label and browser tooltip.

## [0.1.10] - 2026-09-05

### Changed

- Replace the labeled Recording/Live pill with two compact, centered icon tabs
  aligned to the close control and labeled with native browser tooltips.
- Leave audio and fullscreen exclusively to Home Assistant's native media bar,
  removing the duplicate overlay buttons.
- Remove the obsolete `appearance.switch_position` and
  `viewer.show_fullscreen` configuration options.
- Restyle the close control to match Home Assistant's plain icon-button
  treatment while retaining its 44-pixel accessible target.

## [0.1.9] - 2026-09-05

### Changed

- Match Home Assistant's native still-camera preview behavior by requesting a
  signed camera-proxy thumbnail sized for the rendered card and screen pixel
  density.
- Refresh dashboard thumbnails every ten seconds only while the card and browser
  tab are visible, and request an updated size after the card is resized.
- Keep the dashboard strictly still-image-only; recording and live renderers are
  still mounted exclusively inside the opened viewer.

## [0.1.8] - 2026-09-05

### Added

- Show the same persistent Mute/Unmute button for last-recording playback as
  live view, without restarting the recording when its audio state changes.

## [0.1.7] - 2026-09-05

### Fixed

- Start direct last-recording playback with audio instead of forcing it muted.
- Retry the same recording muted only when the browser rejects audible autoplay,
  while retaining native media controls so the user can enable sound.

## [0.1.6] - 2026-09-05

### Changed

- Start Ring live view with audio enabled by default, matching Home Assistant's
  native camera viewer. If the browser rejects playback with audio, retry muted.
- Keep an already-negotiated audio track across mute/unmute actions so sound
  returns immediately without starting another Ring session.

## [0.1.5] - 2026-09-05

### Fixed

- Recreate a muted WebRTC live renderer when the user enables audio so Home
  Assistant retains the arriving audio track, matching its native camera
  viewer behavior.
- Do not report a muted WebRTC session as having no camera audio, because Home
  Assistant intentionally omits audio tracks while that player is muted.

## [0.1.4] - 2026-09-05

### Fixed

- Listen for live audio/video capability reports on both Home Assistant's
  camera-stream host and its shadow renderer, and expose a precise accessible
  audio status after connection.

## [0.1.3] - 2026-09-05

### Fixed

- Play a Ring recording from its temporary native video source first so the
  original timestamps are preserved instead of being re-timed by MJPEG.
- Fall back to Home Assistant's native camera renderer when the temporary
  recording URL cannot play.
- Propagate Home Assistant's live-stream audio capability report and announce
  when an audio track is available.

## [0.1.2] - 2026-09-05

### Fixed

- Detect a native MJPEG image that loads before the adapter can subscribe to
  Home Assistant's `load` event, avoiding an incorrect permanent spinner.

## [0.1.1] - 2026-09-05

### Fixed

- Let Home Assistant finish its native WebRTC/HLS-to-MJPEG fallback instead of
  treating a failed preferred stream candidate as a final recording error.

## [0.1.0] - 2026-09-05

### Added

- Still-only dashboard preview with native card styling and optional name/mode badge.
- Accessible responsive viewer with recording/live segmented control.
- Isolated native `ha-camera-stream` adapter with lazy loading and compatibility fallbacks.
- Single-stream lifecycle enforcement, hidden-tab suspension, browser-history close, timeout, and one automatic live retry.
- Fullscreen, audio mute, keyboard, focus-trap, reduced-motion, and safe-area support.
- Visual Home Assistant editor with camera entity selectors and capability warnings.
- HACS metadata, unit tests, Playwright browser tests, release workflow, compatibility notes, and rollback instructions.
