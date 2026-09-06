# Changelog

All notable changes to this project are documented here.

## [Unreleased]

## [0.3.4] - 2026-09-06

### Documentation

- Remove captured dashboard pixels from outside every screenshot's rounded
  corners so the gallery sits cleanly on light and dark README backgrounds.
- Trim stray edge pixels from the configuration screenshot and preserve its
  dialog shape with a transparent, consistently rounded frame.

## [0.3.3] - 2026-09-06

### Documentation

- Replace the synthetic README images with carefully cropped, normalized
  screenshots of the real dashboard card, recording view, and live view.
- Group the product screenshots directly below the introduction and add the
  visual editor screenshot to the configuration reference.

## [0.3.2] - 2026-09-06

### Documentation

- Keep the one-click HACS button exclusively in the installation section to
  remove the duplicate call to action from the introduction.

## [0.3.1] - 2026-09-06

### Documentation

- Rebuild the README around Ring View's unified two-entity workflow and the
  problems it solves beyond a single native camera card.
- Add the official one-click HACS repository button and a concise installation
  path.
- Document every flat Ring View option, accepted value, default, and standard
  Home Assistant grid field.
- Move development details into the dedicated testing guide and keep release
  recovery in its own document.

## [0.3.0] - 2026-09-06

### Added

- Restore focused flat options for remembering the last selected view,
  recording autoplay, the dashboard preview source, and the view icon.
- Add English and German labels, choices, and contextual help for every
  restored option.

### Changed

- Make **Show camera name** control the name consistently in both the dashboard
  card and the detail viewer.
- Move the optional dashboard name to the top left to match the detail viewer
  and remove the former bottom gradient label.
- Preserve an accessible generic name for the detail dialog when the visible
  camera name is disabled.
- Keep stream timeout, retry, hidden-tab suspension, native controls, and
  Escape behavior automatic instead of exposing technical or safety switches.

## [0.2.1] - 2026-09-06

### Added

- Add English and German translations for the visual editor, card tooltips,
  viewer controls, loading and error states, warnings, and accessibility
  announcements.
- Follow Home Assistant's active BCP 47 language setting, including regional
  German variants such as `de-DE`, `de-AT`, and `de-CH`, with English as the
  fallback for unsupported languages.
- Reuse Home Assistant's own shared translation for common UI text where the
  frontend exposes it, while keeping complete bundled translations for reliable
  custom-card rendering.

## [0.2.0] - 2026-09-06

### Changed

- Redesign the visual editor around Home Assistant's native form language: keep
  the two camera selectors visible and group viewer behavior and card appearance
  into compact icon-led expandable rows.
- Remove the editor's duplicate dashboard preview because Home Assistant already
  provides the authoritative live preview beside the form.
- Replace the large custom settings cards and warning styling with native
  `ha-form` expandable sections and `ha-alert` warnings.
- Reduce the public configuration to the meaningful flat options:
  `default_mode`, `live_muted`, `show_name`, `name`, `aspect_ratio`, and
  `fit_mode`.

### Removed

- Remove the nested `preview`, `appearance`, `viewer`, and `performance`
  configuration groups without backward compatibility.
- Remove remembered-mode storage, configurable autoplay, preview-source and
  view-icon switches, media-control and Escape switches, and technical stream
  tuning from the visual editor and public configuration.
- Remove the distortion-prone `fill` image mode.

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
