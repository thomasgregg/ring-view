# Changelog

All notable changes to this project are documented here.

## [Unreleased]

## [0.11.0-beta.3] - 2026-09-13

### Changed

- Separate Bell, Snapshot, and Close or Enlarge into individual circular glass
  controls instead of combining unrelated actions in one pill. Close and
  Enlarge remain fixed at the far-right edge while contextual controls appear
  to their left without shifting the primary navigation action.
- Add separate **Start recordings muted** controls for the fullscreen viewer
  and interactive dashboard. Fullscreen recordings keep sound on by default;
  dashboard recordings start muted by default for reliable automatic playback.
- Preserve the configured recording-audio preference when a browser rejects
  autoplay. Ring View now leaves the loaded recording and native Play control
  available instead of silently retrying with a different mute state.

### Fixed

- Request the matching Ring-MQTT **(Transcoded)** event before playback on
  iPhone/iPad, and as an automatic fallback when a direct Ring recording fails
  elsewhere. The selected Ding, Motion, or on-demand event is preserved.
- Keep Ring View's muted state synchronized when the user changes sound through
  the browser's native recording controls.

### Tests

- Cover both recording-audio settings, audible-autoplay rejection, Apple-mobile
  preselection without audio-policy changes, exact transcoded-option matching,
  desktop-only direct playback, and direct-URL failure fallback.

## [0.11.0-beta.2] - 2026-09-13

### Changed

- Shorten the active Talk label to **Release** while retaining the complete
  **Release to stop** instruction for screen readers.
- Group Snapshot with Close in the portrait header instead of leaving Snapshot
  isolated beside the middle of the camera image.
- Anchor the Talk and door-access rail eight pixels above the bottom of an
  interactive dashboard card, including short mobile cards.
- Give a newly selected or transcoding Ring-MQTT event one complete refresh
  cycle before showing a recording error.

### Fixed

- Keep a loaded recording and its native Play control available when iOS rejects
  both autoplay attempts; a browser playback policy is no longer treated as a
  broken Ring-MQTT URL.
- Remount each distinct valid Ring-MQTT recording URL once before requesting a
  refresh, and accept the still-valid URL when Ring-MQTT republishes no change.
- Prevent compact recording errors from colliding with the camera title and
  mode controls. Short cards now show a concise title and Retry action while the
  technical detail remains available in the full viewer and live region.
- Replace the remaining legacy blue Ring View Resume surface with the shared
  dark, borderless rounded action style.

### Tests

- Cover iOS autoplay rejection, unchanged Ring-MQTT URL refreshes, per-URL media
  retries, 184-pixel dashboard cards, concise active Talk copy, portrait utility
  grouping, compact error geometry, and provider-independent layout.

## [0.11.0-beta.1] - 2026-09-13

### Added

- Add one coherent, low-chrome control language inspired by modern video-player
  interfaces: borderless translucent rails, circular inset interaction states,
  consistent icon weight, and restrained semantic colour.
- Keep an enlarge action at the top right of every interactive dashboard card.
  It opens the complete Ring View viewer and remains distinct from any native
  fullscreen action supplied by the browser or Home Assistant media player.
- Add explicit forced-colour treatment for utility rails, visitor actions,
  selected modes, door progress, and keyboard focus.
- Add a compact-height rule that gives a central connection, Ding, or feedback
  message temporary priority over visitor controls when both cannot fit without
  colliding.

### Changed

- Standardize custom utility controls at 44 pixels on desktop and 48 pixels on
  touch layouts. Talk and door access now use stable 48-pixel-high targets in
  desktop, landscape, portrait, and dashboard modes.
- Group Recording and Live in one top rail. The selected mode, hover, pressed,
  and keyboard-focus treatments stay four pixels inside the control instead of
  changing its outer size.
- Use a plain 17-pixel red dot for Live without the unrelated white ring that
  previously made the selected state look like a different control family.
- Keep portrait camera actions in a compact vertical rail at the right edge,
  while mode switching stays near the top right and Close stays in the corner.
  Desktop and landscape retain their established header arrangement.
- Combine Talk and door access in one borderless visitor rail without a divider,
  nested outlines, shadow, or default blur. Talk turns red only while audio is
  being transmitted.
- Extend the default door confirmation to 1.6 seconds. Its warm progress surface
  fills from left to right with a rounded starting edge and a straight moving
  edge, while the target and its contents remain stationary.
- Present loading as a lightweight spinner and label, actionable recovery as a
  dark rounded action, and short snapshot, door, and session feedback as one
  central dark message surface with left-aligned wrapping text.
- Preserve the browser and Home Assistant media player's own playback, volume,
  timeline, captions, and fullscreen controls exactly as supplied.

### Fixed

- Prevent snapshot, mode, Talk, and door states from changing the size or outer
  silhouette of their controls.
- Prevent the snapshot focus/selected treatment from overflowing the edge of a
  narrow card or appearing visibly non-circular.
- Keep long status and translated text inside the camera surface without
  overlapping header controls, visitor actions, or native playback controls.
- Restore visitor actions automatically when a short interactive card becomes
  tall enough or its central message clears.
- Keep both Talk and door access at equal 48-by-48 icon targets on exceptionally
  narrow screens where visible labels can no longer fit.
- Make keyboard focus visible in Windows forced-colour mode, where decorative
  box shadows may be suppressed by the browser.
