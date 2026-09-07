# Optional temporary Ring backend patch

[← Ring View](../README.md)

## Do I need another integration?

No. Ring View's recording, Live, and supported two-way audio features use the
official Home Assistant Ring integration. The card adds no Ring login of its
own. You can use it without the patch.

The separate [Ring WebRTC Backend Patch](https://github.com/thomasgregg/ring-webrtc-backend-patch)
is a temporary workaround for a specific session-cleanup defect in the
`ring-doorbell` library used by Home Assistant. It runs **alongside** the
built-in Ring integration; it does not replace it, create new camera entities,
or take over authentication.

## What problem does it address?

When Ring closes a WebRTC session, the library's reader task can enter cleanup
and try to await itself. Python rejects that with
`RuntimeError: Task cannot await on itself`. Cleanup then exits prematurely,
and a later Live connection may fail or take longer to recover.

This can be exposed by closing/reopening Live, reconnecting, or an iOS
Companion Web View reload during rotation. Rotation is a trigger in some
setups—not the underlying library defect.

The patch guards against that self-await. It does not change media negotiation,
camera credentials, or the dashboard. Version **0.1.1** deliberately supports
only **ring-doorbell 0.9.14** and checks the method signature before patching;
it will not silently patch an unknown library version.

## With and without the patch

- **Without it:** use Ring View normally. The backend defect may still affect
  repeated Live sessions; not every playback failure is caused by this defect.
- **With it:** the same features and entity IDs remain available, with the
  guarded cleanup on a supported backend version.
- **Either way:** HTTPS and microphone permission are required for talkback.
  iOS autoplay restrictions, including Low Power Mode, can still require a
  manual Play/Resume tap. Network problems, Ring outages, camera session limits,
  and competing clients remain possible.

For installation, compatibility checks, diagnostics, and removal instructions,
use the [patch repository's guide](https://github.com/thomasgregg/ring-webrtc-backend-patch#readme).
Keep its release separate from the Ring View card release.

## Upstream status and retirement

Status checked **7 September 2026**:

- The Ring library already has a proposed self-await fix:
  [python-ring-doorbell PR #534](https://github.com/python-ring-doorbell/python-ring-doorbell/pull/534).
- The error is also reported in
  [issue #554](https://github.com/python-ring-doorbell/python-ring-doorbell/issues/554).
- Home Assistant's [Ring integration manifest](https://github.com/home-assistant/core/blob/dev/homeassistant/components/ring/manifest.json)
  still pins `ring-doorbell==0.9.14`.

The intended permanent route is **library fix → library release → Home
Assistant dependency update**. A merged library PR alone does not update an
existing Home Assistant installation.

Once a Home Assistant release includes the corrected dependency, follow the
patch repository's removal instructions and verify normal Live/reconnect
behavior without the patch. Do not assume a particular future Home Assistant
version is fixed until its dependency and release notes confirm it.

[iPhone and playback troubleshooting](playback-and-troubleshooting.md)
