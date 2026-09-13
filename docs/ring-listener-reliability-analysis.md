# Ring realtime-event failure: deep code and test analysis

Date: 2026-09-12  
System examined: Home Assistant Core 2026.9.2 on HAOS 18.2, Python 3.14.6, arm64  
Primary symptom: the official Ring app reports a physical doorbell press, while Home Assistant receives no Ding event and the Ring View automation does not run

## Executive conclusion

The card and automation are using the correct Home Assistant entities. The failure occurs earlier, in the backend push-notification path, before Home Assistant can produce an event for either the card or the automation.

The direct failure is an application-level rejection from Google's legacy GCM registration endpoint:

```text
Error=PHONE_REGISTRATION_ERROR
```

The request reached Google and received a parsed response, so this is not consistent with a simple DNS, firewall, or TCP-connectivity failure. It also occurs before the library subscribes the resulting push token with Ring, so changing the doorbell entity, camera entity, external chime, card configuration, or automation trigger cannot repair it.

The underlying Google-side reason cannot be proven from the returned error alone. The strongest defensible statement is that Google is rejecting the synthetic Android/GCM registration identity used by `firebase-messaging`. Google's Android SDK team has associated a similarly named error with duplicated Firebase installation identities, but that report concerns the official Android SDK and a later Firebase Installation stage. Our failure occurs at the older `c2dm/register3` GCM stage, so that explanation is a useful clue, not a confirmed diagnosis. [Google Firebase Android issue #7025](https://github.com/firebase/firebase-android-sdk/issues/7025)

Three implementation weaknesses turn that external rejection into a persistent Home Assistant outage:

1. `firebase-messaging` retries a terminal-looking `PHONE_REGISTRATION_ERROR` with the same identity, then converts it into a generic `RuntimeError`. It does not preserve enough structured error information for a caller to apply an appropriate recovery policy.
2. `python-ring-doorbell` does not have a reliable listener lifecycle. It can claim to be started before the FCM socket has logged in, remain started after the receiver dies, leak callbacks/tasks across retries, and fail to clean up a partially initialized receiver.
3. Home Assistant starts the Ring listener once. An exception ends that task with no retry or health monitor. Reauthentication and reconfiguration also replace the config-entry data without carrying forward the saved FCM credentials, forcing a new Google registration.

This explains all observed behavior, including why the official Ring app still works: it has its own independent, official push registration. Its notification proves the physical doorbell and Ring cloud event are working; it does not prove Home Assistant's separate unofficial push receiver is registered.

## Confidence assessment

| Conclusion | Confidence | Basis |
|---|---:|---|
| The Ring View card and automation entity mapping is correct | High | `event.front_door_ding`, `camera.front_door`, and `camera.front_door_live_view` match the loaded Ring device and the simulated Ding event exercised the UI path. |
| The physical Ding is lost before Home Assistant's event entity | Very high | A real press reaches the official Ring app, while HA's listener never reaches its “started” log and the Ding entity remains unavailable. |
| The immediate failure is Google registration, not Ring account authentication | Very high | Four controlled HA listener starts returned `PHONE_REGISTRATION_ERROR` during GCM registration; Ring devices and cameras loaded successfully. |
| Removing Ring authorized devices can fix this specific state | Low | A full cleanup and reconfiguration produced one clean Ring authorized device but the same Google rejection. The failing identity belongs to the Google push path, not the Ring account-device list. |
| Duplicate Firebase installation ID is the exact Google-side cause | Low to medium | Google documents that cause for an official Android SDK case, but our rejection is at a different protocol stage and fresh identities were also rejected. |
| The libraries need lifecycle and recovery changes even if Google later accepts registration | Very high | Reproduced by focused tests and independently reported upstream. |

## End-to-end failure chain

```text
physical button
  -> Ring cloud event                         works (official app receives it)
  -> Google push registration for HA client  FAILS: PHONE_REGISTRATION_ERROR
  -> Ring push-token subscription             never reached
  -> FCM/MCS socket login                      never reached
  -> python-ring-doorbell callback             never called
  -> HA event.front_door_ding                  remains unavailable / unchanged
  -> Ring View automation and card             have nothing to react to
```