- Cancel a door hold at the final millisecond when the pointer is released or
  cancelled, and prevent pointer-up after activation from sending a second
  service call.

### Documentation

- Describe the new custom-control layout, dashboard enlarge action, Talk state,
  visitor rail, compact-message priority, and 1.6-second door confirmation in
  the README and configuration, door-access, privacy, and accessibility guides.
- Explicitly distinguish Ring View's custom controls from the native media
  controls that the redesign intentionally does not modify.

### Tests

- Pass 195 unit and component tests and 134 browser scenarios across desktop and
  phone projects.
- Cover stable rail geometry, dashboard enlarge behavior, selected, hover,
  pressed, and keyboard states, active Talk colour, progressive door fill,
  pointer cancellation, compact-height recovery, long feedback text, portrait,
  landscape, 280-pixel width, reduced motion, forced colours, provider parity,
  and preservation of native media controls.

## [0.10.0] - 2026-09-13

### Added

- Support Ring-MQTT Ding and motion binary sensors as last-activity sources,
  including renamed same-device companions and ISO, Unix-second, and
  Unix-millisecond timestamps.
- Refresh Ring-MQTT snapshots through the device's **Take Snapshot** button and
  wait for an explicit new image timestamp before saving the JPEG.
- Play Ring-MQTT Event Select recordings directly in the existing **Last
  recording** view, refreshing missing, expiring, failed, or transcoding URLs
  through Home Assistant state updates.
- Support official Ring and Ring-MQTT entities in one phone-notification
  blueprint, with the same visual inputs and notification flow.

### Changed

- Resolve recording, Live, snapshot, doorbell, and activity entities as
  independent source roles so official Ring, Ring-MQTT, and mixed setups share
  the same Ring View configuration and interface.
- Discover renamed same-device Ring-MQTT companion entities from Home
  Assistant's registry while refusing disabled or ambiguous matches.
- Keep the visual editor's sections, controls, and preview geometry consistent
  across official Ring and Ring-MQTT source profiles.
- Keep two-way audio limited to an official Ring Live camera because Ring-MQTT
  exposes one-way RTSP without a microphone return path.
- Send the phone notification immediately, then update that same alert only
  after a fresh official recording or Ring-MQTT Ding snapshot is available.

### Fixed

- Prevent Ring-MQTT snapshot saves from reporting success while persisting a
  stale image.
- Reject non-playable Ring-MQTT recording sentinels and URLs that are too close
  to expiry, with one bounded refresh attempt after a browser playback failure.
- Cancel pending snapshot and recording refreshes when the viewer closes,
  changes mode, becomes hidden, or is suspended.
- Detect rapid and repeated Ring-MQTT doorbell presses from advancing
  `lastDingTime`, `lastDing`, or entity-update timestamps while the configured
  Ding sensor remains `on`, without relying on a fixed debounce window.
- Recover a genuinely fresh Ring alert after the dashboard loads or an entity
  reconnects, while continuing to ignore stale retained MQTT state.
- Prefix the visible relative time with **Activity** so it cannot be mistaken
  for the age of an older recording selected through Ring-MQTT Event Select.
- Ignore stale, backward, malformed, and implausibly future doorbell markers,
  and avoid attaching an old notification preview after a timeout.

### Documentation

- Add a plain-language official Ring versus Ring-MQTT feature table and a
  recommended mixed-entity setup to the README.
- Explain exactly where to choose **Ding 1**, **Motion 1**, or a transcoded
  Ring-MQTT Event Select recording before opening **Last recording**.
- Align the doorbell guide with the current temporary bell and centered **Open
  live view** behavior.
- Document how to update the blueprint and configure its official Ring or
  Ring-MQTT Ding and preview sources.
- Publish the code- and test-backed analysis of the official Ring realtime
  listener failure and its recommended upstream repair sequence.

### Tests

- Pass 194 unit and component tests and 116 browser scenarios across desktop
  and phone projects.
- Cover provider parity, renamed entities, mixed sources, repeated Dings,
  reconnect freshness, timestamp normalization, snapshot refresh, Event Select
  playback, signed-URL expiry, cancellation, accessibility, and responsive
  layout behavior.

## [0.10.0-beta.1] - 2026-09-13

### Added

- Support Ring-MQTT Ding and motion binary sensors as last-activity sources,
  including renamed same-device companions and ISO, Unix-second, and
  Unix-millisecond timestamps.
- Refresh Ring-MQTT snapshots through the device's **Take Snapshot** button and
  wait for an explicit new image timestamp before saving the JPEG.
- Play Ring-MQTT Event Select recordings directly in the existing **Last
  recording** view, refreshing missing, expiring, failed, or transcoding URLs
  through Home Assistant state updates.

### Changed

- Resolve recording, Live, snapshot, doorbell, and activity entities as
  independent source roles so official Ring, Ring-MQTT, and mixed setups share
  the same Ring View configuration and interface.
- Discover renamed same-device Ring-MQTT companion entities from Home
  Assistant's registry while refusing disabled or ambiguous matches.
- Keep the visual editor's sections, controls, and preview geometry consistent
  across official Ring and Ring-MQTT source profiles.
- Keep two-way audio limited to an official Ring Live camera because Ring-MQTT
  exposes one-way RTSP without a microphone return path.

