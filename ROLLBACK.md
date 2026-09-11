# Rollback procedure

The card does not modify entities or Home Assistant backend state, so rollback affects only the frontend resource and dashboard YAML.

## HACS installation

1. Open HACS → Frontend → Ring View.
2. Choose **Redownload** and select the previously working release.
3. Refresh Home Assistant with cache bypass, or restart the Companion app.
4. Confirm the resource still points to `/hacsfiles/ring-view/ring-view.js`.

For the `0.7.0-beta.1` interactive-dashboard trial, select `v0.6.3` as the
previously working release. The beta defaults to the stable passive behavior,
and `v0.6.3` simply ignores the four new top-level dashboard options if they are
still present in YAML. No entity or backend state is changed.

## Manual installation

1. Replace `<config>/www/ring-view.js` with the bundle from the previously working release.
2. Keep the same resource URL and refresh with cache bypass. If necessary, append a temporary version query such as `?v=0.1.0` to the resource URL.

## Return to native cards

If no custom-card version is suitable, remove the test card from the dashboard and restore the pre-existing Home Assistant `picture-entity` recording card and live tile. Remove the JavaScript resource only after no dashboard references `custom:ring-view`.

During initial rollout, do not replace the existing native cards until recording playback, live startup, and live-session teardown have been verified on the target Home Assistant installation.
