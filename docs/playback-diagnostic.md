# Temporary playback diagnostic (v0.5.11-diagnostic.2)

This prerelease collects evidence; it does not fix or redesign playback.
The stable release remains v0.5.10. Diagnostics are inactive until **Start test**.

## iPhone test

1. Refresh the test dashboard and verify the panel says `0.5.11-diagnostic.2`.
2. Press **Start test**, open the card, then select the clock / **Last recording**.
3. Wait for the problem, then tap the picture once.
4. Close with X, press **Copy report**, and share the report together with what appeared.

Do not rotate/reload during this test: a new page loses its in-memory report.
Collection stops after two minutes, keeps at most 200 events and performs at most
50 source observations. No network requests, media downloads or backend changes
are performed by the diagnostic. Redownload diagnostic.1 to roll this update back.

## Reading the report

- `test-start.epochMs`: device-clock time for correlating backend history.
- `recording-source`: source relationships and media state captured synchronously,
  including **before** an error handler removes the MP4 player.
- `source-fingerprints`: asynchronous hashes joined by `observation`; `observedMs`
  is the original capture time, not when hashing finished. If hashing is unavailable,
  `fingerprintsAvailable` is false. Work finishing after Stop is discarded.
- `currentSourceFingerprint`: the browser's `currentSrc` (may be empty before selection).
- `assignedSourceFingerprint`: the video element's `src` attribute.
- `entitySourceFingerprint` / `entityRecordingFingerprint`: HA's **current** URL/ID
  at observation time. These do not assert that an older video belongs to that ID.
- `assignedMatchesEntity` / `currentMatchesAssigned`: exact nonempty string equality,
  including query parameters. Relative-vs-absolute URLs can also produce false.
- `linkAgeSeconds` / `linkRemainingSeconds`: from `X-Amz-Date` and `X-Amz-Expires`
  on `currentSrc`, or assigned `src` if selection is empty. Missing/malformed,
  duplicated, relative or unsupported metadata remains unknown (fields absent).
  Negative age means the signing time is ahead of the device clock. Nominal expiry
  **does not prove** a server rejected the link; clock skew matters.
- `recording-fallback` with media error 4 means source loading failed, not a proven
  codec or network cause. `controls=true` cannot establish native controls are
  visible/tappable. The diagnostic cannot inspect closed browser control internals.

## Matching backend evidence safely

Read only the recording camera's state/history for the test time. Keep raw URLs and
IDs private and in memory. Use the following exact UTF-8 SHA-256 inputs (lowercase,
64-character hexadecimal output), matching `src/diagnostics/source.ts`:

```text
ring-view-diagnostic-v2:source:<URL.origin><URL.pathname>
ring-view-diagnostic-v2:recording:<last_video_id as an exact string>
```

Use the WHATWG URL parser. Only absolute HTTP(S) sources are supported. Omit URL
credentials, query and fragment. Reject unsafe numeric recording IDs rather than
rounding them. Source hashes match a canonical path, **not the media bytes** and
not an exact signed link. Query renewal can keep the same fingerprint while
equality flags and link timing change. Two matching hashes do not prove identical
media content. Recording hashes are pseudonymous, not an anonymization guarantee
for a party that already knows candidate IDs.

Match history to the failed **selected** source, or assigned source if no selection
exists; do not simply download the newest recording. First check whether the exact
candidate's link remains available. If expired/unavailable, say so and capture a
fresh matched failure instead of substituting a different recording or bypassing
link authorization. Separately compare browser playback of those same bytes.

The capture root follows Lit's connection lifecycle, allowing HA's first
`showDialog`-before-append ordering. Root capture sees MP4 events and composed
events; non-composed events inside HA's nested shadow roots may remain invisible,
although periodic viewer-state sampling still observes accessible media elements.

No raw URLs, entity IDs, recording IDs, error messages or media enter the report.
Only fingerprints, known enum values and bounded numeric/boolean telemetry are
reported. The diagnostic does not persist data or send it anywhere automatically.