### Fixed

- Prevent Ring-MQTT snapshot saves from reporting success while persisting a
  stale image.
- Reject non-playable Ring-MQTT recording sentinels and URLs that are too close
  to expiry, with one bounded refresh attempt after a browser playback failure.
- Cancel pending snapshot and recording refreshes when the viewer closes,
  changes mode, becomes hidden, or is suspended.

### Documentation

- Add provider-role mapping, Ring-MQTT Live camera setup, Event Select behavior,
  snapshot requirements, privacy notes, and troubleshooting guidance.

### Tests

- Pass 187 unit tests and 116 browser tests across desktop and phone projects,
  including renamed entities, mixed providers, missing registry data,
  ambiguity, timeouts, cancellation, signed-URL expiry, and layout parity.

## [0.9.2] - 2026-09-12

### Fixed

- Move the Ding prompt into the shared centered viewer message area and keep it
  clear of visitor controls on phone and desktop layouts.
- Show a temporary header bell whenever a Ding arrives, but show **Open live
  view** only when Live is not actually running. The action remains available
  when an on-demand Live view is selected but still idle.
- Use one white tone for the normal header controls, leaving amber for the Ding
  bell and red for the active Live indicator.

### Tests

- Add responsive browser coverage for the centered Ding prompt, its placement,
  and its transition into Live.

## [0.9.1] - 2026-09-12

### Added

- Accept either an official Ring Ding event or a Ring-MQTT Ding binary sensor
  for the card's doorbell alert, inferring the correct transition behavior from
  the selected entity domain.

### Tests

- Cover official event semantics and Ring-MQTT `off` to `on` transitions,
  including initial, retained, reset, unavailable, and unsupported states.

## [0.9.0] - 2026-09-12

### Added

- Add an optional Live-only snapshot action to the interactive dashboard card
  and fullscreen viewer, saving timestamped JPEG files through Home Assistant's
  standard `camera.snapshot` action.
- Prefer a configured device snapshot camera, such as Ring-MQTT, and fall back
  to the Live camera when it is available.
- Add a configurable snapshot directory with `/media/ring-view` as the safe,
  Media-browser-friendly default and clear editor guidance for custom paths.

### Changed

- Rename **Viewer behavior** to **Fullscreen viewer** and organize the editor
  around Dashboard card, Fullscreen viewer, Snapshots, and the optional visitor
  features.
- Keep Recording and Live highlights as selected-view markers, including while
  an on-demand card waits for a tap or after recording playback ends.
- Start an idle recording by tapping the unobstructed camera image instead of
  covering it with a large central Play prompt.
- Use one centered viewer status treatment for snapshot, door-action, and Ring
  WebRTC feedback while keeping brief successful actions visible in their own
  controls.

### Fixed

- Keep snapshot feedback clear of the Talk and door controls on iPhone-sized
  layouts.
- Avoid duplicate success messages after a snapshot is saved.

### Documentation

- Add a concise snapshot setup guide and clarify which camera capabilities are
  general Home Assistant behavior and which features are Ring-specific.
- Refresh the README hero and visual-editor screenshots using current real Home
  Assistant captures with clean transparent rounded corners.

### Tests

- Expand unit and browser coverage for snapshot source selection, path safety,
  service failures, status layout, idle view semantics, and responsive controls.

## [0.9.0-beta.7] - 2026-09-12

### Changed

- Route snapshot, door-action, and Ring WebRTC session feedback through one
  shared centered viewer message instead of separate header, bottom-dock, and
  player message treatments.
- Keep the dashboard preview fallback, visual-editor warnings, and ringing
  alert in their own contexts because they are not viewer operation results.
- Preserve brief success feedback in the action itself, including the green
  snapshot icon and green door state, without adding a duplicate message.

### Tests

- Cover centered door failures on phone-sized layouts and common talkback
  session feedback from the external Ring WebRTC controls.
- Pass 147 unit tests and 110 browser tests across desktop and phone projects.

## [0.9.0-beta.6] - 2026-09-12

### Changed

- Show snapshot failures in Ring View's existing centered status layer instead
  of introducing a separate header message style and location.
- Keep the temporary error state below the persistent header and visitor
  controls so camera navigation, Talk, and door access remain available.

### Tests

- Cover reuse of the common state card, exact fullscreen centering, and
  separation from the bottom visitor controls on desktop and phone.

## [0.9.0-beta.5] - 2026-09-12

### Changed

- Use only the brief green icon state for successful snapshots, removing the
  redundant visible confirmation message while preserving the screen-reader
  announcement.
- Keep the compact header message for failures, where explanatory text is
  necessary.

### Tests

- Cover silent visual success feedback and verify that explanatory error text
  remains clear of the bottom action dock on desktop and phone.

## [0.9.0-beta.4] - 2026-09-12

### Fixed

- Replace Home Assistant's bottom snapshot notification with compact success
  or error feedback beside the header icon, preventing it from covering Talk
  and door controls on iPhone.

### Tests

- Cover local success and error feedback, removal of the global notification,
  automatic dismissal, and separation from the bottom action dock on desktop
  and phone.

## [0.9.0-beta.3] - 2026-09-12

### Changed

- Keep the selected Recording or Live view highlighted while an on-demand
  dashboard card waits for a tap, separating view selection from playback
  state consistently.
