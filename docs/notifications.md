# Doorbell alerts and phone notifications

[← Ring View](../README.md)

## Alerts inside the card

In the visual editor, open **Doorbell features** and select your Ring Ding
event entity, for example `event.front_door_ding`.

A fresh `ring` event displays **Someone is at the door** for twelve seconds.
Tapping the card during that alert opens Live. An already active Live session
is left untouched. The alert expires from the original event time; rebuilding
the card does not restart its twelve-second lifetime.

## Phone notifications, even when the dashboard is closed

A dashboard card cannot reliably notify your phone while the dashboard is
closed. The included
[Ring View doorbell notification blueprint](../blueprints/automation/ring_view/doorbell_notification.yaml)
runs in Home Assistant instead.

[![Import the Ring View doorbell notification blueprint.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https://github.com/thomasgregg/ring-view/blob/main/blueprints/automation/ring_view/doorbell_notification.yaml)

### Setup

1. Import the blueprint and create an automation from it.
2. Select the Ring **Ding event entity** and the matching **last-recording
   camera**.
3. Choose the phone registered with the Home Assistant **Companion app**.
4. Set **Dashboard path** to the actual view containing your Ring View card,
   such as `/lovelace/entrance`. Replace the example/test path; the blueprint
   does not create or configure a dashboard for you.
5. Save, then test with a real doorbell press. Confirm phone notification
   permission is enabled.

### What happens

- A Ring Ding event sends an immediate **Someone is at the door** notification.
- Tapping it opens the configured Home Assistant dashboard, not a guaranteed
  automatically opened Live viewer.
- The automation waits up to **two minutes** for the recording camera's
  `last_video_id` to change.
- When the recording is ready, it updates the same tagged notification with a
  recording preview. No extra Ring live session is started.
- If no new recording appears within two minutes, the immediate notification
  remains; there is no preview update.
- Another ring restarts the wait. The shared notification tag updates the same
  alert rather than creating a separate notification for every stage.

The blueprint requires Home Assistant **2026.7 or newer**, a Ring recording
entity with `last_video_id`, and a working Companion app notification device.
The optional backend patch is not required for this automation.

On some newer wired Ring cameras using 24/7 recording, an
[upstream Home Assistant issue](https://github.com/home-assistant/core/issues/176299)
can leave the recording entity's `last_video_id` stuck on an old event. The
immediate doorbell notification still arrives, but the blueprint cannot detect
a new recording and therefore leaves the notification without a recording
preview after the two-minute wait. The issue reporter found that disabling
24/7 recording and using periodic snapshots restored recording updates.

## Build on the same Ring event

You can use the doorbell event in additional Home Assistant automations to:

- Turn on an entrance light after dark.
- Announce a visitor on a speaker.
- Choose different notification behavior depending on who is home.

These are extension ideas; the shipped blueprint does not control lights,
speakers, or presence logic. Keep those actions explicit in your own
automations. Neither the blueprint nor a notification grants microphone
permission or starts transmitting audio.

[Card configuration](configuration.md) · [Talkback help](playback-and-troubleshooting.md)
