# Security, privacy, and accessibility

[← Ring View](../README.md)

## Themes, languages, and accessibility

Ring View uses Home Assistant theme variables instead of fixed light or dark surfaces, so it follows the active dashboard theme. English and German are included throughout the editor, tooltips, viewer states, warnings, and accessibility announcements. Regional variants such as `de-DE`, `de-AT`, and `de-CH` use German; unsupported languages fall back to English.

The card supports keyboard activation, Escape to close, focus trapping and restoration, screen-reader status messages, visible focus treatment, responsive phone and tablet layouts, and device safe areas.

## Security and privacy

- Ring View communicates only with Home Assistant-provided entities, endpoints, and frontend components.
- It includes no Ring authentication, direct Ring requests, external scripts, remote fonts, telemetry, or analytics.
- Camera tokens, authenticated URLs, and `video_url` values are never copied into configuration, browser storage, or logs.
- Microphone access is requested only after the user presses **Hold to talk**.
  The track remains muted whenever the button is not actively held.
- The optional remembered view stores only the selected mode for that entity pair in the local browser.

## A note on privacy & legality

Camera surveillance is regulated differently around the world. In many countries (including Germany and much of the EU), **recording public streets, sidewalks, or your neighbor's property may be restricted or unlawful**—home-camera use that extends even partially into a public space or neighboring property can fall outside the GDPR's household exemption. Before positioning a camera, check your local laws, use privacy zones or masking where your camera or platform supports them, and be transparent with visitors where required. Ring View only displays what the Ring integration makes available through Home Assistant—the legal responsibility for how your camera is positioned and what it records remains with you. See the [European Data Protection Board's video-device guidelines](https://www.edpb.europa.eu/documents/guideline/guidelines-32019-on-processing-of-personal-data-through-video-devices_en) for further guidance.