- Present the editor's primary surfaces first: **Dashboard card** and
  **Fullscreen viewer**, followed by the optional **Snapshots** feature.
- Clarify the on-demand helper text in English and German.

### Tests

- Cover idle selected-view semantics, stable mode labels, and the revised
  editor section order.

## [0.9.0-beta.2] - 2026-09-12

### Changed

- Use the unobstructed camera image as the initial Play surface in both the
  interactive dashboard card and fullscreen viewer when recording autoplay is
  disabled, while preserving keyboard access and an accessible label.
- Document that the mode highlight identifies the selected Recording or Live
  view rather than the media player's current playback state.

### Tests

- Cover the transparent fullscreen recording start surface and confirm that
  the former central Play prompt is absent.

## [0.9.0-beta.1] - 2026-09-12

### Added

- Add an optional camera button while Live is active in the interactive
  dashboard card or fullscreen viewer.
- Save each requested image through Home Assistant's `camera.snapshot` action,
  using the configured device snapshot camera when it is available and the
  official Live camera otherwise.
- Add a configurable save folder with `/media/ring-view` as the protected,
  Media-browser-friendly default, plus editor warnings for public and custom
  locations.
- Show working, success, and actionable failure feedback without adding a
  custom backend automation.

### Changed

- Rename the **Viewer behavior** editor section to **Fullscreen viewer**, making
  its relationship to **Dashboard card** and the scope of its playback options
  explicit.

### Fixed

- Leave both Recording and Live unselected while an interactive card is using
  **No, wait for a tap**, then highlight the mode only after the user starts it.

### Tests

- Cover source selection, path validation, timezone-aware filenames, service
  calls, repeat-click protection, errors, Live-only visibility, idle mode
  styling, and responsive header spacing.

## [0.8.1] - 2026-09-12

### Added

- Add the Ring View project camera-lens icon using its blue,
  charcoal, and white visual identity, with vector and web-ready PNG assets.

### Maintenance

- Verify the active HACS Default submission against the current dashboard
  plugin requirements and confirm that all applicable checks remain green.

## [0.8.0] - 2026-09-12

### Added

- Add an optional last-activity timestamp entity under **Card appearance**,
  showing a compact localized relative time below the camera name or by itself
  at the top left when the name is hidden.
- Accept ISO, Home Assistant input-datetime, and Unix-second or millisecond
  timestamp states, with an exact hover time and fuller screen-reader label.

### Fixed

- Let direct-recording controls fade after a paused or finished video becomes
  idle, while preserving tap-to-resume, tap-to-replay, and keyboard playback.
- Restore an interactive card immediately after returning to its Home Assistant
  dashboard view instead of waiting for the camera entity's next state update.

### Tests

- Cover timestamp parsing, localization, invalid and unavailable values, editor
  placement, name and no-name layouts, responsive widths, and separation from
  every header control on desktop and phone.
- Cover paused and ended recording-control cleanup, interaction delays, stale
  timers, replay-from-start, and desktop and phone playback behavior.
- Cover disconnecting and reinserting the same interactive card without any
  intervening Home Assistant camera-state update.

## [0.7.2] - 2026-09-11

### Fixed

- Keep long camera names clear of the mode switch and header actions at every
  supported card width, truncating the name with an ellipsis when needed.
- Reduce the inline camera-name size to 16px while retaining the 20px
  fullscreen heading.

### Tests

- Cover long camera-name geometry, truncation, control spacing, and font sizes
  across compact and wide dashboard layouts.

## [0.7.1] - 2026-09-11

### Maintenance

- Move the compatibility, testing, and rollback guides into `docs/`, and keep
  generated Playwright output out of version control.

## [0.7.0] - 2026-09-11

### Added

- Add **Control camera in card**, an optional interactive dashboard mode with
  Recording and Live tabs, playback, Talk, configured door access, and an
  explicit fullscreen button.
- Add independent dashboard startup choices to wait for a tap, play the last
  recording, or start Live muted.
- Add a separate **Door control location** choice for keeping door access in the
  fullscreen viewer or also placing it on the dashboard.

### Changed

- Start an on-demand recording by tapping or keyboard-activating the camera
  image, keeping the preview free of a large central Play button.
- Use action-specific **Open when ready** and **Unlock when ready** labels while
  an inline Live connection is starting.
- Keep the Talk and door dock at a consistent, touch-friendly size across card
  widths, with a compact loading layout at the minimum supported 12-column by
  3-row Sections size.

### Safety and lifecycle

- Keep the passive fullscreen-opening card as the default behavior and make all
  dashboard controls explicitly opt-in.
- Require a ready Live picture before enabling Live-only door actions, keep edit
  previews non-interactive, and prevent duplicate cards from opening competing
  Live sessions for the same camera.
- Stop inline media before opening fullscreen and suspend it while the card is
  not visible.

### Documentation

- Reorganize the README around a short setup path, the two dashboard behaviors,
  common configurations, and current visual-editor screenshots.
- Expand the configuration and door-access guides with option comparisons,
  safety guidance, examples, and visitor-control state explanations.

### Tests

- Cover interactive startup, door readiness and placement, fixed control sizing,
  minimum card geometry, inline/fullscreen handoff, duplicate Live sessions,
  and desktop and iPhone layouts.