The Ring project explicitly uses Firebase Cloud Messaging for realtime Ding and motion delivery; this is separate from its ordinary REST polling path. [Ring notification architecture and troubleshooting](https://github.com/dgreif/ring/wiki/Notification-Troubleshooting)

## Exact versions and source examined

The analysis used immutable releases corresponding to the live Home Assistant installation:

| Component | Version / commit | Relevant source |
|---|---|---|
| Home Assistant Core | `2026.9.2`, `33c3e0cca60e73a8c4970ee677d75b8bc6464cdf` | [Ring manifest](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/ring/manifest.json), [coordinator](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/ring/coordinator.py), [config flow](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/ring/config_flow.py), [event entity](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/ring/event.py) |
| `ring-doorbell` | `0.9.14`, `28fd01c47130350614d555b3b4e360aa9a9e4c71` | [event listener](https://github.com/python-ring-doorbell/python-ring-doorbell/blob/0.9.14/ring_doorbell/listen/eventlistener.py) |
| `firebase-messaging` | `0.4.5`, `61231a66625ba9e16c7fb385071b27984b021290` | [registration](https://github.com/sdb9696/firebase-messaging/blob/0.4.5/firebase_messaging/fcmregister.py), [push client](https://github.com/sdb9696/firebase-messaging/blob/0.4.5/firebase_messaging/fcmpushclient.py) |

Home Assistant 2026.9.2 pins `ring-doorbell==0.9.14` and `aiohttp==3.14.3`. The latest upstream branches were also checked on 2026-09-12. The important behavior is still present: current `firebase-messaging` increases GCM attempts from two to four but still repeats the same request; current `python-ring-doorbell` still uses the stale `started` boolean and immediate-return receiver start; current HA still has the one-shot listener start and data replacement in reauth/reconfigure. [Current firebase registration source](https://github.com/sdb9696/firebase-messaging/blob/main/firebase_messaging/fcmregister.py), [current Ring listener](https://github.com/python-ring-doorbell/python-ring-doorbell/blob/master/ring_doorbell/listen/eventlistener.py), [current HA Ring coordinator](https://github.com/home-assistant/core/blob/dev/homeassistant/components/ring/coordinator.py), [current HA Ring config flow](https://github.com/home-assistant/core/blob/dev/homeassistant/components/ring/config_flow.py)

## Live-system evidence

The account and integration were deliberately normalized before drawing a code conclusion:

- The Ring integration was disabled while the old authorized-device backlog was removed.
- Reconfiguration created a single fresh `ring-doorbell:HomeAssistant/ring-integration` authorized device.
- Ring's normal API path loaded devices and cameras correctly after reconfiguration.
- Listener startup attempts at approximately 14:30, 14:32, 14:33, and 14:40 CEST all failed at GCM registration.
- Each installed-version attempt made two calls and returned `Error=PHONE_REGISTRATION_ERROR` both times.
- `ring_doorbell.listen.eventlistener` logged “Starting event listener” but never “Started event listener.”
- `event.front_door_ding` remained unavailable.
- A real press produced an official Ring-app notification but no HA event or automation run.

That sequence rules out stale Ring authorized sessions as the primary cause. It also shows the listener is failing before it can subscribe a push token to the Ring account.

## Test methodology and results

All experiments were isolated from the installed Ring View card and live Home Assistant configuration. The tests mock Google, Ring, and socket boundaries; they did not send synthetic registrations to Google's live service.

### Baseline validation

The first run used the newest unconstrained test dependencies. Both upstream suites failed because `aioresponses` could not construct an `aiohttp 3.14.3` response (`stream_writer` became a required argument). This was a test-tool compatibility problem, not treated as a product failure.

The suites were rerun with their tagged lock-compatible versions (`aiohttp 3.11.18`, `aioresponses 0.7.8`, `pytest 8.3.5`, and related pinned packages):

| Suite | Result |
|---|---:|
| `firebase-messaging` 0.4.5 upstream tests | 11 passed |
| `ring-doorbell` 0.9.14 upstream tests | 40 passed |
| Baseline total | **51 passed** |

This proves the test harness and exact tagged sources work before adversarial cases are added. It also exposes a CI gap: Home Assistant runs `aiohttp 3.14.3`, while the library's historical test lock exercises an older `aiohttp`. A compatibility CI job using HA's current constraint would catch integration drift earlier.

### Adversarial reproduction tests

Twenty-six focused tests were run against unchanged source in a disposable Python 3.14.7 environment, matching HA's Python generation and `aiohttp 3.14.3`. The tests pass when they successfully reproduce the current hazardous behavior.

| Area | Reproduced behavior |
|---|---|
| Google rejection | The same Android ID, security token, and GCM app ID are submitted twice for `PHONE_REGISTRATION_ERROR`; the code sleeps even after the final attempt. |
| Error semantics | The provider error becomes a generic runtime error, preventing policy decisions upstream. |
| Registration state | Failed registration does not persist the partial GCM identity, so a reload starts another fresh identity; a missing final FCM registration is wrapped in a truthy mapping and can be persisted as if valid. |
| Resource cleanup | The registration helper is not closed when registration raises. Calling `stop()` before `start()` raises because its lock has not been created. |
| Socket readiness | `FcmPushClient.start()` returns after scheduling tasks, before connection or MCS login. Initial connection exhaustion leaves the monitor alive and the state stuck at “starting connection.” |
| Ring listener state | `RingEventListener.started` can be true while `FcmPushClient.is_started()` is false, and stays true after receiver death. |
| Retry safety | Timeout/repeated start can duplicate callbacks and refresh tasks; one refresh task becomes unreachable and cannot be canceled by normal stop. |
| Callback invariant | Stop/restart clears callbacks without resetting their counter, so the actual default callback is no longer ID 1 even though ID 1 alone is protected. |
| Session maintenance | The 12-hour refresh algorithm first checks at 65,535 seconds (18:12:15), overshooting by 6:12:15, then exits permanently after that single refresh. |
| Payload safety | A legacy Ding comparison uses `action.lower` instead of `action.lower()`; a missing current-payload `ding.id` raises through the Ring callback; a callback removing itself mutates the dictionary during iteration. |
| HA config flow | Both reauth and reconfigure replace entry data and drop the stored `listen_token`. |
| HA coordinator | A start exception aborts without callback, entity update, retry, or repair signal; a false return still installs a callback; unload skips partial listener cleanup; the removal callback is not idempotent. |

Two public reports independently corroborate the highest-impact post-start failures:

- The Ring listener can remain marked started after its FCM receiver shuts down, leaving HA event automations dead until reload. [python-ring-doorbell issue #526](https://github.com/python-ring-doorbell/python-ring-doorbell/issues/526)
- New Ring payloads can omit `ding.id`; three such callback failures terminate the whole FCM receiver. [python-ring-doorbell issue #537](https://github.com/python-ring-doorbell/python-ring-doorbell/issues/537)

### Candidate-fix validation

A proof-of-concept patch was applied only to isolated copies of the three upstream projects. It was not installed into Home Assistant and did not alter this card project.

The patch implemented typed terminal registration errors, guaranteed cleanup, safe pre-start stop, socket-readiness waiting, a lifecycle lock, dynamic health, idempotent start/stop, continuous session refresh, payload isolation, preserved HA credentials, coordinator health monitoring, bounded backoff, and start/stop race cancellation.

| Validation | Result |
|---|---:|
| Original upstream suites after the candidate library changes | **51 passed** |
| Candidate acceptance tests on Python 3.12 | **14 passed** |
| Candidate acceptance tests on disposable Python 3.14.7 / HA-style environment | **21 passed** |
| Rapid HA event-listener remove/re-add race | Passed; stale start and stop tasks were canceled, one final stop remained |
| Static compile and diff whitespace checks | Passed |
| Tagged Ruff checks for changed Firebase and Ring library files | Passed |

These results validate the architecture, not production readiness. A real staging account must still confirm that the modified registration path interoperates with Google's live endpoint and that Ring accepts the resulting push token.

## Detailed code findings

### 1. `firebase-messaging`: terminal rejection is handled like a transient timeout

`gcm_register()` creates one `gcm_app_id` before its retry loop and uses the same Android ID, security token, headers, and request body on every attempt. The installed release retries twice; current `main` retries four times. A deterministic `PHONE_REGISTRATION_ERROR` is therefore replayed without changing the property Google rejected. [0.4.5 registration loop](https://github.com/sdb9696/firebase-messaging/blob/0.4.5/firebase_messaging/fcmregister.py#L172-L231)

The function returns `None`; the caller raises a generic message. The structured provider code is available only in logs. Home Assistant consequently cannot distinguish a timeout, rate limit, malformed request, invalid identity, or provider policy rejection.

The safe behavior is:

- Parse `Error=<code>` into a typed exception with a stable `code` field.
- Do not immediately repeat a known terminal identity error with the same identity.
- Let callers use long, jittered backoff and expose a repair issue.
- Keep ordinary bounded retries for network timeouts and 5xx errors.
- Never include tokens or security credentials in normal logs.

The proof-of-concept stops after one `PHONE_REGISTRATION_ERROR`, preserves its code, and lets HA begin at a 15-minute delay rather than creating a tight identity-registration storm.

### 2. Registration is not transactional

`fcm_install_and_register()` returns a truthy outer dictionary even when the inner registration result is `None`. That dictionary is then accepted and passed to the credentials callback. Later, `FcmPushClient` indexes `registration["token"]` and fails. [FCM installation wrapper](https://github.com/sdb9696/firebase-messaging/blob/0.4.5/firebase_messaging/fcmregister.py#L253-L262)

Registration should be committed only if all required fields validate:

- generated encryption keys;
- GCM Android ID/security token/app ID/token;
- Firebase installation token/FID/refresh token;
- final FCM registration token.

Partial state may be retained internally for a controlled retry, but it must not be published as complete credentials. If partial identities are persisted in the future, they need an explicit schema version and expiry so HA does not confuse them with usable credentials.

### 3. FCM start does not mean ready

`FcmPushClient.start()` schedules `_listen()` and `_do_monitor()` and returns immediately. Successful MCS login occurs later, when a `LoginResponse` changes `run_state` to `STARTED`. [push-client start](https://github.com/sdb9696/firebase-messaging/blob/0.4.5/firebase_messaging/fcmpushclient.py#L749-L791)

`RingEventListener` wraps only the immediate scheduling call in its ten-second timeout, then sets its own `started=True`. The timeout therefore does not verify connection or login. A correct contract needs either:

- `start()` to await readiness, or
- a separate `wait_until_started()` / health event that Ring awaits inside its timeout.

The candidate uses the second option to preserve API compatibility.

### 4. Initial socket failure and later receiver death are invisible upstream

If all initial MCS connection attempts fail, `_listen()` returns but leaves `do_listen=True`; the monitor remains alive in a state it does not handle. Later sequential connection or callback errors call `_terminate()`, but no health-change callback reaches `RingEventListener` or HA.

`RingEventListener.started` is an unrelated boolean. HA's event entity reports availability solely from that boolean. [HA Ring event availability](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/ring/event.py#L111-L115)

The minimum fix is a dynamic health predicate backed by the receiver's actual run state. A stronger API exposes a state enum and metadata:

```text
STOPPED -> REGISTERING -> SUBSCRIBING -> CONNECTING -> HEALTHY
              |               |              |
              +------------> BACKOFF <-------+
```

Useful diagnostics are `last_error_code`, `last_error_at`, `last_notification_at`, current retry delay, and whether the Ring token subscription succeeded. They must exclude secrets.

### 5. Lifecycle operations are not idempotent or race-safe

The listener lacks a lifecycle lock. A timeout occurs after the internal Ring callback is added but before `started=True`; retry adds it again. Repeated starts overwrite the only stored refresh-task reference, leaking the previous task. Stop clears callbacks but does not reset their counter, violating the hard-coded “ID 1 is default” rule.

HA has a related race: removing the last entity schedules stop; adding an entity again schedules start, but neither operation cancels or serializes the other. The candidate serializes Ring start/stop and tracks/cancels stale HA start and stop tasks. It passed a controlled remove/re-add race test.

### 6. Session refresh stops after one delayed run

The refresh sleep is `1 + elapsed_since_refresh`, producing check times of 1, 3, 7, 15, … seconds. With a 43,200-second threshold, the first over-threshold check is at 65,535 seconds. The function then uses `break`, so it never refreshes a second time. [Ring session refresh loop](https://github.com/python-ring-doorbell/python-ring-doorbell/blob/0.9.14/ring_doorbell/listen/eventlistener.py#L204-L219)

Use a monotonic deadline and a bounded health-check interval, refresh at the deadline, then continue the loop. The candidate refreshed exactly at the test deadlines twice and remained cancelable.

### 7. One malformed message can kill every realtime entity

The Ring parser performs unguarded JSON and key access. The Firebase client catches the exception as a callback failure and terminates after its sequential-error threshold. A payload variant from one camera can therefore disable Ding and motion events for every Ring device sharing the global receiver. The real-world missing-`ding.id` report demonstrates this exact blast radius. [Issue #537](https://github.com/python-ring-doorbell/python-ring-doorbell/issues/537)

Parsing must be an isolation boundary:

- Validate the envelope and required fields.
- Use a deterministic synthetic event ID when safe, or skip only that message.
- Log a sanitized schema summary, not the full token-bearing payload.
- Catch failures per message and per callback.
- Iterate over a snapshot of callbacks so a callback may unsubscribe itself.

The listener must not terminate its transport because Ring added or omitted a payload field.

### 8. Home Assistant discards durable push credentials

On a successful initial FCM registration, HA intentionally writes `CONF_LISTEN_CREDENTIALS` (`listen_token`) into the config entry. [HA Ring setup](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/ring/__init__.py#L34-L65)

Reauth and reconfigure later build a new data mapping containing only username, Ring API token, and hardware ID, then replace the entry data. The saved push credentials disappear. [HA reauth/reconfigure](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/ring/config_flow.py#L164-L235)

Reauth should unquestionably preserve unrelated entry data. Reconfigure should also preserve the FCM credentials while rotating the Ring hardware ID; failed credential check-in already provides a natural path to full registration. If HA wants a manual push reset, it should be an explicit repair action rather than an incidental side effect of account reconfiguration.

### 9. Home Assistant has no recovery state machine

The coordinator awaits listener start once. An exception exits before callback installation and before entity updates. A false return still installs the callback and updates entities even though the listener is unavailable. Unload calls stop only when the stale boolean is true. [HA Ring listener coordinator](https://github.com/home-assistant/core/blob/2026.9.2/homeassistant/components/ring/coordinator.py#L162-L229)

The coordinator should own one background state machine for the account:

- Start only while at least one event entity is subscribed.
- Propagate cancellation immediately.
- On transient failure, use exponential backoff with jitter and a one-hour cap.
- On `PHONE_REGISTRATION_ERROR`, avoid rapid identity rotation; begin with a substantially longer delay.
- Update entity availability on every health transition.
- Always clean up partial state on unload.
- Create a user-visible repair issue after a sustained outage, including the error code and next retry but no credentials.
- Automatically clear the issue after a confirmed healthy MCS login.

## Recommended change sequence

The fixes should be split at ownership boundaries so each project can release and test independently.

### PR 1: `firebase-messaging`

1. Add a typed registration exception with provider code and stage.
2. Classify `PHONE_REGISTRATION_ERROR` as non-immediately-retryable for the same identity.
3. Validate complete registration before invoking the credentials callback.
4. Close the registration helper in `finally`.
5. Make stop safe before, during, and after start.
6. Terminate all tasks when initial connection attempts are exhausted.
7. Add readiness/health waiting and an optional health-change callback.
8. Add tests for terminal errors, partial results, cleanup, cancellation, and initial-connect exhaustion.

### PR 2: `python-ring-doorbell`

1. Require the Firebase release containing typed errors and readiness.
2. Guard lifecycle operations with one lock and make start/stop idempotent.
3. Do not mark started until MCS login is confirmed.
4. Derive health from the receiver rather than a stale boolean.
5. Clean up on every failed stage before allowing retry.
6. Install internal callbacks only after readiness; track the actual default callback ID.
7. Make session refresh continuous and deadline-based.
8. Isolate malformed payloads and callback failures.
9. Fix the legacy `action.lower()` comparison.
10. Add restart, concurrent-start, receiver-death, malformed-payload, and callback-mutation tests.

### PR 3: Home Assistant Core

1. Preserve `listen_token` and unknown future entry fields during reauth/reconfigure.
2. Replace the one-shot task with a cancelable, single-owner listener state machine.
3. Use typed-error-aware, jittered backoff.
4. Monitor health and update all Ring event entities when it changes.
5. Always stop partial listener state on unload.
6. Make entity listener-removal callbacks idempotent and cancel stale start/stop tasks.
7. Add a repair issue for sustained realtime-event outage.
8. Run Ring dependency tests against HA's actual `aiohttp` constraint in CI.

## What should not be changed

- Do not point the automation at the external chime or a different camera. The event source is the doorbell's Ding event, and that mapping is already correct.
- Do not add card-level polling or URL-opening fallbacks to conceal listener failure. The card cannot reconstruct a realtime press that HA never received.
- Do not repeatedly delete Ring authorized devices. That operates on a different registration domain and the controlled cleanup already disproved it as the primary fix.
- Do not retry `PHONE_REGISTRATION_ERROR` every few seconds with newly generated identities. That can amplify throttling or identity-policy problems and makes diagnosis harder.
- Do not install the proof-of-concept directly on the production HA host. It spans three versioned projects and needs staging with a disposable Ring/HA environment first.

## Practical next step

The highest-value first upstream change is the Firebase typed-error/cleanup/readiness patch, followed by the Ring lifecycle patch. HA can then consume reliable health and error semantics instead of guessing from a boolean. In parallel, the small HA credential-preservation fix can be submitted independently because it is low risk and prevents reauth from unnecessarily forcing a new Google registration.

For this installation, a later successful retry would show that the Google rejection was temporary; it would not invalidate the lifecycle findings. If it fails again with the same provider code, further Ring reauthentication is unlikely to help. The next live diagnostic should record only the error code, stage, attempt time, and whether stored push credentials were present—never the credentials themselves.

## Limitations

- Google's legacy GCM endpoint does not provide a documented explanation with this response, and the project uses a reverse-engineered, unofficial Ring API. [python-ring-doorbell project statement](https://github.com/python-ring-doorbell/python-ring-doorbell)
- The isolated tests deliberately did not call live Google or Ring endpoints, avoiding registration spam and account impact.
- The candidate patch proves the proposed state-machine behavior under deterministic failure, timeout, cancellation, malformed-payload, and concurrency tests. It does not replace staging against live push delivery.
- The official Ring app's internal implementation and credentials are not available for comparison.

## Sources

- [Home Assistant Core 2026.9.2 Ring integration](https://github.com/home-assistant/core/tree/2026.9.2/homeassistant/components/ring)
- [Home Assistant current Ring integration](https://github.com/home-assistant/core/tree/dev/homeassistant/components/ring)
- [`python-ring-doorbell` 0.9.14 event listener](https://github.com/python-ring-doorbell/python-ring-doorbell/blob/0.9.14/ring_doorbell/listen/eventlistener.py)
- [`python-ring-doorbell` current event listener](https://github.com/python-ring-doorbell/python-ring-doorbell/blob/master/ring_doorbell/listen/eventlistener.py)
- [`firebase-messaging` 0.4.5 registration source](https://github.com/sdb9696/firebase-messaging/blob/0.4.5/firebase_messaging/fcmregister.py)
- [`firebase-messaging` 0.4.5 push-client source](https://github.com/sdb9696/firebase-messaging/blob/0.4.5/firebase_messaging/fcmpushclient.py)
- [`firebase-messaging` current registration source](https://github.com/sdb9696/firebase-messaging/blob/main/firebase_messaging/fcmregister.py)
- [Ring notification troubleshooting](https://github.com/dgreif/ring/wiki/Notification-Troubleshooting)
- [Stale Ring listener health issue #526](https://github.com/python-ring-doorbell/python-ring-doorbell/issues/526)
- [Missing `ding.id` receiver-termination issue #537](https://github.com/python-ring-doorbell/python-ring-doorbell/issues/537)
- [Google Firebase duplicate-FID discussion #7025](https://github.com/firebase/firebase-android-sdk/issues/7025)
