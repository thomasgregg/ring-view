# Playback, talkback, and troubleshooting

[← Ring View](../README.md)

## Preview and playback

The dashboard shows one authenticated still image from Home Assistant's camera
proxy. It sizes the image request to the card and screen pixel density,
refreshes every ten seconds while visible, and reacts to meaningful layout
changes. It does not mount a live player or preconnect a live session.

Inside the viewer, the latest recording starts automatically unless
`autoplay_recording` is disabled. Live begins when the viewer opens in Live or
you select Live. Only the active mode's renderer remains mounted.

For recordings, Ring View uses the current ephemeral `video_url` when
available, with Home Assistant's camera renderer as the alternative if it is
missing or fails. Normal Live uses Home Assistant's camera renderer and its
WebRTC/HLS/MJPEG selection. Enabling supported two-way audio uses Ring View's
single-session WebRTC player for Live instead.

Home Assistant's application-level dialog manager owns the viewer and its
history entry, independently of responsive dashboard card rearrangements.
Closing, switching modes, or going Back tears down the inactive media.
Hidden tabs suspend native playback and immediately stop active talkback.

## Listen and Hold to talk

Enable **Doorbell features → Two-way audio** in the visual editor. The live
entity must be the official Ring `live_view` camera, not an RTSP entity from
Ring-MQTT or Generic Camera. Ring-MQTT can still supply the optional dashboard
snapshot alongside the official live entity.

Live video and incoming audio connect without opening the microphone.
**Hold to talk** appears once playback and the connection are ready. Pressing
it requests microphone permission when needed and adds the track to the
existing session. Audio is transmitted only while you hold the button.

If the permission prompt interrupts the first hold, release and hold again
after granting access. Closing, reconnecting, or leaving the page releases the
microphone; recovery never restores a held talk button.

An unsupported live camera produces an editor warning and uses Home
Assistant's normal player without **Hold to talk**.

### “Microphone access requires HTTPS”

Use an HTTPS Home Assistant connection. A Companion app can switch to an HTTP
internal URL on home Wi-Fi, which blocks browser microphone access even while
video works. An HTTPS internal URL or HTTPS Home Assistant Cloud connection
avoids that mismatch. Also check the app/browser microphone permission.

## iPhone rotation and Resume

A dashboard relayout should leave the viewer open. Some iOS Companion setups
instead rebuild the Web View when orientation changes; the brief Home
Assistant logo is a useful sign of that reload.

Ring View puts the active camera pair and mode in the current URL, following
Home Assistant's camera-dialog restoration convention. A matching card can
reopen the viewer after the reload. Credentials, media URLs, and microphone
state are not stored there.

A restored Live viewer makes **one automatic, muted connection attempt** once
the page is visible and Home Assistant is connected. Use the video control to
enable sound afterward. If automatic recovery fails, a centered **Resume live
view** button provides a manual attempt; Ring View does not retry forever.

If video is connected but iOS blocks playback, Play/Resume starts the existing
stream instead of opening another camera session. **Low Power Mode can require
this manual tap**. Turning it off resolved that case in our iPhone testing,
but browser autoplay policy can still require interaction in other conditions.
The temporary backend patch does not bypass this restriction.

## Connection failures

| What you see | What to check |
| --- | --- |
| Play/Resume over an otherwise connected stream | Browser autoplay policy; on iPhone, check Low Power Mode. Tap once to start playback. |
| Reconnecting, followed by Retry/error | Check Home Assistant connectivity and Ring Live availability. Repeated failures after session teardown can match the [known backend defect](backend-patch.md). |
| Hold to talk is unavailable | Wait for playback; confirm the official Ring live entity, HTTPS, and microphone permission. |
| Missing/unavailable camera | Check the configured entity IDs and enable the recording entity in the Ring device if needed. |
| Last recording remains on an old clip | On some newer wired Ring cameras, 24/7 recording can leave Home Assistant's `last_recording` entity stuck on an old event. This is an [upstream Home Assistant issue](https://github.com/home-assistant/core/issues/176299), not a Ring View cache: the card's preview and Last recording view can update only when Home Assistant supplies a new `last_video_id` or `video_url`. The issue reporter found that disabling 24/7 recording and using periodic snapshots restored updates. Live view, talkback, and Ding alerts use separate entities and remain available. |
| Old card behavior after updating | Confirm the installed HACS version and refresh the frontend. In the iOS Companion app, **Clear Web View Cache** may be necessary. |
| No new phone preview | Check the blueprint's selected recording entity and whether a new `last_video_id` appeared within two minutes. See [notifications](notifications.md). |

A live attempt times out after **20 seconds**. Normal opens can retry once;
a failed automatic recovery offers Resume, and a failed manual attempt offers
Retry. Waiting for Resume or blocked playback does not run this timer.

If Home Assistant's signaling connection is lost, the two-way player waits
for Resume instead of replaying an old offer against a negotiated peer.
Temporary WebRTC disconnections allow browser recovery, but Ring outages,
network loss, device session limits, browser suspension, and competing Ring
clients can still interrupt Live.

If the native camera component cannot be loaded, Live offers Home Assistant's
standard camera dialog as a compatibility fallback.

## Reporting an issue

Include Ring View and Home Assistant versions, browser/Companion app and OS,
whether two-way audio and the backend patch are enabled, and exact steps.
For rotation, say whether the HA logo appeared, whether video moved before
rotation, what appeared afterward, whether Play/Resume worked, and roughly how
long recovery took. Note Low Power Mode and whether your connection uses HTTPS.

Do not post camera tokens, signed media URLs, Ring credentials, or raw debug
logs that may contain them. Automated browser coverage does not replace a
physical-device test; see [testing scope](../TESTING.md).

[Configuration](configuration.md) · [Compatibility details](../COMPATIBILITY.md) · [Security and privacy](privacy-and-accessibility.md)