## [0.7.0-beta.8] - 2026-09-11

### Documentation

- Add a compact README contents section linking directly to setup, dashboard
  behavior, Talk, door access, backend guidance, and notifications.

## [0.7.0-beta.7] - 2026-09-11

### Documentation

- Remove secondary marketing copy that did not help users understand the card.
- Add current visual-editor screenshots to the setup and configuration guides,
  with transparent surroundings that preserve the dialog's clean rounded
  corners on light and dark pages.

## [0.7.0-beta.6] - 2026-09-11

### Documentation

- Simplify the README setup flow around the two dashboard behaviors and three
  common starting points.
- Replace the detailed door-access tables in the README with a short explanation
  of the optional lock action and physical-door contact sensor.
- Move the detailed setting comparison, common configurations, safety guidance,
  and complete YAML examples to the configuration and door-access guides.

## [0.7.0-beta.5] - 2026-09-11

### Changed

- Replace the ambiguous inline **Waiting for Live…** door label with the shorter,
  action-specific **Open when ready** or **Unlock when ready**.
- Keep a more explicit accessible name explaining that the action becomes
  available after the live video connects.

### Documentation

- Update the configuration guide to describe the new ready-state labels.

### Tests

- Cover both the visible label and detailed accessible name for Open and Unlock
  on desktop and iPhone profiles.

## [0.7.0-beta.4] - 2026-09-11

### Fixed

- Keep the inline Live connection status clear of the fixed Talk/door dock at
  short card heights by using a compact horizontal loading layout with reserved
  header and control space.

### Documentation

- Reorganize the README around the dashboard modes and commonly confused
  settings, with a use-case matrix and complete examples for a simple viewer,
  wall tablet, muted Live monitor, and fullscreen-only door access.

### Tests

- Verify at the minimum card height on both desktop and iPhone profiles that
  the connection status ends above the visitor-action dock.

## [0.7.0-beta.3] - 2026-09-11

### Changed

- Restore the established fixed Talk/door button sizing after beta feedback;
  the dock remains responsive through containment and the 44 px touch target.

## [0.7.0-beta.2] - 2026-09-11

### Changed

- Replace the dashboard-door checkbox with a clearer **Door control location**
  choice: fullscreen viewer only, or dashboard and fullscreen.
- Scale the inline Talk/door dock fluidly with card width while preserving a
  44 px minimum touch target and compact icon-only fallback for unusually
  narrow embeds.
- Make 12 columns by 3 rows the minimum Sections layout size in both dashboard
  modes.
- Keep the on-demand recording image unobstructed and start playback by tapping,
  clicking, or keyboard-activating the image instead of showing a central Play
  button.

### Tests

- Cover location validation and editor disclosure, enforced grid minimums,
  image-surface playback, and responsive action-dock geometry.

## [0.7.0-beta.1] - 2026-09-11

### Added

- Add an opt-in **Control camera in card** dashboard mode with Recording/Live
  tabs, playback, Talk, optional door access, and an explicit fullscreen button.
- Add separate dashboard startup choices: wait for a tap, start the last
  recording, or start Live muted by default.
- Add a second explicit opt-in before door access is exposed on the dashboard.

### Safety and lifecycle

- Keep all existing cards on the passive **Open fullscreen viewer** behavior by
  default, and keep edit/configuration previews non-interactive.
- Require a ready Live picture before enabling a Live-only inline door action.
- Stop inline media before opening fullscreen, suspend it while hidden, and
  prevent duplicate inline cards from opening overlapping Live sessions for the
  same camera.
- Keep inline failure states intentionally compact: the existing mode tabs
  replace a duplicate switch button, while unavailable visitor actions hide.

### Tests

- Cover defaults and validation, progressive editor disclosure, on-demand
  startup, door opt-in/readiness, edit-preview safety, duplicate cards, and
  inline/fullscreen session handoff on desktop and phone.

## [0.6.3] - 2026-09-11

### Fixed

- Hide the browser's native video surface while a direct recording is still
  loading, preventing its buffering indicator from appearing underneath Ring
  View's loading spinner.

### Tests

- Verify the pending recording surface stays hidden while the Ring View loader
  remains visible on desktop and phone.

## [0.6.2] - 2026-09-11

### Changed

- Match the visitor-action dock's 6 px horizontal outer inset to the spacing on
  both sides of the divider, improving optical balance without changing the
  compact phone layout.

### Tests

- Verify the combined dock's outer padding and viewport containment on desktop
  and phone.

## [0.6.1] - 2026-09-11

### Changed

- Make the combined Talk/door dock a true segmented control: the sides next to
  the divider are flat while only the two exterior ends remain rounded. A
  balanced gap keeps the divider clear, while a single remaining action
  continues to render as a fully rounded pill.

### Tests

- Verify the combined and single-action corner geometry on desktop and phone.

## [0.6.0] - 2026-09-11

### Added

- Add opt-in door access for a Home Assistant `lock.*` entity, with safe hold
  confirmation, `unlock` or supported latch-opening actions, and configurable
  Live-only or all-view visibility.
- Add an optional binary door-contact sensor. When configured, the icon reflects
  the physical closed, open, or unknown state; an open door replaces the action
  with a disabled **Door open** status.
- Add a unified visitor-action dock that places Talk and door access in one
  balanced control with a subtle divider and automatic single-action fallback.

