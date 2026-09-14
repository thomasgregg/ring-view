# Doorbell alerts and phone notifications

[← Ring View](../README.md)

## Alerts inside the card

In the visual editor, open **Doorbell features** and select either your official
Ring Ding event entity, for example `event.front_door_ding`, or a Ring-MQTT Ding
binary sensor such as `binary_sensor.front_door_ding`.

A fresh `ring` event, an `off` to `on` Ding transition, or a newer Ring-MQTT
Ding timestamp while the sensor remains `on` displays the bell alert for
twelve seconds. If Live is not running, Ring View also offers **Open live
view** in the shared centered message area. An already active Live session
is left untouched. The alert expires from the original event time; rebuilding
the card does not restart its twelve-second lifetime.

## Phone notifications, even when the dashboard is closed

A dashboard card cannot reliably notify your phone while the dashboard is
closed. The included
[Ring View doorbell notification blueprint](../blueprints/automation/ring_view/doorbell_notification.yaml)
runs in Home Assistant instead.

[![Import the Ring View doorbell notification blueprint.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https://github.com/thomasgregg/ring-view/blob/main/blueprints/automation/ring_view/doorbell_notification.yaml)

### Setup

1. Import the blueprint and create an automation from it. If it is already
   installed, import it again and choose **Overwrite**; existing automations
   keep their configured inputs.
2. Under **Ring View sources**, select:

   - For official Ring: the **Ding event** and matching **Last recording**
     camera.
   - For Ring-MQTT: the **Ding binary sensor** and matching **Snapshot** camera.

3. For Ring-MQTT, set the camera's **Snapshot Mode** to an option that includes
   **Ding**. Choose **Interval + Ding** if you also want periodic dashboard
   images.
4. Choose the phone registered with the Home Assistant **Companion app**.
5. Set **Dashboard path** to the actual view containing your Ring View card,
   such as `/lovelace/entrance`. Replace the example/test path; the blueprint
   does not create or configure a dashboard for you.
6. If iOS shows an attachment-error thumbnail, set **External image address**
   to the full HTTPS address used to reach Home Assistant remotely, for example
   `https://example.ui.nabu.casa`. Ring View then saves the fresh frame under
   `/config/www` and gives iOS an absolute `/local/...` image URL. Leave this
   field empty when authenticated camera-proxy thumbnails already work.
7. Save, then test with a real doorbell press. Confirm phone notification
   permission is enabled.

### What happens

- An official Ring or Ring-MQTT Ding sends an immediate **Someone is at the
  door** notification. Repeated Ring-MQTT presses are detected even while its
  Ding sensor remains `on`.
- Tapping it opens the configured Home Assistant dashboard, not a guaranteed
  automatically opened Live viewer.
- The automation waits up to **two minutes** for a new official recording ID or
  a newer Ring-MQTT Ding snapshot timestamp.
- When the chosen preview camera updates, the automation updates the same
  tagged notification with its fresh image. No extra Ring live session is
  started.
- By default the preview uses Home Assistant's authenticated camera proxy. If
  **External image address** is configured, the blueprint instead writes one
  current JPEG per selected camera to `/config/www` and sends its absolute
  HTTPS `/local/...` URL. This works around iOS notification-extension setups
  that can open the expanded camera view but cannot resolve an authenticated or
  relative compact thumbnail.
- If the camera does not publish a new image within two minutes, the immediate
  notification remains unchanged; an older image is never attached as if it
  were current.
- Another ring restarts the wait. The shared notification tag updates the same
  alert rather than creating a separate notification for every stage.

The blueprint requires Home Assistant **2026.7 or newer**, a supported Ding
entity, a camera preview entity, and a working Companion app notification
device. The optional backend patch is not required for this automation.

Ring-MQTT snapshot timing depends on the camera and its **Snapshot Mode**. For
the most useful doorbell preview, choose a mode that includes Ding snapshots.
Low-power cameras may not always produce a snapshot while recording; in that
case the immediate alert still arrives and the blueprint safely leaves it
without a stale preview.

### Public-snapshot privacy

The optional external-image method deliberately stores the latest notification
preview in `/config/www`. Home Assistant serves that file without
authentication. Its camera-derived filename is stable and the next successful
doorbell notification overwrites it; it is not automatically deleted. Use this
option only when you accept that anyone who learns the full URL can view the
latest saved frame. Clearing **External image address** returns the blueprint to
the authenticated camera-proxy method, but does not remove an existing file
from `/config/www`.

On some newer wired Ring cameras using 24/7 recording, an
[upstream Home Assistant issue](https://github.com/home-assistant/core/issues/176299)
can leave the recording entity's `last_video_id` stuck on an old event. The
immediate doorbell notification still arrives, but the blueprint cannot detect
a new recording and therefore leaves the notification without a recording
preview after the two-minute wait. The issue reporter found that disabling
24/7 recording and using periodic snapshots restored recording updates.

## Build on the same doorbell signal

You can use the doorbell signal in additional Home Assistant automations to:

- Turn on an entrance light after dark.
- Announce a visitor on a speaker.
- Choose different notification behavior depending on who is home.

These are extension ideas; the shipped blueprint does not control lights,
speakers, or presence logic. Keep those actions explicit in your own
automations. Neither the blueprint nor a notification grants microphone
permission or starts transmitting audio.

[Card configuration](configuration.md) · [Talkback help](playback-and-troubleshooting.md)