### Changed

- Promote door access from beta to a stable feature after the `0.6.0` beta
  series, preserving its opt-in configuration and safety defaults.
- Remove the redundant Talk-layout option: Talk and door access merge whenever
  both are available, and the layout collapses automatically otherwise.
- Expand the README and door-access guide with state/icon and configuration
  tables that explain the optional contact sensor and every safety state.

### Tests

- Cover configuration, lock capabilities, physical contact states, state/icon
  transitions, confirmation, service errors, responsive layout, and Talk/door
  integration in 115 unit and 72 desktop/phone browser tests.

## [0.6.0-beta.4] - 2026-09-11

### Changed

- When a door contact sensor is configured, make the door icon reflect the
  physical state: closed door while closed, open door while open, and a warning
  icon when the contact state is unknown. Without a contact sensor, the icon
  continues to represent the configured door action.

## [0.6.0-beta.3] - 2026-09-11

### Added

- Add an optional **Door contact sensor** to Door access. When the configured
  binary sensor reports open, the existing door action becomes a clear,
  disabled **Door open** state until the door closes.
- Add English and German labels, validation, documentation, and editor guidance
  for the optional contact sensor.

### Changed

- Keep the configured Unlock or Open action available when the contact is
  unknown or unavailable, with a subtle **Status unknown** indication. Cards
  without a contact sensor retain their existing behavior.

### Tests

- Cover optional configuration, open, closed, unknown, unavailable, and live
  state changes in unit tests and desktop/phone browser tests.

## [0.6.0-beta.2] - 2026-09-11

### Changed

- Remove the redundant **When Talk is available** setting. Ring View now always
  shows the unified Talk/door dock when Talk is supported and automatically
  collapses to the door-only pill when Talk is disabled or unsupported.

### Tests

- Verify the simpler editor schema, merged supported-camera layout, and automatic
  door-only fallback for unsupported cameras.

## [0.6.0-beta.1] - 2026-09-11

### Added

- Add opt-in door access for a Home Assistant `lock.*` entity, with configurable
  `unlock` or supported `open` actions, Live-only or all-view visibility, and a
  safe 900 ms hold confirmation enabled by default.
- Add a unified visitor-action dock: Talk and door access share one glass control
  with a short divider, while door-only and replace-Talk layouts collapse to a
  balanced single-action pill.
- Add a progressively disclosed **Door access** section to the visual editor,
  lock capability and availability warnings, and English and German feedback.
- Document the complete beta interaction, configuration, accessibility, safety,
  and Home Assistant service contract.

### Changed

- Surface Ring talkback state to the parent viewer so Talk can participate in the
  shared action dock without changing the underlying WebRTC or microphone safety
  behavior.
- Mark hyphenated release tags such as `v0.6.0-beta.1` as GitHub prereleases so
  beta builds are not presented as stable releases.
- Clarify how to distinguish the official Ring Last recording and Live view
  entities when their names or entity-ID suffixes are not reliable.

### Tests

- Cover door defaults and validation, lock capabilities, visual-editor disclosure,
  hold cancellation, single service execution, failure states, visibility, and
  merged/replacement layouts on desktop and phone.

## [0.5.11] - 2026-09-07

### Changed

- Move **Enable two-way audio** from **Doorbell features** to **Viewer behavior**,
  directly below **Start Live muted**, since talkback is useful on cameras without
  a doorbell too. Existing settings, playback, and viewer controls are unchanged.
- This stable release does not include the temporary playback diagnostic panel.

## [0.5.10] - 2026-09-07

### Fixed

- Recognize replacement recording players after returning from the background;
  ignore late playback promises from closed viewers or previous media sessions.
- Release local media immediately and show Live recovery controls even when the
  backend subscription or unsubscribe acknowledgment is still pending.
- Defer WebSocket listener removal until after Home Assistant finishes dispatch,
  without delaying microphone shutdown or skipping another disconnect listener.
- Preserve doorbell alerts' original expiry across card detach/reinsert, and
  avoid opening Live for an expired alert when browser timers were throttled.

### Changed

- Scope recording playback attempts to their video element, consolidate repeated
  attempt resets, and remove the unused initial-mode helper, redundant talk-button
  disabled condition, and unreachable native-audio fallback state/translations.
- Keep native candidate fallback in Home Assistant's camera renderer; retain
  Ring View's actual recording/WebRTC muted-playback fallbacks and bounded recovery.

### Tests

- Reproduce lifecycle failures before fixing them, including delayed recording
  success/rejection, repeated backgrounding, stalled subscription cleanup, and
  doorbell expiry before and after reinsertion.
- Match HA's live-array event dispatch in the browser fixture, and verify Retry,
  advancing video frames, and fresh talk presses while old cleanup is pending.

## [0.5.9] - 2026-09-07

### Changed

- Try one muted automatic Live recovery after a frontend reload, once the page
  is visible and Home Assistant's signaling connection is ready. Keep Resume
  available if the attempt fails or times out, without automatic retry loops.
- Preserve the connected player and its centered Resume control when iOS blocks
  autoplay. Resuming playback does not create another camera session.
- Cancel pending recovery on Close, mode changes, unavailable cameras, or page
  exit. A persisted page-cache return can recover without restoring a talk press.

### Tests

- Reproduce the missing automatic recovery before implementing it, then verify
  moving, muted video after reload in both orientations without any new gesture.
- Cover blocked autoplay, failed automatic connections, manual fallback, hidden
  or offline startup, stale events, listener cleanup, and microphone safety.

## [0.5.8] - 2026-09-07

### Fixed

- Restore Live after a frontend reload with a centered Resume live view button
  over the camera still, without an automatic connection or retry loop.
- Start one fresh Ring session on Resume and keep autoplay rejection separate
  from connection failure: a connected stream can wait for Play without timing out.
- Stop replaying stale WebRTC offers when Home Assistant reconnects, release
  microphone access immediately, and require a new talk press after resuming.
- Show talkback only after playback is ready and keep the Play control reachable
  by keyboard without overlapping loading or error messages.

### Tests

- Reproduce double autoplay rejection, stale session replacement, and reload
  recovery failures before changing the player.
- Add a local camera fixture using real WebRTC peers and advancing video frames
  for browser tests of both orientations, reconnection, and microphone cleanup.
  Home Assistant signaling and the microphone source are simulated; these tests
  do not replace validation with Ring hardware in the iOS Companion app.

## [0.5.7] - 2026-09-07

### Fixed

- Preserve the application-owned camera dialog and its exact media player when
  a responsive Home Assistant layout recreates a matching Ring View card.
- Adopt the replacement card as the dialog's focus target without dispatching
  another `show-dialog` request or restarting video, incoming audio, or
  talkback.
- Keep a restored viewer in one centered reconnecting state while a discarded
  Companion Web View's Ring session closes, then retry with bounded backoff
  without overlapping stale error or talkback controls.

### Tests

- Add deterministic desktop and iPhone/WebKit regressions for card recreation,
  Ring teardown races, and portrait-to-landscape frontend reload recovery.

## [0.5.6] - 2026-09-07

### Fixed

- Restore Ring live video muted after a Companion Web View rebuild so iOS does
  not reject audible autoplay when no fresh tap exists, while normal opens
  continue to follow the configured audio preference.
- Wait for Ring's video track before starting the media element when audio
  arrives first, matching Home Assistant's native camera playback sequence.

## [0.5.5] - 2026-09-07

### Fixed

- Let a discarded Companion Web View release its Ring live session before the
  restored viewer reconnects, then retry once with a short backoff if Ring is
  still finishing the previous session.
- Keep reconnecting, failure, and talkback status surfaces mutually exclusive
  so an error never overlaps a stale Connecting message or disabled talk button.

## [0.5.4] - 2026-09-07

### Fixed

- Restore an open viewer after the iOS Companion app rebuilds its Web View
  during rotation, following Home Assistant's native camera More info pattern.
- Restore the matching camera pair, selected Recording or Live mode, and any
  still-active doorbell notice without reopening a different Ring View card.
- Stop an active talk press, microphone track, and peer connection before the
  old frontend is discarded, then recreate the talkback controls with the new
  live session.
- Remove the recoverable viewer URL state on Close, browser Back, and normal
  navigation so a dismissed camera does not reopen.

### Tests

- Add full frontend-reload regression coverage at iPhone portrait and landscape
  sizes, including the Hold to talk control and URL cleanup.
- Add unit coverage for camera matching, mode and doorbell restoration,
  unavailable-camera errors, and microphone/peer cleanup.

## [0.5.3] - 2026-09-07

### Changed

- Open the camera viewer through Home Assistant's application-level dialog
  manager so responsive dashboard relayouts and card remounts do not interrupt
  an active recording, live view, or talkback session.
- Delegate browser-history ownership to Home Assistant while retaining Ring
  View's focus handling, Escape behavior, visibility safety, and deterministic
  media cleanup.

### Fixed

- Keep the viewer open when a phone or tablet rotates between portrait and
  landscape in a responsive Sections dashboard.
- Continue updating unavailable-camera errors and doorbell alerts after the
  originating dashboard card has been moved or recreated.
- Keep all microphone errors brief by removing the redundant video-connection
  sentence.

### Tests

- Add unit and desktop/mobile browser regression coverage for globally owned
  dialogs, card removal during an active stream, orientation changes, current
  error messages, and final stream cleanup.

## [0.5.2] - 2026-09-07

### Fixed

- Center talkback status messages in portrait and landscape, hide them after the
  same brief interval as the video controls, and shorten the HTTPS notice.

## [0.5.1] - 2026-09-07

### Changed

- Group dashboard image-source settings together in a dedicated visual-editor
  section and reveal the snapshot camera and capture-time fallback only when
  the selected source needs them.

### Fixed

- Show Hold to talk only for a streaming camera from Home Assistant's official
  Ring integration. Unsupported live entities now retain native video and any
  incoming-audio playback instead of mounting a nonfunctional talkback player.
- Keep the HTTPS/talkback status message above the low Hold to talk control on
  portrait phones, including when the message wraps to a second line.
- Explain that two-way audio needs an HTTPS Home Assistant connection while
  leaving video connected on an HTTP internal connection.

### Documentation

- Clarify that Companion apps using an HTTP internal URL on home Wi-Fi must use
  an HTTPS internal URL or the HTTPS Home Assistant Cloud connection for
  talkback.
- Clarify that talkback requires the official Ring `live_view` entity;
  Ring-MQTT can provide the optional snapshot but its RTSP camera path does not
  carry Ring View's microphone audio back to the doorbell.

### Tests

- Add regression coverage for the insecure-connection explanation and for
  keeping the portrait status message clear of the talkback control.
- Add visual-editor coverage for the progressive dashboard-preview fields.
- Add editor, unit, and desktop/mobile browser coverage for official-Ring
  talkback capability detection and unsupported-camera fallback.

## [0.5.0] - 2026-09-06

### Added

- Add an optional device snapshot camera for Ring-MQTT and other integrations.
- Add dashboard preview choices for the device snapshot and the newest snapshot
  or recording, with a configurable fallback when capture times cannot be
  compared.
- Read Ring-MQTT's explicit snapshot `timestamp`, recognize other explicit
  capture-time attributes, and follow snapshot timestamp or recording ID
  changes received while the dashboard is open. The viewer remains limited to
  the existing Recording and Live modes.

### Fixed

- Keep the camera viewer at full viewport height on short landscape phones so
  the media no longer collapses to a thin line.
- Move Hold to talk closer to the video edge on desktop and mobile, without
  applying portrait phone safe-area padding to a centered media frame.

### Tests

- Make the orientation regression test assert that the camera renderer and a
  meaningfully sized media frame remain visible, in addition to checking the
  controls.
- Add timestamp parsing, fallback, availability, source-switching, two-mode
  viewer, and talkback-position coverage.

## [0.4.5] - 2026-09-06

### Fixed

- Make the MIT license badge and its link render reliably in the HACS
  repository preview by serving both from absolute repository URLs.

## [0.4.4] - 2026-09-06

### Fixed

- Make the documentation images render in the HACS repository preview by using
  absolute GitHub image URLs.

### Changed

- Build every GitHub release description from its matching changelog section
  so the release explains what changed instead of only linking to a comparison.

## [0.4.3] - 2026-09-06

### Changed

- Lower the hold-to-talk control toward the otherwise unused center of the
  native media bar while preserving mobile safe-area clearance.

## [0.4.2] - 2026-09-06

### Documentation

- Remove the built-in outer gutter from the visual configuration screenshot so
  it uses the same full content width as the surrounding configuration text.
- Give the lead viewer screenshot consistent rounded corners, a subtle neutral
  shadow, and true transparency without the previous colored edge fringe.

## [0.4.1] - 2026-09-06

### Documentation

- Update the lead viewer image with the released hold-to-talk control and a
  matching set of mode and audio callouts.
- Restore the visual configuration screenshot with the current grouped editor,
  two-way audio switch, doorbell event picker, and dashboard preview.
- Tighten the opening description to focus on the unified Ring camera
  experience.

## [0.4.0] - 2026-09-06

### Added

- Add optional two-way audio that keeps live video, incoming audio, and
  push-to-talk on one WebRTC session through Home Assistant's official Ring
  live-view entity.
- Insert microphone audio into the existing connection only after explicit
  permission, without sending a second offer or restarting video.
- Add an optional doorbell event entity that displays an incoming-ring alert
  without starting or replacing the camera stream.
- Add a native Home Assistant notification blueprint for immediate doorbell
  alerts, one-tap Ring View access, duplicate suppression, and a recording
  preview update when Ring finishes processing the new clip.

### Safety

- Keep video connected if microphone permission or track insertion fails.
- Stop microphone transmission on pointer cancellation, focus loss, or when the
  page becomes hidden.
- Let temporary WebRTC disconnections recover without deliberately replacing
  the session.

### Changed

- Replace the separate microphone activation step with one hold-to-talk
  control that requests permission on the first hold.
- Hide the persistent connected status pill so it does not cover the camera
  timestamp; retain status messages for connection progress and problems.
- Promote two-way audio and doorbell awareness from the beta card namespace to
  the standard `custom:ring-view` card and visual editor.

### Documentation

- Document the stable Doorbell features editor group, hold-to-talk behavior,
  complete YAML options, and one-click notification blueprint import.
- Remove the outdated visual-editor screenshot that predated the new group.

## [0.3.7] - 2026-09-06

### Documentation

- Add camera-surveillance privacy and legal guidance, including a reference to
  the European Data Protection Board's video-device guidelines.

## [0.3.6] - 2026-09-06

### Changed

- Remove the redundant view-mode icon from configured dashboard cards and
  remove its visual-editor option; mode switching remains in the detail viewer.

### Documentation

- Use the approved annotated real-camera viewer image in the README.
- Replace the configuration reference image with a clean, transparent rounded
  crop and a current dashboard preview without the removed mode icon.

## [0.3.5] - 2026-09-06

### Changed

- Use the bundled synthetic entrance scene in Home Assistant's card picker so
  opening the catalog never displays or requests a user's camera image.
- Remove the view-mode icon from the picker preview, where it is neither a
  status nor an available action.
- Keep configured dashboard cards on their selected real camera preview,
  including while editing a dashboard.
- Remove the demo-only Live label so the synthetic preview matches the real
  dashboard card more faithfully.

### Documentation

- Replace the private-camera screenshot gallery with one privacy-safe,
  annotated synthetic viewer guide using precisely aligned callouts.
- Add a contents list and identify which configuration options are available
  in Ring View's Config tab, Home Assistant's Layout tab, or handled
  automatically.

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
